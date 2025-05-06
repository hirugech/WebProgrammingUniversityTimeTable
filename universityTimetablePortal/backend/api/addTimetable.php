<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../includes/dbConnect.php';

try {
    $subjectId = $_POST['subjectId'] ?? '';
    $professorId = $_POST['professorId'] ?? '';
    $roomId = $_POST['roomId'] ?? '';
    $dayOfWeek = $_POST['dayOfWeek'] ?? '';
    $startTime = $_POST['startTime'] ?? '';
    $endTime = $_POST['endTime'] ?? '';

    if ($subjectId && $professorId && $roomId && $dayOfWeek && $startTime && $endTime) {
       
        $capSql = "SELECT capacity FROM rooms WHERE roomId = ?";
        $capStmt = mysqli_prepare($conn, $capSql);
        mysqli_stmt_bind_param($capStmt, 'i', $roomId);
        mysqli_stmt_execute($capStmt);
        $capResult = mysqli_stmt_get_result($capStmt);
        $room = mysqli_fetch_assoc($capResult);
        $capacity = $room['capacity'] ?? 0;

        if ($capacity === 0) {
            echo json_encode(['success' => false, 'message' => 'Invalid room or no capacity set']);
            exit;
        }

  
        $studentCountSql = "
            SELECT COUNT(DISTINCT u.userId) AS total
            FROM users u
            JOIN subjects s ON u.courseId = s.courseId
            JOIN timetables t ON t.subjectId = s.subjectId
            WHERE t.roomId = ?
              AND t.dayOfWeek = ?
              AND ? < t.endTime AND ? > t.startTime
              AND u.userRole = 'student'
        ";
        $countStmt = mysqli_prepare($conn, $studentCountSql);
        mysqli_stmt_bind_param($countStmt, 'isss', $roomId, $dayOfWeek, $startTime, $endTime);
        mysqli_stmt_execute($countStmt);
        $countResult = mysqli_stmt_get_result($countStmt);
        $students = mysqli_fetch_assoc($countResult);
        $count = $students['total'] ?? 0;

        if ($count >= $capacity) {
            echo json_encode(['success' => false, 'message' => 'Room capacity exceeded at this time']);
            exit;
        }

        // Check for time conflict 
        $conflictQuery = "
            SELECT * FROM timetables
            WHERE dayOfWeek = ?
              AND (
                roomId = ? OR professorId = ?
              )
              AND (
                ? < endTime AND ? > startTime
              )
        ";
        $stmt = mysqli_prepare($conn, $conflictQuery);
        mysqli_stmt_bind_param($stmt, 'siiss', $dayOfWeek, $roomId, $professorId, $startTime, $endTime);
        mysqli_stmt_execute($stmt);
        $conflictResult = mysqli_stmt_get_result($stmt);

        if (mysqli_num_rows($conflictResult) > 0) {
            echo json_encode(['success' => false, 'message' => 'Time conflict detected']);
            exit;
        }

        
        $insertSql = "INSERT INTO timetables (subjectId, professorId, roomId, dayOfWeek, startTime, endTime)
                      VALUES (?, ?, ?, ?, ?, ?)";
        $insertStmt = mysqli_prepare($conn, $insertSql);
        mysqli_stmt_bind_param($insertStmt, 'iiisss', $subjectId, $professorId, $roomId, $dayOfWeek, $startTime, $endTime);

        if (mysqli_stmt_execute($insertStmt)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Insert failed']);
        }

    } else {
        echo json_encode(['success' => false, 'message' => 'Missing or invalid input']);
    }

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
