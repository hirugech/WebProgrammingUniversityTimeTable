<?php
$host = 'db'; 
$user = 'root';
$password = '7634';
$database = 'timetableDB';

$conn = mysqli_connect($host, $user, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
