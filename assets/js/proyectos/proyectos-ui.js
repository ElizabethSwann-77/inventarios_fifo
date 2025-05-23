'use strict';

import * as CORE from './proyectos-core.js';
var $ = jQuery.noConflict();

//--Todos los estilos, tamaños y textos para la vista movil--//
let isMobile = window.matchMedia("only screen and (max-width: 1024px)").matches;
let size, sizecolumnview, sizesearchPanel, textGroupPanel;
let visible= true;

export let modoProyecto = 'insert';



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
                        "vertical-align": "top"
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
            dataField: "estado",
            caption: "Estado",
            allowEditing: false,
            width: 110,
            minWidth: 100,
            cellTemplate: function(container, options) {
                $("<div>")
                    .css({
                        width: "100%",
                        height: "35px",
                        overflow: "hidden"
                    })
                    .appendTo(container)
                    .dxSelectBox({
                        dataSource: [
                            { value: 'A', text: "Activo" },
                            { value: 'C', text: "Cancelado" },
                            { value: 'T', text: "Terminado" },
                        ],
                        valueExpr: "value",
                        displayExpr: "text",
                        value: options.value, // No asignamos un valor por defecto distinto
                        onValueChanged: function(e) {
                            let id_proyecto = options.data.id_proyecto;
                        
                            if (e.previousValue !== undefined && e.previousValue !== e.value) {
                                CORE.postEditarEstado(id_proyecto, e.value);
                        
                                // Actualiza el valor en el dataSource
                                options.data.estado = e.value;
                        
                                // Si tu grid necesita reflejar el cambio visualmente:
                                options.component.refresh(); // Opcional, solo si no se ve reflejado automáticamente
                            }
                        }
                    });
            }
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
                                CORE.limpiarInputs();
                                const data = options.data;
                                modoProyecto = 'edit';

                                $("#numeroProyecto").prop('disabled', true).val(data.id_proyecto); // Alternativa a ocultar
                                // Cargar los demás datos en el modal
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

export function setModoProyecto(valor) {
    modoProyecto = valor;
}

export function getModoProyecto() {
    return modoProyecto;
}
//--------------------------------------------------------------------------------------------------------------------//
