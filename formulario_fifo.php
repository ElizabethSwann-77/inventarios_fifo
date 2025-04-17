<?php
session_start();

// Verificar si el usuario está logueado
if (!isset($_SESSION['usuario'])) {
    // Redirigir a la página de login si la sesión no es válida
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
    <link rel="stylesheet" href="assets/css/own_style.css">
    <!--------------------->

    <!---Fuentes--->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet' type='text/css'>
    <!------------->

    <!---DataGrid--->
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/20.1.6/css/dx.softblue.compact.css">
    <!-------------->

</head>
<body>
<!--Inicio Header-->
    <?php require 'header.php'?>
<!--Fin  Header-->

<!--Inicio del contenido HTML de la pagina-->
 <!-- Right Panel -->

        <div id="right-panel" class="right-panel">
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
                <div class="row">
                    
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            <strong>Registro Número de Parte</strong>
                        </div>
                        <div class="card-body card-block">
                            <form action="" method="post" enctype="multipart/form-data" class="form-horizontal">

                                <div class="form-group">
                                    <label class="form-control-label">Número de Parte</label>
                                    <div class="input-group">
                                        <div class="input-group-addon"><i class="fa fa-hashtag"></i></div>
                                        <input class="form-control" placeholder="Ejemplo: 01A1B2C3">
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
                                    <label class="form-control-label">Cantidad</label>
                                    <div class="input-group">
                                        <div class="input-group-addon"><i class="fa fa-calculator"></i></div>
                                        <input type="number" class="form-control" placeholder="Ejemplo: 20">
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
                                    <label class="form-control-label">Estado del Proyecto</label>
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
                        <div class="card-footer">
                            <button type="submit" class="btn btn-primary btn-sm">
                                <i class="fa fa-dot-circle-o"></i> Submit
                            </button>
                            <button type="reset" class="btn btn-danger btn-sm">
                                <i class="fa fa-ban"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header">
                            <strong>Tabla Número de Parte</strong>
                        </div>
                        <div class="card-body card-block">
                            
                        </div>
                        <div class="card-footer">
                        
                        </div>
                    </div>
                </div>
            </div>
<!--Fin del contenido HTML de la pagina-->


<!--Inicio Footer-->
<?php require 'footer.php'?>
<!--Fin Footer-->

<script src="vendors/jquery/jquery-3.5.1.min.js"></script>
<script src="vendors/popper.js/dist/umd/popper.min.js"></script>
<script src="vendors/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="vendors/toastr/toastr.min.js"></script>
<script src="https://cdn3.devexpress.com/jslib/20.1.6/js/dx.all.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/fifo/fifo-core.js"></script>
</body>
</html>
