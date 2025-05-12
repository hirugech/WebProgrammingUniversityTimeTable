<?php
require_once '../includes/dbConnect.php';

function insertUser($conn, $fullName, $email, $password, $role, $courseId = null) {
    $email = mysqli_real_escape_string($conn, $email);
    $result = mysqli_query($conn, "SELECT * FROM users WHERE email = '$email'");
    if (mysqli_num_rows($result) > 0) {
        echo "User with email '$email' already exists.<br>";
        return;
    }

    $hashedPass = password_hash($password, PASSWORD_DEFAULT);
    if ($role === 'student' && $courseId !== null) {
        $sql = "INSERT INTO users (fullName, email, password, userRole, courseId) 
                VALUES ('$fullName', '$email', '$hashedPass', '$role', $courseId)";
    } else {
        $sql = "INSERT INTO users (fullName, email, password, userRole) 
                VALUES ('$fullName', '$email', '$hashedPass', '$role')";
    }

    if (mysqli_query($conn, $sql)) {
        echo " $role '$fullName' inserted successfully.<br>";
    } else {
        echo "Error inserting $role '$fullName': " . mysqli_error($conn) . "<br>";
    }
}


insertUser($conn, 'John Admin', 'admin@example.com', 'admin123', 'admin');
insertUser($conn, 'Jane Professor', 'professor@example.com', 'professor123', 'professor');
insertUser($conn, 'Ruth Student', 'student@example.com', 'student123', 'student', 1);

?>
