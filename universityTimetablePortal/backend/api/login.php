<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../includes/dbConnect.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Missing email or password']);
    exit;
}

$sql = "SELECT userId, fullName, email, password, userRole, courseId FROM users WHERE email = ?";
$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'SQL prepare error: ' . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        'success' => true,
        'userId' => $user['userId'],
        'userRole' => $user['userRole'],
        'fullName' => $user['fullName'],
        'email' => $user['email'],
        'courseId' => $user['courseId'] ?? null
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
}
