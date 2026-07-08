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

  configs[cellId(0, 0)] = {
    ...configs[cellId(0, 0)],
    label: "Mission Deck",
    allowCards: false,
    allowDeck: true,
    cardKind: "mission",
    cellRole: "mission-deck",
    deckKind: "mission",
    deckCapacityUnlimited: true,
  };
  configs[cellId(0, 1)] = {
    ...configs[cellId(0, 1)],
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
  configs[cellId(7, 0)] = {
    ...configs[cellId(7, 0)],
    label: "Player 1 Character",
    owner: "player-1",
    cardKind: "character",
    cellRole: "character-card",
    cardCapacity: 1,
  };
  configs[cellId(7, 1)] = {
    ...configs[cellId(7, 1)],
    label: "Character Bench",
    owner: "player-1",
    cardKind: "character",
    cellRole: "character-card",
    cardCapacity: 1,
  };
  configs[cellId(7, 2)] = {
    ...configs[cellId(7, 2)],
    label: "Character Bench",
    owner: "player-1",
    cardKind: "character",
    cellRole: "character-card",
    cardCapacity: 1,
  };
  configs[cellId(7, 3)] = {
    ...configs[cellId(7, 3)],
    label: "Player 1 Loadout",
    owner: "player-1",
    cardKind: "item",
    cellRole: "item-card",
    cardCapacity: 5,
  };
  configs[cellId(4, 0)] = {
    ...configs[cellId(4, 0)],
    label: "Locked",
    locked: true,
    allowCards: false,
    allowDeck: false,
    cardCapacity: 0,
  };

  states[cellId(0, 0)].deckIds = ["mission-deck"];
  states[cellId(0, 1)].deckIds = ["item-deck"];
  states[cellId(2, 3)].cardIds = ["glass-orchard"];
  states[cellId(7, 0)].cardIds = ["sweetpea"];
  states[cellId(7, 1)].cardIds = ["kael-ember"];
  states[cellId(7, 2)].cardIds = ["mira-tide"];

  return { configs, states };
}
