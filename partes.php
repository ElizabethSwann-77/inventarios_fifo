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

    <!-- Devexpress -->
    <link rel="stylesheet" href="https://cdn3.devexpress.com/jslib/20.1.6/css/dx.common.css">
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/20.1.6/css/dx.softblue.compact.css">
    <link rel="stylesheet" href="assets/css/datagrid.css">

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
                         <button style="margin-top: 7px; border-radius: 5px;" type="button" class="btn btn-success" id="btnNewParts">
                            <i class="fa fa-barcode icon-button" ></i>
                             Nuevo Número de Parte 
                        </button>
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

    <div class="modal fade" id="Parts" tabindex="-1" aria-labelledby="PartsLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="PartsLabel"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" style="color:white;">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="modalBodyParts">
                    <form action="" method="post" enctype="multipart/form-data" class="form-horizontal">
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <label class="form-control-label">Número de Parte</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-barcode"></i></div>
                                    <input class="form-control" placeholder="Ejemplo: 01A1B2C3" id="parte" required>
                                    <div class="invalid-feedback">
                                        Por favor ingresa el número de parte.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label class="form-control-label">Ultimo proceso</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-microchip"></i></div>
                                    <select class="form-control" id="select_tipo">
                                        <option value="SMT">SMT</option>
                                        <option value="THT">THT</option>
                                        <option value="FG">FG</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="form-control-label">Proyecto</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-project-diagram"></i></div>
                                    <select class="form-control" id="select_proyecto">
                                    </select>
                                    <div class="invalid-feedback">
                                        Por favor selecciona un proyecto.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-control-label">Descripción del Número de Parte</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-keyboard"></i></div>
                                <textarea id="descripcion" class="form-control" rows="4" placeholder="Descripción (opcional)"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="btnSaveParts"></button>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdn3.devexpress.com/jslib/20.1.6/js/dx.all.js"></script>
<script src="assets/js/main.js"></script>
<script type="module" src="assets/js/partes/partes-core.js"></script>

</body>
</html>
