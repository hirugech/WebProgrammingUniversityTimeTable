<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$subjectName = $_POST['subjectName'] ?? '';
$courseId = $_POST['courseId'] ?? '';
$professorId = $_POST['professorId'] ?? '';

if ($subjectName && $courseId && $professorId) {
    $countSql = "SELECT COUNT(*) as total FROM subjects WHERE professorId = ?";
    $countStmt = mysqli_prepare($conn, $countSql);
    mysqli_stmt_bind_param($countStmt, 'i', $professorId);
    mysqli_stmt_execute($countStmt);
    $countResult = mysqli_stmt_get_result($countStmt);
    $row = mysqli_fetch_assoc($countResult);
    $totalSubjects = $row['total'] ?? 0;

    if ($totalSubjects >= 3) {
        echo json_encode(['success' => false, 'message' => 'Professor already has 3 subjects']);
        exit;
    }

    $sql = "INSERT INTO subjects (subjectName, courseId, professorId) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'sii', $subjectName, $courseId, $professorId);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Insert failed']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Missing input']);
}
