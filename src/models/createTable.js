import { extendObservable, reaction, computed } from "mobx";
import add from "lodash/add";
import startCase from "lodash/startCase";
import keyBy from "lodash/keyBy";
import RowsComplex from "./RowsComplex";

const createTable = BaseClass => class extends BaseClass {

    @computed get tbodyColumnWidthsSum(){
        return this.tbodyColumnWidths.reduce( add );
    }

    @computed get normalizedColumns(){
        return this.columns.map( column => {
            const finalColumn = typeof column === "string" ? { dataKey: column } : { ...column };
            
            if( !finalColumn.getCellData ){
                finalColumn.getCellData = this.getCellData;
            }

            if( !finalColumn.label ){
                finalColumn.label = startCase( finalColumn.dataKey );
            }

            return finalColumn;
        });
    }

    @computed get columnsByDataKey(){
        return keyBy( this.normalizedColumns, "dataKey" );
    }

    constructor(){
        super( RowsComplex );

        extendObservable( this, {
            columns: [],
            totals: {},
            headlessMode: false,
            getCellData: null,
            tbodyColumnWidths: []
        });

        this.dispose = reaction(() => this.Rows.sorted, () => this.scrollToStart() );
    }

    destructor(){
        this.Rows.destructor();
        this.dispose();
        super.destructor();
    }
}

export default createTable;