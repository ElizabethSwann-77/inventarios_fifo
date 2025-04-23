'use strict';

import * as CORE from './proyectos-core.js';
var $ = jQuery.noConflict();

//--Todos los estilos, tamaños y textos para la vista movil--//
let isMobile = window.matchMedia("only screen and (max-width: 1024px)").matches;
let size, sizecolumnview, sizesearchPanel, textGroupPanel;
let visible= true;

if (isMobile){
    size = 35;
    sizecolumnview = 35;
    sizesearchPanel = 100;
    textGroupPanel = 'Arrastra la columna para agrupar';
    visible = false;
}else{
    size = 150;
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
            fileName: "Almacén Chatarra",
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
        columns: getColumnasProyectos(),
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
            }
        },
        {
            dataField: "nombre",
            caption: "Nombre",
            minWidth: 180,
        },
        {
            dataField: "responsable",
            caption: "Responsable",
            minWidth: 180,
        },
        {
            dataField: "descripcion",
            caption: "Descripción",
            minWidth: 180,
        },
        {
            dataField: "fecha_registro",
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Fecha<br>Registro</div>"));
            },
            allowEditing: false,
            dataType: "string",
            width: 110,
            minWidth: 110,
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
                               
                            })
                    )
                    .appendTo(container);
            }

        },

    ];

    return dataFields;
}
//--------------------------------------------------------------------------------------------------------------------//
