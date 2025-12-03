/**
 * GSAP-style easing functions for smooth animations
 */

export type EasingType =
  | 'linear'
  | 'power1.in' | 'power1.out' | 'power1.inOut'
  | 'power2.in' | 'power2.out' | 'power2.inOut'
  | 'power3.in' | 'power3.out' | 'power3.inOut'
  | 'power4.in' | 'power4.out' | 'power4.inOut'
  | 'back.in' | 'back.out' | 'back.inOut'
  | 'elastic.in' | 'elastic.out' | 'elastic.inOut'
  | 'bounce.in' | 'bounce.out' | 'bounce.inOut'
  | 'circ.in' | 'circ.out' | 'circ.inOut'
  | 'expo.in' | 'expo.out' | 'expo.inOut'
  | 'sine.in' | 'sine.out' | 'sine.inOut';

// Helper: create in/out/inOut variants
const makeEasing = (
  inFunc: (t: number) => number,
  outFunc: (t: number) => number
) => ({
  in: inFunc,
  out: outFunc,
  inOut: (t: number) => (t < 0.5 ? inFunc(t * 2) / 2 : outFunc(t * 2 - 1) / 2 + 0.5),
});

function bounceOut(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

export const easingFunctions = {
  linear: (t: number) => t,

  // Power eases (quad, cubic, quart, quint)
  power1: makeEasing(
    (t) => t * t,
    (t) => 1 - (1 - t) * (1 - t)
  ),
  power2: makeEasing(
    (t) => t * t * t,
    (t) => 1 - Math.pow(1 - t, 3)
  ),
  power3: makeEasing(
    (t) => t * t * t * t,
    (t) => 1 - Math.pow(1 - t, 4)
  ),
  power4: makeEasing(
    (t) => t * t * t * t * t,
    (t) => 1 - Math.pow(1 - t, 5)
  ),

  // Back (overshoots)
  back: makeEasing(
    (t) => {
      const c = 1.70158;
      return t * t * ((c + 1) * t - c);
    },
    (t) => {
      const c = 1.70158;
      return 1 + (t - 1) * (t - 1) * ((c + 1) * (t - 1) + c);
    }
  ),

  // Elastic (springy)
  elastic: makeEasing(
    (t) => {
      if (t === 0 || t === 1) return t;
      return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },
    (t) => {
      if (t === 0 || t === 1) return t;
      return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    }
  ),

  // Bounce
  bounce: makeEasing(
    (t) => 1 - bounceOut(1 - t),
    bounceOut
  ),

  // Circ (circular)
  circ: makeEasing(
    (t) => 1 - Math.sqrt(1 - t * t),
    (t) => Math.sqrt(1 - (t - 1) * (t - 1))
  ),

  // Expo (exponential)
  expo: makeEasing(
    (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
    (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
  ),

  // Sine
  sine: makeEasing(
    (t) => 1 - Math.cos(t * Math.PI / 2),
    (t) => Math.sin(t * Math.PI / 2)
  ),
};

export function applyEasing(progress: number, easing: EasingType): number {
  if (easing === 'linear') return progress;

  const [family, variant] = easing.split('.') as [keyof typeof easingFunctions, 'in' | 'out' | 'inOut'];
  const easingGroup = easingFunctions[family];

  if (typeof easingGroup === 'function') {
    return easingGroup(progress);
  }

  return easingGroup[variant](progress);
}

// For UI display - grouped easing options
export const easingGroups = {
  'Basic': ['linear'] as const,
  'Power': ['power1', 'power2', 'power3', 'power4'] as const,
  'Special': ['back', 'elastic', 'bounce', 'circ', 'expo', 'sine'] as const,
};

// Helper to get all easing variants for a family
export function getEasingVariants(family: string): EasingType[] {
  if (family === 'linear') return ['linear'];
  return [`${family}.in`, `${family}.out`, `${family}.inOut`] as EasingType[];
}
