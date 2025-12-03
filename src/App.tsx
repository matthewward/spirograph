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
    pathString,
    pathLength,
    viewBox,
  } = useSpirograph();

  const {
    isPlaying,
    progress,
    speed,
    play,
    pause,
    reset,
    setProgress,
    setSpeed,
  } = useAnimation(5000);

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
          <SimpleControls params={params} onChange={setParams} />

          <h3 className={styles.sectionTitle}>Animation</h3>
          <PlaybackControls
            isPlaying={isPlaying}
            progress={progress}
            speed={speed}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onProgressChange={setProgress}
            onSpeedChange={setSpeed}
          />

          <h3 className={styles.sectionTitle}>Export</h3>
          <ExportPanel
            onExportStatic={exportStatic}
            onExportAnimated={exportAnimated}
          />
        </aside>

        <main className={styles.canvasArea}>
          <SpirographCanvas
            pathString={pathString}
            viewBox={viewBox}
            strokeColor={params.strokeColor}
            strokeWidth={params.strokeWidth}
            pathLength={pathLength}
            isAnimating={isPlaying}
            progress={progress}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
