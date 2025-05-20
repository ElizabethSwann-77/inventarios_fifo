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
                $numero = $conexion->real_escape_string($input['numero']);
                $nombre = $conexion->real_escape_string($input['nombre']);
                $descripcion = $conexion->real_escape_string($input['descripcion']);
                $id_responsable = $_SESSION['id_usuario']; // Ajusta según tu sesión

                // Validación: verificar si ya existe un proyecto con el mismo número y responsable
                $checkSql = "SELECT COUNT(*) AS existe FROM proyectos WHERE id_proyecto = '$numero' AND id_responsable = '$id_responsable'";
                $checkResult = $conexion->query($checkSql);

                if ($checkResult) {
                    $row = $checkResult->fetch_assoc();
                    if ($row['existe'] > 0) {
                        echo json_encode([
                            'success' => false,
                            'error' => 'Ya existe el proyecto número: ' . $numero . ' para este usuario.'
                        ]);
                        exit();
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Error al verificar existencia previa']);
                    exit();
                }

                // Si no existe, se hace el insert
                $sql = "INSERT INTO proyectos (id_proyecto, nombre, descripcion, id_responsable, fecha_registro, fecha_ultima_modificacion)
                        VALUES ('$numero', '$nombre', '$descripcion', '$id_responsable', NOW(), NOW())";

                if ($conexion->query($sql)) {
                    echo json_encode([
                        'success' => true,
                        'responsable' => $_SESSION['nombre']
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
            p.id_proyecto, 
            p.nombre, 
            u.nombre AS responsable, 
            p.descripcion, 
            estado,
            DATE_FORMAT(p.fecha_registro, '%d/%m/%Y %H:%i') AS fecha_registro, 
            DATE_FORMAT(p.fecha_ultima_modificacion, '%d/%m/%Y %H:%i') AS fecha_ultima_modificacion
        FROM proyectos p 
        INNER JOIN usuarios u ON p.id_responsable = u.id_usuario";

// Agregar filtro si no es ADM
if (!isset($_SESSION['puesto']) || $_SESSION['puesto'] === 'EMP') {
    $id_usuario = intval($_SESSION['id_usuario']); // Asegúrate de sanitizar el ID
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
