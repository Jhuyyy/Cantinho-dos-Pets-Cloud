<?php
header('Content-Type: application/json');
include '../db.php';

try {
    $stmt = $pdo->query("SELECT id, nome FROM orgs ORDER BY nome");
    $ongs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($ongs)) {
        echo json_encode([]);
    } else {
        echo json_encode($ongs);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor: ' . $e->getMessage()]);
}