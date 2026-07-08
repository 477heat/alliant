import type {
  CellConfig,
  CellRole,
  CellState,
  DragPayload,
  LabCard,
  CellCardKind,
  DeckKind,
} from "./types";

export const MAX_GRID_SIZE = 8;
export const STORAGE_KEY = "alliant-table-lab-v2";

const deckIdsByKind: Record<Exclude<DeckKind, "none">, string> = {
  mission: "mission-deck",
  item: "item-deck",
};

export function cellId(row: number, col: number) {
  return `${row}-${col}`;
}

export function shuffleIds(ids: string[]) {
  const copy = [...ids];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function clampGridSize(value: number) {
  return Math.min(MAX_GRID_SIZE, Math.max(1, value || 1));
}

export function deckKindLabel(kind: DeckKind) {
  if (kind === "mission") return "Mission";
  if (kind === "item") return "Item";
  return "No";
}

export function cardKindLabel(kind: CellCardKind) {
  if (kind === "mission") return "Mission";
  if (kind === "item") return "Item";
  if (kind === "any") return "Any";
  return "Character";
}

export function defaultLabelForRole(role: CellRole) {
  if (role === "mission-deck") return "Mission Deck";
  if (role === "item-deck") return "Item Deck";
  if (role === "discard-pile") return "Discard Pile";
  return "";
}

export function configForCellRole(role: CellRole): Partial<CellConfig> {
  if (role === "mission-deck") {
    return {
      allowCards: false,
      allowDeck: true,
      cardKind: "mission",
      cellRole: role,
      deckCapacity: 1,
      deckCapacityUnlimited: false,
      deckKind: "mission",
      discardShuffleRule: "none",
    };
  }

  if (role === "item-deck") {
    return {
      allowCards: false,
      allowDeck: true,
      cardKind: "item",
      cellRole: role,
      deckCapacity: 1,
      deckCapacityUnlimited: false,
      deckKind: "item",
      discardShuffleRule: "none",
    };
  }

  if (role === "item-card") {
    return {
      allowCards: true,
      allowDeck: false,
      cardKind: "item",
      cellRole: role,
      deckKind: "none",
      discardShuffleRule: "none",
    };
  }

  if (role === "character-card") {
    return {
      allowCards: true,
      allowDeck: false,
      cardCapacity: 1,
      cardKind: "character",
      cellRole: role,
      deckKind: "none",
      discardShuffleRule: "none",
    };
  }

  if (role === "discard-pile") {
    return {
      allowCards: true,
      allowDeck: false,
      cardCapacity: 99,
      cardKind: "any",
      cellRole: role,
      deckKind: "none",
      discardShuffleRule: "none",
    };
  }

  return {
    allowCards: true,
    allowDeck: false,
    cardKind: "mission",
    cellRole: role,
    deckKind: "none",
    discardShuffleRule: "none",
  };
}

export function inferCardKind(card: Pick<LabCard, "type" | "tags"> & { cardKind?: LabCard["cardKind"] }) {
  if (card.cardKind) return card.cardKind;
  if (card.type === "Mission" || card.tags.includes("mission")) return "mission";
  if (card.type === "Character" || card.tags.includes("character")) return "character";
  return "item";
}

export function inferCellRole(config: CellConfig, stateDeckKind: DeckKind): CellRole {
  const label = config.label.toLowerCase();

  if (label.includes("discard") || label.includes("graveyard")) return "discard-pile";
  if (label.includes("character")) return "character-card";
  if (label.includes("item deck")) return "item-deck";
  if (label.includes("mission deck")) return "mission-deck";
  if (label.includes("load out") || label.includes("loadout")) return "item-card";
  if (config.deckKind === "mission" || stateDeckKind === "mission") return "mission-deck";
  if (config.deckKind === "item" || stateDeckKind === "item") return "item-deck";
  if (config.cardKind === "character") return "character-card";
  if (config.cardKind === "item") return "item-card";
  if (config.cardKind === "any") return "discard-pile";

  return "mission-card";
}

export function deckIdForKind(kind: DeckKind) {
  return kind === "none" ? null : deckIdsByKind[kind];
}

export function deckKindForDeckId(deckId: string): DeckKind {
  if (deckId === "mission-deck") return "mission";
  if (deckId === "item-deck") return "item";
  return "none";
}

export function normalizeCellConfigs(
  configs: Record<string, CellConfig>,
  states?: Record<string, CellState>,
) {
  return Object.fromEntries(
    Object.entries(configs).map(([id, config]) => {
      const stateDeckKind =
        states?.[id]?.deckIds.map(deckKindForDeckId).find((kind) => kind !== "none") ?? "none";
      const cellRole = config.cellRole ?? inferCellRole(config, stateDeckKind);
      const roleDefaults = configForCellRole(cellRole);
      return [
        id,
        {
          ...config,
          ...roleDefaults,
          cellRole,
          label: config.label,
          locked: config.locked,
          owner: config.owner,
          deckCapacityUnlimited:
            (cellRole === "mission-deck" || cellRole === "item-deck") && config.deckCapacityUnlimited,
          discardShuffleRule:
            config.discardShuffleRule === "may" || config.discardShuffleRule === "must"
              ? config.discardShuffleRule
              : "none",
        },
      ];
    }),
  ) as Record<string, CellConfig>;
}

export function normalizeCards(cards: Record<string, LabCard>) {
  return Object.fromEntries(
    Object.entries(cards).map(([id, card]) => [
      id,
      {
        ...card,
        cardKind: inferCardKind(card),
      },
    ]),
  ) as Record<string, LabCard>;
}

export function serializeDragPayload(payload: DragPayload) {
  return JSON.stringify(payload);
}

export function parseDragPayload(value: string): DragPayload | null {
  try {
    const parsed = JSON.parse(value) as DragPayload;
    if (parsed.kind === "card" || parsed.kind === "deck") {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}
