<?php
header('Content-Type: application/json');
include '../db.php';

try {
    $stmt = $pdo->query("SELECT id, nome FROM orgs");
    $ongs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ongs);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar ONGs: ' . $e->getMessage()]);
}