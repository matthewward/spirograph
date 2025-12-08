import { useCallback } from 'react';
import { generateStaticSVG, generateAnimatedSVG, generateWaveOnlySVG, generateCombinedSVG } from '../lib/svg/animator';
import { downloadFile } from '../lib/utils/download';
import { EasingType } from '../lib/animation/easing';
import { LoopDirection } from './useAnimation';
import { WaveEffectParams } from '../lib/animation/waveEffect';
import { Point } from '../lib/spirograph/types';
import { renderFrame, calculateFrameCount, FrameRenderOptions } from '../lib/animation/frameRenderer';
// @ts-ignore - gif.js doesn't have TypeScript definitions
import GIF from 'gif.js';

export interface UseExportOptions {
  pathString: string;
  viewBox: string;
  strokeColor: string;
  strokeWidth: number;
  pathLength: number;
  backgroundColor: string;
  waveEffect: WaveEffectParams;
  drawAnimationEnabled: boolean;
  basePoints: Point[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export function useExport(options: UseExportOptions) {
  const { pathString, viewBox, strokeColor, strokeWidth, pathLength, backgroundColor, waveEffect, drawAnimationEnabled, basePoints, bounds } = options;

  const exportStatic = useCallback(() => {
    const svg = generateStaticSVG(pathString, viewBox, strokeColor, strokeWidth);
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5); // YYYY-MM-DDTHH-MM-SS
    downloadFile(svg, `spirograph-${timestamp}.svg`, 'image/svg+xml');
  }, [pathString, viewBox, strokeColor, strokeWidth]);

  const exportAnimated = useCallback((duration: number = 5, loopDirection: LoopDirection = 'none', easing: EasingType = 'linear') => {
    let svg: string;

    // Determine which animation to generate
    const waveEnabled = waveEffect.enabled && waveEffect.animate;

    if (waveEnabled && !drawAnimationEnabled) {
      // Wave-only animation
      svg = generateWaveOnlySVG(
        basePoints,
        waveEffect,
        bounds,
        viewBox,
        strokeColor,
        strokeWidth,
        backgroundColor
      );
    } else if (waveEnabled && drawAnimationEnabled) {
      // Combined draw + wave animation
      svg = generateCombinedSVG(
        basePoints,
        waveEffect,
        bounds,
        viewBox,
        strokeColor,
        strokeWidth,
        pathLength,
        duration,
        easing,
        loopDirection,
        backgroundColor
      );
    } else {
      // Draw-only animation (existing)
      svg = generateAnimatedSVG(
        pathString,
        viewBox,
        strokeColor,
        strokeWidth,
        pathLength,
        duration,
        loopDirection,
        easing
      );
    }

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5); // YYYY-MM-DDTHH-MM-SS
    downloadFile(svg, `spirograph-animated-${timestamp}.svg`, 'image/svg+xml');
  }, [pathString, viewBox, strokeColor, strokeWidth, pathLength, backgroundColor, waveEffect, drawAnimationEnabled, basePoints, bounds]);

  const exportPNG = useCallback((size: number = 2048) => {
    console.log('exportPNG called', { size, pathString: pathString.substring(0, 50), viewBox, strokeColor, strokeWidth, backgroundColor });

    // Generate static SVG
    const svgString = generateStaticSVG(pathString, viewBox, strokeColor, strokeWidth);
    console.log('Generated SVG string:', svgString.substring(0, 200));

    // Create a blob and object URL from the SVG
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    console.log('Created blob URL:', url);

    // Create an image element to load the SVG
    const img = new Image();
    img.onload = () => {
      console.log('Image loaded successfully');

      // Create a canvas with square dimensions
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Could not get canvas context');
        URL.revokeObjectURL(url);
        return;
      }

      console.log('Canvas created, filling background with', backgroundColor);

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);

      // Draw the SVG image
      ctx.drawImage(img, 0, 0, size, size);
      console.log('Drew image on canvas');

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Canvas converted to blob, initiating download');
          const now = new Date();
          const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `spirograph-${timestamp}.png`;
          link.click();
          URL.revokeObjectURL(pngUrl);
          console.log('Download initiated');
        }
        URL.revokeObjectURL(url);
      }, 'image/png');
    };

    img.onerror = (error) => {
      console.error('Failed to load SVG image', error);
      URL.revokeObjectURL(url);
    };

    console.log('Setting image src');
    img.src = url;
  }, [pathString, viewBox, strokeColor, strokeWidth, backgroundColor]);

  const exportGIF = useCallback(async (
    duration: number,
    easing: EasingType,
    fps: number = 30,
    size: number = 800
  ): Promise<void> => {
    console.log('exportGIF called', { duration, easing, fps, size });

    const frameCount = calculateFrameCount(duration, waveEffect, drawAnimationEnabled, fps);
    console.log('Rendering', frameCount, 'frames for GIF');

    // Create canvas for rendering
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const frameOptions: FrameRenderOptions = {
      basePoints,
      bounds,
      viewBox,
      strokeColor,
      strokeWidth,
      backgroundColor: 'transparent', // Transparent background for GIF
      pathLength,
      waveEffect,
      drawAnimationEnabled,
      drawDuration: duration,
      drawEasing: easing,
      frameCount,
      size,
    };

    // Initialize GIF encoder
    const gif = new GIF({
      workers: 2,
      quality: 10, // 1-30, lower is better quality
      width: size,
      height: size,
      transparent: 0x000000, // Use black as transparent color
      background: 0x000000,
      workerScript: '/gif.worker.js',
    });

    // Render all frames
    for (let i = 0; i < frameCount; i++) {
      renderFrame(ctx, frameOptions, i);
      gif.addFrame(ctx, { copy: true, delay: 1000 / fps });
    }

    // Return a promise that resolves when encoding is finished
    return new Promise((resolve, reject) => {
      gif.on('finished', (blob: Blob) => {
        console.log('GIF encoding finished');
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `spirograph-${timestamp}.gif`;
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      });

      gif.on('error', (error: Error) => {
        console.error('GIF encoding failed:', error);
        reject(error);
      });

      console.log('Starting GIF encoding...');
      gif.render();
    });
  }, [basePoints, bounds, viewBox, strokeColor, strokeWidth, pathLength, backgroundColor, waveEffect, drawAnimationEnabled]);

  const exportWebM = useCallback(async (
    duration: number,
    easing: EasingType,
    fps: number = 30,
    size: number = 800
  ): Promise<void> => {
    console.log('exportWebM called', { duration, easing, fps, size });

    const frameCount = calculateFrameCount(duration, waveEffect, drawAnimationEnabled, fps);
    console.log('Rendering', frameCount, 'frames for WebM');

    // Create canvas for rendering
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const frameOptions: FrameRenderOptions = {
      basePoints,
      bounds,
      viewBox,
      strokeColor,
      strokeWidth,
      backgroundColor, // Use background color for video
      pathLength,
      waveEffect,
      drawAnimationEnabled,
      drawDuration: duration,
      drawEasing: easing,
      frameCount,
      size,
    };

    // Create a canvas stream and MediaRecorder
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000, // 5 Mbps
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    // Return a promise that resolves when recording is finished
    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        console.log('WebM encoding finished');
        const blob = new Blob(chunks, { type: 'video/webm' });
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `spirograph-${timestamp}.webm`;
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      };

      mediaRecorder.onerror = (error) => {
        console.error('WebM recording failed:', error);
        reject(error);
      };

      console.log('Starting WebM recording...');
      mediaRecorder.start();

      // Render frames at the specified FPS
      let frameIndex = 0;
      const frameInterval = 1000 / fps;
      const startTime = performance.now();

      const renderNextFrame = () => {
        if (frameIndex < frameCount) {
          renderFrame(ctx, frameOptions, frameIndex);
          frameIndex++;

          const elapsed = performance.now() - startTime;
          const expectedTime = frameIndex * frameInterval;
          const delay = Math.max(0, expectedTime - elapsed);

          setTimeout(renderNextFrame, delay);
        } else {
          // Finished rendering all frames
          setTimeout(() => {
            mediaRecorder.stop();
          }, 100); // Small delay to ensure last frame is captured
        }
      };

      renderNextFrame();
    });
  }, [basePoints, bounds, viewBox, strokeColor, strokeWidth, pathLength, backgroundColor, waveEffect, drawAnimationEnabled]);

  return {
    exportStatic,
    exportAnimated,
    exportPNG,
    exportGIF,
    exportWebM,
  };
}
