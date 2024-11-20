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

// Decode the incoming JSON data or use query parameters
$dData = json_decode(file_get_contents("php://input"), true);

// Check if the necessary fields are provided
if (!isset($dData['docid'])) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$UID = $dData['uid'];
$Doc_id = $dData['docid'];

// Fetch the document from the database
$stmt = $mysqli->prepare("SELECT DocumentID, Title, Content, Visibility, LastModified FROM Document WHERE DocumentID = ?");
$stmt->bind_param("s", $Doc_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "DocumentID" => $row['DocumentID'],
        "Title" => $row['Title'],
        "Content" => json_decode($row['Content']),
        "Visibility" => $row['Visibility'],
        "LastModified" => $row['LastModified']
    ]);
}

$stmt->close();
$mysqli->close();
?>
