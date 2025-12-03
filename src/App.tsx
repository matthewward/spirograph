import { useSpirograph } from './hooks/useSpirograph';
import { useAnimation } from './hooks/useAnimation';
import { useExport } from './hooks/useExport';
import { SpirographCanvas } from './components/Canvas/SpirographCanvas';
import { SimpleControls } from './components/Controls/SimpleControls';
import { PlaybackControls } from './components/Playback/PlaybackControls';
import { ExportPanel } from './components/Export/ExportPanel';
import styles from './App.module.css';

function App() {
  const {
    params,
    setParams,
    curveType,
    setCurveType,
    colorOscillation,
    setColorOscillation,
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

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Spirograph</h1>
        <p className={styles.subtitle}>Create beautiful mathematical curves</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3 className={styles.sectionTitle}>Controls</h3>
          <SimpleControls
            params={params}
            onChange={setParams}
            curveType={curveType}
            onCurveTypeChange={setCurveType}
            colorOscillation={colorOscillation}
            onColorOscillationChange={setColorOscillation}
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
          />
        </aside>

        <main className={styles.canvasArea}>
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
            colorOscillation={colorOscillation}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
