<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../includes/dbConnect.php';

$courseId = $_POST['courseId'] ?? '';

if ($courseId) {
    $sql = "DELETE FROM courses WHERE courseId = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'i', $courseId);
    mysqli_stmt_execute($stmt);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Missing course ID']);
}
?>
