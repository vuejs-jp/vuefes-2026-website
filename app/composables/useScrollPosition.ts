import { nextTick, onBeforeRouteLeave, onBeforeUnmount, onMounted, useState } from "#imports";

export function useScrollPosition(key: string) {
  const scrollPosition = useState<number>(key, () => 0);

  onBeforeRouteLeave(() => {
    scrollPosition.value = window.scrollY;
  });

  onMounted(() => {
    if (scrollPosition.value > 0) {
      void nextTick(() => {
        window.scrollTo({
          top: scrollPosition.value,
          behavior: "instant",
        });
      });
    }
  });

  if (import.meta.client) {
    function savePosition() {
      scrollPosition.value = window.scrollY;
    }

    window.addEventListener("pagehide", savePosition);

    onBeforeUnmount(() => {
      window.removeEventListener("pagehide", savePosition);
    });
  }
}
