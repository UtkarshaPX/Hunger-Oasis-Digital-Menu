<?php
require_once 'config.php';

// Get the JSON data from the request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Check if data is valid
if (!$data || !isset($data['order_id']) || !isset($data['status'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
    exit();
}

$order_id = $data['order_id'];
$status = $data['status'];

// Validate status
$valid_statuses = ['pending', 'preparing', 'ready', 'delivered'];
if (!in_array($status, $valid_statuses)) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid status']);
    exit();
}

try {
    // Start transaction
    $conn->beginTransaction();
    
    // Get current status for logging
    $stmt = $conn->prepare("SELECT status FROM orders WHERE id = :id");
    $stmt->bindParam(':id', $order_id);
    $stmt->execute();
    $current_status = $stmt->fetchColumn();
    
    // Update order status
    $stmt = $conn->prepare("UPDATE orders SET status = :status WHERE id = :id");
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':id', $order_id);
    $result = $stmt->execute();
    
    if (!$result) {
        throw new Exception("Failed to update order status");
    }
    
    // Log the status change
    $stmt = $conn->prepare("
        INSERT INTO order_status_log (order_id, previous_status, new_status, changed_at) 
        VALUES (:order_id, :previous_status, :new_status, NOW())
    ");
    $stmt->bindParam(':order_id', $order_id);
    $stmt->bindParam(':previous_status', $current_status);
    $stmt->bindParam(':new_status', $status);
    $stmt->execute();
    
    // Commit transaction
    $conn->commit();
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'message' => 'Order status updated successfully',
        'order_id' => $order_id,
        'new_status' => $status
    ]);
    
} catch(Exception $e) {
    // Rollback transaction on error
    $conn->rollBack();
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
