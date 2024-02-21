import { useState, useEffect, useRef } from 'react'
import useMediaPlayState from './useMediaPlayState'
import useRequestAnimationFrame from './useRequestAnimationFrame'
import type { MediaRefType } from '../types'

function useAudioContext(mediaRef: MediaRefType, fftSize = 2048) {
    const { playing } = useMediaPlayState(mediaRef.current)
    const audioContext = useRef<AudioContext>()
    const mediaSource = useRef<MediaElementAudioSourceNode>()
    const analyser = useRef<AnalyserNode>()
    const [byteFrequency, setByteFrequency] = useState<Uint8Array>(new Uint8Array(fftSize))
    const ts = useRequestAnimationFrame()

    const startAnalyser = () => {
        const buffer = new Uint8Array(fftSize);
        analyser.current!.getByteFrequencyData(buffer);
        setByteFrequency(buffer);
    }

    useEffect(() => {
        if (playing && audioContext.current) {
            startAnalyser()
        }
    }, [ts, playing])

    useEffect(() => {
        if (!mediaRef.current) {
            return;
        }
        if (playing) {
            if (!audioContext.current) {
                audioContext.current = new AudioContext()
                mediaSource.current = audioContext.current.createMediaElementSource(mediaRef.current)
                analyser.current = audioContext.current.createAnalyser()
            }
            analyser.current!.fftSize = fftSize;
            mediaSource.current!.connect(analyser.current!)
            analyser.current!.connect(audioContext.current.destination)
            audioContext.current.resume();
        }
        return () => {
            if (playing) {
                audioContext.current!.suspend()
                mediaSource.current!.disconnect()
                analyser.current!.disconnect()
            }
        }
    }, [mediaRef.current, playing, fftSize])

    return { byteFrequency }
}

export default useAudioContext;
