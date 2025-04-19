// Desactivar el conflicto con otras librerías
var $ = jQuery.noConflict();

// Ahora puedes usar "$" para referirte a jQuery
$(document).ready(function() {
    toastr.options = {
        "positionClass": "toast-custom-top",
        "preventDuplicates": true,
        "closeButton": true,
        "showDuration": "none",
        "hideDuration": "none",
        "timeOut": 3500,
        "showEasing": "swing",
        "hideEasing": "linear",
        "onShown": function() {
            const toast = $(this);
            setTimeout(() => {
                toast.addClass("toast-fade-out");
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        },
        "onHidden": function() {
            const toast = $(this);
            toast.removeClass("toast-fade-out");
        }
    };

    initialize();

    const mensaje = $('#mensaje-container').data('mensaje');
    if (mensaje) {
        if (mensaje.includes("exitoso")) {
            toastr.success(mensaje);
            setTimeout(function() {
                window.location.href = 'index.php';
            }, 3000);
        } else if (mensaje.includes("existe")) {
            toastr.warning(mensaje);
        } else if (mensaje.includes("Error")) {
            toastr.error(mensaje);
        } else {
            toastr.info(mensaje);
        }
    }

    $('#usuario').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 50) {
            $(this).val(valor.substring(0, 50));  // Limitar a 50 caracteres
            toastr.warning("El usuario no puede ser mayor a 50 caracteres");
        }
    });

    $('#password').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 15) {
            $(this).val(valor.substring(0, 15));  // Limitar a 50 caracteres
            toastr.warning("La contraseña no puede ser mayor a 50 caracteres");
        }
    });

    // Función para alternar la visibilidad de la contraseña
    $('#toggle-password').on('click', function() {
        const passwordField = $('#password');
        const icon = $(this).find('i');
        
        // Verificar si la contraseña es visible o no
        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');  // Mostrar la contraseña
            icon.removeClass('fa-eye').addClass('fa-eye-slash');  // Cambiar el ícono a "ojo tachado"
        } else {
            passwordField.attr('type', 'password');  // Ocultar la contraseña
            icon.removeClass('fa-eye-slash').addClass('fa-eye');  // Volver al ícono de "ojo"
        }
    });

    $('#nombre').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 100) {
            $(this).val(valor.substring(0, 100));  // Limitar a 150 caracteres
            toastr.warning("El nombre no puede ser mayor a 150 caracteres");
        }
    });

});

function initialize() {}
