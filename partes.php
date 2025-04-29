<?php
session_start();
// Evitar caché
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Verificar sesión
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

    <!-- Estilos DevExtreme -->
    <link rel="stylesheet" href="https://cdn3.devexpress.com/jslib/20.1.6/css/dx.common.css">
    <link rel="stylesheet" href="https://cdn3.devexpress.com/jslib/20.1.6/css/dx.material.blue.dark.compact.css">

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
                        <h1>Formulario FIFO</h1>
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
                            <strong>Números de Parte</strong>
                        </div>
                        <div class="card-body card-block">
                            <div id="gridPiezas"></div>
                        </div>
                        <div class="card-footer">
                            <!-- Opcional -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="Proyects" tabindex="-1" aria-labelledby="ProyectsLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ProyectsLabel">Nuevo Registro de Proyecto</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="modalBodyProyect">
                    <form action="" method="post" enctype="multipart/form-data" class="form-horizontal">

                        <div class="form-group">
                            <label class="form-control-label">Número de Parte</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-hashtag"></i></div>
                                <input class="form-control" placeholder="Ejemplo: 01A1B2C3">
                            </div>

                        </div>
                        <div class="form-group">
                            <label class="form-control-label">Cantidad</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-calculator"></i></div>
                                <input type="number" class="form-control" placeholder="Ejemplo: 20">
                            </div>
                        </div>
                    

                        <div class="form-group">
                            <label class="form-control-label">Tipo de Parte</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-microchip"></i></div>
                                <select class="form-control">
                                    <option value="SMT">SMT</option>
                                    <option value="THT">THT</option>
                                    <option value="FG">FG</option>
                                </select>
                            </div>
                        </div>


                        <div class="form-group">
                            <label class="form-control-label">Responsable</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-user"></i></div>
                                <input class="form-control" placeholder="Ejemplo: PEREZ PEREZ JUAN">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-control-label">Proyecto</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-sitemap"></i></div>
                                <input class="form-control" placeholder="Ejemplo: LINEA NISSAN">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-control-label">Tipo de pieza</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-tasks"></i></div>
                                <select class="form-control">
                                    <option value="PCB">PCB</option>
                                    <option value="Housing">Housing</option>
                                    <option value="PCBA">PCBA</option>
                                    <option value="FG">FG</option>
                                </select>
                            </div>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="btnSaveProyect">Guardar</button>
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
<script type="module" src="assets/js/partes/partes-core.js"></script>

</body>
</html>
