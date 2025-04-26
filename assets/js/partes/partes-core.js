import * as UI from './partes-ui.js';

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

    $('#nombreProyecto').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 101) {
            $(this).val(valor.substring(0, 100));  // Limitar a 100 caracteres
            toastr.warning("El nombre del proyecto no puede ser mayor a 100 caracteres");
        }
    });


    $('#descripcionProyecto').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 301) {
            $(this).val(valor.substring(0, 300));  // Limitar a  300 caracteres
            toastr.warning("La descripcion del proyecto no puede ser mayor a 300 caracteres");
        }
    });

    $("#btnSaveProyect").click(async function () {
        const nombre = $("#nombreProyecto").val().trim();
        const descripcion = $("#descripcionProyecto").val().trim();
    
        if (!nombre) {
            toastr.warning('El nombre del proyecto es obligatorio.');
            return;
        }
    
        if (UI.modoProyecto === 'insert') {
            const resultado = await postNuevoProyecto(nombre, descripcion);
    
            if (resultado.success) {
                const grid = $("#gridProyectos").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");
    
                const nuevoProyecto = {
                    id_proyecto: resultado.id_proyecto ?? 0,
                    nombre: nombre,
                    descripcion: descripcion,
                    responsable: resultado.responsable ?? 'Tú',
                    fecha_registro: formatearFecha(new Date()),
                    fecha_ultima_modificacion: formatearFecha(new Date())
                };
    
                dataSource.push(nuevoProyecto);
                grid.refresh();
    
                limpiarInputs();
                $('#Proyects').modal('hide');
                toastr.success('Proyecto registrado exitosamente.');
            } else {
                toastr.error('No se pudo registrar el proyecto.');
            }
        } else if (UI.modoProyecto === 'edit') {
            const resultado = await postEditarProyecto(UI.idProyectoEditando, nombre, descripcion);
    
            if (resultado.success) {
                const grid = $("#gridProyectos").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");
    
                // Actualiza el proyecto en la grilla
                const index = dataSource.findIndex(p => p.id_proyecto === UI.idProyectoEditando);
                if (index !== -1) {
                    dataSource[index].nombre = nombre;
                    dataSource[index].descripcion = descripcion;
                    dataSource[index].fecha_ultima_modificacion = formatearFecha(new Date());
                }
    
                grid.refresh();
    
                limpiarInputs();
                $('#Proyects').modal('hide');
                toastr.success('Proyecto actualizado correctamente.');
            } else {
                toastr.error('No se pudo actualizar el proyecto.');
            }
        }
    });
    

});

function initialize() {
    getPiezas();
}


function getPiezas() {
    $.ajax({
        url: 'assets/js/partes/partes_db.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            UI.getPiezas(data); // Mostrar en la DataGrid
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los números de parte:", error);
            toastr.error("No se pudo cargar la lista de números de parte.");
        }
    });
}

    
async function postNuevoProyecto(nombre, descripcion) {
    const response = await fetch('assets/js/proyectos/proyectos_db.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'insert',
            nombre,
            descripcion
        })
    });
    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Error al parsear JSON:", e);
        return { success: false, error: 'Respuesta inválida del servidor' };
    }
}

async function postEditarProyecto(id_proyecto, nombre, descripcion) {
    const response = await fetch('assets/js/proyectos/proyectos_db.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'update',
            id_proyecto,
            nombre,
            descripcion
        })
    });

    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Error al parsear JSON:", e);
        console.warn("Respuesta recibida del servidor:", text); // <-- para debug
        return { success: false, error: 'Respuesta inválida del servidor' };
    }
}

export async function postEditarEstado(id_proyecto, estado) {
    const response = await fetch('assets/js/proyectos/proyectos_db.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'updateStatus',
            id_proyecto,
            estado
        })
    });

    const text = await response.text();

    try {
        const result = JSON.parse(text); // <- primero parseas
        if (result.success) {
            toastr.success("Estado actualizado correctamente");
        } else {
            toastr.error(result.error || "Error al actualizar estado");
        }
        return result; // <- luego retornas
    } catch (e) {
        console.error("Error al parsear JSON:", e);
        console.warn("Respuesta recibida del servidor:", text);
        toastr.error("Error en la respuesta del servidor");
        return { success: false, error: 'Respuesta inválida del servidor' };
    }
}


function formatearFecha(fecha) {
    const f = new Date(fecha);
    const dia = String(f.getDate()).padStart(2, '0');
    const mes = String(f.getMonth() + 1).padStart(2, '0');
    const anio = f.getFullYear();
    const horas = String(f.getHours()).padStart(2, '0');
    const minutos = String(f.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

export function limpiarInputs() {
    const modal = $('#newProyect');
    
    // Limpiar inputs de texto
    modal.find('input[type="text"], textarea, select').each(function () {
        $(this).val('');
    });

    // También podrías quitar clases de validación si estás usando
    modal.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
}



