import PropTypes from "prop-types";

/*
    If all cells in a row would be completely empty - row can "collapse" short.
    To prevent it we can fill it with &nbsp;
*/
const DEFAULT_EMPTY_CELL_CONTENT = "\u00A0";

const Cell = ({ rowData, rowIndex, column, columnIndex, getCellExtraProps }) => {
    const { render, getEmptyCellData, dataKey, format, getCellData } = column;

    let cellData = rowData && getCellData( rowData, rowIndex, dataKey );
    
    if( cellData === undefined || cellData === "" ){
        cellData = getEmptyCellData ? getEmptyCellData( rowIndex, column ) : DEFAULT_EMPTY_CELL_CONTENT;
    }
    else{
        if( format ){
            cellData = format( cellData, rowData );
        }
        if( render ){
            cellData = render( cellData, rowData, column );
        }
    }

    return (
        <td {...( getCellExtraProps && getCellExtraProps(rowData,columnIndex,rowIndex))} aria-colindex={columnIndex + 1}>
            {cellData}
        </td>
    );
};

Cell.propTypes = {
    rowIndex: PropTypes.number.isRequired,
    columnIndex: PropTypes.number.isRequired,
    column: PropTypes.object.isRequired,
    rowData: PropTypes.object,
    getCellExtraProps: PropTypes.func
};

export default Cell;