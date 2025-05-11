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
            $numero_parte = $conexion->real_escape_string($input['numero_parte']);
            $cantidad = $conexion->real_escape_string($input['cantidad']);
            $observaciones = $conexion->real_escape_string($input['observaciones']);
            $id_responsable = $_SESSION['id_usuario']; // o ajusta según sesión

            $sql = "INSERT INTO salidas (numero_parte, cantidad, observaciones, id_registro_salida, fecha_salida)
                    VALUES ('$numero_parte', '$cantidad', '$observaciones', '$id_responsable', NOW())";

            if ($conexion->query($sql)) {
                $id_insertado = $conexion->insert_id; // ✅ obtener inmediatamente después del INSERT

                $sql2 = "UPDATE partes 
                         SET cantidad = cantidad - '$cantidad',
                            fecha_ultima_modificacion = NOW()
                         WHERE numero_parte = '$numero_parte'";
                
                $conexion->query($sql2); // ✅ ejecutar después de capturar insert_id

                $id_proyecto = obtenerIDProyecto($numero_parte);

                echo json_encode([
                    'success' => true,
                    'id_salida' => $id_insertado,
                    'responsable' => $_SESSION['nombre'],
                    'tipo' => obtenerTipoParte($numero_parte),
                    'id_proyecto' => $id_proyecto,
                    'proyecto' => obtenerNombreProyecto($id_proyecto)
                ]);
                exit();
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Error al ejecutar la consulta',
                    'sql' => $sql
                ]);
                exit();
            }
        break;
                        
        case 'delete':
            $id = intval($input['id_salida']);
            $numero_parte = $conexion->real_escape_string($input['numero_parte']);
            $cantidad = $conexion->real_escape_string($input['cantidad']);

            $sql = "DELETE FROM salidas WHERE id_salida = $id";

            $sql2 = "UPDATE partes 
                     SET cantidad = cantidad + $cantidad,
                        fecha_ultima_modificacion = NOW()
                     WHERE numero_parte = '$numero_parte'";

            if ($conexion->query($sql) && $conexion->query($sql2)) {
                    echo json_encode(["success" => true]);
                    exit();
                } else {
                    echo json_encode([
                        "success" => false,
                        "error" => "Error en la consulta: " . $conexion->error,
                        "sql1" => $sql,
                        "sql2" => $sql2,
                        "datos_recibidos" => $input
                    ]);
                }

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


function obtenerTipoParte($numero_parte) {
    global $conexion;
    $stmt = $conexion->prepare("SELECT tipo_parte FROM partes WHERE numero_parte = ?");
    $stmt->bind_param("s", $numero_parte);
    $stmt->execute();
    $stmt->bind_result($tipo);
    $stmt->fetch();
    $stmt->close();
    return $tipo;
}


function obtenerIDProyecto($numero_parte) {
    global $conexion;
    $stmt = $conexion->prepare("SELECT id_proyecto FROM partes WHERE numero_parte = ?");
    $stmt->bind_param("s", $numero_parte);
    $stmt->execute();
    $stmt->bind_result($id_proyecto);
    $stmt->fetch();
    $stmt->close();
    return $id_proyecto;
}


function obtenerNombreProyecto($id_proyecto) {
    global $conexion;
    $stmt = $conexion->prepare("SELECT nombre FROM proyectos WHERE id_proyecto = ?");
    $stmt->bind_param("i", $id_proyecto);
    $stmt->execute();
    $stmt->bind_result($nombre);
    $stmt->fetch();
    $stmt->close();
    return $nombre;
}


// 🔍 MODO SELECT (GET)
$sql = "SELECT 
            e.id_salida,
            e.numero_parte, 
            e.cantidad,   
            p.tipo_parte,
            u.nombre AS responsable, 
            p.id_proyecto,
            pr.nombre AS proyecto, 
            p.descripcion, 
            e.observaciones,
            DATE_FORMAT(e.fecha_salida, '%d/%m/%Y %H:%i') AS fecha_salida
        FROM salidas e
        INNER JOIN partes p ON p.numero_parte = e.numero_parte
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

