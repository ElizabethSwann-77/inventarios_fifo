<?php
require_once 'config/conexion.php';

$mensaje = "";
$mostrar_formulario_contrasena = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = $_POST['usuario'] ?? '';
    $ficha = $_POST['ficha'] ?? '';

    // Validación mínima
    if (empty($usuario) || empty($ficha)) {
        $mensaje = "Usuario y ficha son obligatorios.";
    } else {
        // Verificar si existe el usuario y ficha en la base de datos
        $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE usuario = ? AND ficha = ?");
        $stmt->bind_param("ss", $usuario, $ficha);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            $mostrar_formulario_contrasena = true;
        } else {
            $mensaje = "Usuario o ficha no encontrados.";
        }
    }

    // Si el formulario se reenvía con una contraseña nueva
    if (isset($_POST['nueva_contrasena']) && $mostrar_formulario_contrasena) {
        $nueva_contrasena = $_POST['nueva_contrasena'];
        $confirmar_contrasena = $_POST['confirmar_contrasena'];

        if ($nueva_contrasena !== $confirmar_contrasena) {
            $mensaje = "Las contraseñas no coinciden.";
        } elseif (strlen($nueva_contrasena) < 6) {
            $mensaje = "La contraseña debe tener al menos 6 caracteres.";
        } else {
            $contrasena_encriptada = password_hash($nueva_contrasena, PASSWORD_DEFAULT);
            $update = $conexion->prepare("UPDATE usuarios SET contrasena = ? WHERE usuario = ? AND ficha = ?");
            $update->bind_param("sss", $contrasena_encriptada, $usuario, $ficha);
            if ($update->execute()) {
                $mensaje = "Contraseña actualizada correctamente.";
                $mostrar_formulario_contrasena = false;

                // Vaciar POST para limpiar campos en recarga
                $_POST = [];
            } else {
                $mensaje = "Error al actualizar la contraseña.";
            }
        }
    }
}
?>

<!doctype html>
<html class="no-js" lang="es">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Registro Inventarios FIFO</title>
    <meta name="description" content="REGISTER">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" href="apple-icon.png">
    <link rel="shortcut icon" href="favicon.ico">

    <!-- Bootstrap -->
    <link rel="stylesheet" href="vendors/bootstrap/dist/css/bootstrap.min.css">

    <!-- FontAwesome -->
    <link href="vendors/fontawesome/5.14.0/css/all.css" rel="stylesheet">

    <!-- Toastr -->
    <link href="vendors/toastr/toastr.css" rel="stylesheet">

    <!-- Estilos Propios -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/login.css">

    <!-- Google Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet' type='text/css'>
</head>

<body class="bg-dark">
    <div class="sufee-login d-flex align-content-center flex-wrap">
        <div class="container">
            <div class="login-content">
                <div class="login-logo">
                    <a href="index.php">
                        <img class="align-content img-size" src="images/logo.png" alt="">
                    </a>
                </div>
                <div class="login-form d-flex flex-column justify-content-between" style="height: 100%;">
                    <form method="POST" class="d-flex flex-column flex-grow-1 justify-content-between">
                        <div id="mensaje-container" data-mensaje="<?= htmlspecialchars($mensaje) ?>"></div>

                        <!-- Siempre se muestran -->
                        <div class="form-group mb-3">
                            <label class="label">Usuario</label>
                            <input type="text" name="usuario" class="form-control" placeholder="Nombre de Usuario" id="usuario" value="<?= htmlspecialchars($_POST['usuario'] ?? '') ?>" required autocomplete="username">
                        </div>
                        <div class="form-group mb-3">
                            <label class="label">No. de Ficha</label>
                            <input type="number" name="ficha" class="form-control" placeholder="Número de Ficha" id="ficha" value="<?= htmlspecialchars($_POST['ficha'] ?? '') ?>" required>
                        </div>

                        <?php if ($mostrar_formulario_contrasena): ?>
                            <!-- Solo si el usuario y ficha existen -->
                            <div class="form-group mb-3">
                                <label class="label">Nueva Contraseña</label>
                                <div class="input-group">
                                    <input type="password" name="nueva_contrasena" class="form-control" id="password" required autocomplete="new-password"> 
                                    <div class="input-group-append">
                                        <span id="toggle-password" class="input-group-text">
                                            <i class="fas fa-eye"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label">Confirmar Contraseña</label>
                                <div class="input-group">
                                    <input type="password" name="confirmar_contrasena" class="form-control" id="password-confirm" required autocomplete="new-password">
                                    <div class="input-group-append">
                                        <span id="toggle-password2" class="input-group-text">
                                            <i class="fas fa-eye"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>

                        <button type="submit" class="btn btn-primary btn-flat w-100 mb-4">
                            <?= $mostrar_formulario_contrasena ? 'Cambiar Contraseña' : 'Validar Usuario' ?>
                        </button>

                        <div class="register-link text-center">
                            <p>¿Ya tienes una cuenta?<br><a href="index.php">Ingresa aquí</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- JS -->
    <script src="vendors/jquery/jquery-3.5.1.min.js"></script>
    <script src="vendors/popper.js/dist/umd/popper.min.js"></script>
    <script src="vendors/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="vendors/toastr/toastr.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/forget/forget-core.js"></script>

</body>
</html>
