import { onScopeDispose, ref, watch, type Ref } from "vue";

/**
 * Tracks the rendered width of the preview stage element.
 *
 * The stage is styled with `min(100%, <preferred>px)`, so its real width is only
 * known after layout. The WebGL scene needs that number in pixels to map the
 * rope simulation onto the stage, hence the observer.
 *
 * On the server (and before the element is mounted) the returned ref stays `0`,
 * which callers treat as "not measured yet" and fall back to the preferred
 * width.
 *
 * @param stageRef Template ref pointing at the stage element.
 * @returns A ref holding the observed width in pixels, or `0` when unmeasured.
 */
export function useStageWidthObserver(stageRef: Ref<HTMLElement | null>): Ref<number> {
  const observedStageWidth = ref(0);
  let resizeObserver: ResizeObserver | null = null;

  const disconnect = () => {
    resizeObserver?.disconnect();
    resizeObserver = null;
  };

  watch(
    stageRef,
    (stage) => {
      disconnect();
      observedStageWidth.value = 0;
      if (!import.meta.client || !stage) return;

      resizeObserver = new ResizeObserver(([entry]) => {
        const width = entry?.contentRect.width ?? 0;
        // Sub-pixel jitter would otherwise rebuild the card mesh every frame.
        if (width <= 0 || Math.abs(width - observedStageWidth.value) < 0.5) return;
        observedStageWidth.value = width;
      });
      resizeObserver.observe(stage);
    },
    // `post` so the element is already laid out when the observer attaches.
    { flush: "post" },
  );

  onScopeDispose(disconnect);

  return observedStageWidth;
}
