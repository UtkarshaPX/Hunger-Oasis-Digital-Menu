<?php
require_once 'config.php';

// Get the JSON data from the request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Check if data is valid
if (!$data || !isset($data['razorpay_payment_id']) || !isset($data['razorpay_order_id']) || !isset($data['razorpay_signature']) || !isset($data['order_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
    exit();
}

try {
    // Verify signature
    $razorpay_key = 'rzp_test_YOUR_KEY_HERE'; // Replace with your Razorpay key
    $razorpay_secret = 'YOUR_SECRET_HERE'; // Replace with your Razorpay secret
    
    $generated_signature = hash_hmac('sha256', $data['razorpay_order_id'] . '|' . $data['razorpay_payment_id'], $razorpay_secret);
    
    if ($generated_signature !== $data['razorpay_signature']) {
        throw new Exception('Invalid payment signature');
    }
    
    // Start transaction
    $conn->beginTransaction();
    
    // Update order payment status
    $stmt = $conn->prepare("UPDATE orders SET payment_status = 'paid' WHERE id = :id");
    $stmt->bindParam(':id', $data['order_id']);
    $stmt->execute();
    
    // Record payment details
    $stmt = $conn->prepare("
        INSERT INTO payments (order_id, payment_id, amount, payment_method, status, created_at) 
        VALUES (:order_id, :payment_id, (SELECT total FROM orders WHERE id = :order_id2), 'razorpay', 'success', NOW())
    ");
    $stmt->bindParam(':order_id', $data['order_id']);
    $stmt->bindParam(':payment_id', $data['razorpay_payment_id']);
    $stmt->bindParam(':order_id2', $data['order_id']);
    $stmt->execute();
    
    // Commit transaction
    $conn->commit();
    
    // Return success response
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'message' => 'Payment verified successfully', 
        'order_id' => $data['order_id']
    ]);
    
} catch(Exception $e) {
    // Rollback transaction on error
    $conn->rollBack();
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
