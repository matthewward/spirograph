import { useCallback } from 'react';
import { generateStaticSVG, generateAnimatedSVG } from '../lib/svg/animator';
import { downloadFile } from '../lib/utils/download';
import { EasingType } from '../lib/animation/easing';

export interface UseExportOptions {
  pathString: string;
  viewBox: string;
  strokeColor: string;
  strokeWidth: number;
  pathLength: number;
}

export function useExport(options: UseExportOptions) {
  const { pathString, viewBox, strokeColor, strokeWidth, pathLength } = options;

  const exportStatic = useCallback(() => {
    const svg = generateStaticSVG(pathString, viewBox, strokeColor, strokeWidth);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(svg, `spirograph-${timestamp}.svg`, 'image/svg+xml');
  }, [pathString, viewBox, strokeColor, strokeWidth]);

  const exportAnimated = useCallback((duration: number = 5, loop: boolean = false, easing: EasingType = 'linear') => {
    const svg = generateAnimatedSVG(
      pathString,
      viewBox,
      strokeColor,
      strokeWidth,
      pathLength,
      duration,
      loop,
      easing
    );
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(svg, `spirograph-animated-${timestamp}.svg`, 'image/svg+xml');
  }, [pathString, viewBox, strokeColor, strokeWidth, pathLength]);

  return {
    exportStatic,
    exportAnimated,
  };
}
