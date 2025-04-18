<?php
require_once 'config.php';

// Get the JSON data from the request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Check if data is valid
if (!$data || !isset($data['items']) || !isset($data['total'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
    exit();
}

try {
    // Start transaction
    $conn->beginTransaction();
    
    // Generate order ID
    $order_id = mt_rand(100000, 999999);
    
    // Get order details
    $items = $data['items'];
    $total = $data['total'];
    $table_no = isset($data['table_no']) ? $data['table_no'] : null;
    $payment_method = $data['payment_method'];
    $order_type = $data['order_type'];
    $status = 'pending';
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    // Current date and time
    $order_time = date('Y-m-d H:i:s');
    
    // Insert order into database
    $stmt = $conn->prepare("INSERT INTO orders (id, user_id, total, table_no, payment_method, order_type, status, created_at) 
                          VALUES (:id, :user_id, :total, :table_no, :payment_method, :order_type, :status, :created_at)");
    
    $stmt->bindParam(':id', $order_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':total', $total);
    $stmt->bindParam(':table_no', $table_no);
    $stmt->bindParam(':payment_method', $payment_method);
    $stmt->bindParam(':order_type', $order_type);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':created_at', $order_time);
    
    $stmt->execute();
    
    // Insert order items
    foreach ($items as $item) {
        $stmt = $conn->prepare("INSERT INTO order_items (order_id, item_name, quantity, price) 
                              VALUES (:order_id, :item_name, :quantity, :price)");
                              
        $stmt->bindParam(':order_id', $order_id);
        $stmt->bindParam(':item_name', $item['name']);
        $stmt->bindParam(':quantity', $item['quantity']);
        $stmt->bindParam(':price', $item['price']);
        
        $stmt->execute();
    }
    
    // Create Razorpay order
    $razorpay_key = 'rzp_test_YOUR_KEY_HERE'; // Replace with your Razorpay key
    $razorpay_secret = 'YOUR_SECRET_HERE'; // Replace with your Razorpay secret
    
    // Amount in paise (multiply by 100)
    $amount = $total * 100;
    
    $razorpay_order_data = [
        'amount' => $amount,
        'currency' => 'INR',
        'receipt' => 'order_' . $order_id,
        'notes' => [
            'order_id' => $order_id
        ]
    ];
    
    $curl = curl_init();
    
    curl_setopt_array($curl, [
        CURLOPT_URL => 'https://api.razorpay.com/v1/orders',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($razorpay_order_data),
        CURLOPT_HTTPHEADER => [
            'content-type: application/json',
            'Authorization: Basic ' . base64_encode($razorpay_key . ':' . $razorpay_secret)
        ],
    ]);
    
    $response = curl_exec($curl);
    $err = curl_error($curl);
    
    curl_close($curl);
    
    if ($err) {
        throw new Exception('cURL Error: ' . $err);
    }
    
    $razorpay_response = json_decode($response, true);
    
    if (!isset($razorpay_response['id'])) {
        throw new Exception('Razorpay API Error: ' . json_encode($razorpay_response));
    }
    
    // Update order with Razorpay order ID
    $stmt = $conn->prepare("UPDATE orders SET payment_id = :payment_id WHERE id = :id");
    $stmt->bindParam(':payment_id', $razorpay_response['id']);
    $stmt->bindParam(':id', $order_id);
    $stmt->execute();
    
    // Commit transaction
    $conn->commit();
    
    // Return success response
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'message' => 'Order created successfully', 
        'order_id' => $order_id,
        'razorpay_order_id' => $razorpay_response['id'],
        'amount' => $amount
    ]);
    
} catch(Exception $e) {
    // Rollback transaction on error
    $conn->rollBack();
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
