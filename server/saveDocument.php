<?php
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
$mysqli = new mysqli('localhost', 'debian-sys-maint', 'B6FoKbULmDP5eTAP', 'Live_text');

if ($mysqli->connect_error) {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$mysqli->set_charset('utf8mb4');

// Decode the incoming JSON data
$dData = json_decode(file_get_contents("php://input"), true);

// Check if the necessary fields are provided
if (!isset($dData['user'], $dData['title'], $dData['content'], $dData['visibility'], $dData['docid'])) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$User = $dData['user'];
$Doc_id = $dData['docid'];
$Title = $dData['title'];
$Content = $dData['content'];
$Visibility = $dData['visibility'];

// Validate the visibility value
if (!in_array($Visibility, ['Public', 'Private', 'Shared'])) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Invalid visibility value"]);
    exit;
}


$stmt = $mysqli->prepare("SELECT UID FROM User WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $User, $User);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "User not found"]);
    exit;
}

$row = $result->fetch_assoc();
$UID = $row['UID'];
$Role = 'Creator';

//Check if the document already exists
$stmt = $mysqli->prepare("SELECT DocumentID FROM Document WHERE DocumentID = ?");
$stmt->bind_param("s", $Doc_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Document exists, perform UPDATE
    try {
        $stmt = $mysqli->prepare("UPDATE Document SET Title = ?, Content = ?, Visibility = ?, LastModified = CURRENT_TIMESTAMP WHERE DocumentID = ?");
        $stmt->bind_param("ssss", $Title, $Content, $Visibility, $Doc_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Document updated successfully"]);
        } else {
            echo json_encode(["error" => "No changes made to the document"]);
        }
        $stmt->close();
    } catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(["error" => "Failed to update document", "details" => $e->getMessage()]);
    }
} else {
    // Document doesn't exist, perform INSERT
    try {
        $stmt = $mysqli->prepare("INSERT INTO Document (DocumentID, UID, Title, Content, Visibility) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sisss", $Doc_id, $UID, $Title, $Content, $Visibility);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Document created successfully"]);
        } else {
            echo json_encode(["error" => "Failed to create document"]);
        }
        $stmt->close();


        $stmt = $mysqli->prepare("INSERT INTO Collaborator (DocumentID, UID, Role) VALUES (?, ?, ?)");
        $stmt->bind_param("sis", $Doc_id, $UID, $Role);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Collaborator created successfully"]);
        } else {
            echo json_encode(["error" => "Failed to create Collaborator"]);
        }
        $stmt->close();

    } catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(["error" => "Failed to save document", "details" => $e->getMessage()]);
    }
}

$mysqli->close();
?>
