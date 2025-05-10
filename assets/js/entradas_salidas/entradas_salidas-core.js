import * as UI from './entradas_salidas-ui.js';

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

    $('#cantidad_entrada').on('input', function () {
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
    
    $('#observaciones_entrada').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 301) {
            $(this).val(valor.substring(0, 300));  // Limitar a  300 caracteres
            toastr.warning("La observacion de la entrada no puede ser mayor a 300 caracteres");
        }
    });

    $("#btnSaveEntrada").click(async function () {
        const numero_parte = ($("#select_partes_entrada").val() || "").trim();
        const cantidad = ($("#cantidad_entrada").val() || "").trim();
        const observaciones = ($("#observaciones_entrada").val() || "").trim();
        
        let allFieldsValid = true;
    
        // Limpia los posibles estilos anteriores
        $(".form-control").removeClass("is-invalid");
    
        // Verifica los campos obligatorios
        if (!numero_parte || !cantidad) {
            if (!numero_parte) {
                $("#select_partes_entrada").addClass("is-invalid");
            }
            if (!cantidad) {
                $("#cantidad_entrada").addClass("is-invalid");
            }
           
            toastr.warning('Todos los campos obligatorios deben estar llenos.');
            allFieldsValid = false;
        }
    
        // Si hay campos vacíos, no procesamos los datos
        if (!allFieldsValid) return;
    
        const datos = {
            numero_parte,
            cantidad,
            observaciones
        };
    
        if (UI.modoEntrada === 'insert') {
            const resultado = await postNuevaEntrada(datos);
    
            if (resultado.success) {
                const grid = $("#gridEntradas").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");

                const hoy = new Date();
                const fechaCaducidad = new Date();
                fechaCaducidad.setDate(hoy.getDate() + 100);
    
                const nuevaEntrada = {
                    id_entrada: resultado.id_entrada ?? 0,
                    numero_parte: numero_parte ?? 0,
                    tipo_parte: resultado.tipo,
                    cantidad: cantidad ?? 0,
                    observaciones: observaciones ?? '',
                    responsable: resultado.responsable,
                    id_proyecto: resultado.id_proyecto ?? 0,
                    proyecto: resultado.proyecto,
                    fecha_ingreso: formatearFecha(hoy),
                    fecha_caducidad: formatearFecha(fechaCaducidad),
                    fecha_ultima_modificacion: formatearFecha(hoy)
                };
    
                dataSource.push(nuevaEntrada);
                grid.refresh();
    
                limpiarInputsEntrada();
                $('#Entradas').modal('hide');
                toastr.success('Entrada de material registrada exitosamente.');
            } else {
                toastr.error('No se pudo registrar el proyecto.');
            }
        } else if (UI.modoEntrada === 'edit') {
            const datos = {
                id_entrada: UI.idEntradaEditando,
                numero_parte,
                cantidad,
                observaciones
            };
        
            const resultado = await postEditarEntrada(datos);
        
            if (resultado.success) {
                const grid = $("#gridEntradas").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");
        
                const index = dataSource.findIndex(p => p.id_entrada === UI.idEntradaEditando);  // Comparamos por numero_parte
                if (index !== -1) {
                    dataSource[index] = {
                        ...dataSource[index],
                        ...datos,
                        fecha_ultima_modificacion: formatearFecha(new Date())
                    };
                }
        
                grid.refresh();
                limpiarInputsEntrada();
                $('#Entradas').modal('hide');
                toastr.success('Entrada de material actualizada correctamente.');
            } else {
                toastr.error('No se pudo actualizar la entrada.');
            }
        }        
    });


    $("#btnDelete").click(async function () {
        const numero_parte = ($("#numero_parte_delete").val() || "").trim();
        const cantidad = ($("#cantidad_delete").val() || "").trim();

        const datos = {
            id_entrada: UI.idEntradaEditando,
            cantidad,
            numero_parte
        };

        if (UI.modoEntrada === 'delete') {
            const resultado = await postEliminarEntrada(datos);

            if (resultado.success) {
                const grid = $("#gridEntradas").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");

                // Buscar y eliminar el registro desde el dataSource
                const index = dataSource.findIndex(item => item.id_entrada === UI.idEntradaEditando);
                if (index !== -1) {
                    dataSource.splice(index, 1); // eliminar del array
                }

                // Refrescar la vista del grid
                grid.refresh();

                $('#Delete').modal('hide');
                toastr.success('Entrada eliminada exitosamente.');
            } else {
                toastr.error('No se pudo eliminar la entrada.');
            }
        }
    });

    $('#select_entrada').on('change', function () {
        const selectedOption = $(this).find('option:selected');
        const numeroParte = selectedOption.data('numero-parte');
        const tipoParte = selectedOption.data('tipo-parte');

        $('#numero_parte').val(numeroParte);
        $('#tipo_parte').val(tipoParte);
    });


    
    

});

function initialize() {
    getEntradas();
    getSalidas();
}

/*------------------------------------CODIGO DE ENTRADAS-------------------------------------------*/
function getEntradas() {
    $.ajax({
        url: 'assets/js/entradas_salidas/entradas_db.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            UI.getEntradas(data); // Mostrar en la DataGrid
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los números de parte:", error);
            toastr.error("No se pudo cargar la lista de números de parte.");
        }
    });
}

export function getNumerosParte(callback) {
    $.ajax({
        url: 'assets/js/entradas_salidas/partes_db.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const select = $('#select_partes_entrada');
            select.empty(); // Limpia opciones anteriores
            select.append('<option value="" disabled selected>Selecciona un número de parte</option>');

            data.forEach(function(parte) {
                select.append(
                    $('<option>', {
                        value: parte.numero_parte,
                        text: parte.numero_parte
                    })
                );
            });

            // Llamamos al callback después de cargar los numeros de parte
            if (callback) callback();
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los números de parte:", error);
            toastr.error("No se pudo cargar la lista de números de parte.");
        }
    });
}

async function postNuevaEntrada(datos) {
    const response = await fetch('assets/js/entradas_salidas/entradas_db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'insert', ...datos })
    });
    return await response.json();
}

async function postEditarEntrada(datos) {
    const response = await fetch('assets/js/entradas_salidas/entradas_db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', ...datos })
    });
    return await response.json();
}

async function postEliminarEntrada(datos) {
    const response = await fetch('assets/js/entradas_salidas/entradas_db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ...datos })
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

export function limpiarInputsEntrada() {
    $('#cantidad_entrada').val('');
    $('#observaciones_entrada').val('');
}

/*--------------------------------------------------------------------------------------------------*/



/*------------------------------------CODIGO DE SALIDAS---------------------------------------------*/
function getSalidas() {
    $.ajax({
        url: 'assets/js/entradas_salidas/salidas_db.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            UI.getSalidas(data); // Mostrar en la DataGrid
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los números de parte:", error);
            toastr.error("No se pudo cargar la lista de números de parte.");
        }
    });
}

export function getEntradasSelect(callback) {
    $.ajax({
        url: 'assets/js/entradas_salidas/entradas_db.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const select = $('#select_entrada');
            select.empty(); // Limpia opciones anteriores
            select.append('<option value="" disabled selected>Selecciona un número de entrada</option>');

            data.forEach(function(parte) {
                select.append(
                    $('<option>', {
                        value: parte.id_entrada,
                        text: parte.id_entrada,
                        'data-numero-parte': parte.numero_parte,
                        'data-tipo-parte': parte.tipo_parte
                    })
                );
            });


            // Llamamos al callback después de cargar los numeros de parte
            if (callback) callback();
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los números de parte:", error);
            toastr.error("No se pudo cargar la lista de números de parte.");
        }
    });
}

export function limpiarInputsSalida() {
    $('#cantidad_salida').val('');
    $('#observaciones_salida').val('');
}


/*--------------------------------------------------------------------------------------------------*/

