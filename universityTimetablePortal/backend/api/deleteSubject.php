<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$subjectId = $_POST['subjectId'] ?? null;

if ($subjectId) {
    $sql = "DELETE FROM subjects WHERE subjectId = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'i', $subjectId);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Deletion failed']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid subject ID']);
}
