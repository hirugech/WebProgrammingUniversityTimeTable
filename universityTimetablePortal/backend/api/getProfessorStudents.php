<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$professorId = $_GET['professorId'] ?? '';

if (!$professorId) {
    echo json_encode([]);
    exit;
}

$sql = "
SELECT DISTINCT u.userId, u.fullName, u.email, c.courseName, c.year, c.semester
FROM users u
JOIN courses c ON u.courseId = c.courseId
JOIN subjects s ON s.courseId = u.courseId
WHERE u.userRole = 'student' AND s.professorId = ?
";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $professorId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$students = [];
while ($row = mysqli_fetch_assoc($result)) {
    $students[] = $row;
}

echo json_encode($students);
