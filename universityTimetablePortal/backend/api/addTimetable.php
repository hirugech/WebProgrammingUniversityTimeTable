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

    if (!$subjectId || !$professorId || !$roomId || !$dayOfWeek || !$startTime || !$endTime) {
        echo json_encode(['success' => false, 'message' => 'Missing or invalid input']);
        exit;
    }

    //  Get room capacity
    $capSql = "SELECT capacity FROM rooms WHERE roomId = ?";
    $capStmt = mysqli_prepare($conn, $capSql);
    mysqli_stmt_bind_param($capStmt, 'i', $roomId);
    mysqli_stmt_execute($capStmt);
    $capResult = mysqli_stmt_get_result($capStmt);
    $room = mysqli_fetch_assoc($capResult);
    $capacity = $room['capacity'] ?? 0;

    if ($capacity <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid room capacity']);
        exit;
    }

    //  Get courseId for subject
    $courseSql = "SELECT courseId FROM subjects WHERE subjectId = ?";
    $courseStmt = mysqli_prepare($conn, $courseSql);
    mysqli_stmt_bind_param($courseStmt, 'i', $subjectId);
    mysqli_stmt_execute($courseStmt);
    $courseResult = mysqli_stmt_get_result($courseStmt);
    $subjectRow = mysqli_fetch_assoc($courseResult);
    $courseId = $subjectRow['courseId'] ?? null;

    if (!$courseId) {
        echo json_encode(['success' => false, 'message' => 'Invalid subject/course link']);
        exit;
    }

    //  Count students in the course
    $studentCountSql = "SELECT COUNT(*) as total FROM users WHERE courseId = ? AND userRole = 'student'";
    $studentStmt = mysqli_prepare($conn, $studentCountSql);
    mysqli_stmt_bind_param($studentStmt, 'i', $courseId);
    mysqli_stmt_execute($studentStmt);
    $studentResult = mysqli_stmt_get_result($studentStmt);
    $studentRow = mysqli_fetch_assoc($studentResult);
    $studentCount = $studentRow['total'] ?? 0;

    if ($studentCount >=$capacity) {
        echo json_encode(['success' => false, 'message' => 'Room capacity exceeded']);
        exit;
    }

    // Check time conflict for room or professor
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
    $conflictStmt = mysqli_prepare($conn, $conflictQuery);
    mysqli_stmt_bind_param($conflictStmt, 'siiss', $dayOfWeek, $roomId, $professorId, $startTime, $endTime);
    mysqli_stmt_execute($conflictStmt);
    $conflictResult = mysqli_stmt_get_result($conflictStmt);

    if (mysqli_num_rows($conflictResult) > 0) {
        echo json_encode(['success' => false, 'message' => 'Time conflict: room or professor is busy']);
        exit;
    }

    //  Insert new entry
    $insertSql = "INSERT INTO timetables (subjectId, professorId, roomId, dayOfWeek, startTime, endTime)
                  VALUES (?, ?, ?, ?, ?, ?)";
    $insertStmt = mysqli_prepare($conn, $insertSql);
    mysqli_stmt_bind_param($insertStmt, 'iiisss', $subjectId, $professorId, $roomId, $dayOfWeek, $startTime, $endTime);

    if (mysqli_stmt_execute($insertStmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add timetable entry']);
    }

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
