<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../includes/dbConnect.php';

$courseId = $_POST['courseId'] ?? '';
$courseName = $_POST['courseName'] ?? '';
$semester = $_POST['semester'] ?? '';
$year = $_POST['year'] ?? '';

if ($courseId && $courseName && $semester && $year) {
    $sql = "UPDATE courses SET courseName = ?, semester = ?, year = ? WHERE courseId = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'sisi', $courseName, $semester, $year, $courseId);
    mysqli_stmt_execute($stmt);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}
?>
