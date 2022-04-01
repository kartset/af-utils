import { useState, useEffect, memo } from "react";
import {
    useVirtual,
    areItemPropsEqual,
    List
} from "@af-utils/react-virtual-list";
import times from "lodash/times";
import r from "lodash/random";

const DEFAULT_ROW_COUNT = 20000;

const Item = memo(
    ({ i, data: dynamicListRowHeights }) => (
        <div
            className="text-center border-t border-zinc-400"
            style={{
                lineHeight: `${dynamicListRowHeights[i]}px`
            }}
        >
            row {i}:&nbsp;{dynamicListRowHeights[i]}px
        </div>
    ),
    areItemPropsEqual
);

const ScrollToItem = () => {
    const [dynamicListRowHeights, changeRows] = useState(() =>
        times(DEFAULT_ROW_COUNT, () => r(50, 100))
    );

    const model = useVirtual({
        itemCount: dynamicListRowHeights.length,
        estimatedItemSize: 75
    });

    useEffect(() => {
        model.scrollTo(dynamicListRowHeights.length - 1);
    }, [dynamicListRowHeights.length]);

    const scrollSubmitHandler = e => {
        e.preventDefault();
        const idx = Number.parseInt(e.currentTarget.idx.value, 10);

        if (!Number.isNaN(idx)) {
            model.scrollTo(idx);
        }
    };

    const rowsAddSubmitHandler = e => {
        e.preventDefault();
        const rowsToAdd = Number.parseInt(e.currentTarget.rowsToAdd.value, 10);

        if (!Number.isNaN(rowsToAdd) && rowsToAdd !== 0) {
            changeRows(rows =>
                rowsToAdd > 0
                    ? rows.concat(times(rowsToAdd, () => r(50, 100)))
                    : rows.slice(0, rowsToAdd)
            );
        }
    };

    return (
        <div className="flex flex-col">
            <form
                className="flex bg-neutral-100 p-4 flex-wrap gap-4 justify-center items-center"
                onSubmit={scrollSubmitHandler}
            >
                <label>
                    Index:&nbsp;
                    <input
                        required
                        defaultValue={Math.round(
                            dynamicListRowHeights.length / 2
                        )}
                        name="idx"
                        className="w-[7em]"
                        type="number"
                    />
                </label>
                <button
                    className="px-6 py-2 border border-gray-500"
                    type="submit"
                >
                    Scroll
                </button>
            </form>
            <form
                className="flex bg-neutral-100 p-4 flex-wrap gap-4 justify-center items-center"
                onSubmit={rowsAddSubmitHandler}
            >
                <label>
                    Rows to add:&nbsp;
                    <input
                        defaultValue={0}
                        type="number"
                        required
                        name="rowsToAdd"
                        className="w-[5em]"
                    />
                </label>

                <button
                    className="px-6 py-2 border border-gray-500"
                    type="submit"
                >
                    Add and scroll to end
                </button>
            </form>
            <List
                model={model}
                itemData={dynamicListRowHeights}
                className="grow basis-96"
            >
                {Item}
            </List>
        </div>
    );
};

export default ScrollToItem;