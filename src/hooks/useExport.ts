import { useCallback } from 'react';
import { generateStaticSVG, generateAnimatedSVG, generateWaveOnlySVG, generateCombinedSVG } from '../lib/svg/animator';
import { downloadFile } from '../lib/utils/download';
import { EasingType } from '../lib/animation/easing';
import { LoopDirection } from './useAnimation';
import { WaveEffectParams } from '../lib/animation/waveEffect';
import { Point } from '../lib/spirograph/types';

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

  return {
    exportStatic,
    exportAnimated,
    exportPNG,
  };
}
