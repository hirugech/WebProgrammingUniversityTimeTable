<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../includes/dbConnect.php';

$courseName = $_POST['courseName'] ?? '';
$semester = $_POST['semester'] ?? '';
$year = $_POST['year'] ?? '';

if ($courseName && $semester && $year) {
    $sql = "INSERT INTO courses (courseName, semester, year) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'sis', $courseName, $semester, $year);
    mysqli_stmt_execute($stmt);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}
