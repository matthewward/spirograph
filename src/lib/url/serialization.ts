import { SpirographParams, CurveType } from '../spirograph/types';
import { WaveType } from '../animation/oscillationWaves';
import { SpirographOscillations } from '../animation/parameterOscillation';
import { EasingType } from '../animation/easing';
import { LoopDirection } from '../../hooks/useAnimation';

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
  animSpeed: number;
  animEasing: EasingType;
  animLoopDirection: LoopDirection;
  animShowDot: boolean;
  animShowRings: boolean;
}

// Default state (matches defaults from hooks)
export function getDefaultState(): SerializableState {
  return {
    R: 120,
    r: 48,
    d: 84,
    strokeWidth: 2,
    strokeColor: '#00d9ff',
    completion: 100,
    duration: 5,
    rotation: 0,
    backgroundColor: '#111529',
    curveType: 'hypotrochoid',
    oscR_enabled: false,
    oscR_amplitude: 20,
    oscR_frequency: 2,
    oscR_waveType: 'sine',
    oscr_enabled: false,
    oscr_amplitude: 10,
    oscr_frequency: 2,
    oscr_waveType: 'sine',
    oscd_enabled: false,
    oscd_amplitude: 20,
    oscd_frequency: 2,
    oscd_waveType: 'sine',
    animSpeed: 1,
    animEasing: 'linear',
    animLoopDirection: 'none',
    animShowDot: false,
    animShowRings: false,
  };
}

// Serialize current state to Base64 string
export function serializeState(
  params: SpirographParams,
  curveType: CurveType,
  paramOscillations: SpirographOscillations,
  animSpeed: number,
  animEasing: EasingType,
  animLoopDirection: LoopDirection,
  animShowDot: boolean,
  animShowRings: boolean
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
    animSpeed,
    animEasing,
    animLoopDirection,
    animShowDot,
    animShowRings,
  };

  const json = JSON.stringify(state);
  return btoa(json); // Base64 encode
}

// Validate and sanitize individual fields
function validateNumber(val: any, min: number, max: number, defaultVal: number): number {
  const num = Number(val);
  if (isNaN(num) || num < min || num > max) return defaultVal;
  return num;
}

function validateString(val: any, defaultVal: string): string {
  return typeof val === 'string' ? val : defaultVal;
}

function validateBoolean(val: any, defaultVal: boolean): boolean {
  return typeof val === 'boolean' ? val : defaultVal;
}

function validateWaveType(val: any, defaultVal: WaveType): WaveType {
  const validWaves: WaveType[] = ['sine', 'triangle', 'square', 'sawtooth', 'reverseSawtooth'];
  return validWaves.includes(val) ? val : defaultVal;
}

function validateCurveType(val: any, defaultVal: CurveType): CurveType {
  return (val === 'hypotrochoid' || val === 'epitrochoid') ? val : defaultVal;
}

function validateEasingType(val: any, defaultVal: EasingType): EasingType {
  const validEasings: EasingType[] = [
    'linear', 'power1.in', 'power1.out', 'power1.inOut',
    'power2.in', 'power2.out', 'power2.inOut',
    'power3.in', 'power3.out', 'power3.inOut',
    'power4.in', 'power4.out', 'power4.inOut',
    'circ.in', 'circ.out', 'circ.inOut',
    'expo.in', 'expo.out', 'expo.inOut',
    'sine.in', 'sine.out', 'sine.inOut',
    'back.in', 'back.out', 'back.inOut',
    'elastic.in', 'elastic.out', 'elastic.inOut',
    'bounce.in', 'bounce.out', 'bounce.inOut',
  ];
  return validEasings.includes(val) ? val : defaultVal;
}

function validateLoopDirection(val: any, defaultVal: LoopDirection): LoopDirection {
  const validLoops: LoopDirection[] = ['none', 'continue', 'pingpong'];
  return validLoops.includes(val) ? val : defaultVal;
}

// Deserialize Base64 string to state with validation
export function deserializeState(base64: string): SerializableState | null {
  try {
    const json = atob(base64);
    const parsed = JSON.parse(json);
    const defaults = getDefaultState();

    // Validate and sanitize all fields
    const state: SerializableState = {
      R: validateNumber(parsed.R, 50, 200, defaults.R),
      r: validateNumber(parsed.r, 10, 150, defaults.r),
      d: validateNumber(parsed.d, 10, 150, defaults.d),
      strokeWidth: validateNumber(parsed.strokeWidth, 0.5, 8, defaults.strokeWidth),
      strokeColor: validateString(parsed.strokeColor, defaults.strokeColor),
      completion: validateNumber(parsed.completion, 1, 100, defaults.completion),
      duration: validateNumber(parsed.duration, 0.1, 30, defaults.duration),
      rotation: validateNumber(parsed.rotation, 0, 360, defaults.rotation),
      backgroundColor: validateString(parsed.backgroundColor, defaults.backgroundColor),
      curveType: validateCurveType(parsed.curveType, defaults.curveType),
      oscR_enabled: validateBoolean(parsed.oscR_enabled, defaults.oscR_enabled),
      oscR_amplitude: validateNumber(parsed.oscR_amplitude, 0, 100, defaults.oscR_amplitude),
      oscR_frequency: validateNumber(parsed.oscR_frequency, 1, 20, defaults.oscR_frequency),
      oscR_waveType: validateWaveType(parsed.oscR_waveType, defaults.oscR_waveType),
      oscr_enabled: validateBoolean(parsed.oscr_enabled, defaults.oscr_enabled),
      oscr_amplitude: validateNumber(parsed.oscr_amplitude, 0, 100, defaults.oscr_amplitude),
      oscr_frequency: validateNumber(parsed.oscr_frequency, 1, 20, defaults.oscr_frequency),
      oscr_waveType: validateWaveType(parsed.oscr_waveType, defaults.oscr_waveType),
      oscd_enabled: validateBoolean(parsed.oscd_enabled, defaults.oscd_enabled),
      oscd_amplitude: validateNumber(parsed.oscd_amplitude, 0, 100, defaults.oscd_amplitude),
      oscd_frequency: validateNumber(parsed.oscd_frequency, 1, 20, defaults.oscd_frequency),
      oscd_waveType: validateWaveType(parsed.oscd_waveType, defaults.oscd_waveType),
      animSpeed: validateNumber(parsed.animSpeed, 0.1, 5, defaults.animSpeed),
      animEasing: validateEasingType(parsed.animEasing, defaults.animEasing),
      animLoopDirection: validateLoopDirection(parsed.animLoopDirection, defaults.animLoopDirection),
      animShowDot: validateBoolean(parsed.animShowDot, defaults.animShowDot),
      animShowRings: validateBoolean(parsed.animShowRings, defaults.animShowRings),
    };

    return state;
  } catch (e) {
    console.error('Failed to deserialize state:', e);
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
    animSpeed: state.animSpeed,
    animEasing: state.animEasing,
    animLoopDirection: state.animLoopDirection,
    animShowDot: state.animShowDot,
    animShowRings: state.animShowRings,
  };
}
