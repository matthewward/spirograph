import { useEffect, useState } from 'react';
import { serializeState, deserializeState, stateToHookParams } from '../lib/url/serialization';
import { SpirographParams, CurveType } from '../lib/spirograph/types';
import { ColorOscillation } from '../lib/animation/colorOscillation';
import { SpirographOscillations } from '../lib/animation/parameterOscillation';
import { EasingType } from '../lib/animation/easing';
import { LoopDirection } from './useAnimation';

export function useURLState() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Check for preview mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPreviewMode(params.get('mode') === 'preview');
  }, []);

  // Load state from URL
  const loadStateFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');

    if (!stateParam) return null;

    const state = deserializeState(stateParam);
    if (!state) return null;

    return stateToHookParams(state);
  };

  // Generate share URL
  const generateShareURL = (
    params: SpirographParams,
    curveType: CurveType,
    colorOscillation: ColorOscillation,
    paramOscillations: SpirographOscillations,
    animSpeed: number,
    animEasing: EasingType,
    animLoopDirection: LoopDirection,
    animShowDot: boolean,
    animShowRings: boolean,
    preview: boolean = true
  ): string => {
    const stateString = serializeState(
      params,
      curveType,
      colorOscillation,
      paramOscillations,
      animSpeed,
      animEasing,
      animLoopDirection,
      animShowDot,
      animShowRings
    );

    const url = new URL(window.location.href);
    url.search = ''; // Clear existing params
    url.searchParams.set('state', stateString);
    if (preview) {
      url.searchParams.set('mode', 'preview');
    }

    return url.toString();
  };

  // Update URL without reload (for browser history)
  const updateURL = (
    params: SpirographParams,
    curveType: CurveType,
    colorOscillation: ColorOscillation,
    paramOscillations: SpirographOscillations,
    animSpeed: number,
    animEasing: EasingType,
    animLoopDirection: LoopDirection,
    animShowDot: boolean,
    animShowRings: boolean
  ) => {
    const url = generateShareURL(
      params,
      curveType,
      colorOscillation,
      paramOscillations,
      animSpeed,
      animEasing,
      animLoopDirection,
      animShowDot,
      animShowRings,
      false // Don't set preview mode for normal updates
    );
    window.history.replaceState({}, '', url);
  };

  return {
    isPreviewMode,
    loadStateFromURL,
    generateShareURL,
    updateURL,
  };
}
