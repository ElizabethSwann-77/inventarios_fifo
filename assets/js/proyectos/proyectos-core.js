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

    $('#numeroProyecto').on('input', function () {
        let valor = $(this).val().trim();

        // Validar que sea un número entero positivo mayor a 0 y sin decimales
        if (!/^[1-9]\d*$/.test(valor)) {
            $(this).val(''); // Borra el valor inválido
            toastr.error("Solo se permiten números enteros positivos mayores que cero");
        }
    });


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

    $("#btnNewProyect").click(async function () {
        limpiarInputs();
        $("#ProyectsLabel").text("Nuevo Registro de Proyecto");
        $("#btnSaveProyect").text("Guardar");
        $('#Proyects').modal('show');
    });

    $("#btnSaveProyect").click(async function () {
        const numero = ($("#numeroProyecto").val() || "").trim();
        const nombre = ($("#nombreProyecto").val() || "").trim();
        const descripcion = ($("#descripcionProyecto").val() || "").trim();

        let allFieldsValid = true;

        // Limpia los posibles estilos anteriores
        $(".form-control").removeClass("is-invalid");
    
        // Verifica los campos obligatorios
        if (!nombre || !numero) {
            if (!nombre) {
                $("#nombreProyecto").addClass("is-invalid");
            }
            if (!numero) {
                $("#numeroProyecto").addClass("is-invalid");
            }
           
            toastr.warning('Todos los campos obligatorios deben estar llenos.');
            allFieldsValid = false;
        }
    
        // Si hay campos vacíos, no procesamos los datos
        if (!allFieldsValid) return;
    
        
    
        if (UI.modoProyecto === 'insert') {
            const resultado = await postNuevoProyecto(numero, nombre, descripcion);

            if (resultado.success) {
                const grid = $("#gridProyectos").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");

                const nuevoProyecto = {
                    id_proyecto: numero ?? 0,
                    nombre: nombre,
                    descripcion: descripcion,
                    responsable: resultado.responsable ?? 'Tú',
                    estado: dataSource.estado ?? 'A',
                    fecha_registro: formatearFecha(new Date()),
                    fecha_ultima_modificacion: formatearFecha(new Date())
                };

                dataSource.push(nuevoProyecto);
                grid.refresh();

                limpiarInputs();
                $('#Proyects').modal('hide');
                toastr.success('Proyecto registrado exitosamente.');
            } else {
                toastr.error(resultado.error || 'No se pudo registrar el proyecto.');
            }
        } else if (UI.modoProyecto === 'edit') {
            const resultado = await postEditarProyecto(numero, nombre, descripcion);
    
            if (resultado.success) {
                const grid = $("#gridProyectos").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");
    
                // Actualiza el proyecto en la grilla
                const index = dataSource.findIndex(p => p.id_proyecto === numero);
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

    
async function postNuevoProyecto(numero, nombre, descripcion) {
    const response = await fetch('assets/js/proyectos/proyectos_db.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'insert',
            numero,
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
    UI.setModoProyecto('insert');
    $("#numeroProyecto").prop('disabled', false).val('');
    $('#nombreProyecto').val('');
    $('#descripcionProyecto').val('');
}