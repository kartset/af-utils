import PropTypes from "prop-types";

import {
    Subscription,
    mapVisibleRange,
    EVT_SCROLL_SIZE,
    EVT_RANGE
} from "@af-utils/react-virtual-headless";

import { css, cx } from "@af-utils/styled";

const verticalWrapperClass = css("overflow: auto", "position: relative");

const hiddenClass = css("visibility: hidden");
const absoluteClass = css("position: absolute");
const h1Class = css("height: 1px");
const w1Class = css("width: 1px");

const horizontalWrapperClass = cx(verticalWrapperClass, css("display: flex"));

const verticalScrollClass = cx(
    absoluteClass,
    hiddenClass,
    w1Class,
    css("top: 0")
);

const horizontalScrollClass = cx(
    absoluteClass,
    hiddenClass,
    h1Class,
    css("left: 0")
);

const verticalOffsetClass = cx(hiddenClass, w1Class);

const horizontalOffsetClass = cx(hiddenClass, h1Class, css("flex-shrink: 0"));

const VERTICAL_PROPS = [
    "height",
    verticalWrapperClass,
    verticalScrollClass,
    verticalOffsetClass
];

const HORIZONTAL_PROPS = [
    "width",
    horizontalWrapperClass,
    horizontalScrollClass,
    horizontalOffsetClass
];

const RANGE_EVENTS = [EVT_RANGE];

const SCROLL_SIZE_EVENTS = [EVT_SCROLL_SIZE];

const List = ({
    model,
    children: Item,
    className,
    itemData,
    header = null,
    footer = null,
    component: Component = "div",
    getKey = i => i,
    tabIndex = -1,
    ...props
}) => {
    const [primaryAxis, baseClassName, scrollClassName, offsetClassName] =
        model.horizontal ? HORIZONTAL_PROPS : VERTICAL_PROPS;

    return (
        <Component
            className={cx(baseClassName, className)}
            ref={model.setOuterNode}
            tabIndex={tabIndex}
            {...props}
        >
            <Subscription model={model} events={SCROLL_SIZE_EVENTS}>
                {() => (
                    <div
                        className={scrollClassName}
                        style={{ [primaryAxis]: model.scrollSize }}
                    />
                )}
            </Subscription>
            {header}
            <Subscription model={model} events={RANGE_EVENTS}>
                {() => (
                    <>
                        <div
                            className={offsetClassName}
                            style={{
                                [primaryAxis]: model.getOffset(model.from)
                            }}
                        />
                        {mapVisibleRange(model, (i, offset) => (
                            <Item
                                key={getKey(i, itemData)}
                                i={i}
                                data={itemData}
                                offset={offset}
                                model={model}
                            />
                        ))}
                    </>
                )}
            </Subscription>
            {footer}
        </Component>
    );
};

List.propTypes = {
    model: PropTypes.object.isRequired,
    children: PropTypes.elementType.isRequired,
    getKey: PropTypes.func,
    component: PropTypes.elementType,
    header: PropTypes.element,
    footer: PropTypes.element,
    className: PropTypes.string,
    itemData: PropTypes.any,
    tabIndex: PropTypes.number
};

export default List;
