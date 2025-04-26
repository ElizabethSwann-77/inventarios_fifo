<?php
session_start();
require_once 'config/conexion.php';

$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];

    $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $fila = $resultado->fetch_assoc();

        if (password_verify($contrasena, $fila['contrasena'])) {
            $_SESSION['id_usuario'] = $fila['id_usuario'];
            $_SESSION['usuario'] = $fila['usuario'];
            $_SESSION['nombre'] = $fila['nombre'];
            $_SESSION['puesto'] = $fila['puesto'];
            header("Location: partes.php");
            exit();
        } else {
            $mensaje = "Contraseña incorrecta";
        }
    } else {
        $mensaje = "Usuario no encontrado";
    }
}
?>

<!doctype html>
<html class="no-js" lang="es">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Login Inventarios FIFO</title>
    <meta name="description" content="LOGIN">
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
    <div class="d-flex align-content-center flex-wrap">
        <div class="container">
            <div class="login-content">
                <div class="login-logo">
                    <a href="#">
                        <img class="align-content img-size" src="images/logo.png" alt="">
                    </a>
                </div>

                <!-- Mensaje de error -->
                <?php if ($mensaje): ?>
                    <div class="alert alert-danger text-center"><?= $mensaje ?></div>
                <?php endif; ?>

                <div class="login-form d-flex flex-column justify-content-between" style="height: 100%;">
                    <form method="POST" class="d-flex flex-column flex-grow-1 justify-content-between">
                        <div>
                            <div class="form-group mb-3">
                                <label class="label"> USUARIO</label>
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
                            <div class="register-link text-center mb-3">
                                <p>
                                    <a href="forget.php">Recuperar Contraseña</a>
                                </p>
                            </div>
                        </div>
                        <div>
                            <button type="submit" class="btn btn-success btn-flat w-100 mb-4">Login</button>
                            <div class="register-link text-center">
                                <p>¿No tienes una cuenta? 
                                    <br>
                                    <a href="register.php">Registrate aquí</a>
                                </p>
                            </div>
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
    <script src="assets/js/login/login-core.js"></script>

</body>
</html>
