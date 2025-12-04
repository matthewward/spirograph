import { useEffect, useState } from "react";
import { useSpirograph } from "./hooks/useSpirograph";
import { useAnimation } from "./hooks/useAnimation";
import { useExport } from "./hooks/useExport";
import { useURLState } from "./hooks/useURLState";
import { SpirographCanvas } from "./components/Canvas/SpirographCanvas";
import { SimpleControls } from "./components/Controls/SimpleControls";
import { PlaybackControls } from "./components/Playback/PlaybackControls";
import { ExportPanel } from "./components/Export/ExportPanel";
import styles from "./App.module.css";

function App() {
  const { loadStateFromURL, hasURLState } = useURLState();
  const [controlsVisible, setControlsVisible] = useState(() => !hasURLState());
  const [showGradientOverlay, setShowGradientOverlay] = useState(false);

  const {
    params,
    setParams,
    curveType,
    setCurveType,
    parameterOscillations,
    setParameterOscillations,
    points,
    pathString,
    pathLength,
    viewBox,
  } = useSpirograph();

  const {
    isPlaying,
    progress,
    isErasing,
    easing,
    loopDirection,
    showDot,
    showRings,
    play,
    pause,
    reset,
    setProgress,
    setEasing,
    setLoopDirection,
    setShowDot,
    setShowRings,
  } = useAnimation(params.duration * 1000); // Convert seconds to milliseconds

  const { exportStatic, exportAnimated, exportPNG } = useExport({
    pathString,
    viewBox,
    strokeColor: params.strokeColor,
    strokeWidth: params.strokeWidth,
    pathLength,
    backgroundColor: params.backgroundColor,
  });

  // Load state from URL on mount
  useEffect(() => {
    const urlState = loadStateFromURL();
    if (urlState) {
      setParams(urlState.params);
      setCurveType(urlState.curveType);
      setParameterOscillations(urlState.paramOscillations);
      setEasing(urlState.animEasing);
      setLoopDirection(urlState.animLoopDirection);
      setShowDot(urlState.animShowDot);
      setShowRings(urlState.animShowRings);
      // Auto-play if URL state has autoPlay enabled
      if (urlState.autoPlay) {
        // Use setTimeout to ensure state is set before playing
        setTimeout(() => play(), 100);
      }
    }
    // Hide controls if URL state exists
    if (urlState) {
      setControlsVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.layout}>
        <main className={styles.canvasArea}>
          {!controlsVisible && (
            <>
              <button
                onClick={() => setControlsVisible(true)}
                className={styles.showControlsButton}
              >
                Show
              </button>
              <button
                onClick={isPlaying ? pause : play}
                className={styles.playButton}
              >
                {isPlaying ? "Stop" : "Play"}
              </button>
            </>
          )}
          <SpirographCanvas
            points={points}
            pathString={pathString}
            viewBox={viewBox}
            strokeColor={params.strokeColor}
            strokeWidth={params.strokeWidth}
            pathLength={pathLength}
            isAnimating={isPlaying}
            progress={progress}
            loopDirection={loopDirection}
            isErasing={isErasing}
            showDot={showDot}
            showRings={showRings}
            R={params.R}
            r={params.r}
            d={params.d}
            curveType={curveType}
            backgroundColor={params.backgroundColor}
            waveEffect={params.waveEffect}
            showGradientOverlay={showGradientOverlay}
          />
        </main>
        {controlsVisible && (
          <aside className={styles.sidebar}>
            <div className={styles.headerContainer}>
              <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                Controls
              </h3>
              <button
                onClick={() => setControlsVisible(false)}
                className={styles.hideControlsButton}
              >
                Hide
              </button>
            </div>
            <SimpleControls
              params={params}
              onChange={setParams}
              curveType={curveType}
              onCurveTypeChange={setCurveType}
              parameterOscillations={parameterOscillations}
              onParameterOscillationsChange={setParameterOscillations}
              showGradientOverlay={showGradientOverlay}
              onShowGradientOverlayChange={setShowGradientOverlay}
            />

            <h3 className={styles.sectionTitle}>Animation</h3>
            <PlaybackControls
              isPlaying={isPlaying}
              progress={progress}
              duration={params.duration}
              easing={easing}
              loopDirection={loopDirection}
              showDot={showDot}
              showRings={showRings}
              onPlay={play}
              onPause={pause}
              onReset={reset}
              onProgressChange={setProgress}
              onDurationChange={(duration) => setParams({ duration })}
              onEasingChange={setEasing}
              onLoopDirectionChange={setLoopDirection}
              onShowDotChange={setShowDot}
              onShowRingsChange={setShowRings}
            />

            <h3 className={styles.sectionTitle}>Export</h3>
            <ExportPanel
              duration={params.duration}
              easing={easing}
              loopDirection={loopDirection}
              onExportStatic={exportStatic}
              onExportAnimated={exportAnimated}
              onExportPNG={exportPNG}
              params={params}
              curveType={curveType}
              paramOscillations={parameterOscillations}
              animEasing={easing}
              animLoopDirection={loopDirection}
              animShowDot={showDot}
              animShowRings={showRings}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
