<?php
header('Content-Type: application/json');
include '../db.php';

$tipo = $_GET['tipo'] ?? null;
$porte = $_GET['porte'] ?? null;

$where = [];
$params = [];

if ($tipo) {
    $where[] = "tipo = ?";
    $params[] = $tipo;
}
if ($porte) {
    $where[] = "porte = ?";
    $params[] = $porte;
}

$where[] = "status = 'ativo'";

$sql = "SELECT a.*, o.nome as ongNome FROM animals a JOIN orgs o ON a.org_id = o.id WHERE " . implode(" AND ", $where);

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));