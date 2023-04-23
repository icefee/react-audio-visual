import { useState, useRef, useEffect } from 'react';

function useResizeObserver<T extends HTMLElement = HTMLDivElement>() {

    const ref = useRef<T>()
    const [size, setSize] = useState({
        width: 0,
        height: 0
    })

    const onResize = () => {
        const width = ref.current.clientWidth;
        const height = ref.current.clientHeight;
        setSize({
            width,
            height
        })
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver(onResize)
        resizeObserver.observe(ref.current)

        onResize()

        return () => {
            resizeObserver.unobserve(ref.current)
        }
    }, [])

    return {
        ref,
        ...size
    }

}

export default useResizeObserver;
