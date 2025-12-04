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
  const { isPreviewMode, loadStateFromURL } = useURLState();
  const [controlsVisible, setControlsVisible] = useState(!isPreviewMode);

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
    speed,
    easing,
    loopDirection,
    showDot,
    showRings,
    play,
    pause,
    reset,
    setProgress,
    setSpeed,
    setEasing,
    setLoopDirection,
    setShowDot,
    setShowRings,
  } = useAnimation(params.duration * 1000); // Convert seconds to milliseconds

  const { exportStatic, exportAnimated } = useExport({
    pathString,
    viewBox,
    strokeColor: params.strokeColor,
    strokeWidth: params.strokeWidth,
    pathLength,
  });

  // Load state from URL on mount
  useEffect(() => {
    const urlState = loadStateFromURL();
    if (urlState) {
      setParams(urlState.params);
      setCurveType(urlState.curveType);
      setParameterOscillations(urlState.paramOscillations);
      setSpeed(urlState.animSpeed);
      setEasing(urlState.animEasing);
      setLoopDirection(urlState.animLoopDirection);
      setShowDot(urlState.animShowDot);
      setShowRings(urlState.animShowRings);
    }
    // Sync controls visibility with preview mode
    setControlsVisible(!isPreviewMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreviewMode]);

  return (
    <div className={styles.app}>
      <div className={styles.layout}>
        <main className={styles.canvasArea}>
          {!controlsVisible && (
            <button
              onClick={() => setControlsVisible(true)}
              className={styles.showControlsButton}
            >
              Show
            </button>
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
            />

            <h3 className={styles.sectionTitle}>Animation</h3>
            <PlaybackControls
              isPlaying={isPlaying}
              progress={progress}
              speed={speed}
              easing={easing}
              loopDirection={loopDirection}
              showDot={showDot}
              showRings={showRings}
              onPlay={play}
              onPause={pause}
              onReset={reset}
              onProgressChange={setProgress}
              onSpeedChange={setSpeed}
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
              params={params}
              curveType={curveType}
              paramOscillations={parameterOscillations}
              animSpeed={speed}
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
