<?php
$servername = "localhost"; // typically localhost
$username = "your_username"; // your database username
$password = "your_password"; // your database password
$dbname = "your_database_name"; // your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$email = $_POST['email']; // Get the email address from form submission

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO emails (email) VALUES (?)");
$stmt->bind_param("s", $email);

// Execute the statement
$stmt->execute();

echo "New records created successfully";

$stmt->close();
$conn->close();
?>
