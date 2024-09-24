<?php

// header('Access-Control-Allow-Origin: *');
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
}
?>