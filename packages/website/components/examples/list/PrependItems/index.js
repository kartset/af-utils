import { memo, useState, useRef, useEffect } from "react";
import {
    useVirtual,
    areItemPropsEqual,
    List
} from "@af-utils/react-virtual-list";
import times from "lodash/times";
import random from "lodash/random";
import faker from "faker";

const Item = memo(
    ({ i, data }) => (
        <div
            className="border-t p-2 border-zinc-400"
            style={{ lineHeight: data[i].height + "px" }}
        >
            Idx:&nbsp;{i};&emsp;{data[i].name}
        </div>
    ),
    areItemPropsEqual
);

const getKey = (i, itemData) => itemData[i].name;

const getRandomItem = () => ({
    name: faker.name.firstName() + " " + faker.name.lastName(),
    height: random(30, 120)
});

/* new Promise is made to simulate asynchronous fetch request */
const fetch100RandomItemsAsync = () =>
    new Promise(resolve =>
        setTimeout(resolve, 1000, times(100, getRandomItem))
    );

/*
    Approach from other examples may be used here also, just for diversity
*/
const getEstimatedItemSize = oldItemSizes =>
    oldItemSizes.length
        ? Math.round((oldItemSizes[0] + oldItemSizes.at(-1)) / 2)
        : 60;

const PrependItems = () => {
    const scrollPosRef = useRef(null);

    const [items, setItems] = useState(() => times(1000, getRandomItem));

    const model = useVirtual({
        getEstimatedItemSize,
        itemCount: items.length
    });

    const prependItems = async () => {
        const newItems = await fetch100RandomItemsAsync();

        /*
            model.getIndex(model.from) may give wrong resuts
            due to overscan optimization.
            Must use scrollPos here.
        */
        const firstVisibleIndex = model.getIndex(model.scrollPos);

        /*
            By default model.scrollTo rewinds exactly to element's top.
            If only half of element is visible - we must remember pixel offset.
        */
        const pxOffset = model.scrollPos - model.getOffset(firstVisibleIndex);

        const indexToScroll = firstVisibleIndex + newItems.length;

        scrollPosRef.current = [indexToScroll, pxOffset];

        setItems(currentItems => [...newItems, ...currentItems]);
    };

    useEffect(() => {
        if (scrollPosRef.current) {
            const [indexToScroll, pxOffset] = scrollPosRef.current;
            model.scrollTo(indexToScroll, pxOffset);
            scrollPosRef.current = null;
        }
        /*
            useEffect dependency may be changed, if you have both
            prepending/appending or you need to sync scroll pos only
            in certain cases.
        */
    }, [model, items]);

    return (
        <div className="flex flex-col gap-4">
            <button
                className="px-6 py-2 border border-gray-500"
                onClick={prependItems}
            >
                Prepend 100 items
            </button>
            <List
                className="grow basis-96"
                model={model}
                itemData={items}
                getKey={getKey}
            >
                {Item}
            </List>
        </div>
    );
};

export default PrependItems;
