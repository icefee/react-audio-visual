### A react audio visual component


<div align="center">
    <img width="400" src="https://raw.githubusercontent.com/icefee/react-audio-visual/main/public/screen_shot.jpg" alt="react audio visual">
</div>



[online demo](https://icefee.github.io/react-audio-visual)

### install

```shell
# Install from npm
npm install react-audio-visual

# Install from yarn
yarn add react-audio-visual
```

### useage

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
          fftSize={1024} // optional, default: 1024
          colors={["#ff0000a0", "#ffff00a0", "#00ffffa0"]} // optional, default: ["#ff0000a0", "#ffff00a0", "#00ffffa0"]
        />
      </div>
    </div>
  );
};
```
