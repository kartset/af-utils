import React, { forwardRef, useCallback, useEffect } from "react";
import cx from "../utils/cx";
import HeightProvider from "./HeightProvider";
import useApi from "../useApi";

const ScrollContainer = forwardRef(({
    className,
    children,
    onScroll,
    ...props
}, ref ) => {

    const API = useApi();

    const scrollHandler = useCallback( e => {
        const { scrollTop, scrollLeft } = e.target;
        API.merge({
            scrollLeft,
            scrollTop
        });
        if( onScroll ){
            onScroll( e );
        }
    }, [ onScroll ]);

    useEffect(() => {
        const el = ref.current;

        const R = new ResizeObserver( entries => {
            if( entries.length === 1 ){
                /*
                    using target.offsetWidth instead of contentRect.width, because we need border-box sizing, 
                    and { box: border-box } option does not work here
                */
                const { offsetWidth, offsetHeight } = entries[ 0 ].target;

                API.merge({
                    widgetHeight: Math.round( offsetHeight ),
                    widgetWidth: Math.round( offsetWidth )
                });
            }
        });

        R.observe( el );

        return () => {
            R.unobserve( el );
        };
    }, []);
    
    /*
        tabIndex="0" is for proper keyboard nav
        https://bugzilla.mozilla.org/show_bug.cgi?id=1346159
    */
    return (
        <div tabIndex="0" className={cx("afvscr-scroll-container",className)} ref={ref} onScroll={scrollHandler} {...props}>
            <HeightProvider />
            {children}
        </div>
    );
});

export default ScrollContainer;