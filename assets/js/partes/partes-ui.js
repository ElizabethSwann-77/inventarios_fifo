'use strict';

import * as CORE from './partes-core.js';
var $ = jQuery.noConflict();

//--Todos los estilos, tamaños y textos para la vista movil--//
let isMobile = window.matchMedia("only screen and (max-width: 1024px)").matches;
let size, sizecolumnview, sizesearchPanel, textGroupPanel;
let visible= true;

export let modoParte = 'insert';
export let idParteEditando = null;

if (isMobile){
    size = 35;
    sizecolumnview = 35;
    sizesearchPanel = 100;
    textGroupPanel = 'Arrastra la columna para agrupar';
    visible = false;
}else{
    size = 180;
    sizecolumnview = 110;
    textGroupPanel = 'Arrastra una columna aquí para agrupar';
}
//-----------------------------------------------------------//

//--GRID PARA VISUALIZAR LOS ITEMS DEL INVENTARIO---------------------------------------------------------------------//
export function getPiezas(dataSource) {
    return $("#gridPiezas").dxDataGrid({
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
        columns: getColumnasPartes(),
        onToolbarPreparing: function (e) {
            let toolbarItems = e.toolbarOptions.items;

            toolbarItems.unshift({
                location: 'after',
                widget: 'dxButton',
                options: {
                    stylingMode: "contained",
                    text: "Nuevo Número de Parte",
                    icon: 'fas fa-hashtag icon-button',
                    hint: 'Registrar Nuevo Numero de Parte',
                    type: 'default', // O 'success'
                    width: size,
                    elementAttr: {
                        class: "btn-custom-resaltado icon-button-wrapper"
                    },
                    onClick: function(e) {
                        modoParte = 'insert';
                        idParteEditando = null;
                        CORE.limpiarInputs();
                        CORE.getProyectos();
                        $("#PartsLabel").text("Nuevo Registro de Número de Parte");
                        $("#btnSaveParts").text("Guardar");
                        $('#Parts').modal('show');
                    }
                    
                }
            });
            
        }
    }).dxDataGrid("instance");
}

function getColumnasPartes(){
    let dataFields = [
        {
            dataField: "numero_parte",
            allowEditing: false,
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Número de<br>Parte</div>"));
            },
            cellTemplate: function (container, options) {
                container
                    .css({
                        "text-align": "center",   // ⬅️ Centrado horizontal
                        "vertical-align": "middle"
                    })
                    .text(options.text);
            },
        },
        {
            dataField: "id_lote",
            allowEditing: false,
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>ID<br>Lote</div>"));
            },
            cellTemplate: function (container, options) {
                container
                    .css({
                        "text-align": "center",   // ⬅️ Centrado horizontal
                        "vertical-align": "middle"
                    })
                    .text(options.text);
            },
        },
        {
            dataField: "piso",
            caption: "Piso",
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
            dataField: "precio",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Precio de<br>la pieza</div>"));
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
            dataField: "descripcion",
            caption: "Descripción",
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
                                const data = options.data;
                                modoParte = 'edit';
                                idParteEditando = data.numero_parte;
            
                                // Cargar los datos en el modal
                                $("#nombreProyecto").val(data.nombre);
                                $("#descripcionProyecto").val(data.descripcion);
            
                                // Ajustar encabezado y botón
                                $("#ProyectsLabel").text("Editar Proyecto");
                                $("#btnSaveProyect").text("Actualizar");
            
                                $('#Proyects').modal('show');
                            })
                    )
                    .appendTo(container);
            }
            

        },

    ];

    return dataFields;
}
//--------------------------------------------------------------------------------------------------------------------//
