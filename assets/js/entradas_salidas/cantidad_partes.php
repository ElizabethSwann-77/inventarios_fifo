<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/inventarios_fifo/config/conexion.php';

$sql = "SELECT 
            p.numero_parte,
            p.cantidad,
            p.id_proyecto,
            pr.nombre AS proyecto
        FROM partes p 
        INNER JOIN proyectos pr ON p.id_proyecto = pr.id_proyecto
        INNER JOIN usuarios u ON p.id_responsable = u.id_usuario
        WHERE p.cantidad != 0";


// Agregar filtro si no es ADM
if (!isset($_SESSION['puesto']) || $_SESSION['puesto'] === 'EMP') {
    $id_usuario = intval($_SESSION['id_usuario']);
    $sql .= " AND p.id_responsable = $id_usuario";
}

$resultado = $conexion->query($sql);
$partes = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $partes[] = $fila;
    }
}

$conexion->close();

header('Content-Type: application/json');
echo json_encode($partes);
