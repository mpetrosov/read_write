<?php

if (! isset($_GET['action'])) {
    throw new Exception("Url parameter not set: action");
} else if ($_GET['action'] == 'read') {
    GetMessage($_GET['id']);
} else if ($_GET['action'] == 'write') {
    WriteMessage($_GET['mykey'], $_GET['value']);
} else {
    throw new Exception("Invalid url parameter value: " . $_GET['action']);
}

function GetMessage($id) {
    $db = DbConnect();

    $sql = "select value from messages where id=:id";
    $statement = $db->prepare($sql);
    $statement->execute(array(
        ':id' => $id
    ));
    $row = $statement->fetch();

    echo $row['value'];
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

?>
