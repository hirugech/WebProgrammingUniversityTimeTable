<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$courseId = $_GET['courseId'] ?? '';

if (!$courseId) {
    echo json_encode(['success' => false, 'message' => 'Missing courseId']);
    exit;
}

$sql = "SELECT s.subjectName, u.fullName AS professorName, r.roomName, t.dayOfWeek, t.startTime, t.endTime,
               c.courseName, c.semester, c.year
        FROM timetables t
        JOIN subjects s ON t.subjectId = s.subjectId
        JOIN courses c ON s.courseId = c.courseId
        JOIN users u ON t.professorId = u.userId
        JOIN rooms r ON t.roomId = r.roomId
        WHERE s.courseId = ?";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, 'i', $courseId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$timetable = [];
while ($row = mysqli_fetch_assoc($result)) {
    $timetable[] = $row;
}

echo json_encode($timetable);
