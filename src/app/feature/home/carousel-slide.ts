/** Slides a carousel with inline transforms. CSS transitions are not used:
 *  the landing turns them off under reduced motion, and a per-frame CSS
 *  transition would restart itself on every step. */

const DURATION = 560;

const ease = (t: number) => 1 - (1 - t) ** 3;

const clear = (slide: HTMLElement) => {
  slide.style.transition = '';
  slide.style.visibility = '';
  slide.style.opacity = '';
  slide.style.pointerEvents = '';
  slide.style.zIndex = '';
  slide.style.transform = '';
};

export function createSlidePlayer() {
  let ride = 0;

  const play = (slides: readonly HTMLElement[], outgoing: HTMLElement, incoming: HTMLElement, dir: number) => {
    const current = ++ride;
    for (const slide of slides) clear(slide);

    const distance = Math.max(1, Math.round(outgoing.getBoundingClientRect().width));
    const arm = (slide: HTMLElement, z: string) => {
      slide.style.transition = 'none';
      slide.style.visibility = 'visible';
      slide.style.opacity = '1';
      slide.style.pointerEvents = 'none';
      slide.style.zIndex = z;
    };
    arm(outgoing, '1');
    arm(incoming, '2');
    outgoing.style.transform = 'translate3d(0px,0,0)';
    incoming.style.transform = `translate3d(${dir * distance}px,0,0)`;

    const t0 = performance.now();
    const step = (now: number) => {
      if (current !== ride) return;
      const t = Math.min(1, (now - t0) / DURATION);
      const e = ease(t);
      outgoing.style.transform = `translate3d(${(-dir * distance * e).toFixed(2)}px,0,0)`;
      incoming.style.transform = `translate3d(${(dir * distance * (1 - e)).toFixed(2)}px,0,0)`;
      if (t < 1) requestAnimationFrame(step);
      else if (current === ride) {
        for (const slide of slides) clear(slide);
      }
    };
    requestAnimationFrame(step);
  };

  return { play };
}
