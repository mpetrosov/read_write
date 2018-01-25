<?php

function DbConnect() {
    $dbserver = "127.0.0.1";
    $dbname = "gorillachat";
    $dbuser = "gorillachat";
    $dbpass = "gorillachat";

    $db = new PDO("mysql:host=$dbserver;dbname=$dbname", $dbuser, $dbpass);

    return $db;
}
