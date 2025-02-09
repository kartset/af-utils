const defaultCompare = new Intl.Collator(undefined, { numeric: true }).compare;

const numericCompare = (a, b) => (a || 0) - (b || 0);

const getCollator = sortVal => {
    if (sortVal === "numeric") {
        return numericCompare;
    }

    if (typeof sortVal === "function") {
        return sortVal;
    }

    return defaultCompare;
};

const getSorter = (getRowData, sortDataKey, sortDirection, sortVal) => {
    const compare = getCollator(sortVal);

    return (a, b) => {
        const row1 = getRowData(a);
        const row2 = getRowData(b);

        if (row1 && row2) {
            const v1 = row1[sortDataKey];
            const v2 = row2[sortDataKey];
            return compare(v1, v2) * sortDirection;
        }

        return row1 ? sortDirection : row2 ? -sortDirection : 0;
    };
};

export default getSorter;
