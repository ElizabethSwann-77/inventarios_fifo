'use strict';

import * as CORE from './proyectos-core.js';

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
export function getInventory(dataSource) {
    return $("#gridContainerInventory").dxDataGrid({
        dataSource: dataSource,
        key: "orden_requisicion",
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
        columns: getColumnsInventory(),
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
        onContentReady: function(e) {
            e.component.element().find(".dx-datagrid").css({
                "background-color": "#eceef1",
                "width": "100%",
                "box-sizing": "border-box"  // Asegura que el padding no afecte el ancho
            });
        }
    }).dxDataGrid("instance");
}

function getColumnsInventory(){
    let dataFields = [
        {
            dataField: "id_insumo",
            allowEditing: false,
            width: 95,
            minWidth: 90,
            headerCellTemplate: function (container) {
                container.append($("<div style='white-space: normal;'>Código<br>Lis</div>"));
            }
        },
        {
            dataField: "descripcion",
            caption: "Descripción",
            minWidth: 180,
        },
        {
            dataField: "cantidad",
            caption: "Cantidad",
            allowEditing: false,
            width: 95,
            minWidth: 90,
        },
        {
            dataField: "observaciones",
            caption: "Observaciones",
            minWidth: 180,
        },
        {
            dataField: "registro",
            caption: "Registró",
            allowEditing: false,
            minWidth: 180,
            visible: false,
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
                                CORE.styleUpdateInputs(options.data.id_insumo, options.data.cantidad, options.data.observaciones);
                            })
                    )
                    .appendTo(container);
            }

        },

    ];

    return dataFields;
}
//--------------------------------------------------------------------------------------------------------------------//
