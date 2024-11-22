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
if (!isset($dData['user'],$dData['docid'], $dData['role'])) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$User = $dData['user'];
$Doc_id = $dData['docid'];
$Role = $dData['role'];


$stmt = $mysqli->prepare("SELECT UID FROM User WHERE username = ?");
$stmt->bind_param("s", $User);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["message" => "User not found"]);
    exit;
}

$row = $result->fetch_assoc();
$UID = $row['UID'];

$stmt = $mysqli->prepare("SELECT * from Collaborator where UID= ? and DocumentID = ?");
$stmt->bind_param("is",$UID,$Doc_id);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0)
{
    header("HTTP/1.1 409 Conflict");
    echo json_encode(["status" => "error", "message" => "Already shared to this User"]);
}

else{
    $stmt = $mysqli->prepare("SELECT Title, Content FROM Document where DocumentID = ? Limit 1");
    $stmt->bind_param("s", $Doc_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $Title = 'a';
    $Content = 'b';
    $Visibility = 'Shared';


    try {
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
        echo json_encode(["error" => "Failed to collab user", "details" => $e->getMessage()]);
    }

}
$mysqli->close();
?>
