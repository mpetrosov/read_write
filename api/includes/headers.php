<?php

// allow cross domain requests
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: access");
header('Access-Control-Allow-Headers: X-Requested-With, X-Request');

// this script returns JSON
header('Content-Type: application/json');
