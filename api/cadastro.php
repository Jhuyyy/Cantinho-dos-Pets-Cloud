<?php
header('Content-Type: application/json');
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$api_key = $_POST['api_key'] ?? '';

if (!$api_key) {
    http_response_code(400);
    echo json_encode(['error' => 'API Key é obrigatória.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM orgs WHERE api_key = ?");
$stmt->execute([$api_key]);
$ong = $stmt->fetch();

if (!$ong) {
    http_response_code(401);
    echo json_encode([
        'error' => 'API Key inválida.',
        'hint' => 'Use a chave padrão: f018d39ee759f809e24aa4d3c4481c49'
    ]);
    exit;
}

$ong_id = 1;

$stmt = $pdo->prepare("
    INSERT INTO animals (nome, tipo, raca, idade, sexo, porte, descricao, foto_url, org_id, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$result = $stmt->execute([
    $_POST['nome'],
    $_POST['tipo'],
    $_POST['raca'] ?? '',
    $_POST['idade'] ?? null,
    $_POST['sexo'],
    $_POST['porte'],
    $_POST['descricao'] ?? '',
    $_POST['foto_url'] ?? '',
    $ong_id,
    'ativo'
]);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => '✅ Animal cadastrado com sucesso! A ONG "Amigos da Rua" receberá notificação.'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao cadastrar animal. Tente novamente.']);
}