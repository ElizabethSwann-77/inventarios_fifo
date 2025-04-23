<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/inventarios_fifo/config/conexion.php';

$sql = "SELECT p.id_proyecto, p.nombre, u.nombre as responsable, p.descripcion, p.fecha_registro  
        FROM proyectos p 
        INNER JOIN usuarios u ON p.id_responsable = u.id_usuario";
$resultado = $conexion->query($sql);

$proyectos = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $proyectos[] = $fila;
    }
}

$conexion->close();

// Enviar como JSON
header('Content-Type: application/json');
echo json_encode($proyectos);
?>