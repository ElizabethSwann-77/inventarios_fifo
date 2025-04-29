<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/inventarios_fifo/config/conexion.php';

$sql = "SELECT 
            p.id_proyecto, 
            p.nombre 
        FROM proyectos p 
        INNER JOIN usuarios u ON p.id_responsable = u.id_usuario";

// Agregar filtro si no es ADM
if (!isset($_SESSION['puesto']) || $_SESSION['puesto'] === 'EMP') {
    $id_usuario = intval($_SESSION['id_usuario']);
    $sql .= " WHERE p.id_responsable = $id_usuario";
}

$resultado = $conexion->query($sql);
$proyectos = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $proyectos[] = $fila;
    }
}

$conexion->close();

header('Content-Type: application/json');
echo json_encode($proyectos);
