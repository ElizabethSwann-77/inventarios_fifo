'use strict';

import * as CORE from './entradas_salidas-core.js';
var $ = jQuery.noConflict();

//--Todos los estilos, tamaños y textos para la vista movil--//
let isMobile = window.matchMedia("only screen and (max-width: 1024px)").matches;
let size, sizecolumnview, sizesearchPanel, textGroupPanel;
let visible= true;

export let modoEntrada = 'insert';
export let idEntradaEditando = null;

export let modoSalida = 'insert';
export let idSalidaEditando = null;

if (isMobile){
    size = 35;
    sizecolumnview = 35;
    sizesearchPanel = 100;
    textGroupPanel = 'Arrastra la columna para agrupar';
    visible = false;
}else{
    size = 140;
    sizecolumnview = 110;
    textGroupPanel = 'Arrastra una columna aquí para agrupar';
}
//-----------------------------------------------------------//

//--GRID PARA VISUALIZAR LAS ENTRADAS DEL SISTEMA---------------------------------------------------------------------//
export function getEntradas(dataSource) {
    return $("#gridEntradas").dxDataGrid({
        dataSource: dataSource,
        columnsAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnReordering: false,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        "export": {
            enabled: true,
            fileName: "Partes",
            excelFilterEnabled: true,
            excelWrapTextEnabled: true
        },
        headerFilter: {
            visible: true,
            allowSearch: true
        },
        columnFixing: {
            enabled: true
        },
        selection: {
            mode: "single"
        },
        searchPanel: {
            visible: true,
            width: sizesearchPanel,
            placeholder: "Buscar",
        },
        paging: {
            pageSize: 10,
            enabled: true
        },
        scrolling: {
            mode: "standard"
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [5, 10, 20],
            showInfo: true
        },
        grouping: {
            autoExpandAll: false,
            allowCollapsing: true
        },
        groupPanel: {
            visible: true,
            emptyPanelText: textGroupPanel
        },
        columnDragging: {
            allowDragging: true
        },
        columns: getColumnasEntradas(),
        onToolbarPreparing: function (e) {
            let toolbarItems = e.toolbarOptions.items;

            toolbarItems.unshift({
                location: 'after',
                widget: 'dxButton',
                options: {
                    stylingMode: "contained",
                    text: "Nueva Entrada",
                    icon: 'fas fa-plus icon-button',
                    hint: 'Registrar Nueva Entrada',
                    type: 'default', // O 'success'
                    width: size,
                    elementAttr: {
                        class: "btn-custom-resaltado icon-button-wrapper"
                    },
                    onClick: function(e) {
                        modoEntrada = 'insert';
                        idEntradaEditando = null;
                        CORE.limpiarInputsEntrada();
                        CORE.getNumerosParte();
                        $("#EntradasLabel").text("Nuevo Registro de Entrada");
                        $("#btnSaveEntrada").text("Guardar");
                        $('#Entradas').modal('show');
                    }
                    
                }
            });
            
        }
    }).dxDataGrid("instance");
}

function getColumnasEntradas(){
    let dataFields = [
        {
            dataField: "id_entrada",
            allowEditing: false,
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>ID<br>Entrada</div>"));
            },
        },
        {
            dataField: "numero_parte",
            allowEditing: false,
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Número<br>de Parte</div>"));
            },
        },
        {
            dataField: "tipo_parte",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Tipo de<br>Parte</div>"));
            },
          
            cellTemplate: function(container, options) {
                const text = $("<div>").text(options.value).css({
                    whiteSpace: "normal",   // Asegura el salto de línea
                    wordWrap: "break-word", // Evita el desbordamiento por palabras largas
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
                container.append(text);
            }
        },
        {
            dataField: "cantidad",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Cantidad de<br>la entrada</div>"));
            },
        },       
        {
            dataField: "observaciones",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Observaciones de<br>la entrada</div>"));
            },        
            cellTemplate: function(container, options) {
                const text = $("<div>").text(options.value).css({
                    whiteSpace: "normal",   // Asegura el salto de línea
                    wordWrap: "break-word", // Evita el desbordamiento por palabras largas
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
                container.append(text);
            }
        },   
        {
            dataField: "responsable",
            caption: "Responsable",
            cellTemplate: function(container, options) {
                const text = $("<div>").text(options.value).css({
                    whiteSpace: "normal",   // Asegura el salto de línea
                    wordWrap: "break-word", // Evita el desbordamiento por palabras largas
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
                container.append(text);
            }
        },
        {
            dataField: "id_proyecto",
            caption: "Proyecto",
            visible: false
        },
        {
            dataField: "proyecto",
            caption: "Proyecto",
            cellTemplate: function(container, options) {
                const text = $("<div>").text(options.value).css({
                    whiteSpace: "normal",   // Asegura el salto de línea
                    wordWrap: "break-word", // Evita el desbordamiento por palabras largas
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
                container.append(text);
            }
        },
        {
            dataField: "fecha_ingreso",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Fecha<br>Ingreso</div>"));
            },
            allowEditing: false,
            dataType: "string",
            width: 135,
            minWidth: 135,
        },
        {
            dataField: "fecha_caducidad",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Fecha<br>Caducidad</div>"));
            },
            allowEditing: false,
            dataType: "string",
            width: 135,
            minWidth: 135,
        },
        {
            dataField: "fecha_ultima_modificacion",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Fecha Ultima<br>Modificación</div>"));
            },
            allowEditing: false,
            dataType: "string",
            width: 135,
            minWidth: 135,
        },
        {
            caption: "Eliminar",
            width: 70,
            minWidth: 70,
            alignment: "center",
            fixed: true,
            fixedPosition: "right",
            allowEditing: false,
            cellTemplate: function (container, options) {
                $("<div>")
                    .addClass("text-danger custom-button-container")
                    .append(
                        $("<i>")
                            .addClass("fas fa-ban custom-icon")
                            .css("cursor", "pointer")
                            .attr("title", "Eliminar Registro")
                            .on("click", function () {
                                const data = options.data;
                                modoEntrada = 'delete';
                                idEntradaEditando = data.id_entrada;

                                // Ajustar encabezado, cuerpo y botón
                                $("#DeleteLabel").text("Eliminar Entrada Número: " + data.id_entrada);
                                $("#modalBodyDelete .mensaje-confirmacion").html(`
                                    <label>¿Estás seguro que deseas eliminar la entrada número <strong>${data.id_entrada}</strong>?</label>
                                    <label>Al hacerlo, se eliminarán <strong>${data.cantidad}</strong> unidades del total de piezas registradas.</label>
                                `);

                                $("#btnDelete").text("Eliminar");

                                $("#numero_parte_delete").val(data.numero_parte);
                                $("#cantidad_delete").val(data.cantidad);

                                $('#Delete').modal('show');
                            })    
                    )
                    .appendTo(container);
            }

            
        },
        /*
        {
            caption: "Editar",
            width: 70,
            minWidth: 70,
            alignment: "center",
            fixed: true,
            fixedPosition: "right",
            allowEditing: false,
            cellTemplate: function (container, options) {
                $("<div>")
                    .addClass("text-primary custom-button-container")
                    .append(
                        $("<i>")
                            .addClass("fas fa-edit custom-icon")
                            .css("cursor", "pointer")
                            .attr("title", "Editar Registro")
                            .on("click", function () {
                                // Llama a getProyectos y actualiza el select
                                CORE.getProyectos(function() {
                                    const data = options.data;
                                    modoParte = 'edit';
                                    idParteEditando = data.numero_parte;
                            
                                    // Cargar los datos en el modal
                                    $("#parte").val(data.numero_parte);
                                    $("#precio").val(data.precio);
                                    $("#lote").val(data.id_lote);
                                    $("#piso").val(data.piso);
                                    $("#select_tipo").val(data.tipo_parte);
                                    $("#select_proyecto").val(data.id_proyecto);
                                    $("#descripcion").val(data.descripcion);
                            
                                    // Ajustar encabezado y botón
                                    $("#PartsLabel").text("Editar Número de Parte");
                                    $("#btnSaveParts").text("Actualizar");
                            
                                    $('#Parts').modal('show');
                                });
                            })    
                    )
                    .appendTo(container);
            }
            
        },
        */

    ];

    return dataFields;
}
//--------------------------------------------------------------------------------------------------------------------//

//--GRID PARA VISUALIZAR LAS SALIDAS DEL SISTEMA----------------------------------------------------------------------//
export function getSalidas(dataSource) {
    return $("#gridSalidas").dxDataGrid({
        dataSource: dataSource,
        columnsAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnReordering: false,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        "export": {
            enabled: true,
            fileName: "Partes",
            excelFilterEnabled: true,
            excelWrapTextEnabled: true
        },
        headerFilter: {
            visible: true,
            allowSearch: true
        },
        columnFixing: {
            enabled: true
        },
        selection: {
            mode: "single"
        },
        searchPanel: {
            visible: true,
            width: sizesearchPanel,
            placeholder: "Buscar",
        },
        paging: {
            pageSize: 10,
            enabled: true
        },
        scrolling: {
            mode: "standard"
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [5, 10, 20],
            showInfo: true
        },
        grouping: {
            autoExpandAll: false,
            allowCollapsing: true
        },
        groupPanel: {
            visible: true,
            emptyPanelText: textGroupPanel
        },
        columnDragging: {
            allowDragging: true
        },
        columns: getColumnasSalidas(),
        onToolbarPreparing: function (e) {
            let toolbarItems = e.toolbarOptions.items;

            toolbarItems.unshift({
                location: 'after',
                widget: 'dxButton',
                options: {
                    stylingMode: "contained",
                    text: "Nueva Salida",
                    icon: 'fas fa-hashtag icon-button',
                    hint: 'Registrar Nueva Salida',
                    type: 'default', // O 'success'
                    width: size,
                    elementAttr: {
                        class: "btn-custom-resaltado icon-button-wrapper"
                    },
                    onClick: function(e) {
                        modoSalida = 'insert';
                        idSalidaEditando = null;
                        CORE.limpiarInputsSalida();
                        CORE.getEntradasSelect();
                        $("#SalidasLabel").text("Nuevo Registro de Salida");
                        $("#btnSaveSalidas").text("Guardar");
                        $('#Salidas').modal('show');
                    }
                    
                }
            });
            
        }
    }).dxDataGrid("instance");
}

function getColumnasSalidas(){
    let dataFields = [
        {
            dataField: "id_salida",
            allowEditing: false,
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>ID<br>Salida</div>"));
            },
        },
        {
            dataField: "numero_parte",
            allowEditing: false,
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Número<br>de Parte</div>"));
            },
        },
        {
            dataField: "tipo_parte",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Tipo de<br>Parte</div>"));
            },
          
            cellTemplate: function(container, options) {
                const text = $("<div>").text(options.value).css({
                    whiteSpace: "normal",   // Asegura el salto de línea
                    wordWrap: "break-word", // Evita el desbordamiento por palabras largas
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
                container.append(text);
            }
        },
        {
            dataField: "cantidad",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Cantidad de<br>la salida</div>"));
            },
            cellTemplate: function (container, options) {
                let valor = parseFloat(options.value);
                
                // Verificamos que sea un número válido
                let valorFormateado = isNaN(valor) ? '' : `$ ${valor.toString().replace(/\.?0+$/, "")}`;
            
                const text = $("<div>").text(valorFormateado).css({
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
            
                container.append(text);
            }
        },   
        {
            dataField: "observaciones",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Observaciones de<br>la salida</div>"));
            },        
            cellTemplate: function(container, options) {
                const text = $("<div>").text(options.value).css({
                    whiteSpace: "normal",   // Asegura el salto de línea
                    wordWrap: "break-word", // Evita el desbordamiento por palabras largas
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
                container.append(text);
            }
        },       
        {
            dataField: "responsable",
            caption: "Responsable",
            cellTemplate: function(container, options) {
                const text = $("<div>").text(options.value).css({
                    whiteSpace: "normal",   // Asegura el salto de línea
                    wordWrap: "break-word", // Evita el desbordamiento por palabras largas
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
                container.append(text);
            }
        },
        {
            dataField: "id_proyecto",
            caption: "Proyecto",
            visible: false
        },
        {
            dataField: "proyecto",
            caption: "Proyecto",
            cellTemplate: function(container, options) {
                const text = $("<div>").text(options.value).css({
                    whiteSpace: "normal",   // Asegura el salto de línea
                    wordWrap: "break-word", // Evita el desbordamiento por palabras largas
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                });
                container.append(text);
            }
        },
        {
            dataField: "fecha_salida",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Fecha<br>Salida</div>"));
            },
            allowEditing: false,
            dataType: "string",
            width: 135,
            minWidth: 135,
        },
        {
            dataField: "fecha_ultima_modificacion",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Fecha Ultima<br>Modificación</div>"));
            },
            allowEditing: false,
            dataType: "string",
            width: 135,
            minWidth: 135,
        },
        {
            caption: "Editar",
            width: 70,
            minWidth: 70,
            alignment: "center",
            fixed: true,
            fixedPosition: "right",
            allowEditing: false,
            cellTemplate: function (container, options) {
                $("<div>")
                    .addClass("text-primary custom-button-container")
                    .append(
                        $("<i>")
                            .addClass("fas fa-edit custom-icon")
                            .css("cursor", "pointer")
                            .attr("title", "Editar Registro")
                            .on("click", function () {
                                // Llama a getProyectos y actualiza el select
                                CORE.getProyectos(function() {
                                    const data = options.data;
                                    modoParte = 'edit';
                                    idParteEditando = data.numero_parte;
                            
                                    // Cargar los datos en el modal
                                    $("#parte").val(data.numero_parte);
                                    $("#precio").val(data.precio);
                                    $("#lote").val(data.id_lote);
                                    $("#piso").val(data.piso);
                                    $("#select_tipo").val(data.tipo_parte);
                                    $("#select_proyecto").val(data.id_proyecto);
                                    $("#descripcion").val(data.descripcion);
                            
                                    // Ajustar encabezado y botón
                                    $("#PartsLabel").text("Editar Número de Parte");
                                    $("#btnSaveParts").text("Actualizar");
                            
                                    $('#Parts').modal('show');
                                });
                            })    
                    )
                    .appendTo(container);
            }
            

        },

    ];

    return dataFields;
}
//--------------------------------------------------------------------------------------------------------------------//
