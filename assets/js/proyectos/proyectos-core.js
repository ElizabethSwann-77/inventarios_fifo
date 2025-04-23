import * as UI from './proyectos-ui.js';

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


});

function initialize() {
    getProyectos();
}


function getProyectos() {
    $.ajax({
        url: 'assets/js/proyectos/proyectos_db.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            UI.getProyectos(data); // Mostrar en la DataGrid
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener proyectos:", error);
            toastr.error("No se pudo cargar la lista de proyectos.");
        }
    });
}


