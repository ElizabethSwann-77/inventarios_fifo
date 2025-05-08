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

    $('#parte').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 10) {
            $(this).val(valor.substring(0, 9));  // Limitar a  9 caracteres
            toastr.warning("El número de parte no puede ser mayor a 9 caracteres");
        }
    });

    $('#lote').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 4) {
            $(this).val(valor.substring(0, 3));  // Limitar a  3 caracteres
            toastr.warning("El lote no puede ser mayor a 3 caracteres");
        }
    });

    $('#precio').on('input', function () {
        const valor = $(this).val();
    
        // Verifica si hay un punto decimal
        if (valor.includes('.')) {
            const [entero, decimal] = valor.split('.');
    
            // Si hay más de 3 decimales, los recorta
            if (decimal.length > 3) {
                $(this).val(`${entero}.${decimal.substring(0, 3)}`);
                toastr.warning("Solo se permiten hasta 3 decimales en el precio.");
            }
        }
    });
    

    $('#descripcion').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 301) {
            $(this).val(valor.substring(0, 300));  // Limitar a  300 caracteres
            toastr.warning("La descripcion del proyecto no puede ser mayor a 300 caracteres");
        }
    });

    $("#btnSaveParts").click(async function () {
        const numero_parte = ($("#parte").val() || "").trim();
        const precio = ($("#precio").val() || "").trim();
        const id_lote = ($("#lote").val() || "").trim();
        const piso = ($("#piso").val() || "").trim();
        const tipo_parte = ($("#select_tipo").val() || "").trim();
        const id_proyecto = ($("#select_proyecto").val() || "").trim();
        const descripcion = ($("#descripcion").val() || "").trim();
        
        let allFieldsValid = true;
    
        // Limpia los posibles estilos anteriores
        $(".form-control").removeClass("is-invalid");
    
        // Verifica los campos obligatorios
        if (!numero_parte || !precio || !id_lote || !piso || !id_proyecto) {
            if (!numero_parte) {
                $("#parte").addClass("is-invalid");
            }
            if (!precio) {
                $("#precio").addClass("is-invalid");
            }
            if (!id_lote) {
                $("#lote").addClass("is-invalid");
            }
            if (!piso) {
                $("#piso").addClass("is-invalid");
            }
            if (!id_proyecto) {
                $("#select_proyecto").addClass("is-invalid");
            }
            toastr.warning('Todos los campos obligatorios deben estar llenos.');
            allFieldsValid = false;
        }
    
        // Si hay campos vacíos, no procesamos los datos
        if (!allFieldsValid) return;
    
        const datos = {
            numero_parte,
            precio,
            id_lote,
            piso,
            tipo_parte,
            id_proyecto,
            descripcion
        };
    
        if (UI.modoParte === 'insert') {
            const resultado = await postNuevaParte(datos);
    
            if (resultado.success) {
                const grid = $("#gridPiezas").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");
    
                const nuevaParte = {
                    numero_parte: resultado.numero_parte ?? 0,
                    id_lote: resultado.lote ?? 0,
                    piso: resultado.piso ?? 0,
                    tipo_parte: resultado.tipo ?? 'SMT',
                    precio: resultado.precio ?? 0,
                    responsable: resultado.responsable,
                    id_proyecto: id_proyecto,
                    proyecto: resultado.proyecto,
                    descripcion: descripcion,
                    cantidad: 0,
                    fecha_ingreso: formatearFecha(new Date()),
                    fecha_ultima_modificacion: formatearFecha(new Date())
                };
    
                dataSource.push(nuevaParte);
                grid.refresh();
    
                limpiarInputs();
                $('#Parts').modal('hide');
                toastr.success('Número de parte registrado exitosamente.');
            } else {
                toastr.error('No se pudo registrar el proyecto.');
            }
        } else if (UI.modoParte === 'edit') {
            const datos = {
                numero_parte: UI.idParteEditando,  // Usamos numero_parte como identificador
                precio,
                id_lote,
                piso,
                tipo_parte,
                id_proyecto,
                descripcion
            };
        
            const resultado = await postEditarParte(datos);
        
            if (resultado.success) {
                const grid = $("#gridPiezas").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");
        
                const index = dataSource.findIndex(p => p.numero_parte === UI.idParteEditando);  // Comparamos por numero_parte
                if (index !== -1) {
                    dataSource[index] = {
                        ...dataSource[index],
                        ...datos,
                        fecha_ultima_modificacion: formatearFecha(new Date())
                    };
                }
        
                grid.refresh();
                limpiarInputs();
                $('#Parts').modal('hide');
                toastr.success('Número de parte actualizado correctamente.');
            } else {
                toastr.error('No se pudo actualizar la parte.');
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

export function getProyectos(callback) {
    $.ajax({
        url: 'assets/js/partes/select_proyecto.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const select = $('#select_proyecto');
            select.empty(); // Limpia opciones anteriores
            select.append('<option value="" disabled selected>Selecciona un proyecto</option>');

            data.forEach(function(proyecto) {
                select.append(
                    $('<option>', {
                        value: proyecto.id_proyecto,
                        text: proyecto.nombre
                    })
                );
            });

            // Llamamos al callback después de cargar los proyectos
            if (callback) callback();
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los proyectos:", error);
            toastr.error("No se pudo cargar la lista de proyectos.");
        }
    });
}


async function postNuevaParte(datos) {
    const response = await fetch('assets/js/partes/partes_db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'insert', ...datos })
    });
    return await response.json();
}

async function postEditarParte(datos) {
    const response = await fetch('assets/js/partes/partes_db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', ...datos })
    });
    return await response.json();
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
    $('#parte').val('');
    $('#precio').val('');
    $('#lote').val('');
    $('#piso').val('');
    $('#descripcion').val('');
}



