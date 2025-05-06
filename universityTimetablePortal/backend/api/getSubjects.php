<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../includes/dbConnect.php';

$sql = "SELECT s.subjectId, s.subjectName, c.courseName
        FROM subjects s
        JOIN courses c ON s.courseId = c.courseId";

$result = mysqli_query($conn, $sql);
$subjects = [];

while ($row = mysqli_fetch_assoc($result)) {
    $subjects[] = $row;
}

echo json_encode($subjects);
