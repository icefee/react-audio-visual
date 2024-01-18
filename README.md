### A react audio visual component

<div align="center">
    <img width="400" src="https://icefee.github.io/react-audio-visual/screen_shot.jpg" alt="react audio visual">
</div>


[online demo](https://icefee.github.io/react-audio-visual)

### install

```shell
# Install from npm
npm install react-audio-visual

# Install from yarn
yarn add react-audio-visual
```

### usage

```jsx
import AudioVisual from "react-audio-visual";

const TestAudioPlayer = () => {
  const audio = useRef<HTMLAudioElement>(null);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
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
          backgroundColor: "#000",
        }}
      >
        <AudioVisual
          audio={audio}
        />
      </div>
    </div>
  );
};
```

### options
```ts
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
```