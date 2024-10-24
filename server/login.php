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
    
    $dData = json_decode(file_get_contents("php://input"), true);

    $user = isset($dData['user']) ? $dData['user'] : null;
    $pass = isset($dData['pass']) ? $dData['pass'] : null;

    $sql = "SELECT password FROM User WHERE username = '$user'";
    $result = $mysqli->query($sql);
  
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      
      if ($pass === $row['password']) {
          
          header("HTTP/1.1 200 OK");
          echo "Login successful";
      } else {          
          header("HTTP/1.1 401 Unauth");
          echo "Invalid password";
      }
    } else {
        header("HTTP/1.1 401 Unauth");
        echo "User not found";
    }


    
}


?>