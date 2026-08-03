import { onMounted, useState } from "#imports";
import {
  readStoredMyTimetableEnabled,
  readStoredMyTimetableSelection,
  writeStoredMyTimetableEnabled,
  writeStoredMyTimetableSelection,
  type MyTimetableStorage,
  type MyTimetableSelectionId,
} from "~/utils/myTimetable";

export function useMyTimetable() {
  const isEnabled = useState("my-timetable-enabled", () => false);
  const selectedIds = useState<MyTimetableSelectionId[]>("my-timetable-selection-ids", () => []);
  const isStorageLoaded = useState("my-timetable-storage-loaded", () => false);

  onMounted(() => {
    const storage = getBrowserStorage();

    if (!isStorageLoaded.value) {
      isEnabled.value = readStoredMyTimetableEnabled(storage);
      selectedIds.value = readStoredMyTimetableSelection(storage);
      isStorageLoaded.value = true;
    }
  });

  function setEnabled(enabled: boolean) {
    isEnabled.value = enabled;
    writeStoredMyTimetableEnabled(getBrowserStorage(), enabled);
  }

  function setSelectionIds(ids: readonly MyTimetableSelectionId[]) {
    const nextSelection = createCanonicalSelection(ids);
    selectedIds.value = nextSelection;
    writeStoredMyTimetableSelection(getBrowserStorage(), nextSelection);
  }

  function clearSelection() {
    setSelectionIds([]);
  }

  return {
    isEnabled,
    selectedIds,
    isStorageLoaded,
    setEnabled,
    setSelectionIds,
    clearSelection,
  };
}

function createCanonicalSelection(
  ids: readonly MyTimetableSelectionId[],
): MyTimetableSelectionId[] {
  return [...new Set(ids)];
}

function getBrowserStorage(): MyTimetableStorage | undefined {
  if (!import.meta.client) {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
