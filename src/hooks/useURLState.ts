import {
  serializeState,
  deserializeState,
  stateToHookParams,
} from "../lib/url/serialization";
import { SpirographParams, CurveType } from "../lib/spirograph/types";
import { SpirographOscillations } from "../lib/animation/parameterOscillation";
import { EasingType } from "../lib/animation/easing";
import { LoopDirection } from "./useAnimation";

export function useURLState() {
  // Load state from URL
  const loadStateFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get("state");

    if (!stateParam) return null;

    const state = deserializeState(stateParam);
    if (!state) return null;

    return stateToHookParams(state);
  };

  // Check if URL has state parameter
  const hasURLState = (): boolean => {
    const params = new URLSearchParams(window.location.search);
    return params.has("state");
  };

  // Generate share URL
  const generateShareURL = (
    params: SpirographParams,
    curveType: CurveType,
    paramOscillations: SpirographOscillations,
    animSpeed: number,
    animEasing: EasingType,
    animLoopDirection: LoopDirection,
    animShowDot: boolean,
    animShowRings: boolean,
    autoPlay: boolean = false
  ): string => {
    const stateString = serializeState(
      params,
      curveType,
      paramOscillations,
      animSpeed,
      animEasing,
      animLoopDirection,
      animShowDot,
      animShowRings,
      autoPlay
    );

    const url = new URL(window.location.href);
    url.search = ""; // Clear existing params
    url.searchParams.set("state", stateString);

    return url.toString();
  };

  // Update URL without reload (for browser history)
  const updateURL = (
    params: SpirographParams,
    curveType: CurveType,
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
      paramOscillations,
      animSpeed,
      animEasing,
      animLoopDirection,
      animShowDot,
      animShowRings,
      false // Don't auto-play for normal updates
    );
    window.history.replaceState({}, "", url);
  };

  return {
    loadStateFromURL,
    hasURLState,
    generateShareURL,
    updateURL,
  };
}
