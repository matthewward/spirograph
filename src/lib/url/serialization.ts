import { SpirographParams, CurveType } from "../spirograph/types";
import { WaveType } from "../animation/oscillationWaves";
import { SpirographOscillations } from "../animation/parameterOscillation";
import { EasingType } from "../animation/easing";
import { LoopDirection } from "../../hooks/useAnimation";
import { GradientType, DisplacementMode } from "../animation/waveEffect";

// Randomization utilities
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  const value = Math.random() * (max - min) + min;
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export interface SerializableState {
  // SpirographParams
  R: number;
  r: number;
  d: number;
  strokeWidth: number;
  strokeColor: string;
  completion: number;
  duration: number;
  rotation: number;
  backgroundColor: string;
  glowColor: string;
  sides: number;
  arcness: number;
  arcnessEnabled: boolean;

  // Wave Effect
  waveEffect_enabled: boolean;
  waveEffect_gradientType: GradientType;
  waveEffect_frequency: number;
  waveEffect_amplitude: number;
  waveEffect_displacementMode: DisplacementMode;
  waveEffect_animationOffset: number;
  waveEffect_easing: number;
  waveEffect_animate: boolean;
  waveEffect_animationSpeed: number;

  // CurveType
  curveType: CurveType;

  // ParameterOscillations - R
  oscR_enabled: boolean;
  oscR_amplitude: number;
  oscR_frequency: number;
  oscR_waveType: WaveType;

  // ParameterOscillations - r
  oscr_enabled: boolean;
  oscr_amplitude: number;
  oscr_frequency: number;
  oscr_waveType: WaveType;

  // ParameterOscillations - d
  oscd_enabled: boolean;
  oscd_amplitude: number;
  oscd_frequency: number;
  oscd_waveType: WaveType;

  // Animation settings
  animEasing: EasingType;
  animLoopDirection: LoopDirection;
  animShowDot: boolean;
  animShowRings: boolean;
  autoPlay: boolean;
}

// Fixed defaults for validation fallbacks (non-random, stable values)
function getFixedDefaultState(): SerializableState {
  return {
    R: 120,
    r: 48,
    d: 84,
    strokeWidth: 0.5,
    strokeColor: "#ffffff",
    completion: 100,
    duration: 5,
    rotation: 90,
    backgroundColor: "#111529",
    glowColor: "#00d9ff",
    sides: 1,
    arcness: 0,
    arcnessEnabled: false,
    waveEffect_enabled: false,
    waveEffect_gradientType: "horizontal",
    waveEffect_frequency: 1,
    waveEffect_amplitude: 10,
    waveEffect_displacementMode: "perpendicular",
    waveEffect_animationOffset: 0,
    waveEffect_easing: 0.5,
    waveEffect_animate: false,
    waveEffect_animationSpeed: 5,
    curveType: "hypotrochoid",
    oscR_enabled: false,
    oscR_amplitude: 20,
    oscR_frequency: 2,
    oscR_waveType: "sine",
    oscr_enabled: false,
    oscr_amplitude: 10,
    oscr_frequency: 2,
    oscr_waveType: "sine",
    oscd_enabled: false,
    oscd_amplitude: 20,
    oscd_frequency: 2,
    oscd_waveType: "sine",
    animEasing: "linear",
    animLoopDirection: "continue",
    animShowDot: false,
    animShowRings: false,
    autoPlay: false,
  };
}

// Serialize current state to Base64 string
export function serializeState(
  params: SpirographParams,
  curveType: CurveType,
  paramOscillations: SpirographOscillations,
  animEasing: EasingType,
  animLoopDirection: LoopDirection,
  animShowDot: boolean,
  animShowRings: boolean,
  autoPlay: boolean = false
): string {
  const state: SerializableState = {
    R: params.R,
    r: params.r,
    d: params.d,
    strokeWidth: params.strokeWidth,
    strokeColor: params.strokeColor,
    completion: params.completion,
    duration: params.duration,
    rotation: params.rotation,
    backgroundColor: params.backgroundColor,
    glowColor: params.glowColor,
    sides: params.sides,
    arcness: params.arcness,
    arcnessEnabled: params.arcnessEnabled,
    waveEffect_enabled: params.waveEffect.enabled,
    waveEffect_gradientType: params.waveEffect.gradientType,
    waveEffect_frequency: params.waveEffect.frequency,
    waveEffect_amplitude: params.waveEffect.amplitude,
    waveEffect_displacementMode: params.waveEffect.displacementMode,
    waveEffect_animationOffset: params.waveEffect.animationOffset,
    waveEffect_easing: params.waveEffect.easing,
    waveEffect_animate: params.waveEffect.animate,
    waveEffect_animationSpeed: params.waveEffect.animationSpeed,
    curveType,
    oscR_enabled: paramOscillations.R.enabled,
    oscR_amplitude: paramOscillations.R.amplitude,
    oscR_frequency: paramOscillations.R.frequency,
    oscR_waveType: paramOscillations.R.waveType,
    oscr_enabled: paramOscillations.r.enabled,
    oscr_amplitude: paramOscillations.r.amplitude,
    oscr_frequency: paramOscillations.r.frequency,
    oscr_waveType: paramOscillations.r.waveType,
    oscd_enabled: paramOscillations.d.enabled,
    oscd_amplitude: paramOscillations.d.amplitude,
    oscd_frequency: paramOscillations.d.frequency,
    oscd_waveType: paramOscillations.d.waveType,
    animEasing,
    animLoopDirection,
    animShowDot,
    animShowRings,
    autoPlay,
  };

  const json = JSON.stringify(state);
  return btoa(json); // Base64 encode
}

// Convert to number, use default if invalid (no range validation)
function validateNumber(val: any, defaultVal: number): number {
  const num = Number(val);
  if (isNaN(num)) return defaultVal;
  return num;
}

function validateString(val: any, defaultVal: string): string {
  return typeof val === "string" ? val : defaultVal;
}

function validateBoolean(val: any, defaultVal: boolean): boolean {
  return typeof val === "boolean" ? val : defaultVal;
}

function validateWaveType(val: any, defaultVal: WaveType): WaveType {
  const validWaves: WaveType[] = [
    "sine",
    "triangle",
    "square",
    "sawtooth",
    "reverseSawtooth",
  ];
  return validWaves.includes(val) ? val : defaultVal;
}

function validateCurveType(val: any, defaultVal: CurveType): CurveType {
  return val === "hypotrochoid" || val === "epitrochoid" ? val : defaultVal;
}

function validateEasingType(val: any, defaultVal: EasingType): EasingType {
  const validEasings: EasingType[] = [
    "linear",
    "power1.in",
    "power1.out",
    "power1.inOut",
    "power2.in",
    "power2.out",
    "power2.inOut",
    "power3.in",
    "power3.out",
    "power3.inOut",
    "power4.in",
    "power4.out",
    "power4.inOut",
    "circ.in",
    "circ.out",
    "circ.inOut",
    "expo.in",
    "expo.out",
    "expo.inOut",
    "sine.in",
    "sine.out",
    "sine.inOut",
    "back.in",
    "back.out",
    "back.inOut",
    "elastic.in",
    "elastic.out",
    "elastic.inOut",
    "bounce.in",
    "bounce.out",
    "bounce.inOut",
  ];
  return validEasings.includes(val) ? val : defaultVal;
}

function validateGradientType(
  val: any,
  defaultVal: GradientType
): GradientType {
  const validTypes: GradientType[] = ["horizontal", "vertical", "radial", "diamond"];
  return validTypes.includes(val) ? val : defaultVal;
}

function validateDisplacementMode(
  val: any,
  defaultVal: DisplacementMode
): DisplacementMode {
  const validModes: DisplacementMode[] = [
    "perpendicular",
    "radial",
    "horizontal",
    "vertical",
  ];
  return validModes.includes(val) ? val : defaultVal;
}

function validateLoopDirection(
  val: any,
  defaultVal: LoopDirection
): LoopDirection {
  const validLoops: LoopDirection[] = ["none", "continue", "pingpong"];
  return validLoops.includes(val) ? val : defaultVal;
}

// Deserialize Base64 string to state with validation
export function deserializeState(base64: string): SerializableState | null {
  try {
    const json = atob(base64);
    const parsed = JSON.parse(json);
    const defaults = getFixedDefaultState(); // Use fixed defaults for validation, not random

    // Use serialized values directly, fallback to defaults only if invalid
    const state: SerializableState = {
      R: validateNumber(parsed.R, defaults.R),
      r: validateNumber(parsed.r, defaults.r),
      d: validateNumber(parsed.d, defaults.d),
      strokeWidth: validateNumber(parsed.strokeWidth, defaults.strokeWidth),
      strokeColor: validateString(parsed.strokeColor, defaults.strokeColor),
      completion: validateNumber(parsed.completion, defaults.completion),
      duration: validateNumber(parsed.duration, defaults.duration),
      rotation: validateNumber(parsed.rotation, defaults.rotation),
      backgroundColor: validateString(
        parsed.backgroundColor,
        defaults.backgroundColor
      ),
      glowColor: validateString(parsed.glowColor, defaults.glowColor),
      sides: validateNumber(parsed.sides, defaults.sides),
      arcness: validateNumber(parsed.arcness, defaults.arcness),
      arcnessEnabled: validateBoolean(
        parsed.arcnessEnabled,
        defaults.arcnessEnabled
      ),
      waveEffect_enabled: validateBoolean(
        parsed.waveEffect_enabled,
        defaults.waveEffect_enabled
      ),
      waveEffect_gradientType: validateGradientType(
        parsed.waveEffect_gradientType,
        defaults.waveEffect_gradientType
      ),
      waveEffect_frequency: validateNumber(
        parsed.waveEffect_frequency,
        defaults.waveEffect_frequency
      ),
      waveEffect_amplitude: validateNumber(
        parsed.waveEffect_amplitude,
        defaults.waveEffect_amplitude
      ),
      waveEffect_displacementMode: validateDisplacementMode(
        parsed.waveEffect_displacementMode,
        defaults.waveEffect_displacementMode
      ),
      waveEffect_animationOffset: validateNumber(
        parsed.waveEffect_animationOffset,
        defaults.waveEffect_animationOffset
      ),
      waveEffect_easing: validateNumber(
        parsed.waveEffect_easing,
        defaults.waveEffect_easing
      ),
      waveEffect_animate: validateBoolean(
        parsed.waveEffect_animate,
        defaults.waveEffect_animate
      ),
      waveEffect_animationSpeed: validateNumber(
        parsed.waveEffect_animationSpeed,
        defaults.waveEffect_animationSpeed
      ),
      curveType: validateCurveType(parsed.curveType, defaults.curveType),
      oscR_enabled: validateBoolean(parsed.oscR_enabled, defaults.oscR_enabled),
      oscR_amplitude: validateNumber(
        parsed.oscR_amplitude,
        defaults.oscR_amplitude
      ),
      oscR_frequency: validateNumber(
        parsed.oscR_frequency,
        defaults.oscR_frequency
      ),
      oscR_waveType: validateWaveType(
        parsed.oscR_waveType,
        defaults.oscR_waveType
      ),
      oscr_enabled: validateBoolean(parsed.oscr_enabled, defaults.oscr_enabled),
      oscr_amplitude: validateNumber(
        parsed.oscr_amplitude,
        defaults.oscr_amplitude
      ),
      oscr_frequency: validateNumber(
        parsed.oscr_frequency,
        defaults.oscr_frequency
      ),
      oscr_waveType: validateWaveType(
        parsed.oscr_waveType,
        defaults.oscr_waveType
      ),
      oscd_enabled: validateBoolean(parsed.oscd_enabled, defaults.oscd_enabled),
      oscd_amplitude: validateNumber(
        parsed.oscd_amplitude,
        defaults.oscd_amplitude
      ),
      oscd_frequency: validateNumber(
        parsed.oscd_frequency,
        defaults.oscd_frequency
      ),
      oscd_waveType: validateWaveType(
        parsed.oscd_waveType,
        defaults.oscd_waveType
      ),
      animEasing: validateEasingType(parsed.animEasing, defaults.animEasing),
      animLoopDirection: validateLoopDirection(
        parsed.animLoopDirection,
        defaults.animLoopDirection
      ),
      animShowDot: validateBoolean(parsed.animShowDot, defaults.animShowDot),
      animShowRings: validateBoolean(
        parsed.animShowRings,
        defaults.animShowRings
      ),
      autoPlay: validateBoolean(parsed.autoPlay, defaults.autoPlay),
    };

    return state;
  } catch (e) {
    console.error("Failed to deserialize state:", e);
    return null;
  }
}

// Convert SerializableState back to hook-compatible structures
export function stateToHookParams(state: SerializableState) {
  const params: SpirographParams = {
    R: state.R,
    r: state.r,
    d: state.d,
    strokeWidth: state.strokeWidth,
    strokeColor: state.strokeColor,
    completion: state.completion,
    duration: state.duration,
    rotation: state.rotation,
    backgroundColor: state.backgroundColor,
    glowColor: state.glowColor,
    sides: state.sides,
    arcness: state.arcness,
    arcnessEnabled: state.arcnessEnabled,
    waveEffect: {
      enabled: state.waveEffect_enabled,
      gradientType: state.waveEffect_gradientType,
      frequency: state.waveEffect_frequency,
      amplitude: state.waveEffect_amplitude,
      displacementMode: state.waveEffect_displacementMode,
      animationOffset: state.waveEffect_animationOffset,
      easing: state.waveEffect_easing,
      animate: state.waveEffect_animate,
      animationSpeed: state.waveEffect_animationSpeed,
    },
  };

  const paramOscillations: SpirographOscillations = {
    R: {
      enabled: state.oscR_enabled,
      baseValue: state.R, // Derived from params
      amplitude: state.oscR_amplitude,
      frequency: state.oscR_frequency,
      waveType: state.oscR_waveType,
    },
    r: {
      enabled: state.oscr_enabled,
      baseValue: state.r,
      amplitude: state.oscr_amplitude,
      frequency: state.oscr_frequency,
      waveType: state.oscr_waveType,
    },
    d: {
      enabled: state.oscd_enabled,
      baseValue: state.d,
      amplitude: state.oscd_amplitude,
      frequency: state.oscd_frequency,
      waveType: state.oscd_waveType,
    },
  };

  return {
    params,
    curveType: state.curveType,
    paramOscillations,
    animEasing: state.animEasing,
    animLoopDirection: state.animLoopDirection,
    animShowDot: state.animShowDot,
    animShowRings: state.animShowRings,
    autoPlay: state.autoPlay,
  };
}
