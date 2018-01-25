<?php

include_once "includes/headers.php";
include_once "includes/db.php";

header("Access-Control-Allow-Methods: GET");


function listMessages($limit, $lastId=NULL) {
    $db = DbConnect();
    $sql = '';
    try {
        $limit = intval($limit);
    } catch(Exception $err) {
        $limit = 1000;
    }
    if ($lastId !== NULL) {
        $lastId = $db->quote($lastId);
    }
    if ($lastId !== NULL) {
        $sql = "SELECT * FROM messages WHERE id>$lastId ORDER BY id DESC LIMIT ".$limit.";";
    } else {
        $sql = "SELECT * FROM messages ORDER BY id DESC LIMIT ".$limit.";";
    }

    $statement = $db->prepare($sql);
    $statement->execute(NULL);

    $res = $statement->fetchAll(PDO::FETCH_ASSOC);

    // print_r($res);
    // print_r($statement->debugDumpParams());

    // JSON_NUMERIC_CHECK converts numeric strings to numbers
    // See: https://stackoverflow.com/questions/11128823/how-to-properly-format-pdo-results-numeric-results-returned-as-string
    echo json_encode(array_reverse($res), JSON_NUMERIC_CHECK);
}

$limit = isset($_GET['limit']) ? $_GET['limit'] : 1000;
$lastId = isset($_GET['lastId']) ? $_GET['lastId'] : NULL;

http_response_code(200);

die(listMessages($limit, $lastId));
