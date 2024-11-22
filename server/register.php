<?php

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    header("HTTP/1.1 200 OK");
    die();
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Database connection
    $mysqli = new mysqli('localhost', 'debian-sys-maint', 'B6FoKbULmDP5eTAP', 'Live_text');
    if ($mysqli->connect_error) {
        throw new Exception("Database connection failed: " . $mysqli->connect_error);
    }

    $mysqli->set_charset('utf8mb4');

    // Retrieve JSON data from POST request
    $dData = json_decode(file_get_contents("php://input"), true);
    if (!$dData) {
        throw new Exception("No JSON data received or JSON is invalid.");
    }

    $username = isset($dData['name']) ? $dData['name'] : null;
    $email = isset($dData['email']) ? $dData['email'] : null;
    $password = isset($dData['pass']) ? $dData['pass'] : null;

    // Validate inputs
    if (!$username || !$email || !$password) {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit();
    }

    // Check if username already exists
    $sqlUsername = "SELECT username FROM User WHERE username = ?";
    $stmtUsername = $mysqli->prepare($sqlUsername);
    $stmtUsername->bind_param('s', $username);
    $stmtUsername->execute();
    $resultUsername = $stmtUsername->get_result();

    if ($resultUsername->num_rows > 0) {
        header("HTTP/1.1 409 Conflict");
        echo json_encode(["status" => "error", "message" => "Username already exists"]);
        exit(); // Stop further execution if username exists
    }


    // Check if email already exists
    $sqlEmail = "SELECT email FROM User WHERE email = ?";
    $stmtEmail = $mysqli->prepare($sqlEmail);
    $stmtEmail->bind_param('s', $email);
    $stmtEmail->execute();
    $resultEmail = $stmtEmail->get_result();

    if ($resultEmail->num_rows > 0) {
        header("HTTP/1.1 409 Conflict");
        echo json_encode(["status" => "error", "message" => "Email already exists"]);
        exit(); // Stop further execution if email exists
    }

    // Debugging: Log email check passed
    error_log("Email check passed");

    // Insert new user into the database
    $sqlInsert = "INSERT INTO User (username, email, password) VALUES (?, ?, ?)";
    $stmtInsert = $mysqli->prepare($sqlInsert);
    $stmtInsert->bind_param('sss', $username, $email, $password);

    if ($stmtInsert->execute()) {
        header("HTTP/1.1 201 Created");
        echo json_encode(["status" => "success", "message" => "Registration successful"]);
    } else {
        throw new Exception("Database insertion failed: " . $stmtInsert->error);
    }

} catch (Exception $e) {
    // Catch and log errors
    header("HTTP/1.1 500 Internal Server Error");
    error_log($e->getMessage());
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

?>
