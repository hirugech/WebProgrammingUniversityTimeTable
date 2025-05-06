<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

$sql = "SELECT userId, fullName, email, userRole FROM users WHERE userRole IN ('professor', 'student')";
$result = mysqli_query($conn, $sql);

$users = [];
while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

echo json_encode($users);
