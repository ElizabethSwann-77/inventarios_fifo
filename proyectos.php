<?php
session_start();
// Evitar que se use el caché del navegador
header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1
header("Pragma: no-cache"); // HTTP 1.0
header("Expires: 0"); // Proxies

// Verificar si el usuario está logueado
if (!isset($_SESSION['usuario'])) {
    header("Location: index.php");
    exit();
}
?>
<!doctype html>
<html class="no-js" lang="es">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Formulario FIFO</title>
    <meta name="description" content="Formulario FIFO">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" href="apple-icon.png">
    <link rel="shortcut icon" href="favicon.ico">

    <!-- Bootstrap -->
    <link rel="stylesheet" href="vendors/bootstrap/dist/css/bootstrap.min.css">

    <!-- FontAwesome -->
    <link href="vendors/fontawesome/5.14.0/css/all.css" rel="stylesheet">

    <!-- Toastr -->
    <link href="vendors/toastr/toastr.css" rel="stylesheet">

    <!-- Estilos propios -->
    <link rel="stylesheet" href="assets/css/navbar.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/own_style.css">

    <!-- Fuente -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet'>

    <!-- DataGrid -->
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/20.1.6/css/dx.softblue.compact.css">
</head>
<body>

<div id="wrapper" style="min-height: 100vh; display: flex; flex-direction: column;">
    <!--Inicio Header-->
    <?php require 'header.php'?>
    <!--Fin  Header-->

    <div id="right-panel" class="right-panel" style="flex: 1;">
        <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>Registro de Proyectos</h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="page-header float-right">
                    <div class="page-title">
                    </div>
                </div>
            </div>
        </div>

        <div class="content mt-3">
            <div class="animated fadeIn">
                <div class="col-md-12 col-12">
                    <div class="card">
                        <div class="card-header">
                            <strong>Proyectos</strong>
                        </div>
                        <div class="card-body card-block">
                            <!-- Tu tabla aquí -->
                        </div>
                        <div class="card-footer">
                            <!-- Opcional -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--Inicio Footer-->
    <?php require 'footer.php'?>
    <!--Fin Footer-->
</div>

<script src="vendors/jquery/jquery-3.5.1.min.js"></script>
<script src="vendors/popper.js/dist/umd/popper.min.js"></script>
<script src="vendors/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="vendors/toastr/toastr.min.js"></script>
<script src="https://cdn3.devexpress.com/jslib/20.1.6/js/dx.all.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/proyectos/proyectos-core.js"></script>

</body>
</html>
