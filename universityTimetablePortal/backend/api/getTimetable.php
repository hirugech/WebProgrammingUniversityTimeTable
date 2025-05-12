<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$sql = "SELECT t.timetableId, s.subjectName, u.fullName AS professorName, r.roomName,
               t.dayOfWeek, t.startTime, t.endTime, c.courseName
        FROM timetables t
        JOIN subjects s ON t.subjectId = s.subjectId
        JOIN courses c ON s.courseId = c.courseId
        JOIN users u ON t.professorId = u.userId
        JOIN rooms r ON t.roomId = r.roomId";

$result = mysqli_query($conn, $sql);
$timetable = [];

while ($row = mysqli_fetch_assoc($result)) {
    $timetable[] = $row;
}

echo json_encode($timetable);
