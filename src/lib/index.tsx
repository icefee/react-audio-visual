import React, { useEffect, useRef } from 'react'
import useResizeObserver from './hook/useResizeObserver'
import useAudioContext from './hook/useAudioContext'
import type { MediaRefType } from './types'

interface AudioVisualProps {
    /**
     * the audio element ref created by useRef() or React.createRef()
     */
    audio: MediaRefType;
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
    /**
     * interval of bar, default 4, not equivalent to bar width
     */
    barInternal?: number;
    /**
     * space between bars, default 1
     */
    barSpace?: number;
    /**
     * height of caps, default 2
     */
    capHeight?: number;
    /**
     * gap between caps, default 2
     */
    capGap?: number;
}

function AudioVisual({
    audio,
    fftSize = 2048,
    colors = ['#ff0000a0', '#ffff00a0', '#00ffffa0'],
    barInternal = 4,
    barSpace = 1,
    capHeight = 2,
    capGap = 2
}: AudioVisualProps) {

    const dpr = window.devicePixelRatio;
    const caps = useRef<number[]>()

    const { byteFrequency } = useAudioContext(audio, fftSize)

    const { ref, width: w, height: h } = useResizeObserver<HTMLCanvasElement>()
    const width = w * dpr, height = h * dpr;

    const drawCanvas = (buffer: Uint8Array) => {
        const ctx = ref.current!.getContext('2d')!
        if (colors.length > 1) {
            const gradient = ctx.createLinearGradient(width / 2, 0, width / 2, height)
            for (let i = 0; i < colors.length; i++) {
                gradient.addColorStop(i / (colors.length - 1), colors[i])
            }
            ctx.fillStyle = gradient
        }
        else {
            ctx.fillStyle = colors[0] ?? '#fff'
        }
        ctx.clearRect(0, 0, width, height)
        const step = Math.floor(
            fftSize / Math.ceil(width / barInternal / dpr)
        )
        const steps = Math.floor(fftSize / step);
        if (!caps.current || caps.current && caps.current.length !== steps) {
            caps.current = Array.from({ length: steps }, _ => 0)
        }
        else {
            caps.current = caps.current.map(
                v => v > 0 ? v - 1 : v
            )
        }
        const gapWidth = barSpace * dpr
        const interval = width / steps
        for (let i = 0; i < steps; i++) {
            const intensity = Math.round(
                buffer.slice(i, i + step).reduce(
                    (prev, current) => prev + current,
                    0
                ) / step)
            if (intensity > caps.current[i]) {
                caps.current[i] = intensity
            }
            const x = i * interval + gapWidth / 2
            const barWidth = Math.max(interval - gapWidth, 1)
            const rate = height / 255
            ctx.fillRect(x, height - intensity * rate, barWidth, intensity * rate)
            ctx.fillRect(x, height - caps.current[i] * rate - capGap * dpr, barWidth, capHeight * dpr)
        }
    }

    useEffect(() => {
        drawCanvas(byteFrequency)
    }, [width, height, byteFrequency, barInternal, barSpace, capHeight, capGap])

    return (
        <canvas
            width={width}
            height={height}
            ref={ref}
            style={{
                display: 'block',
                width: '100%',
                height: '100%'
            }}
        />
    )
}

export default AudioVisual;
