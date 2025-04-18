<?php
// Database configuration
$host = "localhost";
$db_name = "hunger_oasis";
$username = "root";
$password = ""; // No password for local XAMPP

// Create database connection
try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    die();
}
?>
