// Tiny helpers to drive the Gari mascot and its speech bubbles.
export type Mood = 'idle' | 'wave' | 'write' | 'think' | 'happy' | 'celebrate' | 'worried' | 'confused';

export const mood = (el: Element | null | undefined, m: Mood) => { if (el) (el as HTMLElement).dataset.mood = m; };

/** Show a message in a speech bubble with a small pop animation. */
export function say(bubble: HTMLElement | null | undefined, text: string) {
  if (!bubble || bubble.textContent === text) return;
  bubble.textContent = text;
  bubble.classList.remove('pop');
  void bubble.offsetWidth;
  bubble.classList.add('pop');
}
