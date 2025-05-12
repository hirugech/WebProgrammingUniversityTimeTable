<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$courseId = (int) ($_POST['courseId'] ?? 0);
$courseName = $_POST['courseName'] ?? '';
$semester = (int) ($_POST['semester'] ?? 0);
$year = (int) ($_POST['year'] ?? 0);

if ($courseId && $courseName && $semester && $year) {
    $sql = "UPDATE courses SET courseName = ?, semester = ?, year = ? WHERE courseId = ?";
    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 'siii', $courseName, $semester, $year, $courseId);
        mysqli_stmt_execute($stmt);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}
?>
