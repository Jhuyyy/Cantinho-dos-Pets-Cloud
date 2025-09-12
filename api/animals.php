<?php
header('Content-Type: application/json');
include '../db.php'; // Conexão com o banco

try {
    $stmt = $pdo->query("SELECT a.*, o.nome as ong_rooms FROM animals a 
                         JOIN orgs o ON a.org_id = o.id 
                         WHERE a.status = 'ativo'");
    
    $animais = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($animais);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar animais: ' . $e->getMessage()]);
}