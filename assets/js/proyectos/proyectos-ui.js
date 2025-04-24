'use strict';

import * as CORE from './proyectos-core.js';
var $ = jQuery.noConflict();

//--Todos los estilos, tamaños y textos para la vista movil--//
let isMobile = window.matchMedia("only screen and (max-width: 1024px)").matches;
let size, sizecolumnview, sizesearchPanel, textGroupPanel;
let visible= true;

export let modoProyecto = 'insert';
export let idProyectoEditando = null;

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
export function getProyectos(dataSource) {
    return $("#gridProyectos").dxDataGrid({
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
            fileName: "Proyectos",
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
        columns: getColumnasProyectos(),
        onToolbarPreparing: function (e) {
            let toolbarItems = e.toolbarOptions.items;

            toolbarItems.unshift({
                location: 'after',
                widget: 'dxButton',
                options: {
                    stylingMode: "contained",
                    text: "Nuevo Proyecto",
                    icon: 'fas fa-folder-plus icon-button',
                    hint: 'Registrar Nuevo Proyecto',
                    type: 'default', // O 'success'
                    width: size,
                    elementAttr: {
                        class: "btn-custom-resaltado icon-button-wrapper"
                    },
                    onClick: function(e) {
                        modoProyecto = 'insert';
                        idProyectoEditando = null;
                        CORE.limpiarInputs();
                        $("#ProyectsLabel").text("Nuevo Registro de Proyecto");
                        $("#btnSaveProyect").text("Guardar");
                        $('#Proyects').modal('show');
                    }
                    
                }
            });
            
        }
    }).dxDataGrid("instance");
}

function getColumnasProyectos(){
    let dataFields = [
        {
            dataField: "id_proyecto",
            allowEditing: false,
            width: 100,
            minWidth: 100,
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Número de<br>Proyecto</div>"));
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
            dataField: "nombre",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Nombre de<br>Proyecto</div>"));
            },
            minWidth: 180,
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
            minWidth: 180,
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
            minWidth: 180,
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
            dataField: "fecha_registro",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Fecha<br>Registro</div>"));
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
                                modoProyecto = 'edit';
                                idProyectoEditando = data.id_proyecto;
            
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
