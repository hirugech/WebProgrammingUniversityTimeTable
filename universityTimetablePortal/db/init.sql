
CREATE DATABASE IF NOT EXISTS timetableDB;
USE timetableDB;

CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    userRole ENUM('admin', 'professor', 'student') NOT NULL
);

CREATE TABLE courses (
    courseId INT AUTO_INCREMENT PRIMARY KEY,
    courseName VARCHAR(100) NOT NULL,
    semester INT
);

CREATE TABLE subjects (
    subjectId INT AUTO_INCREMENT PRIMARY KEY,
    subjectName VARCHAR(100),
    courseId INT,
    FOREIGN KEY (courseId) REFERENCES courses(courseId) ON DELETE CASCADE
);


CREATE TABLE rooms (
    roomId INT AUTO_INCREMENT PRIMARY KEY,
    roomName VARCHAR(50) NOT NULL
);

CREATE TABLE timetables (
    timetableId INT AUTO_INCREMENT PRIMARY KEY,
    subjectId INT,
    professorId INT,
    roomId INT,
    dayOfWeek ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
    startTime TIME,
    endTime TIME,
    FOREIGN KEY (subjectId) REFERENCES subjects(subjectId) ON DELETE CASCADE,
    FOREIGN KEY (professorId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (roomId) REFERENCES rooms(roomId) ON DELETE CASCADE
);
