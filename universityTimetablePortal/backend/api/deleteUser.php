<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$userId = $_POST['userId'] ?? '';

if ($userId) {
    // prevent deleting admin user
    $check = "SELECT userRole FROM users WHERE userId = ?";
    $checkStmt = mysqli_prepare($conn, $check);
    mysqli_stmt_bind_param($checkStmt, 'i', $userId);
    mysqli_stmt_execute($checkStmt);
    $result = mysqli_stmt_get_result($checkStmt);
    $row = mysqli_fetch_assoc($result);

    if ($row && $row['userRole'] === 'admin') {
        echo json_encode(['success' => false, 'message' => 'Cannot delete admin users.']);
        exit;
    }

    $sql = "DELETE FROM users WHERE userId = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'i', $userId);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing userId']);
}
