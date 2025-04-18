<?php
session_start();
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
    $stmt = $conn->prepare("INSERT INTO orders (id, user_id, total, table_no, payment_method, order_type, status, created_at, payment_status) 
                          VALUES (:id, :user_id, :total, :table_no, :payment_method, :order_type, :status, :created_at, :payment_status)");
    
    $payment_status = ($payment_method === 'cash') ? 'pending' : 'paid';
    
    $stmt->bindParam(':id', $order_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':total', $total);
    $stmt->bindParam(':table_no', $table_no);
    $stmt->bindParam(':payment_method', $payment_method);
    $stmt->bindParam(':order_type', $order_type);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':created_at', $order_time);
    $stmt->bindParam(':payment_status', $payment_status);
    
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
    
    // Commit transaction
    $conn->commit();
    
    // Return success response
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'message' => 'Order placed successfully', 
        'order_id' => $order_id
    ]);
    
} catch(Exception $e) {
    // Rollback transaction on error
    $conn->rollBack();
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
