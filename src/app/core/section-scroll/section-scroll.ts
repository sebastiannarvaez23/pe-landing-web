/**
 * One scroll behavior for every landing section.
 * Each section declares data-pe-side (start | end) and data-pe-shape.
 * While the next section enters the viewport, the shared mark travels
 * from one side to the other. Its form breaks into pieces and particles,
 * then those pieces gather into the next shape.
 */
export function bindSectionScroll(): void {
  const story = document.querySelector<HTMLElement>('[data-pe-story]');
  const stage = document.querySelector<HTMLElement>('[data-pe-mark]');
  if (!story || !stage) return;

  const sections = [...story.querySelectorAll<HTMLElement>('[data-pe-section]')];
  const shapes = [...stage.querySelectorAll<HTMLElement>('[data-pe-shape]')];
  stage.querySelectorAll('[data-pe-shard-twin]').forEach((twin) => twin.remove());
  const shardHost = stage.querySelector('[data-pe-shards]');
  const shardNodes = [...stage.querySelectorAll<SVGGraphicsElement>('[data-pe-shard]')];
  shardNodes.forEach((shard) => {
    const twin = shard.cloneNode(true) as SVGGraphicsElement;
    twin.dataset.peShardTwin = 'true';
    twin.dataset.dx = String(-(Number(shard.dataset.dx) || 0));
    twin.dataset.dy = String(-(Number(shard.dataset.dy) || 0));
    twin.dataset.spin = String(-(Number(shard.dataset.spin) || 0));
    twin.dataset.lag = String(((Number(shard.dataset.lag) || 0) + 0.09) % 0.22);
    shardHost?.appendChild(twin);
  });
  const shards = [...stage.querySelectorAll<SVGGraphicsElement>('[data-pe-shard]')].map((shard) => {
    const box = shard.getBBox();
    return {
      shard,
      dx: (Number(shard.dataset.dx) || 0) * 2,
      dy: (Number(shard.dataset.dy) || 0) * 2,
      spin: Number(shard.dataset.spin) || 0,
      lag: Number(shard.dataset.lag) || 0,
      cx: box.x + box.width / 2,
      cy: box.y + box.height / 2,
    };
  });
  if (!sections.length) return;

  let frame = 0;

  const anchorOf = (section: HTMLElement) => {
    const anchor = section.querySelector<HTMLElement>('[data-pe-anchor]') ?? section;
    const box = anchor.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  };

  const update = () => {
    frame = 0;
    const vh = window.innerHeight;

    let from = sections[0];
    let to = sections[0];
    let progress = 1;

    for (let i = 0; i < sections.length - 1; i += 1) {
      const nextTop = sections[i + 1].getBoundingClientRect().top;
      const travel = Math.max(sections[i].getBoundingClientRect().height, 1);
      if (nextTop <= 0) continue;
      if (nextTop < travel) {
        from = sections[i];
        to = sections[i + 1];
        progress = 1 - nextTop / travel;
      } else {
        from = sections[i];
        to = sections[i];
      }
      break;
    }

    const last = sections[sections.length - 1];
    if (last.getBoundingClientRect().top <= 0) {
      from = last;
      to = last;
      progress = 1;
    }

    const fromPoint = anchorOf(from);
    const toPoint = anchorOf(to);
    const x = fromPoint.x + (toPoint.x - fromPoint.x) * progress;
    const y = fromPoint.y + (toPoint.y - fromPoint.y) * progress;
    // On a phone the figure has to be finished once the section is the one
    // on screen. The full travel only ends when the section top hits 0, so
    // the assembly is compressed into the first part of that travel.
    const mobile = window.matchMedia(
      '(max-width: 767.98px), (min-width: 768px) and (max-width: 1023.98px) and (orientation: portrait), (max-width: 1023.98px) and (orientation: landscape) and (max-height: 500px)',
    ).matches;
    const motion = mobile && from !== to ? Math.min(1, progress / 0.52) : progress;
    const blend = from === to ? 0 : Math.sin(Math.min(Math.max(motion, 0), 1) * Math.PI);
    const fromCover = from.dataset.peSide === 'start' ? 0 : 1;
    const toCover = to.dataset.peSide === 'start' ? 0 : 1;
    const cover = fromCover + (toCover - fromCover) * motion;

    stage.style.left = `${x}px`;
    stage.style.top = `${y}px`;
    stage.style.setProperty('--pe-mark-blend', blend.toFixed(4));
    stage.style.setProperty('--pe-hero-cover', cover.toFixed(4));
    stage.style.setProperty('--pe-shard', blend.toFixed(4));

    const fromShape = from.dataset.peShape ?? '';
    const toShape = to.dataset.peShape ?? '';
    const traveling = from !== to;
    shapes.forEach((shape) => {
      const id = shape.dataset.peShape ?? '';
      let opacity = 0;
      let scale = 1;
      if (!traveling) {
        opacity = id === fromShape ? 1 : 0;
      } else if (id === fromShape && id === toShape) {
        opacity = 1;
      } else if (id === fromShape) {
        opacity = motion < 0.7 ? 1 - motion / 0.7 : 0;
        scale = 1 + Math.min(motion / 0.7, 1) * 0.12;
      } else if (id === toShape) {
        const arrive = motion > 0.3 ? (motion - 0.3) / 0.7 : 0;
        opacity = arrive;
        scale = 0.84 + arrive * 0.16;
      }
      shape.style.opacity = opacity.toFixed(3);
      shape.style.transform = scale === 1 ? '' : `scale(${scale.toFixed(3)})`;
    });

    shards.forEach((piece) => {
      const shifted = Math.min(Math.max(motion * (1 + piece.lag) - piece.lag * 0.35, 0), 1);
      const local = traveling ? Math.sin(shifted * Math.PI) : 0;
      if (!local) {
        piece.shard.removeAttribute('transform');
        return;
      }
      piece.shard.setAttribute(
        'transform',
        `translate(${(piece.dx * local).toFixed(1)} ${(piece.dy * local).toFixed(1)}) rotate(${(piece.spin * local).toFixed(1)} ${piece.cx.toFixed(1)} ${piece.cy.toFixed(1)})`,
      );
    });

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - vh / 2) / vh;
      section.style.setProperty('--pe-in', Math.max(0, Math.min(1, 1 - distance)).toFixed(3));
    });

    const storyBottom = story.getBoundingClientRect().bottom;
    const gate = vh * 0.4;
    stage.style.opacity = (storyBottom < gate ? Math.max(0, storyBottom / gate) : 1).toFixed(3);
  };

  const request = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
}

/** Toolbar and in-page section links slide through the story instead of jumping. */
export function bindSectionNav(): void {
  let ride = 0;

  const destination = (el: HTMLElement) => {
    const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(max, top - padding - margin));
  };

  const root = document.documentElement;
  const jump = (y: number) => {
    const scroller = document.scrollingElement ?? root;
    scroller.scrollTop = y;
  };

  const slideTo = (el: HTMLElement) => {
    const start = window.scrollY || root.scrollTop;
    const end = destination(el);
    const distance = Math.abs(end - start);
    const current = ++ride;
    if (distance < 2) return;
    const viewports = distance / Math.max(window.innerHeight, 1);
    const duration = Math.min(2400, Math.max(850, viewports * 920));
    const t0 = performance.now();
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);
    root.style.scrollBehavior = 'auto';
    const step = (now: number) => {
      if (current !== ride) return;
      const t = Math.min(1, (now - t0) / duration);
      jump(start + (end - start) * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else root.style.scrollBehavior = '';
    };
    requestAnimationFrame(step);
  };

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest('a');
    if (!link) return;
    const raw = link.getAttribute('href');
    if (!raw || !raw.includes('#')) return;
    const hashAt = raw.indexOf('#');
    const path = raw.slice(0, hashAt);
    const trim = (value: string) => (value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value);
    if (path && trim(path) !== trim(window.location.pathname)) return;
    const id = decodeURIComponent(raw.slice(hashAt + 1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', `#${id}`);
    slideTo(target);
  }, true);
}
