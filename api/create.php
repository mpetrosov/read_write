<?php

include_once "includes/headers.php";
include_once "includes/db.php";

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization");


function createMessage($mykey, $value) {
    $db = DbConnect();

    $sql = "INSERT INTO messages (mykey, value) VALUES(:mykey, :value);";
    $statement = $db->prepare($sql);
    $statement->execute(array(
        ':mykey' => $mykey,
        ':value' => $value,
    ));

    echo $db->lastInsertId();
}

$mykey = isset($_POST['mykey']) ? $_POST['mykey'] : null;
$value = isset($_POST['value']) ? $_POST['value'] : null;

if ($mykey == null || $value == null) {
    http_response_code(400);
    die('{"message": "mykey or value are missing in the POST request."}');
}

http_response_code(201);

die(createMessage($mykey, $value));
