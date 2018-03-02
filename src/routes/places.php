<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app = new \Slim\App;

// Get All places
$app->get('/api/places', function(Request $request, Response $response){
  $cutlery = $request->getParam('cutlery');
  $plate = $request->getParam('plate');
  $compost = $request->getParam('compost');
  // echo $cutlery;
  // echo $compost;
  // echo $plate;

  $sql = "SELECT * FROM places";
  if(! is_null($cutlery) || ! is_null($plate) || ! is_null($compost)){
    $sql = "SELECT * FROM places";
    $found = false;
    if($cutlery=="true"){
      if(!$found){
        $sql .= " WHERE ";
        $found = true;
      }
      else{
        $sql .= " AND ";
      }
      $sql .= "cutlery=\"$cutlery\"";
    }
    if($plate=="true"){
      if(!$found){
        $sql .= " WHERE ";
        $found = true;
      }
      else{
        $sql .= " AND ";
      }
      $sql .= "plate=\"$plate\"";
    }
    if($compost=="true"){
      if(!$found){
        $sql .= " WHERE ";
        $found = true;
      }
      else{
        $sql .= " AND ";
      }
      $sql .= "compost=\"$compost\"";
    }
    // echo $sql;
  }
  try{
    // GET DB Object
    $db = new db();
    // connect
    $db = $db->connect();

    $stmt = $db->query($sql);
    $places = $stmt->fetchAll(PDO::FETCH_OBJ);
    $db = null;
    echo json_encode($places);
  } catch(PDOException $e) {
    echo '{"error": {"text": '.$e->getMessage().'}}';
  }
});

// Get Single places
$app->get('/api/places/{id}', function(Request $request, Response $response){
  $id = $request->getAttribute('id');
  $sql = "SELECT * FROM places WHERE id=$id";
  try{
    // GET DB Object
    $db = new db();
    // connect
    $db = $db->connect();

    $stmt = $db->query($sql);
    $customer = $stmt->fetchAll(PDO::FETCH_OBJ);
    $db = null;
    echo json_encode($customer);
  } catch(PDOException $e) {
    echo '{"error": {"text": '.$e->getMessage().'}}';
  }
});

// add places
$app->post('/api/places', function(Request $request, Response $response){
  $name = $request->getParam('name');
  $cutlery = $request->getParam('cutlery');
  $plate = $request->getParam('plate');
  $compost = $request->getParam('compost');
  $comments = $request->getParam('comments');
  $lat = $request->getParam('lat');
  $long = $request->getParam('long');
  $mapsid = $request->getParam('mapsid');

  $sql = "INSERT INTO places (name, cutlery, plate, compost, comments, lat, lon, mapsid) VALUES
          (:name, :cutlery, :plate, :compost, :comments, :lat, :long, :mapsid)";
  try{
    // GET DB Object
    $db = new db();
    // connect
    $db = $db->connect();

    $stmt = $db->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':cutlery', $cutlery);
    $stmt->bindParam(':plate', $plate);
    $stmt->bindParam(':compost', $compost);
    $stmt->bindParam(':comments', $comments);
    $stmt->bindParam(':lat', $lat);
    $stmt->bindParam(':long', $long);
    $stmt->bindParam(':mapsid', $mapsid);

    $stmt->execute();

    echo '{"notice":{"text":"Place Added"}}';
  } catch(PDOException $e) {
    echo '{"error": {"text": '.$e->getMessage().'}}';
  }
});

// edit places
$app->put('/api/places/{id}', function(Request $request, Response $response){
  $id = $request->getAttribute('id');
  $name = $request->getParam('name');
  $cutlery = $request->getParam('cutlery');
  $plate = $request->getParam('plate');
  $compost = $request->getParam('compost');
  $comments = $request->getParam('comments');
  $lat = $request->getParam('lat');
  $long = $request->getParam('long');
  $mapsid = $request->getParam('mapsid');

  $sql = "Update places SET
                name = :name,
                cutlery = :cutlery,
                plate = :plate,
                compost = :compost,
                comments = :comments,
                lat = :lat,
                lon = :long,
                mapsid = :mapsid
          WHERE id=$id";
  try{
    // GET DB Object
    $db = new db();
    // connect
    $db = $db->connect();

    $stmt = $db->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':cutlery', $cutlery);
    $stmt->bindParam(':plate', $plate);
    $stmt->bindParam(':compost', $compost);
    $stmt->bindParam(':comments', $comments);
    $stmt->bindParam(':lat', $lat);
    $stmt->bindParam(':long', $long);
    $stmt->bindParam(':mapsid', $mapsid);


    $stmt->execute();

    echo '{"notice":{"text":"Place Updated"}}';
  } catch(PDOException $e) {
    echo '{"error": {"text": '.$e->getMessage().'}}';
  }
});

// Delete Customer
$app->delete('/api/places/delete/{id}', function(Request $request, Response $response){
  $id = $request->getAttribute('id');
  $sql = "DELETE FROM places WHERE id=$id";
  try{
    // GET DB Object
    $db = new db();
    // connect
    $db = $db->connect();

    $stmt = $db->prepare($sql);
    $customer = $stmt->execute();
    $db = null;
    echo '{"notice":{"text":"Customer Deleted"}}';
  } catch(PDOException $e) {
    echo '{"error": {"text": '.$e->getMessage().'}}';
  }
});
