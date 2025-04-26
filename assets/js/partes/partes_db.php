<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/inventarios_fifo/config/conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $action = $input['action'] ?? null;

    if (!$action) {
        http_response_code(400);
        echo json_encode(['error' => 'Acción no especificada']);
        exit();
    }

    switch ($action) {
        case 'insert':
            $nombre = $conexion->real_escape_string($input['nombre']);
            $descripcion = $conexion->real_escape_string($input['descripcion']);
            $id_responsable = $_SESSION['id_usuario']; // Ajusta según tu sesión

            $sql = "INSERT INTO proyectos (nombre, descripcion, id_responsable, fecha_registro, fecha_ultima_modificacion)
                    VALUES ('$nombre', '$descripcion', '$id_responsable', NOW(), NOW())";

            if ($conexion->query($sql)) {
                echo json_encode([
                    'success' => true,
                    'id_proyecto' => $conexion->insert_id,
                    'responsable' => $_SESSION['nombre'] // Ajusta si el nombre del usuario está en otra parte
                ]);
                exit();
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al ejecutar la consulta']);
            }

            break;

            case 'update':
                $id = intval($input['id_proyecto']);
                $nombre = $conexion->real_escape_string($input['nombre']);
                $descripcion = $conexion->real_escape_string($input['descripcion']);
            
                $sql = "UPDATE proyectos 
                        SET nombre = '$nombre', descripcion = '$descripcion', fecha_ultima_modificacion = NOW()
                        WHERE id_proyecto = $id";
            
                if ($conexion->query($sql)) {
                    echo json_encode(["success" => true]);
                    exit();
                } else {
                    echo json_encode([
                        "success" => false,
                        "error" => "Error en la consulta: " . $conexion->error,
                        "sql" => $sql
                    ]);
                }
                break;

            case 'updateStatus':
                $id = intval($input['id_proyecto']);
                $estado = $conexion->real_escape_string($input['estado']);
            
                $sql = "UPDATE proyectos 
                        SET estado = '$estado', fecha_ultima_modificacion = NOW()
                        WHERE id_proyecto = $id";
            
                if ($conexion->query($sql)) {
                    echo json_encode(["success" => true]);
                    exit();
                } else {
                    echo json_encode([
                        "success" => false,
                        "error" => "Error en la consulta: " . $conexion->error,
                        "sql" => $sql
                    ]);
                }
                break;
            

        case 'delete':
            $id = intval($input['id_proyecto']);
            $sql = "DELETE FROM proyectos WHERE id_proyecto = $id";
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Acción no reconocida']);
            exit();
    }

    if ($conexion->query($sql)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al ejecutar la consulta']);
    }

    $conexion->close();
    exit();
}

// 🔍 MODO SELECT (GET)
$sql = "SELECT 
            p.numero_parte, 
            p.id_lote, 
            p.cantidad,
            p.tipo_parte,
            p.estado_parte,   
            p.estatus, 
            p.piso, 
            u.nombre AS responsable, 
            pr.nombre AS proyecto, 
            p.descripcion, 
            p.prioridad_salida,
            DATE_FORMAT(p.fecha_ingreso, '%d/%m/%Y %H:%i') AS fecha_ingreso, 
            DATE_FORMAT(p.fecha_caducidad, '%d/%m/%Y %H:%i') AS fecha_caducidad, 
            DATE_FORMAT(p.fecha_ultima_modificacion, '%d/%m/%Y %H:%i') AS fecha_ultima_modificacion
        FROM partes p 
        INNER JOIN usuarios u ON p.id_responsable = u.id_usuario
        INNER JOIN proyectos pr ON pr.id_proyecto = p.id_proyecto";

// Agregar filtro si no es ADM
if (!isset($_SESSION['puesto']) || $_SESSION['puesto'] === 'EMP') {
    $id_usuario = intval($_SESSION['id_usuario']); // Asegúrate de sanitizar el ID
    $sql .= " WHERE p.id_responsable = $id_usuario";
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
