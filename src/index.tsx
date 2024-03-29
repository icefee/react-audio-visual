import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import AudioVisual from './lib'

const TestAudioPlayer = () => {

    const audio = useRef<HTMLAudioElement | null>(null)

    return (
        <div
            style={{
                width: '100%',
                maxWidth: 600,
                margin: '0 auto'
            }}
        >
            <audio
                ref={audio}
                preload="audio"
                src="/react-audio-visual/test/Tom Fulp-Dad n Me.mp3"
                controls
            />
            <div
                style={{
                    height: 200,
                    backgroundColor: '#000'
                }}
            >
                <AudioVisual
                    audio={audio}
                    barInternal={1}
                    barSpace={0}
                    capGap={1}
                    capHeight={1}
                />
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)
root.render(<TestAudioPlayer />)