<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$professorId = $_GET['professorId'] ?? '';

if (!$professorId) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT s.subjectName, r.roomName, t.dayOfWeek, t.startTime, t.endTime
        FROM timetables t
        JOIN subjects s ON t.subjectId = s.subjectId
        JOIN rooms r ON t.roomId = r.roomId
        WHERE t.professorId = ?";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, 'i', $professorId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$timetable = [];
while ($row = mysqli_fetch_assoc($result)) {
    $timetable[] = $row;
}

echo json_encode($timetable);
