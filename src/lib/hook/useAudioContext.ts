import { useState, useEffect, useRef } from 'react';
import useMediaPlayState from './useMediaPlayState';
import useRequestAnimationFrame from './useRequestAnimationFrame';

function useAudioContext(audio: HTMLAudioElement | null, fftSize = 2048) {
    const { playing } = useMediaPlayState(audio)
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
        if (playing) {
            startAnalyser()
        }
    }, [ts, playing])

    useEffect(() => {
        if (!audio) {
            return;
        }
        if (!audioContext.current) {
            audioContext.current = new AudioContext();
            mediaSource.current = audioContext.current.createMediaElementSource(audio);
            analyser.current = audioContext.current.createAnalyser();
        }
        analyser.current!.fftSize = fftSize;
        mediaSource.current!.connect(analyser.current!);
        analyser.current!.connect(audioContext.current.destination);
        audioContext.current.resume();
        startAnalyser();
        return () => {
            audioContext.current!.suspend();
            mediaSource.current!.disconnect();
            analyser.current!.disconnect();
        }
    }, [audio, playing, fftSize])

    return { byteFrequency }
}

export default useAudioContext;
