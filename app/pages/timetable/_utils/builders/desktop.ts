import { createTimetableCell, TRACKS, validateTimetableItems } from "./items";
import type {
  TimetableCell,
  TimetableItem,
  TimetableTime,
  TimetableTrack,
} from "~~/server/static-data/types/timetable";

export type DesktopTimetableRow = {
  id: string;
  cells: TimetableCell[];
};

type GridRow = {
  time: TimetableTime;
  cells: (TimetableItem | undefined)[];
};

type Grid = GridRow[];

type CellPlacement = {
  item: TimetableItem | undefined;
  rowIndex: number;
  trackIndex: number;
  colspan: number;
  rowspan: number;
};

type PlacementRow = {
  time: TimetableTime;
  placements: CellPlacement[];
};

export function createDesktopTimetable(
  sourceItems: readonly TimetableItem[],
): DesktopTimetableRow[] {
  validateTimetableItems(sourceItems);
  const timeBoundaries = [...new Set(sourceItems.flatMap((item) => [item.start, item.end]))].sort();

  const grid = createGrid(sourceItems, timeBoundaries);
  const placementsByRow = createCellPlacements(grid);

  return placementsByRow.map(({ time, placements }) => ({
    id: `row-${time.replace(":", "")}`,
    cells: placements.map(createCell),
  }));
}

function createGrid(
  items: readonly TimetableItem[],
  timeBoundaries: readonly TimetableTime[],
): Grid {
  return timeBoundaries.slice(0, -1).map((time) => ({
    time,
    cells: TRACKS.map((track) => {
      const activeItems = items.filter(
        (item) => item.tracks.includes(track) && item.start <= time && time < item.end,
      );

      return selectItemForSlot(activeItems);
    }),
  }));

  function selectItemForSlot(activeItems: readonly TimetableItem[]): TimetableItem | undefined {
    return (
      activeItems.find((item) => item.type !== "schedule") ??
      activeItems.find((item) => item.type === "schedule")
    );
  }
}

function createCellPlacements(grid: Grid): PlacementRow[] {
  const coveredCells = new Set<string>();

  return grid.map((row, rowIndex) => {
    const placements: CellPlacement[] = [];

    for (const [trackIndex, item] of row.cells.entries()) {
      if (coveredCells.has(createCellKey(rowIndex, trackIndex))) {
        continue;
      }

      const colspan = measureColumnSpan(row, coveredCells, rowIndex, trackIndex, item);
      const rowspan = measureRowSpan(grid, coveredCells, rowIndex, trackIndex, colspan, item);
      const placement = { item, rowIndex, trackIndex, colspan, rowspan };

      markPlacementAsCovered(coveredCells, placement);
      placements.push(placement);
    }

    return { time: row.time, placements };
  });

  function measureColumnSpan(
    row: GridRow,
    coveredCells: ReadonlySet<string>,
    rowIndex: number,
    trackIndex: number,
    item: TimetableItem | undefined,
  ): number {
    if (!item) {
      return 1;
    }

    let colspan = 1;
    while (
      trackIndex + colspan < row.cells.length &&
      !coveredCells.has(createCellKey(rowIndex, trackIndex + colspan)) &&
      row.cells[trackIndex + colspan] === item
    ) {
      colspan += 1;
    }

    return colspan;
  }

  function measureRowSpan(
    grid: Grid,
    coveredCells: ReadonlySet<string>,
    rowIndex: number,
    trackIndex: number,
    colspan: number,
    item: TimetableItem | undefined,
  ): number {
    let rowspan = 1;

    for (const nextRow of grid.slice(rowIndex + 1)) {
      const nextRowIndex = rowIndex + rowspan;
      const continuesThroughRow = Array.from(
        { length: colspan },
        (_, offset) => trackIndex + offset,
      ).every(
        (columnIndex) =>
          !coveredCells.has(createCellKey(nextRowIndex, columnIndex)) &&
          nextRow.cells[columnIndex] === item,
      );

      if (!continuesThroughRow) {
        break;
      }

      rowspan += 1;
    }

    return rowspan;
  }

  function markPlacementAsCovered(coveredCells: Set<string>, placement: CellPlacement): void {
    for (let rowOffset = 0; rowOffset < placement.rowspan; rowOffset += 1) {
      for (let columnOffset = 0; columnOffset < placement.colspan; columnOffset += 1) {
        coveredCells.add(
          createCellKey(placement.rowIndex + rowOffset, placement.trackIndex + columnOffset),
        );
      }
    }
  }

  function createCellKey(rowIndex: number, trackIndex: number): string {
    return `${rowIndex}:${trackIndex}`;
  }
}

function createCell(placement: CellPlacement): TimetableCell {
  const { item, rowIndex, trackIndex, colspan, rowspan } = placement;
  const track = getSourceTrack(trackIndex);
  if (!item) {
    return {
      id: `blank-${rowIndex}-${trackIndex}`,
      type: "schedule",
      heading: "",
      programs: [],
      colspan,
      rowspan,
      track,
      color: "grey",
    };
  }

  return createTimetableCell(item, track, `${item.id}-${rowIndex}-${trackIndex}`, {
    colspan,
    rowspan,
  });

  function getSourceTrack(trackIndex: number): TimetableTrack {
    const track = TRACKS[trackIndex];
    if (!track) {
      throw new Error(`Unknown timetable track index: ${trackIndex}`);
    }

    return track;
  }
}
