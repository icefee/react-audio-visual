import { useState, useEffect } from 'react';

function useMediaPlayState(media: HTMLMediaElement | null) {
    const [playing, setPlaying] = useState(false)
    const onPlay = () => {
        setPlaying(true)
    }
    const onPause = () => {
        setPlaying(false)
    }
    useEffect(() => {
        if (media) {
            media.addEventListener('play', onPlay)
            media.addEventListener('pause', onPause)
        }
        return () => {
            if (media) {
                media.removeEventListener('play', onPlay)
                media.removeEventListener('pause', onPause)
            }
        }
    }, [media])
    return { playing }
}

export default useMediaPlayState;
