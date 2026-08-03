import { computed, useI18n } from "#imports";
import type { TimetableProgram, TimetableTrack } from "~~/server/static-data/types/timetable";
import type { MyTimetableSelectionId } from "~/utils/myTimetable";

const EMPTY_SELECTION_ID_SET: ReadonlySet<MyTimetableSelectionId> = new Set();

export type MyTimetableSelectableProps = {
  selectable?: boolean;
  selectedMyTimetableIdSet?: ReadonlySet<MyTimetableSelectionId>;
};

type MyTimetableItemSelectionOptions = {
  programs: () => readonly TimetableProgram[];
  selectable: () => boolean;
  selectedIdSet: () => ReadonlySet<MyTimetableSelectionId> | undefined;
  heading: () => string;
  startTime: () => string | undefined;
  endTime: () => string | undefined;
  track: () => TimetableTrack | undefined;
};

export function useMyTimetableItemSelection(options: MyTimetableItemSelectionOptions) {
  const { t } = useI18n();
  const programIds = computed(() => options.programs().map((program) => program.id));
  const canSelect = computed(() => options.selectable() && programIds.value.length > 0);
  const hasProgramChoices = computed(() => options.programs().length > 1);
  const areAllProgramsSelected = computed(() => {
    const selectedIds = options.selectedIdSet() ?? EMPTY_SELECTION_ID_SET;
    return programIds.value.length > 0 && programIds.value.every((id) => selectedIds.has(id));
  });
  const areSomeProgramsSelected = computed(() => {
    const selectedIds = options.selectedIdSet() ?? EMPTY_SELECTION_ID_SET;
    const selectedCount = programIds.value.filter((id) => selectedIds.has(id)).length;
    return selectedCount > 0 && selectedCount < programIds.value.length;
  });
  const timeSlotAccessibleLabel = computed(() =>
    t("myTimetable.includeTimeSlot", {
      heading: options.heading() || t("myTimetable.untitledProgram"),
      startTime: options.startTime() ?? "",
      endTime: options.endTime() ?? "",
      track: getTrackLabel(),
    }),
  );

  function isProgramSelected(programId: string): boolean {
    return (options.selectedIdSet() ?? EMPTY_SELECTION_ID_SET).has(programId);
  }

  function shouldShowProgramRow(program: TimetableProgram): boolean {
    return (
      (canSelect.value && hasProgramChoices.value) ||
      (hasProgramChoices.value && Boolean(program.url)) ||
      Boolean(program.title && program.title !== options.heading())
    );
  }

  function getProgramDisplayTitle(program: TimetableProgram): string {
    return program.title || t("myTimetable.untitledProgram");
  }

  function getProgramAccessibleLabel(program: TimetableProgram): string {
    return t("myTimetable.includeProgram", {
      program: getProgramDisplayTitle(program),
      startTime: options.startTime() ?? "",
      endTime: options.endTime() ?? "",
      track: getTrackLabel(),
    });
  }

  function getTrackLabel(): string {
    const track = options.track();
    return track ? t(`timetable.track.${track}`) : "";
  }

  return {
    programIds,
    canSelect,
    hasProgramChoices,
    areAllProgramsSelected,
    areSomeProgramsSelected,
    timeSlotAccessibleLabel,
    isProgramSelected,
    shouldShowProgramRow,
    getProgramDisplayTitle,
    getProgramAccessibleLabel,
  };
}
