<?php
require_once 'config.php';

try {
    // Get all orders with their items
    $stmt = $conn->prepare("
        SELECT o.id, o.total, o.table_no, o.payment_method, o.order_type, o.status, o.created_at,
               i.item_name, i.quantity, i.price
        FROM orders o
        LEFT JOIN order_items i ON o.id = i.order_id
        WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY 
            CASE o.status
                WHEN 'pending' THEN 1
                WHEN 'preparing' THEN 2
                WHEN 'ready' THEN 3
                WHEN 'delivered' THEN 4
                ELSE 5
            END,
            o.created_at DESC
    ");
    
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group results by order
    $orders = [];
    foreach ($results as $row) {
        $order_id = $row['id'];
        
        if (!isset($orders[$order_id])) {
            $orders[$order_id] = [
                'id' => $row['id'],
                'total' => $row['total'],
                'table_no' => $row['table_no'],
                'payment_method' => $row['payment_method'],
                'order_type' => $row['order_type'],
                'status' => $row['status'],
                'time' => $row['created_at'],
                'items' => []
            ];
        }
        
        if ($row['item_name']) {
            $orders[$order_id]['items'][] = [
                'name' => $row['item_name'],
                'quantity' => $row['quantity'],
                'price' => $row['price']
            ];
        }
    }
    
    // Convert associative array to indexed array
    $orders_array = array_values($orders);
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'orders' => $orders_array]);
    
} catch(PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
