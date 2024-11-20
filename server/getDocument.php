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
$dData = json_decode(file_get_contents("php://input"), true);

if (!isset($dData['uid'])) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Missing UID"]);
    exit;
}

$UID = $dData['uid'];

try {
    $stmt = $mysqli->prepare("SELECT DocumentID, Title FROM Document WHERE UID = ?");
    $stmt->bind_param("i", $UID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $documents = [];
        while ($row = $result->fetch_assoc()) {
            $documents[] = $row;
        }
        echo json_encode($documents);
    } else {
        echo json_encode([]);  // No documents found
    }

    $stmt->close();
} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => "Failed to retrieve documents", "details" => $e->getMessage()]);
}

$mysqli->close();
?>
