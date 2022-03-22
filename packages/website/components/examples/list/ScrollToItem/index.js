import { useState, memo } from "react";
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
    const [dynamicListRowHeights] = useState(() =>
        times(DEFAULT_ROW_COUNT, () => r(50, 100))
    );

    const model = useVirtual({
        itemCount: DEFAULT_ROW_COUNT,
        estimatedItemSize: 75
    });

    const submitHandler = e => {
        e.preventDefault();
        const idx = Number.parseInt(e.currentTarget.idx.value, 10);
        if (!Number.isNaN(idx)) {
            model.scrollTo(idx);
        }
    };

    return (
        <div className="flex flex-col">
            <form
                className="flex bg-neutral-100 p-4 flex-wrap gap-4 justify-center items-center"
                onSubmit={submitHandler}
            >
                <label>
                    Index:&nbsp;
                    <input
                        required
                        defaultValue={Math.round(DEFAULT_ROW_COUNT / 2)}
                        name="idx"
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
