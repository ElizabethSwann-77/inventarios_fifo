import * as UI from './entradas_salidas-ui.js';

// Desactivar el conflicto con otras librerías
var $ = jQuery.noConflict();

let cantidadMaxima = 0;


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

    $('#lote_entrada, #lote_salida').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 4) {
            $(this).val(valor.substring(0, 3));  // Limitar a  3 caracteres
            toastr.warning("El lote no puede ser mayor a 3 caracteres");
        }
    });

    $('#precio_entrada, #precio_salida').on('input', function () {
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

    $('#piso_entrada, #piso_salida').on('input', function () {
        let valor = $(this).val().trim();

        // Validar que sea un número entero positivo mayor a 0 y sin decimales
        if (!/^[1-9]\d*$/.test(valor)) {
            $(this).val(''); // Borra el valor inválido
            toastr.error("Solo se permiten números enteros positivos mayores que cero");
        }
    });
    
    $('#observaciones_entrada, #observaciones_salida').on('input', function () {
        const valor = $(this).val().trim();
        if (valor.length >= 301) {
            $(this).val(valor.substring(0, 300));
            toastr.warning("La observación no puede ser mayor a 300 caracteres");
        }
    });

    let cantidadMaxima = 0;

    $('#select_partes_salida').on('change', function () {
        const selected = $(this).find(':selected');
        const cantidad = parseInt(selected.data('cantidad')) || 0;
    
        cantidadMaxima = cantidad;
    
        if (selected.val()) {
            $('#cantidad_salida')
                .prop('disabled', false)
                .attr('max', cantidadMaxima); // opcional para navegadores modernos
        } else {
            $('#cantidad_salida').prop('disabled', true).val('');
        }
    });
    
    // Validar cantidad en tiempo real
    $('#cantidad_salida').on('input', function () {
        const valor = parseInt($(this).val()) || 0;
    
        if (valor > cantidadMaxima) {
            $(this).val(cantidadMaxima); // Limita al máximo
            toastr.warning(`No puedes solicitar más de ${cantidadMaxima} piezas para este número de parte.`);
        }
    });

    $("#btnNewEntrada").click(async function () {
    limpiarInputsEntrada();
    getNumerosParte();
    $("#EntradasLabel").text("Nuevo Registro de Entrada");
    $("#btnSaveEntrada").text("Guardar");
    $('#Entradas').modal('show');
    });

    $("#btnSaveEntrada").click(async function () {
        const selectedValue = ($("#select_partes_entrada").val() || "").trim();
        const [numero_parte, id_proyecto] = selectedValue.split("|");
        const cantidad = ($("#cantidad_entrada").val() || "").trim();
        const precio = ($("#precio_entrada").val() || "").trim();
        const lote = ($("#lote_entrada").val() || "").trim();
        const piso = ($("#piso_entrada").val() || "").trim();
        const observaciones = ($("#observaciones_entrada").val() || "").trim();
        
        let allFieldsValid = true;
    
        // Limpia los posibles estilos anteriores
        $(".form-control").removeClass("is-invalid");
    
        // Verifica los campos obligatorios
        if (!numero_parte || !cantidad || !precio || !lote || !piso) {
            if (!numero_parte) {
                $("#select_partes_entrada").addClass("is-invalid");
            }
            if (!cantidad) {
                $("#cantidad_entrada").addClass("is-invalid");
            }
            if (!precio) {
                $("#precio_entrada").addClass("is-invalid");
            }
            if (!lote) {
                $("#lote_entrada").addClass("is-invalid");
            }
            if (!piso) {
                $("#piso_entrada").addClass("is-invalid");
            }
           
            toastr.warning('Todos los campos obligatorios deben estar llenos.');
            allFieldsValid = false;
        }
    
        // Si hay campos vacíos, no procesamos los datos
        if (!allFieldsValid) return;
    
        const datos = {
            numero_parte,
            id_proyecto,
            cantidad,
            precio,
            lote,
            piso,
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
                    precio: precio ?? 0,
                    id_lote: lote ?? 0,
                    piso: piso ?? 0,
                    observaciones: observaciones ?? '',
                    responsable: resultado.responsable,
                    id_proyecto_entrada: resultado.id_proyecto ?? 0,
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
                toastr.error('No se pudo registrar la entrada de material. Intenta nuevamente.');
                console.error('Error en el insert:', resultado.error || 'Error desconocido');
            }
        }        
    });

    $("#btnNewSalida").click(async function () {
        limpiarInputsSalidas();
        getNumerosParteSalidas();
        $("#SalidasLabel").text("Nuevo Registro de Salida");
        $("#btnSaveSalidas").text("Guardar");
        $('#Salidas').modal('show');
    });

    $('#select_partes_salida').on('change', function () {
        const selected = $(this).find(':selected');
        const cantidad = parseInt(selected.data('cantidad')) || 0;

        cantidadMaxima = cantidad;

        if (selected.val()) {
            $('#cantidad_salida')
                .prop('disabled', false)
                .attr('max', cantidadMaxima);

            // Actualiza el mensaje
            $('#cantidad_maxima_msg')
                .text(`Cantidad máxima: ${cantidadMaxima}`)
                .show();
        } else {
            $('#cantidad_salida').prop('disabled', true).val('');

            // Oculta el mensaje
            $('#cantidad_maxima_msg').hide();
        }
    });


    $("#btnSaveSalidas").click(async function () {
        const selectedValue = ($("#select_partes_salida").val() || "").trim();
        const [numero_parte, id_proyecto] = selectedValue.split("|");
        const cantidad = ($("#cantidad_salida").val() || "").trim();
        const precio = ($("#precio_salida").val() || "").trim();
        const lote = ($("#lote_salida").val() || "").trim();
        const piso = ($("#piso_salida").val() || "").trim();
        const observaciones = ($("#observaciones_salida").val() || "").trim();
        
        let allFieldsValid = true;
    
        // Limpia los posibles estilos anteriores
        $(".form-control").removeClass("is-invalid");

         if (!numero_parte || !cantidad || !precio || !lote || !piso) {
            if (!numero_parte) {
                $("#select_partes_salida").addClass("is-invalid");
            }
            if (!cantidad) {
                $("#cantidad_salida").addClass("is-invalid");
            }
            if (!precio) {
                $("#precio_salida").addClass("is-invalid");
            }
            if (!lote) {
                $("#lote_salida").addClass("is-invalid");
            }
            if (!piso) {
                $("#piso_salida").addClass("is-invalid");
            }
           
            toastr.warning('Todos los campos obligatorios deben estar llenos.');
            allFieldsValid = false;
        }
    
    
        // Si hay campos vacíos, no procesamos los datos
        if (!allFieldsValid) return;
    
        const datos = {
            numero_parte,
            id_proyecto,
            cantidad,
            precio,
            lote,
            piso,
            observaciones
        };
    
        if (UI.modoSalida === 'insert') {
            const resultado = await postNuevaSalida(datos);
            console.log(resultado)
            if (resultado.success) {
                
                const grid = $("#gridSalidas").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");

                const hoy = new Date();
    
                const nuevaSalida = {
                    id_salida: resultado.id_salida ?? 0,
                    numero_parte: numero_parte ?? 0,
                    tipo_parte: resultado.tipo,
                    cantidad: cantidad ?? 0,
                    precio: precio ?? 0,
                    id_lote: lote ?? 0,
                    piso: piso ?? 0,
                    observaciones: observaciones ?? '',
                    responsable: resultado.responsable,
                    id_proyecto_salida: resultado.id_proyecto ?? 0,
                    proyecto: resultado.proyecto,
                    fecha_salida: formatearFecha(hoy),
                };
    
                dataSource.push(nuevaSalida);
                grid.refresh();
    
                limpiarInputsSalidas();
                $('#Salidas').modal('hide');
                toastr.success('Salida de material registrada exitosamente.');
            } else {
                toastr.error('No se pudo registrar el proyecto.');
            }
        }         
    });

    $("#btnDelete").click(async function () {
        const numero_parte = ($("#numero_parte_delete").val() || "").trim();
        const id_proyecto = ($("#id_proyecto_delete").val() || "").trim();
        const cantidad = ($("#cantidad_delete").val() || "").trim();

        const datos = {
            id_entrada: UI.idEntradaEditando,
            cantidad,
            numero_parte,
            id_proyecto
        };

        const datos2 = {
            id_salida: UI.idSalidaEditando,
            cantidad,
            numero_parte,
            id_proyecto
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
        } else if (UI.modoSalida === 'delete') {
            const resultado = await postEliminarSalida(datos2);

            if (resultado.success) {
                const grid = $("#gridSalidas").dxDataGrid("instance");
                const dataSource = grid.option("dataSource");

                // Buscar y eliminar el registro desde el dataSource
                const index = dataSource.findIndex(item => item.id_salida === UI.idSalidaEditando);
                if (index !== -1) {
                    dataSource.splice(index, 1); // eliminar del array
                }

                // Refrescar la vista del grid
                grid.refresh();

                $('#Delete').modal('hide');
                toastr.success('Salida eliminada exitosamente.');
            } else {
                toastr.error('No se pudo eliminar la salida.');
            }
        }
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
                        value: parte.numero_parte + '|' + parte.id_proyecto,
                        text: parte.numero_parte + ' - ' + parte.proyecto
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
    try {
        const response = await fetch('assets/js/entradas_salidas/entradas_db.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'insert', ...datos })
        });

        // Si el servidor responde pero con error (ej. 500)
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result?.mysql_error || 'Error desconocido en el servidor');
        }

        return result;
    } catch (error) {
        console.error('Error en postNuevaParte:', error);
        return {
            success: false,
            error: error.message || 'Fallo inesperado'
        };
    }
}

async function postEliminarEntrada(datos) {
    const response = await fetch('assets/js/entradas_salidas/entradas_db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ...datos })
    });
    return await response.json();
}

export function limpiarInputsEntrada() {
    UI.setModoEntrada('insert');
    $('#cantidad_entrada').val('');
    $('#precio_entrada').val('');
    $('#lote_entrada').val('');
    $('#piso_entrada').val('');
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

export function getNumerosParteSalidas(callback) {
    $.ajax({
        url: 'assets/js/entradas_salidas/cantidad_partes.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const select = $('#select_partes_salida');
            select.empty(); // Limpia opciones anteriores
            select.append('<option value="" disabled selected>Selecciona un número de parte</option>');

            data.forEach(function(parte) {
                select.append(
                    $('<option>', {
                        value: parte.numero_parte + '|' + parte.id_proyecto,
                        text: parte.numero_parte + ' - ' + parte.proyecto,
                        'data-cantidad': parte.cantidad  // Guarda la cantidad disponible
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

async function postNuevaSalida(datos) {
    const response = await fetch('assets/js/entradas_salidas/salidas_db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'insert', ...datos })
    });
    return await response.json();
}

async function postEliminarSalida(datos) {
    const response = await fetch('assets/js/entradas_salidas/salidas_db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ...datos })
    });
    return await response.json();
}

/*--------------------------------------------------------------------------------------------------*/

function formatearFecha(fecha) {
    const f = new Date(fecha);
    const dia = String(f.getDate()).padStart(2, '0');
    const mes = String(f.getMonth() + 1).padStart(2, '0');
    const anio = f.getFullYear();
    const horas = String(f.getHours()).padStart(2, '0');
    const minutos = String(f.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

export function limpiarInputsSalidas() {
    UI.setModoSalida('insert');
    $('#cantidad_salida').val('').prop('disabled', true);
    $('#observaciones_salida').val('');

    // Limpiar mensaje de cantidad máxima
    $('#cantidad_maxima_msg').text('').hide();
}

