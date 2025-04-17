<?php
$host = "localhost";         // Servidor (XAMPP usa localhost)
$usuario = "root";           // Usuario por defecto de XAMPP
$contrasena = "";            // Contraseña vacía por defecto en XAMPP
$base_de_datos = "inventarios_fifo";  // El nombre de tu base

$conexion = new mysqli($host, $usuario, $contrasena, $base_de_datos);

if ($conexion->connect_error) {
    die("Error en la conexión: " . $conexion->connect_error);
}

?>