<?php

// allow cross domain requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Requested-With, X-Request');

// this script returns JSON
header('Content-Type: application/json');

// determine action, throw exception on error
if (! isset($_GET['action'])) {
    throw new Exception("Url parameter not set: action");
}

$action = $_GET['action'];
if ($action == 'read') {
    GetMessage($_GET['id']);
} else if ($action == 'write') {
    WriteMessage($_GET['mykey'], $_GET['value']);
} else if ($action == 'list') {
    GetMessages($_GET['limit']);
} else {
    throw new Exception("Invalid action: " . $action);
}

function GetMessages($limit) {
    $db = DbConnect();

    $sql = "select * from messages order by id desc limit $limit";
    $statement = $db->prepare($sql);
    $statement->execute();

    $res = $statement->fetchAll(PDO::FETCH_ASSOC);

    // JSON_NUMERIC_CHECK converts numeric strings to numbers
    // See: https://stackoverflow.com/questions/11128823/how-to-properly-format-pdo-results-numeric-results-returned-as-string
    echo json_encode(array_reverse($res), JSON_NUMERIC_CHECK);
}

function GetMessage($id) {
    $db = DbConnect();

    $sql = "select * from messages where id=:id";
    $statement = $db->prepare($sql);
    $statement->execute(array(
        ':id' => $id
    ));
    // fetch column name to value hash
    $row = $statement->fetch(PDO::FETCH_ASSOC);

    // JSON_NUMERIC_CHECK converts numeric strings to numbers
    // See: https://stackoverflow.com/questions/11128823/how-to-properly-format-pdo-results-numeric-results-returned-as-string
    echo json_encode($row, JSON_NUMERIC_CHECK);
}

function WriteMessage($mykey, $value) {
    $db = DbConnect();

    $sql = "insert into messages (mykey, value) values(:mykey, :value)";
    $statement = $db->prepare($sql);
    $statement->execute(array(
        ':mykey' => $mykey,
        ':value' => $value,
    ));

    echo $db->lastInsertId();
}

function DbConnect() {
    $dbserver = "127.0.0.1";
    $dbname = "gorillachat";
    $dbuser = "gorillachat";
    $dbpass = "gorillachat";

    $db = new PDO("mysql:host=$dbserver;dbname=$dbname", $dbuser, $dbpass);

    return $db;
}
