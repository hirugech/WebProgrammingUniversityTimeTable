<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

try {
    $roomName = $_POST['roomName'] ?? '';
    $capacity = $_POST['capacity'] ?? '';

    if ($roomName && $capacity) {
        $sql = "INSERT INTO rooms (roomName, capacity) VALUES (?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 'si', $roomName, $capacity);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true]);
        } else {
            if (mysqli_errno($conn) == 1062) {
                echo json_encode(['success' => false, 'message' => 'Room already exists']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Insert failed']);
            }
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing room name or capacity']);
    }
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
