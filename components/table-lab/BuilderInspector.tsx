import type {
  BuilderEditTarget,
  CardEffect,
  CellConfig,
  CellRole,
  LabCard,
  ShuffleRule,
  TableRulesConfig,
} from "./types";
import { MAX_GRID_SIZE, clampGridSize } from "./rules";

type BuilderInspectorProps = {
  builderEditTarget: BuilderEditTarget;
  cols: number;
  rows: number;
  selectedCard: LabCard | null;
  selectedCell: CellConfig | undefined;
  setBuilderEditTarget: (target: BuilderEditTarget) => void;
  setCols: (cols: number) => void;
  setRows: (rows: number) => void;
  setTableRules: (rules: TableRulesConfig) => void;
  tableRules: TableRulesConfig;
  updateSelectedCard: (patch: Partial<LabCard>) => void;
  updateSelectedCardEffect: (effectId: string, patch: Partial<CardEffect>) => void;
  updateSelectedCell: (patch: Partial<CellConfig>) => void;
  assignSelectedCellRole: (role: CellRole) => void;
};

const ruleLabels: Array<{
  key: keyof TableRulesConfig;
  label: string;
  note: string;
}> = [
  {
    key: "turnsEnabled",
    label: "Turns",
    note: "Use player turns and turn order.",
  },
  {
    key: "targetChecksEnabled",
    label: "Targets",
    note: "Cards may compare totals against Range, Surpass, or Precise targets.",
  },
  {
    key: "cardMovementEnabled",
    label: "Moves",
    note: "Cards may move only when board rules allow it.",
  },
  {
    key: "deckActionsEnabled",
    label: "Deck actions",
    note: "Decks may shuffle, draw, reveal, or return cards.",
  },
  {
    key: "duplicateLimitEnabled",
    label: "Duplicate limit",
    note: "The ruleset may reject repeated named cards.",
  },
  {
    key: "hiddenRulesEnabled",
    label: "Hidden rules",
    note: "Face-down cards can hide metadata until revealed.",
  },
];

export function BuilderInspector({
  assignSelectedCellRole,
  builderEditTarget,
  cols,
  rows,
  selectedCard,
  selectedCell,
  setBuilderEditTarget,
  setCols,
  setRows,
  setTableRules,
  tableRules,
  updateSelectedCard,
  updateSelectedCardEffect,
  updateSelectedCell,
}: BuilderInspectorProps) {
  function updateRule(key: keyof TableRulesConfig, value: boolean) {
    setTableRules({ ...tableRules, [key]: value });
  }

  return (
    <>
      <section>
        <h2>Builder workspace</h2>
        <div className="table-lab-submode" role="group" aria-label="Builder edit target">
          <button
            aria-pressed={builderEditTarget === "table"}
            onClick={() => setBuilderEditTarget("table")}
            type="button"
          >
            Table
          </button>
          <button
            aria-pressed={builderEditTarget === "card"}
            onClick={() => setBuilderEditTarget("card")}
            type="button"
          >
            Card
          </button>
        </div>
      </section>

      {builderEditTarget === "table" ? (
        <>
          <section>
            <h2>Table shape</h2>
            <div className="table-lab-field-row">
              <label>
                Rows
                <input
                  max={MAX_GRID_SIZE}
                  min="1"
                  type="number"
                  value={rows}
                  onChange={(event) => setRows(clampGridSize(Number(event.target.value)))}
                />
              </label>
              <label>
                Columns
                <input
                  max={MAX_GRID_SIZE}
                  min="1"
                  type="number"
                  value={cols}
                  onChange={(event) => setCols(clampGridSize(Number(event.target.value)))}
                />
              </label>
            </div>
          </section>

          <section>
            <h2>Selected cell</h2>
            {selectedCell ? (
              <>
                <label>
                  Label
                  <input
                    type="text"
                    value={selectedCell.label}
                    onChange={(event) => updateSelectedCell({ label: event.target.value })}
                  />
                </label>
                <div className="table-lab-check-grid">
                  <label>
                    <input
                      checked={selectedCell.locked}
                      type="checkbox"
                      onChange={(event) => updateSelectedCell({ locked: event.target.checked })}
                    />
                    Locked
                  </label>
                  <label>
                    <input
                      checked={selectedCell.deckCapacityUnlimited}
                      disabled={!selectedCell.allowDeck}
                      type="checkbox"
                      onChange={(event) =>
                        updateSelectedCell({ deckCapacityUnlimited: event.target.checked })
                      }
                    />
                    Unlimited deck
                  </label>
                </div>
                <label>
                  Cell type
                  <select
                    value={selectedCell.cellRole}
                    onChange={(event) => assignSelectedCellRole(event.target.value as CellRole)}
                  >
                    <option value="mission-deck">Mission Deck</option>
                    <option value="mission-card">Mission Card</option>
                    <option value="item-deck">Item Deck</option>
                    <option value="item-card">Item Card</option>
                    <option value="character-card">Character Card</option>
                    <option value="discard-pile">Discard Pile / Graveyard</option>
                  </select>
                </label>
                {selectedCell.cellRole === "discard-pile" ? (
                  <label>
                    Shuffle rule
                    <select
                      value={selectedCell.discardShuffleRule}
                      onChange={(event) =>
                        updateSelectedCell({ discardShuffleRule: event.target.value as ShuffleRule })
                      }
                    >
                      <option value="none">No shuffle rule</option>
                      <option value="may">May shuffle</option>
                      <option value="must">Must shuffle</option>
                    </select>
                  </label>
                ) : null}
                <div className="table-lab-field-row">
                  <label>
                    Card cap
                    <input
                      disabled={!selectedCell.allowCards}
                      min="0"
                      type="number"
                      value={selectedCell.cardCapacity}
                      onChange={(event) =>
                        updateSelectedCell({ cardCapacity: Math.max(0, Number(event.target.value)) })
                      }
                    />
                  </label>
                  <label>
                    Deck cap
                    <input
                      disabled={!selectedCell.allowDeck || selectedCell.deckCapacityUnlimited}
                      min="0"
                      type="number"
                      value={selectedCell.deckCapacity}
                      onChange={(event) =>
                        updateSelectedCell({ deckCapacity: Math.max(0, Number(event.target.value)) })
                      }
                    />
                  </label>
                </div>
              </>
            ) : (
              <p>Select a cell to edit it.</p>
            )}
          </section>

          <section>
            <h2>Table rules</h2>
            <div className="table-lab-rule-toggle-list">
              {ruleLabels.map((rule) => (
                <label className="table-lab-rule-toggle" key={rule.key}>
                  <input
                    checked={tableRules[rule.key]}
                    type="checkbox"
                    onChange={(event) => updateRule(rule.key, event.target.checked)}
                  />
                  <span>
                    <strong>{rule.label}</strong>
                    <em>{rule.note}</em>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>Card attributes</h2>
            {selectedCard ? (
              <>
                <label>
                  Name
                  <input
                    type="text"
                    value={selectedCard.name}
                    onChange={(event) => updateSelectedCard({ name: event.target.value })}
                  />
                </label>
                <div className="table-lab-field-row">
                  <label>
                    Card type
                    <select
                      value={selectedCard.cardKind}
                      onChange={(event) =>
                        updateSelectedCard({ cardKind: event.target.value as LabCard["cardKind"] })
                      }
                    >
                      <option value="mission">Mission</option>
                      <option value="item">Item</option>
                      <option value="character">Character</option>
                    </select>
                  </label>
                  <label>
                    Visual tone
                    <select
                      value={selectedCard.imageTone}
                      onChange={(event) =>
                        updateSelectedCard({ imageTone: event.target.value as LabCard["imageTone"] })
                      }
                    >
                      <option value="gold">Gold</option>
                      <option value="cyan">Cyan</option>
                      <option value="green">Green</option>
                      <option value="red">Red</option>
                    </select>
                  </label>
                </div>
                <label>
                  Tags
                  <input
                    type="text"
                    value={selectedCard.tags.join(", ")}
                    onChange={(event) =>
                      updateSelectedCard({
                        tags: event.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>
                <label>
                  Front title
                  <input
                    type="text"
                    value={selectedCard.frontTitle}
                    onChange={(event) => updateSelectedCard({ frontTitle: event.target.value })}
                  />
                </label>
                <label>
                  Front text
                  <textarea
                    value={selectedCard.frontText}
                    onChange={(event) => updateSelectedCard({ frontText: event.target.value })}
                  />
                </label>
                <label>
                  Back title
                  <input
                    type="text"
                    value={selectedCard.backTitle}
                    onChange={(event) => updateSelectedCard({ backTitle: event.target.value })}
                  />
                </label>
                <label>
                  Back text
                  <textarea
                    value={selectedCard.backText}
                    onChange={(event) => updateSelectedCard({ backText: event.target.value })}
                  />
                </label>
              </>
            ) : (
              <p>Select a card to edit its attributes.</p>
            )}
          </section>

          <section>
            <h2>Card functions</h2>
            {selectedCard ? (
              <div className="table-lab-effect-list">
                {selectedCard.effects.map((effect) => (
                  <article className={`table-lab-effect table-lab-effect--${effect.mode}`} key={effect.id}>
                    <label>
                      Label
                      <input
                        type="text"
                        value={effect.label}
                        onChange={(event) =>
                          updateSelectedCardEffect(effect.id, { label: event.target.value })
                        }
                      />
                    </label>
                    <div className="table-lab-field-row">
                      <label>
                        Mode
                        <select
                          value={effect.mode}
                          onChange={(event) =>
                            updateSelectedCardEffect(effect.id, {
                              mode: event.target.value as CardEffect["mode"],
                            })
                          }
                        >
                          <option value="info">Info</option>
                          <option value="may">May</option>
                          <option value="must">Must</option>
                        </select>
                      </label>
                      <label>
                        Action
                        <select
                          value={effect.action}
                          onChange={(event) =>
                            updateSelectedCardEffect(effect.id, {
                              action: event.target.value as CardEffect["action"],
                            })
                          }
                        >
                          <option value="modifyStat">Modify stat</option>
                          <option value="shuffleDeck">Shuffle deck</option>
                          <option value="drawCard">Draw card</option>
                          <option value="compareTarget">Compare target</option>
                        </select>
                      </label>
                    </div>
                    <div className="table-lab-field-row">
                      <label>
                        Operation
                        <select
                          value={effect.operation ?? "add"}
                          onChange={(event) =>
                            updateSelectedCardEffect(effect.id, {
                              operation: event.target.value as CardEffect["operation"],
                            })
                          }
                        >
                          <option value="add">Add</option>
                          <option value="subtract">Subtract</option>
                          <option value="choose">Choose +/-</option>
                          <option value="compare">Compare</option>
                        </select>
                      </label>
                      <label>
                        Value
                        <input
                          min="0"
                          type="number"
                          value={effect.value ?? 0}
                          onChange={(event) =>
                            updateSelectedCardEffect(effect.id, {
                              value: Math.max(0, Number(event.target.value)),
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="table-lab-field-row">
                      <label>
                        Stat
                        <input
                          type="text"
                          value={effect.stat ?? ""}
                          onChange={(event) =>
                            updateSelectedCardEffect(effect.id, { stat: event.target.value })
                          }
                        />
                      </label>
                      <label>
                        Timing
                        <input
                          type="text"
                          value={effect.timing}
                          onChange={(event) =>
                            updateSelectedCardEffect(effect.id, { timing: event.target.value })
                          }
                        />
                      </label>
                    </div>
                    <label>
                      Description
                      <textarea
                        value={effect.description}
                        onChange={(event) =>
                          updateSelectedCardEffect(effect.id, { description: event.target.value })
                        }
                      />
                    </label>
                  </article>
                ))}
              </div>
            ) : (
              <p>Select a card to edit its functions.</p>
            )}
          </section>
        </>
      )}
    </>
  );
}
