<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../src/config/db.php';

$app = new \Slim\App;
//Customer routes
require '../src/routes/places.php';

$app->get('/',function (Request $request, Response $response, array $args){
  echo file_get_contents('static/map/index.html');
});
$app->get('/add',function (Request $request, Response $response, array $args){
  echo file_get_contents('static/add/index.html');
});
$app->get('/test',function (Request $request, Response $response, array $args){
  echo file_get_contents('static/testmap/index.html');
});
$app->run();
