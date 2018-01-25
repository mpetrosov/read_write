<?php

include_once "includes/headers.php";
include_once "includes/db.php";

header("Access-Control-Allow-Methods: GET");


function retrieveMessage($id) {
    $db = DbConnect();

    $sql = "SELECT * FROM messages WHERE id=:id;";
    $statement = $db->prepare($sql);
    $statement->execute(
        array(
            ':id' => $id
        )
    );
    // fetch column name to value hash
    $row = $statement->fetch(PDO::FETCH_ASSOC);

    // JSON_NUMERIC_CHECK converts numeric strings to numbers
    // See: https://stackoverflow.com/questions/11128823/how-to-properly-format-pdo-results-numeric-results-returned-as-string
    echo json_encode($row, JSON_NUMERIC_CHECK);
}

$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id == null) {
    http_response_code(400);
    die('{"message": "id is missing in the POST request."}');
}

http_response_code(200);

die(retrieveMessage($id));
