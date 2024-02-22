import { useState, useEffect } from 'react'
import type { MediaRefType } from '../types'

function useMediaPlayState(media: MediaRefType) {
    const [playing, setPlaying] = useState(false)
    const onPlay = () => {
        setPlaying(true)
    }
    const onPause = () => {
        setPlaying(false)
    }
    useEffect(() => {
        media.current?.addEventListener('play', onPlay)
        media.current?.addEventListener('pause', onPause)
        return () => {
            media.current?.removeEventListener('play', onPlay)
            media.current?.removeEventListener('pause', onPause)
        }
    }, [])
    return { playing }
}

export default useMediaPlayState;
