<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$fullName = $_POST['fullName'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$courseId = $_POST['courseId'] ?? null;

if (!$fullName || !$email || !$password || !$courseId) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$userRole = 'student';

$checkQuery = "SELECT userId FROM users WHERE email = ?";
$stmt = mysqli_prepare($conn, $checkQuery);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

if (mysqli_stmt_num_rows($stmt) > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

$insertQuery = "INSERT INTO users (fullName, email, password, userRole, courseId) VALUES (?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $insertQuery);
mysqli_stmt_bind_param($stmt, "ssssi", $fullName, $email, $hashedPassword, $userRole, $courseId);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed']);
}
?>
