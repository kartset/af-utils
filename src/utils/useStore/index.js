import { useRef, useEffect } from "react";

/*
    dataRef is to call Data methods from outside( Data.scrollTo(), etc. ).
    As it is not dom-related, I decided to avoid forwardRef
*/
const useStore = ( StoreConstructor, dataRef ) => {
    const finalDataRef = useRef();

    let Store = finalDataRef.current;

    if( !Store ){
        Store = finalDataRef.current = new StoreConstructor();

        if( dataRef ){
            dataRef.current = Store;
        }
    }

    useEffect(() => () => {
        Store.destructor();
    }, []);

    return Store;
};

export default useStore;