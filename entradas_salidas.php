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
    <title>Entradas y Salidas</title>
    <meta name="description" content="Entradas y Salidas">
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
                        <h1>Entradas</h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="page-header float-right">
                    <div class="page-title">
                         <button style="margin-top: 7px; border-radius: 5px;" type="button" class="btn btn-success" id="btnNewEntrada">
                            <i class="fa fa-folder-plus icon-button " ></i>
                             Nueva Entrada 
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
                            <strong>Entradas de Partes</strong>
                        </div>
                        <div class="card-body card-block">
                            <div id="gridEntradas"></div>
                        </div>
                        <div class="card-footer">
                            <!-- Opcional -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>Salidas</h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="page-header float-right">
                    <div class="page-title">
                         <button style="margin-top: 7px; border-radius: 5px;" type="button" class="btn btn-success" id="btnNewSalida">
                            <i class="fa fa-folder-plus icon-button " ></i>
                             Nueva Salida 
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
                            <strong>Salidas de Partes</strong>
                        </div>
                        <div class="card-body card-block">
                            <div id="gridSalidas"></div>
                        </div>
                        <div class="card-footer">
                            <!-- Opcional -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="Entradas" tabindex="-1" aria-labelledby="EntradasLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="EntradasLabel"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" style="color:white;">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="modalBodyEntradas">
                    <form action="" method="post" enctype="multipart/form-data" class="form-horizontal">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label class="form-control-label">Número de Parte</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-barcode"></i></div>
                                    <select class="form-control" id="select_partes_entrada">
                                    </select>
                                    <div class="invalid-feedback">
                                        Por favor selecciona un número de parte.
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="form-control-label">Cantidad de Piezas</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-hashtag"></i></div>
                                    <input type="number" class="form-control" placeholder="Ejemplo: 100" id="cantidad_entrada" required>
                                    <div class="invalid-feedback">
                                        Por favor ingresa la cantidad de piezas.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label class="form-control-label">Precio</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-dollar-sign"></i></div>
                                    <input type="number" class="form-control" placeholder="Ejemplo: $2300" id="precio_entrada" required>
                                    <div class="invalid-feedback">
                                        Por favor ingresa el precio.
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="form-control-label">Número de Lote</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-layer-group"></i></div>
                                    <input class="form-control" placeholder="Ejemplo: 1A" id="lote_entrada" required>
                                    <div class="invalid-feedback">
                                        Por favor ingresa el lote.
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="form-control-label">Piso</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-building"></i></div>
                                    <input class="form-control" placeholder="Ejemplo: 1" id="piso_entrada" required>
                                    <div class="invalid-feedback">
                                        Por favor ingresa el piso.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-control-label">Observaciones de la Entrada</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-keyboard"></i></div>
                                <textarea id="observaciones_entrada" class="form-control" rows="4" placeholder="Observaciones (opcional)"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="btnSaveEntrada"></button>
                </div>
            </div>
        </div>
    </div>

        <div class="modal fade" id="Salidas" tabindex="-1" aria-labelledby="SalidasLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="SalidasLabel"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" style="color:white;">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="modalBodySalidas">
                    <form action="" method="post" enctype="multipart/form-data" class="form-horizontal">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label class="form-control-label">Número de Parte</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-barcode"></i></div>
                                    <select class="form-control" id="select_partes_salida">
                                    </select>
                                    <div class="invalid-feedback">
                                        Por favor selecciona un número de parte.
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="form-control-label">Cantidad de Piezas</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-hashtag"></i></div>
                                    <input type="number" class="form-control" placeholder="Ejemplo: 100" id="cantidad_salida" disabled required>
                                </div>
                                <!-- Mensaje dinámico -->
                                <small id="cantidad_maxima_msg" class="form-text text-muted" style="display: none;"></small>

                                <div class="invalid-feedback">
                                    Por favor ingresa la cantidad de piezas.
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label class="form-control-label">Precio</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-dollar-sign"></i></div>
                                    <input type="number" class="form-control" placeholder="Ejemplo: $2300" id="precio_salida" required>
                                    <div class="invalid-feedback">
                                        Por favor ingresa el precio.
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="form-control-label">Número de Lote</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-layer-group"></i></div>
                                    <input class="form-control" placeholder="Ejemplo: 1A" id="lote_salida" required>
                                    <div class="invalid-feedback">
                                        Por favor ingresa el lote.
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="form-control-label">Piso</label>
                                <div class="input-group">
                                    <div class="input-group-addon"><i class="fa fa-building"></i></div>
                                    <input class="form-control" placeholder="Ejemplo: 1" id="piso_salida" required>
                                    <div class="invalid-feedback">
                                        Por favor ingresa el piso.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-control-label">Observaciones de la Salida</label>
                            <div class="input-group">
                                <div class="input-group-addon"><i class="fa fa-keyboard"></i></div>
                                <textarea id="observaciones_salida" class="form-control" rows="4" placeholder="Observaciones (opcional)"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="btnSaveSalidas"></button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="Delete" tabindex="-1" aria-labelledby="DeleteLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="DeleteLabel"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" style="color:white;">&times;</span>
                    </button>
                </div>
               <div class="modal-body" id="modalBodyDelete">
                    <div class="mensaje-confirmacion"></div>
                    <input type="hidden" id="numero_parte_delete">
                    <input type="hidden" id="id_proyecto_delete">
                    <input type="hidden" id="cantidad_delete">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="btnDelete"></button>
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
<script type="module" src="assets/js/entradas_salidas/entradas_salidas-core.js"></script>

</body>
</html>
