import type { CellConfig, CellState, TableRulesConfig } from "./types";
import { cellId, MAX_GRID_SIZE } from "./rules";

export const initialTableRules: TableRulesConfig = {
  cardMovementEnabled: true,
  deckActionsEnabled: true,
  duplicateLimitEnabled: true,
  hiddenRulesEnabled: true,
  targetChecksEnabled: true,
  turnsEnabled: true,
};

export function makeInitialCells() {
  const configs: Record<string, CellConfig> = {};
  const states: Record<string, CellState> = {};

  for (let row = 0; row < MAX_GRID_SIZE; row += 1) {
    for (let col = 0; col < MAX_GRID_SIZE; col += 1) {
      const id = cellId(row, col);
      configs[id] = {
        id,
        label: "",
        owner: row >= 6 ? "player-1" : "shared",
        locked: false,
        allowCards: true,
        allowDeck: false,
        cardKind: row >= 6 ? "item" : "mission",
        cardCapacity: row >= 6 ? 5 : 2,
        cellRole: row >= 6 ? "item-card" : "mission-card",
        deckCapacity: 1,
        deckCapacityUnlimited: false,
        deckKind: "none",
        discardShuffleRule: "none",
      };
      states[id] = { cardIds: [], deckIds: [] };
    }
  }

  configs[cellId(0, 2)] = {
    ...configs[cellId(0, 2)],
    label: "Mission Deck",
    allowCards: false,
    allowDeck: true,
    cardKind: "mission",
    cellRole: "mission-deck",
    deckKind: "mission",
    deckCapacityUnlimited: true,
  };
  configs[cellId(0, 3)] = {
    ...configs[cellId(0, 3)],
    label: "Item Deck",
    allowCards: false,
    allowDeck: true,
    cardKind: "item",
    cellRole: "item-deck",
    deckKind: "item",
    deckCapacityUnlimited: true,
  };
  configs[cellId(2, 3)] = {
    ...configs[cellId(2, 3)],
    label: "Active Mission",
    cardKind: "mission",
    cellRole: "mission-card",
    cardCapacity: 3,
  };
  configs[cellId(7, 2)] = {
    ...configs[cellId(7, 2)],
    label: "Player 1 Character",
    owner: "player-1",
    cardKind: "character",
    cellRole: "character-card",
    cardCapacity: 1,
  };
  configs[cellId(7, 3)] = {
    ...configs[cellId(7, 3)],
    label: "Character Bench",
    owner: "player-1",
    cardKind: "character",
    cellRole: "character-card",
    cardCapacity: 1,
  };
  configs[cellId(7, 4)] = {
    ...configs[cellId(7, 4)],
    label: "Character Bench",
    owner: "player-1",
    cardKind: "character",
    cellRole: "character-card",
    cardCapacity: 1,
  };
  configs[cellId(7, 5)] = {
    ...configs[cellId(7, 5)],
    label: "Player 1 Loadout",
    owner: "player-1",
    cardKind: "item",
    cellRole: "item-card",
    cardCapacity: 5,
  };
  configs[cellId(4, 0)] = {
    ...configs[cellId(4, 0)],
    label: "Unused",
    locked: true,
    allowCards: false,
    allowDeck: false,
    cardCapacity: 0,
  };

  states[cellId(0, 2)].deckIds = ["mission-deck"];
  states[cellId(0, 3)].deckIds = ["item-deck"];
  states[cellId(2, 3)].cardIds = ["glass-orchard"];
  states[cellId(7, 2)].cardIds = ["sweetpea"];
  states[cellId(7, 3)].cardIds = ["kael-ember"];
  states[cellId(7, 4)].cardIds = ["mira-tide"];

  return { configs, states };
}
