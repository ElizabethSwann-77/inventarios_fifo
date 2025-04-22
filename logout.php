<?php
session_start();

// Destruir todas las variables de sesión
$_SESSION = [];

// Destruir la sesión completamente
session_destroy();

// Evitar que el usuario vuelva con el botón "atrás"
header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
header("Pragma: no-cache"); // HTTP 1.0.
header("Expires: 0"); // Proxies.

// Redirigir al login
header("Location: index.php");
exit();
?>
