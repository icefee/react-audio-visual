import { useState, useEffect, useRef } from 'react';

function useRequestAnimationFrame() {
    const raf = useRef<number | null>(null)
    const [ts, setTs] = useState(0)
    const loop = () => {
        setTs(+new Date)
        raf.current = requestAnimationFrame(loop)
    }
    const cancelLoop = () => {
        cancelAnimationFrame(raf.current!)
    }
    useEffect(() => {
        loop()
        return cancelLoop;
    }, [])
    return ts;
}


export default useRequestAnimationFrame;
