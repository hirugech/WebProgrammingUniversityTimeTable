<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../includes/dbConnect.php';

$sql = "SELECT 
            s.subjectId, 
            s.subjectName, 
            s.courseId, 
            c.courseName, 
            u.fullName AS professorName
        FROM subjects s
        JOIN courses c ON s.courseId = c.courseId
        LEFT JOIN users u ON s.professorId = u.userId";

$result = mysqli_query($conn, $sql);
$subjects = [];

while ($row = mysqli_fetch_assoc($result)) {
    $subjects[] = $row;
}

echo json_encode($subjects);
