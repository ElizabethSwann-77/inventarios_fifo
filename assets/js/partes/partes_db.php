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
                $tipo_parte = $conexion->real_escape_string($input['tipo_parte']);
                $id_proyecto = $conexion->real_escape_string($input['id_proyecto']);
                $descripcion = $conexion->real_escape_string($input['descripcion']);
                $id_responsable = $_SESSION['id_usuario'];

                // Verificar existencia previa
                $checkSql = "SELECT COUNT(*) AS total FROM partes 
                            WHERE numero_parte = '$numero_parte' 
                            AND id_responsable = '$id_responsable' 
                            AND id_proyecto = '$id_proyecto'";

                $checkResult = $conexion->query($checkSql);
                $checkRow = $checkResult->fetch_assoc();

                if ($checkRow['total'] > 0) {
                    echo json_encode([
                        'success' => false,
                        'error' => 'Ya existe un número de parte igual para este proyecto y responsable.'
                    ]);
                    exit();
                }

                // Si no existe, proceder con el insert
                $sql = "INSERT INTO partes (numero_parte, tipo_parte, id_responsable, id_proyecto, descripcion, fecha_ingreso, fecha_ultima_modificacion)
                        VALUES ('$numero_parte', '$tipo_parte', '$id_responsable', '$id_proyecto', '$descripcion', NOW(), NOW())";

                if ($conexion->query($sql)) {
                    echo json_encode([
                        'success' => true,
                        'numero_parte' => $numero_parte,
                        'tipo' => $tipo_parte,
                        'responsable' => $_SESSION['nombre'],
                        'proyecto' => obtenerNombreProyecto($id_proyecto, $id_responsable)
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'success' => false,
                        'error' => 'Error al ejecutar la consulta',
                        'sql' => $sql,
                        'mysql_error' => $conexion->error
                    ]);
                }

                exit();


                break;
            
            case 'update':
                $numero_parte = $conexion->real_escape_string($input['numero_parte']);
                $tipo_parte = $conexion->real_escape_string($input['tipo_parte']);
                $id_proyecto = $conexion->real_escape_string($input['id_proyecto']);
                $descripcion = $conexion->real_escape_string($input['descripcion']);
                $id_responsable = $_SESSION['id_usuario'];

                // Validación: ¿ya existe otro con ese mismo número, proyecto y responsable?
                $checkSql = "SELECT COUNT(*) AS total FROM partes 
                            WHERE numero_parte = '$numero_parte' 
                            AND id_proyecto = '$id_proyecto' 
                            AND id_responsable = '$id_responsable'";
                $checkResult = $conexion->query($checkSql);
                $checkRow = $checkResult->fetch_assoc();

                 if ($checkRow['total'] > 1) {
                    echo json_encode([
                        'success' => false,
                        'error' => 'Ya existe un número de parte igual para este proyecto y responsable.'
                    ]);
                    exit();
                }

               $sql = "UPDATE partes 
                        SET tipo_parte = '$tipo_parte',
                            descripcion = '$descripcion',
                            fecha_ultima_modificacion = NOW()
                        WHERE numero_parte = '$numero_parte' 
                        AND id_proyecto = '$id_proyecto'
                        AND id_responsable = '$id_responsable'";

                if ($conexion->query($sql)) {
                    echo json_encode([
                        "success" => true
                    ]);
                } else {
                    echo json_encode([
                        "success" => false,
                        "error" => "Error al actualizar: " . $conexion->error,
                        "code" => 'SQL_ERROR'
                    ]);
                }

                exit();

        
            break;
            

            case 'updateStatus':
                $parte = intval($input['numero_parte']);
                $proyecto = intval($input['id_proyecto']);
                $tipo = $conexion->real_escape_string($input['tipo']);
            
                $sql = "UPDATE partes 
                        SET tipo_parte = '$tipo', fecha_ultima_modificacion = NOW()
                        WHERE id_proyecto = '$proyecto' 
                        AND numero_parte = '$parte'";
            
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


function obtenerNombreProyecto($id_proyecto, $id_responsable) {
    global $conexion;
    $stmt = $conexion->prepare("SELECT nombre FROM proyectos WHERE id_proyecto = ? AND id_responsable = ?");
    $stmt->bind_param("ii", $id_proyecto, $id_responsable);  // Dos enteros
    $stmt->execute();
    $stmt->bind_result($nombre);
    $stmt->fetch();
    $stmt->close();
    return $nombre ?? null;  // Opcional: retorna null si no se encuentra
}


// 🔍 MODO SELECT (GET)
$sql = "SELECT 
            p.numero_parte, 
            p.tipo_parte,
            u.nombre AS responsable, 
            p.id_proyecto,
            pr.nombre AS proyecto, 
            p.descripcion, 
            p.cantidad,
            DATE_FORMAT(p.fecha_ingreso, '%d/%m/%Y %H:%i') AS fecha_ingreso, 
            DATE_FORMAT(p.fecha_ultima_modificacion, '%d/%m/%Y %H:%i') AS fecha_ultima_modificacion
        FROM partes p 
        INNER JOIN usuarios u ON p.id_responsable = u.id_usuario
        INNER JOIN proyectos pr ON pr.id_proyecto = p.id_proyecto AND p.id_responsable = pr.id_responsable ";

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

