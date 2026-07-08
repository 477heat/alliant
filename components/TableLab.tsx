"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { initialTableRules, makeInitialCells } from "./table-lab/board";
import { BuilderInspector } from "./table-lab/BuilderInspector";
import { initialCards, initialDecks } from "./table-lab/cards";
import { GameInspector } from "./table-lab/GameInspector";
import {
  STORAGE_KEY,
  cardKindLabel,
  cellId,
  clampGridSize,
  configForCellRole,
  deckIdForKind,
  deckKindForDeckId,
  deckKindLabel,
  defaultLabelForRole,
  inferCardKind,
  normalizeCards,
  normalizeCellConfigs,
  parseDragPayload,
  serializeDragPayload,
  shuffleIds,
} from "./table-lab/rules";
import type {
  BuilderEditTarget,
  CardEffect,
  CellConfig,
  CellRole,
  CellState,
  DragPayload,
  LabCard,
  LabDeck,
  TableRulesConfig,
  TableMode,
} from "./table-lab/types";

export function TableLab() {
  const initial = useMemo(() => makeInitialCells(), []);
  const [mode, setMode] = useState<TableMode>("builder");
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [builderEditTarget, setBuilderEditTarget] = useState<BuilderEditTarget>("table");
  const [tableRules, setTableRules] = useState<TableRulesConfig>(initialTableRules);
  const [cards, setCards] = useState<Record<string, LabCard>>(initialCards);
  const [decks, setDecks] = useState<Record<string, LabDeck>>(initialDecks);
  const [cellConfigs, setCellConfigs] = useState(initial.configs);
  const [cellStates, setCellStates] = useState(initial.states);
  const [selectedCellId, setSelectedCellId] = useState(cellId(2, 3));
  const [selectedCardId, setSelectedCardId] = useState("glass-orchard");
  const [log, setLog] = useState<string[]>([
    "Table Lab loaded with Quantum Tunnel as a sample preset.",
  ]);
  const storageLoadedRef = useRef(false);

  const selectedCard = selectedCardId ? cards[selectedCardId] : null;
  const selectedCell = cellConfigs[selectedCellId];
  const characterCards = useMemo(
    () => Object.values(cards).filter((card) => inferCardKind(card) === "character"),
    [cards],
  );

  const visibleCellIds = useMemo(() => {
    const ids: string[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        ids.push(cellId(row, col));
      }
    }
    return ids;
  }, [cols, rows]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      storageLoadedRef.current = true;
      return;
    }

    try {
      const parsed = JSON.parse(stored) as {
        cards?: Record<string, LabCard>;
        cellConfigs?: Record<string, CellConfig>;
        cellStates?: Record<string, CellState>;
        cols?: number;
        decks?: Record<string, LabDeck>;
        builderEditTarget?: BuilderEditTarget;
        log?: string[];
        mode?: TableMode;
        rows?: number;
        selectedCardId?: string;
        selectedCellId?: string;
        tableRules?: TableRulesConfig;
      };

      window.queueMicrotask(() => {
        if (parsed.cards) setCards(normalizeCards(parsed.cards));
        if (parsed.decks) setDecks(parsed.decks);
        if (parsed.cellConfigs) setCellConfigs(normalizeCellConfigs(parsed.cellConfigs, parsed.cellStates));
        if (parsed.cellStates) setCellStates(parsed.cellStates);
        if (parsed.builderEditTarget === "table" || parsed.builderEditTarget === "card") {
          setBuilderEditTarget(parsed.builderEditTarget);
        }
        if (parsed.rows) setRows(clampGridSize(parsed.rows));
        if (parsed.cols) setCols(clampGridSize(parsed.cols));
        if (parsed.mode === "builder" || parsed.mode === "game") setMode(parsed.mode);
        if (parsed.selectedCardId) setSelectedCardId(parsed.selectedCardId);
        if (parsed.selectedCellId) setSelectedCellId(parsed.selectedCellId);
        if (parsed.tableRules) setTableRules({ ...initialTableRules, ...parsed.tableRules });
        if (parsed.log) setLog(parsed.log.slice(0, 8));
        storageLoadedRef.current = true;
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      storageLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!storageLoadedRef.current) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cards,
        cellConfigs,
        cellStates,
        cols,
        decks,
        builderEditTarget,
        log,
        mode,
        rows,
        selectedCardId,
        selectedCellId,
        tableRules,
      }),
    );
  }, [
    builderEditTarget,
    cards,
    cellConfigs,
    cellStates,
    cols,
    decks,
    log,
    mode,
    rows,
    selectedCardId,
    selectedCellId,
    tableRules,
  ]);

  function addLog(message: string) {
    setLog((current) => [message, ...current].slice(0, 8));
  }

  function updateSelectedCell(patch: Partial<CellConfig>) {
    if (!selectedCell) return;
    setCellConfigs((current) => ({
      ...current,
      [selectedCell.id]: { ...selectedCell, ...patch },
    }));
  }

  function updateSelectedCard(patch: Partial<LabCard>) {
    if (!selectedCard) return;
    setCards((current) => ({
      ...current,
      [selectedCard.id]: { ...current[selectedCard.id], ...patch },
    }));
  }

  function updateSelectedCardEffect(effectId: string, patch: Partial<CardEffect>) {
    if (!selectedCard) return;
    setCards((current) => ({
      ...current,
      [selectedCard.id]: {
        ...current[selectedCard.id],
        effects: current[selectedCard.id].effects.map((effect) =>
          effect.id === effectId ? { ...effect, ...patch } : effect,
        ),
      },
    }));
  }

  function assignSelectedCellRole(role: CellRole) {
    if (!selectedCell) return;

    const roleDefaults = configForCellRole(role);
    const deckId = deckIdForKind(roleDefaults.deckKind ?? "none");
    const defaultLabel = defaultLabelForRole(role);
    const shouldReplaceLabel =
      !selectedCell.label ||
      selectedCell.label === defaultLabelForRole(selectedCell.cellRole) ||
      selectedCell.label === "Mission Deck" ||
      selectedCell.label === "Item Deck" ||
      selectedCell.label === "Discard Pile";

    setCellConfigs((current) => ({
      ...current,
      [selectedCell.id]: {
        ...current[selectedCell.id],
        ...roleDefaults,
        label: shouldReplaceLabel ? defaultLabel : current[selectedCell.id].label,
      },
    }));

    setCellStates((current) => {
      const nextStates = { ...current };

      Object.entries(nextStates).forEach(([id, state]) => {
        nextStates[id] = {
          ...state,
          deckIds: deckId
            ? state.deckIds.filter((currentId) => currentId !== deckId)
            : state.deckIds,
        };
      });

      nextStates[selectedCell.id] = {
        ...nextStates[selectedCell.id],
        deckIds: deckId ? [deckId] : [],
        cardIds: deckId
          ? []
          : nextStates[selectedCell.id].cardIds.filter((cardId) => {
              const card = cards[cardId];
              if (!card) return false;
              const targetKind = roleDefaults.cardKind ?? "mission";
              return targetKind === "any" || inferCardKind(card) === targetKind;
            }),
      };

      return nextStates;
    });
  }

  function removeCardFromCells(cardId: string, currentStates = cellStates) {
    const nextStates = { ...currentStates };
    Object.entries(nextStates).forEach(([id, state]) => {
      if (state.cardIds.includes(cardId)) {
        nextStates[id] = {
          ...state,
          cardIds: state.cardIds.filter((currentId) => currentId !== cardId),
        };
      }
    });
    return nextStates;
  }

  function removeDeckFromCells(deckId: string, currentStates = cellStates) {
    const nextStates = { ...currentStates };
    Object.entries(nextStates).forEach(([id, state]) => {
      if (state.deckIds.includes(deckId)) {
        nextStates[id] = {
          ...state,
          deckIds: state.deckIds.filter((currentId) => currentId !== deckId),
        };
      }
    });
    return nextStates;
  }

  function findCardCellId(cardId: string, currentStates = cellStates) {
    return Object.entries(currentStates).find(([, state]) => state.cardIds.includes(cardId))?.[0] ?? null;
  }

  function cellIsVisible(id: string) {
    return visibleCellIds.includes(id);
  }

  function expandGridToCell(id: string) {
    const [row, col] = id.split("-").map(Number);
    if (Number.isFinite(row)) setRows((current) => clampGridSize(Math.max(current, row + 1)));
    if (Number.isFinite(col)) setCols((current) => clampGridSize(Math.max(current, col + 1)));
  }

  function describeCardLocation(cardId: string) {
    const locationId = findCardCellId(cardId);
    if (!locationId) return "Not on table";

    const config = cellConfigs[locationId];
    const name = config?.label || locationId;
    return cellIsVisible(locationId) ? name : `${name} / hidden`;
  }

  function focusCharacterCard(cardId: string) {
    const locationId = findCardCellId(cardId);
    setSelectedCardId(cardId);

    if (!locationId) {
      sendCharacterToBench(cardId);
      return;
    }

    expandGridToCell(locationId);
    setSelectedCellId(locationId);
    addLog(`${cards[cardId]?.name ?? "Character"} located at ${cellConfigs[locationId]?.label || locationId}.`);
  }

  function sendCharacterToBench(cardId: string) {
    const benchCellIds = [cellId(7, 0), cellId(7, 1), cellId(7, 2)];
    const currentLocationId = findCardCellId(cardId);
    const openBenchId =
      benchCellIds.find((id) => cellStates[id]?.cardIds.includes(cardId)) ??
      benchCellIds.find((id) => (cellStates[id]?.cardIds.length ?? 0) === 0) ??
      currentLocationId ??
      benchCellIds[0];

    if (!openBenchId) return;

    setCellConfigs((current) => {
      const next = { ...current };
      benchCellIds.forEach((id, index) => {
        next[id] = {
          ...next[id],
          label: index === 0 ? "Player 1 Character" : "Character Bench",
          owner: "player-1",
          locked: false,
          allowCards: true,
          allowDeck: false,
          cardKind: "character",
          cellRole: "character-card",
          cardCapacity: 1,
          deckKind: "none",
        };
      });
      return next;
    });

    setCellStates((current) => {
      const removed = removeCardFromCells(cardId, current);
      return {
        ...removed,
        [openBenchId]: {
          ...removed[openBenchId],
          cardIds: [cardId],
        },
      };
    });

    expandGridToCell(openBenchId);
    setSelectedCellId(openBenchId);
    setSelectedCardId(cardId);
    addLog(`${cards[cardId]?.name ?? "Character"} moved to the character bench.`);
  }

  function canPlaceCard(cardId: string, targetCellId: string) {
    const config = cellConfigs[targetCellId];
    const state = cellStates[targetCellId];
    const card = cards[cardId];
    return Boolean(
      config &&
        state &&
        card &&
        (mode === "builder" || tableRules.cardMovementEnabled) &&
        !config.locked &&
        config.allowCards &&
        (config.cardKind === "any" || inferCardKind(card) === config.cardKind) &&
        state.cardIds.length < config.cardCapacity,
    );
  }

  function canPlaceDeck(deckId: string, targetCellId: string) {
    const config = cellConfigs[targetCellId];
    const state = cellStates[targetCellId];
    const capacity = config?.deckCapacityUnlimited ? Number.POSITIVE_INFINITY : config?.deckCapacity ?? 0;
    const targetKind = deckKindForDeckId(deckId);
    return Boolean(
      config &&
        state &&
        (mode === "builder" || tableRules.cardMovementEnabled) &&
        !config.locked &&
        config.allowDeck &&
        config.deckKind === targetKind &&
        state.deckIds.length < capacity,
    );
  }

  function placeCard(cardId: string, targetCellId: string) {
    if (!canPlaceCard(cardId, targetCellId)) {
      addLog("Move blocked: that card type does not match the cell.");
      return;
    }

    setCellStates((current) => {
      const removed = removeCardFromCells(cardId, current);
      return {
        ...removed,
        [targetCellId]: {
          ...removed[targetCellId],
          cardIds: [...removed[targetCellId].cardIds, cardId],
        },
      };
    });
    setSelectedCardId(cardId);
    setSelectedCellId(targetCellId);
  }

  function placeDeck(deckId: string, targetCellId: string) {
    if (!canPlaceDeck(deckId, targetCellId)) {
      addLog("Move blocked: that deck type does not match the cell.");
      return;
    }

    setCellStates((current) => {
      const removed = removeDeckFromCells(deckId, current);
      return {
        ...removed,
        [targetCellId]: {
          ...removed[targetCellId],
          deckIds: [...removed[targetCellId].deckIds, deckId],
        },
      };
    });
    setSelectedCellId(targetCellId);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetCellId: string) {
    event.preventDefault();
    const payload = parseDragPayload(event.dataTransfer.getData("application/json"));
    if (!payload) return;

    if (payload.kind === "card") {
      placeCard(payload.id, targetCellId);
      return;
    }

    placeDeck(payload.id, targetCellId);
  }

  function startDrag(event: DragEvent<HTMLElement>, payload: DragPayload) {
    event.dataTransfer.setData("application/json", serializeDragPayload(payload));
    event.dataTransfer.effectAllowed = "move";
  }

  function flipCard(cardId: string) {
    setCards((current) => ({
      ...current,
      [cardId]: {
        ...current[cardId],
        face: current[cardId].face === "front" ? "back" : "front",
        faceUp: true,
      },
    }));
  }

  function turnCard(cardId: string) {
    setCards((current) => ({
      ...current,
      [cardId]: {
        ...current[cardId],
        rotation: ((current[cardId].rotation + 90) % 360) as LabCard["rotation"],
      },
    }));
  }

  function toggleFaceUp(cardId: string) {
    setCards((current) => ({
      ...current,
      [cardId]: {
        ...current[cardId],
        faceUp: !current[cardId].faceUp,
      },
    }));
  }

  function shuffleDeck(deckId: string) {
    const deck = decks[deckId];
    if (!deck) return;
    if (mode === "game" && !tableRules.deckActionsEnabled) {
      addLog("Shuffle blocked: deck actions are disabled by the table rules.");
      return;
    }

    setDecks((current) => ({
      ...current,
      [deckId]: { ...deck, cardIds: shuffleIds(deck.cardIds) },
    }));
    addLog(`${deck.name} shuffled.`);
  }

  function drawFromDeck(deckId: string, targetCellId: string) {
    const deck = decks[deckId];
    if (mode === "game" && !tableRules.deckActionsEnabled) {
      addLog("Draw blocked: deck actions are disabled by the table rules.");
      return;
    }
    if (!deck || deck.cardIds.length === 0) {
      addLog("Draw blocked: deck is empty.");
      return;
    }

    const [drawnCardId, ...remaining] = deck.cardIds;

    if (!canPlaceCard(drawnCardId, targetCellId)) {
      addLog("Draw blocked: this cell does not accept that card type.");
      return;
    }
    setDecks((current) => ({
      ...current,
      [deckId]: { ...deck, cardIds: remaining },
    }));
    setCellStates((current) => ({
      ...current,
      [targetCellId]: {
        ...current[targetCellId],
        cardIds: [...current[targetCellId].cardIds, drawnCardId],
      },
    }));
    setSelectedCardId(drawnCardId);
    setSelectedCellId(targetCellId);
    addLog(`${deck.name} drew ${cards[drawnCardId]?.name ?? "a card"}.`);
  }

  function applyEffect(effect: CardEffect, choice?: string) {
    if (!selectedCard) return;

    if (effect.action === "shuffleDeck" && effect.targetDeckId) {
      shuffleDeck(effect.targetDeckId);
      addLog(`${selectedCard.name}: ${effect.label} used.`);
      return;
    }

    if (choice === "skip") {
      addLog(`${selectedCard.name}: skipped ${effect.label}.`);
      return;
    }

    const operation =
      choice === "minus"
        ? "-"
        : choice === "plus" || effect.operation === "add"
          ? "+"
          : effect.operation === "subtract"
            ? "-"
            : "";
    const value = effect.value ? `${operation}${effect.value}` : "";
    addLog(`${selectedCard.name}: ${effect.label} ${value} ${effect.stat ?? ""}`.trim());
  }

  function exportSave() {
    const data = JSON.stringify(
      {
        engineVersion: "0.1",
        gameVersion: "table-lab-prototype",
        cards,
        cellConfigs,
        cellStates,
        cols,
        decks,
        builderEditTarget,
        log,
        mode,
        rows,
        tableRules,
      },
      null,
      2,
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "table-lab-save.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importSave(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as {
          cards?: Record<string, LabCard>;
          cellConfigs?: Record<string, CellConfig>;
          cellStates?: Record<string, CellState>;
          cols?: number;
          decks?: Record<string, LabDeck>;
          builderEditTarget?: BuilderEditTarget;
          log?: string[];
          mode?: TableMode;
          rows?: number;
          tableRules?: TableRulesConfig;
        };
        if (parsed.cards) setCards(normalizeCards(parsed.cards));
        if (parsed.decks) setDecks(parsed.decks);
        if (parsed.cellConfigs) setCellConfigs(normalizeCellConfigs(parsed.cellConfigs, parsed.cellStates));
        if (parsed.cellStates) setCellStates(parsed.cellStates);
        if (parsed.builderEditTarget === "table" || parsed.builderEditTarget === "card") {
          setBuilderEditTarget(parsed.builderEditTarget);
        }
        if (parsed.rows) setRows(clampGridSize(parsed.rows));
        if (parsed.cols) setCols(clampGridSize(parsed.cols));
        if (parsed.mode === "builder" || parsed.mode === "game") setMode(parsed.mode);
        if (parsed.tableRules) setTableRules({ ...initialTableRules, ...parsed.tableRules });
        if (parsed.log) setLog(parsed.log);
        addLog("Imported table save.");
      } catch {
        addLog("Import failed: file was not a valid Table Lab save.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function resetTable() {
    const fresh = makeInitialCells();
    setCards(initialCards);
    setDecks(initialDecks);
    setCellConfigs(fresh.configs);
    setCellStates(fresh.states);
    setRows(8);
    setCols(8);
    setBuilderEditTarget("table");
    setTableRules(initialTableRules);
    setMode("builder");
    setSelectedCellId(cellId(2, 3));
    setSelectedCardId("glass-orchard");
    setLog(["Table Lab reset to the sample preset."]);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <section className="table-lab-shell" aria-label="Modular tabletop test lab">
      <div className="table-lab-header">
        <div>
          <p className="eyebrow">Table Lab / local prototype</p>
          <h1>Build the table. Test the card.</h1>
        </div>
        <div className="table-lab-mode" role="group" aria-label="Table mode">
          <button
            aria-pressed={mode === "builder"}
            onClick={() => setMode("builder")}
            type="button"
          >
            Builder
          </button>
          <button
            aria-pressed={mode === "game"}
            onClick={() => setMode("game")}
            type="button"
          >
            Game
          </button>
        </div>
      </div>

      <div className="table-lab-layout">
        <aside className="table-lab-panel table-lab-panel--left">
          <section>
            <h2>Board</h2>
            <p className="table-lab-note">
              {mode === "builder"
                ? "Use the right workspace to edit Table or Card settings."
                : "Table size is locked during Game Mode."}
            </p>
            <div className="table-lab-legend" aria-label="Cell state legend">
              <span><i className="table-lab-swatch table-lab-swatch--locked" />Locked</span>
              <span><i className="table-lab-swatch table-lab-swatch--empty" />Empty</span>
              <span><i className="table-lab-swatch table-lab-swatch--active" />Active</span>
              <span><i className="table-lab-swatch table-lab-swatch--deck-empty" />Deck empty</span>
              <span><i className="table-lab-swatch table-lab-swatch--deck-used" />Deck used</span>
              <span><i className="table-lab-swatch table-lab-swatch--role-mission-card" />Mission</span>
              <span><i className="table-lab-swatch table-lab-swatch--role-item-card" />Item</span>
              <span><i className="table-lab-swatch table-lab-swatch--role-character-card" />Character</span>
              <span><i className="table-lab-swatch table-lab-swatch--role-discard-pile" />Discard</span>
            </div>
          </section>

          <section>
            <h2>Character finder</h2>
            <div className="table-lab-card-finder">
              {characterCards.map((card) => (
                <article key={card.id}>
                  <div>
                    <strong>{card.name}</strong>
                    <span>{describeCardLocation(card.id)}</span>
                  </div>
                  <div>
                    <button type="button" onClick={() => focusCharacterCard(card.id)}>
                      Find
                    </button>
                    <button type="button" onClick={() => sendCharacterToBench(card.id)}>
                      Bench
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2>Save</h2>
            <button className="table-lab-button" type="button" onClick={exportSave}>
              Export file
            </button>
            <label className="table-lab-file">
              Import file
              <input accept="application/json" type="file" onChange={importSave} />
            </label>
            <button className="table-lab-button table-lab-button--ghost" type="button" onClick={resetTable}>
              Reset sample
            </button>
          </section>
        </aside>

        <div className="table-lab-table-wrap">
          <div className="table-lab-camera">
            <div
              className="table-lab-grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {visibleCellIds.map((id) => {
                const config = cellConfigs[id];
                const state = cellStates[id];
                const isSelected = id === selectedCellId;
                const hasContents = state.cardIds.length > 0 || state.deckIds.length > 0;
                const isDeckCell = config.allowDeck || config.deckKind !== "none";
                const status = config.locked
                  ? "locked"
                  : isDeckCell
                    ? hasContents
                      ? "deck-used"
                      : "deck-empty"
                    : hasContents
                      ? "active"
                      : "empty";
                return (
                  <div
                    className={`table-lab-cell table-lab-cell--${status} table-lab-cell--role-${config.cellRole}${isSelected ? " table-lab-cell--selected" : ""}`}
                    key={id}
                    onClick={() => setSelectedCellId(id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, id)}
                  >
                    <div className="table-lab-cell__label">
                      <span>{config.label || id}</span>
                      <em>
                        {config.deckKind !== "none"
                          ? `${deckKindLabel(config.deckKind)} deck`
                          : config.owner === "player-1"
                            ? "P1"
                            : config.allowDeck
                              ? "Deck"
                              : ""}
                      </em>
                    </div>
                    <div className="table-lab-cell__contents">
                      {state.deckIds.map((deckId) => {
                        const deck = decks[deckId];
                        return (
                          <div
                            className="table-lab-deck"
                            draggable
                            key={deckId}
                            onDragStart={(event) => startDrag(event, { kind: "deck", id: deckId })}
                          >
                            <strong>{deck.name}</strong>
                            <span>{deck.cardIds.length} cards</span>
                            <div className="table-lab-deck__actions">
                              <button
                                disabled={mode === "game" && !tableRules.deckActionsEnabled}
                                type="button"
                                onClick={() => shuffleDeck(deckId)}
                              >
                                Shuffle
                              </button>
                              <button
                                disabled={mode === "game" && !tableRules.deckActionsEnabled}
                                type="button"
                                onClick={() => drawFromDeck(deckId, id)}
                              >
                                Draw
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {state.cardIds.map((cardId) => {
                        const card = cards[cardId];
                        const title = card.face === "front" ? card.frontTitle : card.backTitle;
                        return (
                          <button
                            className={`table-lab-card table-lab-card--${card.imageTone}`}
                            draggable
                            key={cardId}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedCardId(cardId);
                              setSelectedCellId(id);
                            }}
                            onDragStart={(event) => startDrag(event, { kind: "card", id: cardId })}
                            onPointerDown={(event) => {
                              event.stopPropagation();
                              setSelectedCardId(cardId);
                              setSelectedCellId(id);
                            }}
                            style={{ transform: `rotate(${card.rotation}deg)` }}
                            type="button"
                          >
                            {card.faceUp ? (
                              <>
                                <span>{card.type}</span>
                                <strong>{title}</strong>
                                <span>{cardKindLabel(inferCardKind(card))}</span>
                              </>
                            ) : (
                              <strong>Face down</strong>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="table-lab-player-edge">Player 1 side</div>
          </div>
        </div>

        <aside className="table-lab-panel table-lab-inspector">
          {mode === "builder" ? (
            <BuilderInspector
              assignSelectedCellRole={assignSelectedCellRole}
              builderEditTarget={builderEditTarget}
              cols={cols}
              rows={rows}
              selectedCard={selectedCard}
              selectedCell={selectedCell}
              setBuilderEditTarget={setBuilderEditTarget}
              setCols={setCols}
              setRows={setRows}
              setTableRules={setTableRules}
              tableRules={tableRules}
              updateSelectedCard={updateSelectedCard}
              updateSelectedCardEffect={updateSelectedCardEffect}
              updateSelectedCell={updateSelectedCell}
            />
          ) : (
            <GameInspector
              applyEffect={applyEffect}
              flipCard={flipCard}
              log={log}
              selectedCard={selectedCard}
              toggleFaceUp={toggleFaceUp}
              turnCard={turnCard}
            />
          )}
        </aside>
      </div>
    </section>
  );
}
