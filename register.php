<?php
require_once 'config/conexion.php';

$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];
    $nombre = $_POST['nombre'];

    // Validación mínima
    if (empty($usuario) || empty($contrasena) || empty($nombre)) {
        $mensaje = "⚠️ Todos los campos son obligatorios";
    } else {
        // Verificar si el usuario ya existe
        $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE usuario = ?");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            $mensaje = "El usuario ya existe";
        } else {
            // Encriptar la contraseña
            $contrasena_encriptada = password_hash($contrasena, PASSWORD_DEFAULT);

            // Insertar nuevo usuario
            $insertar = $conexion->prepare("INSERT INTO usuarios (usuario, contrasena, nombre, puesto) VALUES (?, ?, ?, 'EMP')");
            $insertar->bind_param("sss", $usuario, $contrasena_encriptada, $nombre);

              if ($insertar->execute()) {
                $mensaje = "Registro exitoso. Ya puedes iniciar sesión.";
            } else {
                $mensaje = "Error al registrar usuario.";
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

    <!---Bootstrap--->
    <link rel="stylesheet" href="vendors/bootstrap/dist/css/bootstrap.min.css">
    <!--------------->

    <!---FontAwesome--->
    <link href="vendors/fontawesome/5.14.0/css/all.css" rel="stylesheet">
    <!----------------->

    <!---Toastr--->
    <link href="vendors/toastr/toastr.css" rel="stylesheet">
    <!------------>

    <!---Estilos Propios--->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/login.css">
    <!--------------------->

    <!---Fuentes--->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet' type='text/css'>
    <!------------->

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
                        <div class="form-group mb-3">
                            <label class="label">Usuario</label>
                            <input type="text" name="usuario" class="form-control" placeholder="Nombre de Usuario" id="usuario" required autocomplete="username">
                            </div>
                            <div class="form-group mb-3">
                                <label class="label">Contraseña</label>
                                <div class="input-group">
                                    <input type="password" name="contrasena" class="form-control" placeholder="Contraseña" id="password" required autocomplete="current-password">
                                    <div class="input-group-append">
                                        <span id="toggle-password" class="input-group-text">
                                            <i class="fas fa-eye"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        <div class="form-group mb-3">
                            <label class="label">Nombre</label>
                            <input type="text" name="nombre" class="form-control" placeholder="Nombre completo" id="nombre" required>
                        </div>       
                        <button type="submit" class="btn btn-primary btn-flat w-100 mb-4">Registrate</button>
                        <div class="register-link text-center">
                            <p>¿Ya tienes una cuenta? 
                                <br>
                                <a href="index.php">Ingresa aquí</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="vendors/jquery/jquery-3.5.1.min.js"></script>
    <script src="vendors/popper.js/dist/umd/popper.min.js"></script>
    <script src="vendors/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="vendors/toastr/toastr.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/register/register-core.js"></script>

</body>
</html>
