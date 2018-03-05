<?php
  class db{
      // Properties
      private $dbhost = 'localhost';
      private $dbuser = 'tanman';
      private $dbpass = '12345';
      private $dbname = 'lemons';

      public function connect(){
        $mysql_connect_str = "mysql:host=$this->dbhost;dbname=$this->dbname;";
        $dbConnection = new PDO($mysql_connect_str, $this->dbuser, $this->dbpass);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbConnection;
      }


      // public function connect(){
      //
      // }
  }
