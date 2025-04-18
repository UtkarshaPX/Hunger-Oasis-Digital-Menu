<?php
session_start();
require_once 'config.php';

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    
    // Validate input
    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Email and password are required";
        header("Location: ../login.html");
        exit();
    }
    
    try {
        // Prepare SQL statement
        $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        // Check if user exists
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Password is correct, create session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email'];
                
                // Redirect to index page
                header("Location: ../index.html");
                exit();
            } else {
                // Password is incorrect
                $_SESSION['error'] = "Invalid email or password";
                header("Location: ../login.html");
                exit();
            }
        } else {
            // User doesn't exist
            $_SESSION['error'] = "Invalid email or password";
            header("Location: ../login.html");
            exit();
        }
    } catch(PDOException $e) {
        $_SESSION['error'] = "Database error: " . $e->getMessage();
        header("Location: ../login.html");
        exit();
    }
} else {
    // If not a POST request, redirect to login page
    header("Location: ../login.html");
    exit();
}
?>
