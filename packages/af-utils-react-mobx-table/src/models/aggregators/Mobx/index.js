import { makeObservable, action, comparer, computed } from "mobx";
import multiGroupBy from "../utils/multiGroupBy";
import sortGroups from "../utils/sortGroups";
import flattenGroups from "../utils/flattenGroups";
import getSorter from "../utils/getSorter";
import getFilteredIndexes from "../utils/getFilteredIndexes";
import Base from "../Base";

const stubFalse = () => false;
class Mobx extends Base {
    get visibleColumns() {
        return this.columns.filter(col => !this.groupKeys.includes(col.key));
    }

    get priorityGroupValuesArray() {
        return this.groupKeys.map(
            key =>
                this.columns.find(c => c.key === key).priorityGroupValues || []
        );
    }

    get grouped() {
        return multiGroupBy(
            this.filteredIndexes,
            this.groupKeys,
            this.getRowData,
            this.priorityGroupValuesArray
        );
    }

    get groupedSorted() {
        if (this.sortDataKey) {
            sortGroups(
                this.grouped,
                this.getRowData,
                this.sortDataKey,
                this.sortDirection,
                this.groupKeys.length,
                0,
                this.columns.find(c => c.key === this.sortDataKey)?.sorter
            );
        }
        return this.grouped;
    }

    get flattenedGroups() {
        return flattenGroups(this.groupedSorted, this.collapsedGroups);
    }

    get filteredIndexes() {
        return getFilteredIndexes(
            this.itemCount,
            this.getRowData,
            this.filtersMap
        );
    }

    get noGroupsSortedIndexes() {
        return this.sortDataKey
            ? this.filteredIndexes.sort(
                  getSorter(
                      this.getRowData,
                      this.sortDataKey,
                      this.sortDirection,
                      this.columns.find(c => c.key === this.sortDataKey)?.sorter
                  )
              )
            : this.filteredIndexes;
    }

    get groupsSortedIndexes() {
        return this.flattenedGroups.rowIndexes;
    }

    get hasGrouping() {
        return !!this.groupKeys.length;
    }

    get finalIndexes() {
        return this.hasGrouping
            ? this.groupsSortedIndexes
            : this.noGroupsSortedIndexes;
    }

    get finalIndexesCount() {
        return this.finalIndexes.length;
    }

    get hasTotals() {
        return this.visibleColumns.some(col => !!col.totals);
    }

    constructor() {
        super();

        makeObservable(this, {
            grouped: true,
            flattenedGroups: true,
            filteredIndexes: true,
            finalIndexesCount: true,
            hasGrouping: true,
            hasTotals: true,

            visibleColumns: computed({ equals: comparer.structural }),
            priorityGroupValuesArray: computed({ equals: comparer.structural }),

            finalIndexes: computed({ equals: stubFalse }),
            noGroupsSortedIndexes: computed({ equals: stubFalse }),
            groupedSorted: computed({ equals: stubFalse }),

            itemCount: true,
            getRowData: false,
            getTotalsFormattingHelper: true,
            columns: true,
            compact: true,
            filtersMap: true,
            groupKeys: true,
            sortDataKey: true,
            sortDirection: true,
            collapsedGroups: true,

            setFiltering: action,
            toggleCompact: action,
            setSorting: action,
            setGrouping: action,
            addGrouping: action,
            toggleCollapsedGroup: action,
            removeGrouping: action,
            merge: action
        });
    }
}

export default Mobx;
