export type TableMode = "builder" | "game";
export type BuilderEditTarget = "table" | "card";
export type BoardLayoutShape = "rectangle" | "square" | "octagon";
export type CardFace = "front" | "back";
export type CardKind = "mission" | "item" | "character";
export type CellCardKind = CardKind | "any";
export type CellRole =
  | "mission-deck"
  | "mission-card"
  | "item-deck"
  | "item-card"
  | "character-card"
  | "discard-pile";
export type DeckKind = "none" | "mission" | "item";
export type EffectMode = "may" | "must" | "info";
export type EffectAction = "modifyStat" | "shuffleDeck" | "drawCard" | "compareTarget";
export type ShuffleRule = "none" | "may" | "must";

export type TableRulesConfig = {
  cardMovementEnabled: boolean;
  deckActionsEnabled: boolean;
  duplicateLimitEnabled: boolean;
  hiddenRulesEnabled: boolean;
  targetChecksEnabled: boolean;
  turnsEnabled: boolean;
};

export type DragPayload =
  | { kind: "card"; id: string }
  | { kind: "deck"; id: string };

export type CardEffect = {
  action: EffectAction;
  description: string;
  id: string;
  label: string;
  mode: EffectMode;
  operation?: "add" | "subtract" | "choose" | "compare";
  stat?: string;
  targetDeckId?: string;
  timing: string;
  value?: number;
};

export type LabCard = {
  backTitle: string;
  backText: string;
  face: CardFace;
  faceUp: boolean;
  frontTitle: string;
  frontText: string;
  cardKind: CardKind;
  id: string;
  imageTone: "gold" | "cyan" | "green" | "red";
  name: string;
  rotation: 0 | 90 | 180 | 270;
  tags: string[];
  type: string;
  effects: CardEffect[];
};

export type LabDeck = {
  cardIds: string[];
  id: string;
  maxCards: number | null;
  name: string;
};

export type CellConfig = {
  allowCards: boolean;
  allowDeck: boolean;
  cardKind: CellCardKind;
  cardCapacity: number;
  cellRole: CellRole;
  deckCapacity: number;
  deckCapacityUnlimited: boolean;
  deckKind: DeckKind;
  discardShuffleRule: ShuffleRule;
  id: string;
  label: string;
  locked: boolean;
  owner: "none" | "player-1" | "shared";
};

export type CellState = {
  cardIds: string[];
  deckIds: string[];
};
