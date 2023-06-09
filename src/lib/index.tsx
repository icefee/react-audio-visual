import React, { useEffect, useRef, RefObject } from 'react';
import useResizeObserver from './hook/useResizeObserver';
import useAudioContext from './hook/useAudioContext';

interface AudioVisualProps {
    /**
     * the audio element ref created by useRef() or React.createRef()
     */
    audio: RefObject<HTMLAudioElement>;
    /**
     * frequencyBinCount for AnalyserNode
     * optional,
     * default: 1024
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/AnalyserNode/frequencyBinCount)
     */
    fftSize?: number;
    /**
     * colors for gradient fill color
     * optional
     * default: ['#ff0000a0', '#ffff00a0', '#00ffffa0']
     */
    colors?: string[];
}

function AudioVisual({ audio, fftSize = 1024, colors = ['#ff0000a0', '#ffff00a0', '#00ffffa0'] }: AudioVisualProps) {

    const dpr = window.devicePixelRatio;
    const barWidth = 4 * dpr;
    const barSpace = 1 * dpr;
    const capHeight = 2;
    const capGap = 2;

    const caps = useRef<number[]>()

    const { byteFrequency } = useAudioContext(audio.current, fftSize)

    const { ref, width: w, height: h } = useResizeObserver()
    const width = w * dpr, height = h * dpr;

    const canvas = useRef<HTMLCanvasElement | null>(null)

    const drawCanvas = (buffer: Uint8Array) => {
        const ctx = canvas.current!.getContext('2d')!;
        const gradient = ctx.createLinearGradient(width / 2, 0, width / 2, height);
        for (let i = 0; i < colors.length; i++) {
            gradient.addColorStop(i / (colors.length - 1), colors[i]);
        }
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = gradient;
        const step = Math.floor(
            (barWidth + barSpace) * fftSize / width
        );
        const steps = Math.floor(fftSize / step);
        if (!caps.current || caps.current && caps.current.length !== steps) {
            caps.current = Array.from({ length: steps }, _ => 0)
        }
        else {
            caps.current = caps.current.map(
                v => v > 0 ? v - 1 : v
            )
        }
        for (let i = 0; i < steps; i++) {
            const intensity = Math.round(
                buffer.slice(i, i + step).reduce(
                    (prev, current) => prev + current,
                    0
                ) / step)
            if (intensity > caps.current[i]) {
                caps.current[i] = intensity;
            }
            const x = i * (barWidth + barSpace) + barSpace / 2;
            ctx.fillRect(x, height - intensity * height / 255, barWidth, intensity * height / 255);
            ctx.fillRect(x, height - caps.current[i] * height / 255 - capHeight - capGap, barWidth, capHeight);
        }
    }

    useEffect(() => {
        drawCanvas(byteFrequency)
    }, [width, height, byteFrequency])

    return (
        <div style={{
            width: '100%',
            height: '100%'
        }} ref={ref}>
            <canvas
                width={width}
                height={height}
                ref={canvas}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%'
                }}
            />
        </div>
    )
}

export default AudioVisual;
