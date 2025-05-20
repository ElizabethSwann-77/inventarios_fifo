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
    }).dxDataGrid("instance");
}

function getColumnasPartes(){
    let dataFields = [
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
                            { value: 'SMT', text: "SMT" },
                            { value: 'THT', text: "THT" },
                            { value: 'FG', text: "FG" },
                        ],
                        valueExpr: "value",
                        displayExpr: "text",
                        value: options.value, // No asignamos un valor por defecto distinto
                        onValueChanged: function(e) {
                            let numero_parte = options.data.numero_parte;
                            let id_proyecto = options.data.id_proyecto;
                        
                            if (e.previousValue !== undefined && e.previousValue !== e.value) {
                                CORE.postEditarTipo(numero_parte, id_proyecto, e.value);
                        
                                // Actualiza el valor en el dataSource
                                options.data.tipo_parte = e.value;
                        
                                // Si tu grid necesita reflejar el cambio visualmente:
                                options.component.refresh(); // Opcional, solo si no se ve reflejado automáticamente
                            }
                        }
                    });
            }
        },
        {
            dataField: "cantidad",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Cantidad de<br>la pieza</div>"));
            },
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
                                // Llama a getProyectos y actualiza el select
                                CORE.getProyectos(function() {
                                    const data = options.data;
                                    modoParte = 'edit';
                                    idParteEditando = data.numero_parte;
                    
                                    // Cargar los datos en el modal
                                    $("#parte").prop('disabled', true).val(data.numero_parte); // Alternativa a ocultar
                                    $("#select_tipo").val(data.tipo_parte);
                                    $("#select_proyecto").prop('disabled', true).val(data.id_proyecto);
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

export function setModoParte(valor) {
    modoParte = valor;
}

export function getModoParte() {
    return modoParte;
}
//--------------------------------------------------------------------------------------------------------------------//
