import { useEffect, useState } from "react";
import { useSpirograph } from "./hooks/useSpirograph";
import { useAnimation } from "./hooks/useAnimation";
import { useExport } from "./hooks/useExport";
import { useURLState } from "./hooks/useURLState";
import { SpirographCanvas } from "./components/Canvas/SpirographCanvas";
import { MainControls } from "./components/Controls/MainControls";
import { WaveAnimationControls } from "./components/Controls/WaveAnimationControls";
import { DrawAnimationControls } from "./components/DrawAnimation/DrawAnimationControls";
import { ExportPanel } from "./components/Export/ExportPanel";
import styles from "./App.module.css";

function App() {
  const { loadStateFromURL, hasURLState } = useURLState();
  const [controlsVisible, setControlsVisible] = useState(() => !hasURLState());
  const [drawAnimationEnabled, setDrawAnimationEnabled] = useState(false);

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
    randomize,
    basePoints,
    bounds,
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
    waveEffect: params.waveEffect,
    drawAnimationEnabled: drawAnimationEnabled,
    basePoints: basePoints,
    bounds: bounds,
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
      setDrawAnimationEnabled(urlState.drawAnimationEnabled);
      // Auto-play if draw animation is enabled
      if (urlState.drawAnimationEnabled) {
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

  const toggleWaveEffect = () => {
    const enabled = !params.waveEffect.enabled;
    setParams({
      waveEffect: {
        ...params.waveEffect,
        enabled,
        animate: enabled ? true : params.waveEffect.animate,
      },
    });
  };

  const toggleDrawAnimation = () => {
    setDrawAnimationEnabled((prev) => {
      if (!prev) {
        // Enabling - auto-play
        setTimeout(() => play(), 0);
      } else {
        // Disabling - reset
        reset();
      }
      return !prev;
    });
  };

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
            glowColor={params.glowColor}
            waveEffect={params.waveEffect}
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
            <MainControls
              params={params}
              onChange={setParams}
              curveType={curveType}
              onCurveTypeChange={setCurveType}
              parameterOscillations={parameterOscillations}
              onParameterOscillationsChange={setParameterOscillations}
              onRandomize={randomize}
            />

            <div className={styles.waveAnimationSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Get wavey</h3>
                <button
                  type="button"
                  className={`${styles.sectionToggleButton} ${params.waveEffect.enabled ? styles.sectionToggleButtonActive : ""}`}
                  onClick={toggleWaveEffect}
                >
                  {params.waveEffect.enabled ? "Disable" : "Enable"}
                </button>
              </div>
              {params.waveEffect.enabled && (
                <WaveAnimationControls params={params} onChange={setParams} />
              )}
            </div>

            <div className={styles.drawAnimationSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Draw it</h3>
                <button
                  type="button"
                  className={`${styles.sectionToggleButton} ${drawAnimationEnabled ? styles.sectionToggleButtonActive : ""}`}
                  onClick={toggleDrawAnimation}
                >
                  {drawAnimationEnabled ? "Disable" : "Enable"}
                </button>
              </div>
              {drawAnimationEnabled && (
                <DrawAnimationControls
                  progress={progress}
                  duration={params.duration}
                  easing={easing}
                  loopDirection={loopDirection}
                  showDot={showDot}
                  showRings={showRings}
                  rotation={params.rotation}
                  onProgressChange={setProgress}
                  onDurationChange={(duration) => setParams({ duration })}
                  onEasingChange={setEasing}
                  onLoopDirectionChange={setLoopDirection}
                  onShowDotChange={setShowDot}
                  onShowRingsChange={setShowRings}
                  onRotationChange={(rotation) => setParams({ rotation })}
                />
              )}
            </div>

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
              drawAnimationEnabled={drawAnimationEnabled}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
