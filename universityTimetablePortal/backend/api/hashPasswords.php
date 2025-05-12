<?php
require_once '../includes/dbConnect.php'; 

$usersToUpdate = [
    ['email' => 'john@gmail.com', 'plainPassword' => 'admin123'],
    ['email' => 'jane@gmail.com', 'plainPassword' => 'prof123'],
    ['email' => 'ruth@gmail.com', 'plainPassword' => 'student123'],
];

foreach ($usersToUpdate as $user) {
    $hashed = password_hash($user['plainPassword'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $hashed, $user['email']);
    $stmt->execute();
    echo "Updated password for " . $user['email'] . "<br>";
}
