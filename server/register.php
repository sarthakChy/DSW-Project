<?php

/* // header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
// header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

//B6FoKbULmDP5eTAP
//debian-sys-maint

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header("HTTP/1.1 200 OK");
die();
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$mysqli = new mysqli('localhost', 'debian-sys-maint', 'B6FoKbULmDP5eTAP', 'Live_text');
if(!$mysqli){
    echo "error in connection";
}
else{
    $mysqli->set_charset('utf8mb4');

    printf("Success... %s\n", $mysqli->host_info);
    $dData = json_decode(file_get_contents("php://input"));
    
    $user = $dData['user'];
    $pass = $dData['pass'];
    
    $UID = 2;
$username = "b";
$password = "b";
$email = "b@gmail.com";

$q = "INSERT INTO User (UID, username, email, date_created, password) 
      VALUES ($UID, '$username', '$email', CURRENT_DATE(), '$password')";

if ($mysqli->query($q)) {
    echo "New record created successfully";
} else {
    echo "Error: " . $q . "<br>" . mysqli_error($mysqli);
}
} */





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
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
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

    // Check if email already exists
    $sql = "SELECT email FROM User WHERE email = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        header("HTTP/1.1 409 Conflict");
        echo json_encode(["status" => "error", "message" => "Email already exists"]);
    } else {
        // Insert new user into the database with auto-incremented UID and current timestamp for date_created
        $sql = "INSERT INTO User (username, email, password) VALUES (?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param('sss', $username, $email, $password);

        if ($stmt->execute()) {
            header("HTTP/1.1 201 Created");
            echo json_encode(["status" => "success", "message" => "Registration successful"]);
        } else {
            throw new Exception("Database insertion failed: " . $stmt->error);
        }
    }

} catch (Exception $e) {
    // Catch and log errors
    header("HTTP/1.1 500 Internal Server Error");
    error_log($e->getMessage());  // Log error message for debugging
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

?>
