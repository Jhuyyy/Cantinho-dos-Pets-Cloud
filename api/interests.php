<?php
header('Content-Type: application/json');
include '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['animal_id'], $data['nome'], $data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO interests (animal_id, nome, email, telefone, mensagem) VALUES (?, ?, ?, ?, ?)");
    $result = $stmt->execute([
        $data['animal_id'],
        $data['nome'],
        $data['email'],
        $data['telefone'] ?? '',
        $data['mensagem'] ?? ''
    ]);

    echo json_encode(['success' => $result]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao salvar interesse: ' . $e->getMessage()]);
}