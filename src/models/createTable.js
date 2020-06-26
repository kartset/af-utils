import { observable, extendObservable, computed } from "mobx";
import add from "lodash/add";
import subtract from "lodash/subtract";
import RowsComplex from "./RowsComplex";

const OrderedRowsCache = Uint32Array;
const TbodyColumnWidthsCache = Uint32Array;

/*
    We could use simple object literal,
    but constructors with stable-order this initialization enforce "hidden-classes" v8 optimization
*/
class TotalsCachePart {
    count = 0;
    sum = 0;
    average = 0.0;
};

/*
    can't extend from both FixedSizeList and VariableSizeList, so exporting compositor
*/
const createTable = BaseClass => class extends BaseClass {

    Rows = new RowsComplex( this );

    refreshTotalsForColumnRaw( dataKey, cellDataGetter ){
        const curTotals = this.totals && this.totals[ dataKey ];
        if( curTotals ){
            let curCachePart = this.totalsCache[ dataKey ];

            if( !curCachePart ){
                curCachePart = this.totalsCache[ dataKey ] = new TotalsCachePart();
            }
            
            for( let j = 0, totalType, oldVal, newVal, tmpSum; j < curTotals.length; j++ ){
                totalType = curTotals[ j ];
                oldVal = curCachePart[ totalType ];
                switch( totalType ){
                    case "count":
                        newVal = this.rowCount;
                        break;
                    case "sum":
                    case "average":
                        if( tmpSum === undefined ){
                            tmpSum = reduceRange( this.rowCount, dataKey, this.getRowData, cellDataGetter, 0, add );
                        }
                        newVal = totalType === "sum" ? tmpSum : tmpSum / this.rowCount;
                        break;
                    case "min":
                    case "max":
                        newVal = reduceRange(
                            this.rowCount,
                            dataKey,
                            this.getRowData,
                            cellDataGetter,
                            totalType === "min" ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER,
                            Math[totalType]
                        );
                        break;
                    default:
                        if( process.env.NODE_ENV !== "production" ){
                            throw new Error( `Wrong total type: ${totalType}` );
                        }
                }
  
                if( oldVal !== newVal ){
                    curCachePart[ totalType ] = newVal;
                    this.emit( "totals-calculated" );
                }
            }
        }
        else if( process.env.NODE_ENV !== "production" ){
            console.log( `Asked to recalculate totals for: ${dataKey}; doing nothing;` );
        }
        return this;
    }

    @computed get tbodyColumnWidthsSum(){
        return this.tbodyColumnWidths.reduce( add );
    }

    constructor(){
        super();

        extendObservable( this, {
            columns: [],
            totals: {},
            headlessMode: false,
            getCellData: null,
            tbodyColumnWidths: []
        });
    }

    destructor(){
        super.destructor();
    }
}

export default createTable;