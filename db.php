<?php
$host = 'localhost';
$db   = 'cantinhodospets';
$user = 'root';
$pass = 'root'; // Senha vazia — comum em instalações escolares

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro de conexão: " . $e->getMessage());
}