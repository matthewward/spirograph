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
  loop: boolean = false
): string {
  const loopAttr = loop ? 'indefinite' : '1';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="800" height="800">
  <style>
    path {
      stroke-dasharray: ${pathLength};
      stroke-dashoffset: ${pathLength};
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
      repeatCount="${loopAttr}"
      fill="freeze"
    />
  </path>
</svg>`;
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
