import { Temporal } from "temporal-polyfill-lite";
import { onBeforeUnmount, onMounted, readonly, ref } from "vue";

const currentInstant = ref<Temporal.Instant | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;
let subscriberCount = 0;

const updateCurrentInstant = () => {
  currentInstant.value = Temporal.Now.instant();
};

const startTimer = (intervalMs: number) => {
  updateCurrentInstant();
  timer = setInterval(updateCurrentInstant, intervalMs);
};

const stopTimer = () => {
  clearInterval(timer);
  timer = undefined;
};

export function useCurrentInstant(intervalMs = 1000) {
  onMounted(() => {
    subscriberCount += 1;

    if (timer === undefined) {
      startTimer(intervalMs);
    }
  });

  onBeforeUnmount(() => {
    subscriberCount = Math.max(0, subscriberCount - 1);

    if (subscriberCount === 0) {
      stopTimer();
    }
  });

  return readonly(currentInstant);
}
