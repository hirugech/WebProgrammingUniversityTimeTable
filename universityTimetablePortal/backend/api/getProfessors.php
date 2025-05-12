<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../includes/dbConnect.php';

$sql = "SELECT userId, fullName FROM users WHERE userRole = 'professor'";
$result = mysqli_query($conn, $sql);

$professors = [];
while ($row = mysqli_fetch_assoc($result)) {
    $professors[] = $row;
}

echo json_encode($professors);

