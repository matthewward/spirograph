import { EasingType } from '../animation/easing';
import { LoopDirection } from '../../hooks/useAnimation';

/**
 * Convert easing type to SMIL keySplines
 * KeySplines format: "x1 y1 x2 y2" for cubic bezier control points
 */
function getKeySplines(easing: EasingType): string {
  // Map GSAP easing types to cubic bezier control points
  const splineMap: Record<string, string> = {
    'linear': '0 0 1 1',

    // Power eases (approximations)
    'power1.in': '0.42 0 1 1',
    'power1.out': '0 0 0.58 1',
    'power1.inOut': '0.42 0 0.58 1',

    'power2.in': '0.55 0.085 0.68 0.53',
    'power2.out': '0.25 0.46 0.45 0.94',
    'power2.inOut': '0.455 0.03 0.515 0.955',

    'power3.in': '0.55 0.055 0.675 0.19',
    'power3.out': '0.215 0.61 0.355 1',
    'power3.inOut': '0.645 0.045 0.355 1',

    'power4.in': '0.895 0.03 0.685 0.22',
    'power4.out': '0.165 0.84 0.44 1',
    'power4.inOut': '0.77 0 0.175 1',

    // Circ
    'circ.in': '0.6 0.04 0.98 0.335',
    'circ.out': '0.075 0.82 0.165 1',
    'circ.inOut': '0.785 0.135 0.15 0.86',

    // Expo
    'expo.in': '0.95 0.05 0.795 0.035',
    'expo.out': '0.19 1 0.22 1',
    'expo.inOut': '1 0 0 1',

    // Sine
    'sine.in': '0.47 0 0.745 0.715',
    'sine.out': '0.39 0.575 0.565 1',
    'sine.inOut': '0.445 0.05 0.55 0.95',

    // Back (approximations - may not perfectly match GSAP)
    'back.in': '0.6 -0.28 0.735 0.045',
    'back.out': '0.175 0.885 0.32 1.275',
    'back.inOut': '0.68 -0.55 0.265 1.55',

    // Note: Elastic and Bounce cannot be accurately represented with cubic bezier
    // Using reasonable approximations
    'elastic.in': '0.6 -0.28 0.735 0.045',
    'elastic.out': '0.175 0.885 0.32 1.275',
    'elastic.inOut': '0.68 -0.55 0.265 1.55',

    'bounce.in': '0.6 -0.28 0.735 0.045',
    'bounce.out': '0.175 0.885 0.32 1.275',
    'bounce.inOut': '0.68 -0.55 0.265 1.55',
  };

  return splineMap[easing] || '0 0 1 1'; // Default to linear
}

/**
 * Generate an animated SVG with SMIL animation
 */
export function generateAnimatedSVG(
  pathString: string,
  viewBox: string,
  strokeColor: string,
  strokeWidth: number,
  pathLength: number,
  duration: number = 5,
  loopDirection: LoopDirection = 'none',
  easing: EasingType = 'linear'
): string {
  const keySplines = getKeySplines(easing);

  if (loopDirection === 'none') {
    // One-way animation (no loop)
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="800" height="800">
  <style>
    path {
      stroke-dasharray: ${pathLength};
    }
  </style>

  <path
    d="${pathString}"
    fill="none"
    stroke="${strokeColor}"
    stroke-width="${strokeWidth}"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <animate
      attributeName="stroke-dashoffset"
      from="${pathLength}"
      to="0"
      dur="${duration}s"
      keySplines="${keySplines}"
      keyTimes="0;1"
      calcMode="spline"
      fill="freeze"
    />
  </path>
</svg>`;
  } else {
    // Both continue and pingpong use same animation (draw -> undraw)
    // The difference is visual only (both show the same effect in SMIL)
    const cycleDuration = duration * 2;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="800" height="800">
  <style>
    path {
      stroke-dasharray: ${pathLength};
    }
  </style>

  <path
    d="${pathString}"
    fill="none"
    stroke="${strokeColor}"
    stroke-width="${strokeWidth}"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <animate
      attributeName="stroke-dashoffset"
      values="${pathLength};0;${pathLength}"
      keyTimes="0;0.5;1"
      keySplines="${keySplines};${keySplines}"
      dur="${cycleDuration}s"
      repeatCount="indefinite"
      calcMode="spline"
    />
  </path>
</svg>`;
  }
}

/**
 * Generate a static SVG
 */
export function generateStaticSVG(
  pathString: string,
  viewBox: string,
  strokeColor: string,
  strokeWidth: number
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="800" height="800">
  <path
    d="${pathString}"
    fill="none"
    stroke="${strokeColor}"
    stroke-width="${strokeWidth}"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;
}
