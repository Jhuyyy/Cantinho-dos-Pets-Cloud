<?php
header('Content-Type: application/json');
include '../db.php';

$api_key = $_POST['api_key'] ?? '';
$stmt = $pdo->prepare("SELECT id FROM orgs WHERE api_key = ?");
$stmt->execute([$api_key]);
$ong = $stmt->fetch();

if (!$ong) {
    http_response_code(401);
    echo json_encode(['error' => 'API Key inválida']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO animals (nome, tipo, raca, idade, sexo, porte, descricao, foto_url, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $result = $stmt->execute([
        $_POST['nome'],
        $_POST['tipo'],
        $_POST['raca'] ?? '',
        $_POST['idade'] ?? null,
        $_POST['sexo'],
        $_POST['porte'],
        $_POST['descricao'] ?? '',
        $_POST['foto_url'] ?? '',
        $ong['id']
    ]);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Erro ao cadastrar animal.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao cadastrar animal: ' . $e->getMessage()]);
}