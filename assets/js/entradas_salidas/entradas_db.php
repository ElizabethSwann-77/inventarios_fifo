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

                $sql = "INSERT INTO entradas (numero_parte, cantidad, observaciones, id_registro_entrada, fecha_ingreso, fecha_caducidad)
                        VALUES ('$numero_parte', '$cantidad', '$observaciones', '$id_responsable', NOW(), DATE_ADD(NOW(), INTERVAL 100 DAY))";

                if ($conexion->query($sql)) {
                    $id_insertado = $conexion->insert_id; // ✅ obtener inmediatamente después del INSERT

                    $sql2 = "UPDATE partes 
                            SET cantidad = cantidad + '$cantidad',
                                fecha_ultima_modificacion = NOW()
                            WHERE numero_parte = '$numero_parte'";
                    
                    $conexion->query($sql2); // ✅ ejecutar después de capturar insert_id

                    $id_proyecto = obtenerIDProyecto($numero_parte);

                    echo json_encode([
                        'success' => true,
                        'id_entrada' => $id_insertado,
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

            
            case 'update':
                $numero_parte = $conexion->real_escape_string($input['numero_parte']);
                $precio = $conexion->real_escape_string($input['precio']);
                $id_lote = $conexion->real_escape_string($input['id_lote']);
                $piso = $conexion->real_escape_string($input['piso']);
                $tipo_parte = $conexion->real_escape_string($input['tipo_parte']);
                $id_proyecto = $conexion->real_escape_string($input['id_proyecto']);
                $descripcion = $conexion->real_escape_string($input['descripcion']);
            
                $sql = "UPDATE partes 
                        SET numero_parte = '$numero_parte',
                            id_lote = '$id_lote',
                            tipo_parte = '$tipo_parte',
                            precio = '$precio',
                            piso = '$piso',
                            id_proyecto = '$id_proyecto',
                            descripcion = '$descripcion',
                            fecha_ultima_modificacion = NOW()
                        WHERE numero_parte = '$numero_parte'";  // Usamos numero_parte en lugar de id_parte
            
                if ($conexion->query($sql)) {
                    echo json_encode([
                        "success" => true,
                        "proyecto" => obtenerNombreProyecto($id_proyecto)
                    ]);
                    exit();
                } else {
                    echo json_encode(["success" => false, "error" => $conexion->error, "sql" => $sql]);
                    exit();
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
            $id = intval($input['id_entrada']);
            $numero_parte = $conexion->real_escape_string($input['numero_parte']);
            $cantidad = $conexion->real_escape_string($input['cantidad']);

            $sql = "DELETE FROM entradas WHERE id_entrada = $id";

            $sql2 = "UPDATE partes 
                     SET cantidad = cantidad - $cantidad,
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
            e.id_entrada,
            e.numero_parte, 
            e.cantidad,  
            p.tipo_parte,
            u.nombre AS responsable, 
            p.id_proyecto,
            pr.nombre AS proyecto, 
            p.descripcion, 
            e.observaciones,
            DATE_FORMAT(e.fecha_ingreso, '%d/%m/%Y %H:%i') AS fecha_ingreso, 
            DATE_FORMAT(e.fecha_caducidad, '%d/%m/%Y %H:%i') AS fecha_caducidad        
        FROM entradas e
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

