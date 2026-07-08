"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type PieceShape = "rectangle" | "pentagon" | "pentagonMirror";

type BoardPiece = {
  id: string;
  label: string;
  shape: PieceShape;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
};

type DraftPiece = {
  label: string;
  shape: PieceShape;
  width: number;
  height: number;
};

type DragMode = "move" | "rotate" | null;

const ROOM = {
  top: 97,
  left: 101,
  right: 162,
  lowerSpan: 171,
  door: 41,
} as const;

const PIECE_ANGLE = 19.7;

const BOARD = {
  width: 400,
  height: 400,
} as const;

const STORAGE_KEY = "alliant-board-pieces-v2";

const initialPieces: BoardPiece[] = [
  {
    id: "piece-1",
    label: "Five-sided piece",
    shape: "pentagon",
    width: 34,
    height: 28,
    x: 48,
    y: 54,
    rotation: PIECE_ANGLE,
    zIndex: 2,
  },
  {
    id: "piece-3",
    label: "Flipped five-sided piece",
    shape: "pentagonMirror",
    width: 34,
    height: 28,
    x: 68,
    y: 58,
    rotation: PIECE_ANGLE,
    zIndex: 3,
  },
  {
    id: "piece-4",
    label: "80 by 56 rectangle",
    shape: "rectangle",
    width: 80,
    height: 56,
    x: 53,
    y: 128,
    rotation: 0,
    zIndex: 4,
  },
  {
    id: "piece-2",
    label: "Sample rectangle",
    shape: "rectangle",
    width: 26,
    height: 16,
    x: 30,
    y: 116,
    rotation: 9,
    zIndex: 1,
  },
];

const defaultDraft: DraftPiece = {
  label: "New piece",
  shape: "rectangle",
  width: 20,
  height: 14,
};

const pieceClipPaths: Record<PieceShape, string> = {
  rectangle: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  pentagon: "polygon(0 10%, 22% 0, 100% 18%, 84% 100%, 0 88%)",
  pentagonMirror: "polygon(100% 10%, 78% 0, 0 18%, 16% 100%, 100% 88%)",
};

function uid() {
  return `piece-${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatInches(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}"`;
}

export function BoardPiecesStudio() {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pieceId: string;
    mode: DragMode;
    offsetX: number;
    offsetY: number;
    startRotation: number;
    pointerAngle: number;
  } | null>(null);

  const [pieces, setPieces] = useState<BoardPiece[]>(initialPieces);
  const [selectedId, setSelectedId] = useState<string>(initialPieces[0]?.id ?? "");
  const [draft, setDraft] = useState<DraftPiece>(defaultDraft);
  const [nextZ, setNextZ] = useState(initialPieces.length + 1);

  const selectedPiece = useMemo(
    () => pieces.find((piece) => piece.id === selectedId) ?? null,
    [pieces, selectedId],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return;
      }

      try {
        const parsed = JSON.parse(stored) as {
          pieces?: BoardPiece[];
          selectedId?: string;
          nextZ?: number;
        };

        if (Array.isArray(parsed.pieces) && parsed.pieces.length > 0) {
          setPieces(parsed.pieces);
          setSelectedId(parsed.selectedId ?? parsed.pieces[0].id);
          setNextZ(typeof parsed.nextZ === "number" ? parsed.nextZ : parsed.pieces.length + 1);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ pieces, selectedId, nextZ }),
    );
  }, [pieces, selectedId, nextZ]);

  const updatePiece = (pieceId: string, patch: Partial<BoardPiece>) => {
    setPieces((current) =>
      current.map((piece) => (piece.id === pieceId ? { ...piece, ...patch } : piece)),
    );
  };

  const bringToFront = (pieceId: string) => {
    setPieces((current) =>
      current.map((piece) =>
        piece.id === pieceId ? { ...piece, zIndex: nextZ } : piece,
      ),
    );
    setNextZ((value) => value + 1);
    setSelectedId(pieceId);
  };

  const pointToBoard = (clientX: number, clientY: number) => {
    const board = boardRef.current;
    if (!board) {
      return null;
    }

    const rect = board.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * BOARD.width;
    const y = ((clientY - rect.top) / rect.height) * BOARD.height;

    return {
      x: clamp(x, 0, BOARD.width),
      y: clamp(y, 0, BOARD.height),
      rect,
    };
  };

  const finishDrag = () => {
    dragStateRef.current = null;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", finishDrag);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const dragState = dragStateRef.current;
    if (!dragState) {
      return;
    }

    const pointer = pointToBoard(event.clientX, event.clientY);
    if (!pointer) {
      return;
    }

    if (dragState.mode === "move") {
      updatePiece(dragState.pieceId, {
        x: clamp(pointer.x - dragState.offsetX, 0, BOARD.width),
        y: clamp(pointer.y - dragState.offsetY, 0, BOARD.height),
      });
      return;
    }

    const piece = pieces.find((current) => current.id === dragState.pieceId);
    if (!piece) {
      return;
    }

    const centerX = piece.x;
    const centerY = piece.y;
    const angle = (Math.atan2(pointer.y - centerY, pointer.x - centerX) * 180) / Math.PI;
    updatePiece(piece.id, {
      rotation: angle + dragState.startRotation - dragState.pointerAngle,
    });
  };

  const startMove = (
    event: ReactPointerEvent<HTMLButtonElement>,
    piece: BoardPiece,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const pointer = pointToBoard(event.clientX, event.clientY);
    if (!pointer) {
      return;
    }

    bringToFront(piece.id);
    dragStateRef.current = {
      pieceId: piece.id,
      mode: "move",
      offsetX: pointer.x - piece.x,
      offsetY: pointer.y - piece.y,
      startRotation: piece.rotation,
      pointerAngle: 0,
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
  };

  const startRotate = (
    event: ReactPointerEvent<HTMLButtonElement>,
    piece: BoardPiece,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const pointer = pointToBoard(event.clientX, event.clientY);
    if (!pointer) {
      return;
    }

    const angle = (Math.atan2(pointer.y - piece.y, pointer.x - piece.x) * 180) / Math.PI;

    bringToFront(piece.id);
    dragStateRef.current = {
      pieceId: piece.id,
      mode: "rotate",
      offsetX: 0,
      offsetY: 0,
      startRotation: piece.rotation,
      pointerAngle: angle,
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
  };

  const addPiece = () => {
    const newPiece: BoardPiece = {
      id: uid(),
      label: draft.label.trim() || "New piece",
      shape: draft.shape,
      width: Math.max(4, draft.width),
      height: Math.max(4, draft.height),
      x: 48,
      y: 82,
      rotation: 0,
      zIndex: nextZ,
    };

    setPieces((current) => [...current, newPiece]);
    setSelectedId(newPiece.id);
    setNextZ((value) => value + 1);
  };

  const resetBoard = () => {
    setPieces(initialPieces);
    setSelectedId(initialPieces[0]?.id ?? "");
    setNextZ(initialPieces.length + 1);
    setDraft(defaultDraft);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <section className="board-pieces-studio" aria-label="Board pieces studio">
      <div className="board-pieces-stage">
        <div className="board-pieces-header">
          <p className="eyebrow">Board-Pieces</p>
          <h1>Scaled room, free placement, free rotation</h1>
          <p>
            The room is anchored to your measured walls. Pieces use inch values,
            and the browser keeps the layout so you can move things around
            without rebuilding the board each time.
          </p>
        </div>

        <div className="board-pieces-grid">
          <div className="board-pieces-canvas-wrap">
            <div className="board-pieces-canvas" role="application" aria-label="Room layout board" ref={boardRef}>
              <div className="board-pieces-board-shell">
                <div className="board-pieces-ruler board-pieces-ruler--top">
                  <span>97 in</span>
                  <span className="board-pieces-ruler__door">Door 41 in</span>
                </div>
                <div className="board-pieces-ruler board-pieces-ruler--left">
                  <span>101 in</span>
                </div>
                <div className="board-pieces-ruler board-pieces-ruler--right">
                  <span>162 in</span>
                </div>
                <div className="board-pieces-ruler board-pieces-ruler--bottom">
                  <span>171 in</span>
                </div>

                <div
                  className="board-pieces-room-stage"
                  onPointerDown={() => selectedId && setSelectedId(selectedId)}
                >
                  <svg className="board-pieces-room" viewBox="0 0 97 162" preserveAspectRatio="none">
                    <defs>
                      <pattern id="board-grid" width="6" height="6" patternUnits="userSpaceOnUse">
                        <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(139,247,255,0.12)" strokeWidth="0.3" />
                      </pattern>
                    </defs>
                    <rect x="0" y="0" width="97" height="162" fill="url(#board-grid)" opacity="0.7" />
                    <path
                      d="M 0 0 L 97 0 L 97 162 L 0 101 Z"
                      fill="rgba(0,0,0,0.26)"
                      stroke="rgba(244,201,107,0.9)"
                      strokeWidth="0.9"
                    />
                    <line
                      x1="56"
                      y1="0"
                      x2="97"
                      y2="0"
                      stroke="rgba(244,201,107,0.9)"
                      strokeWidth="1.3"
                      strokeDasharray="2.5 1.4"
                    />
                    <text x="8" y="7" fill="rgba(236,254,255,0.7)" fontSize="4.8">
                      Board room
                    </text>
                    <text x="60" y="4.8" fill="rgba(244,201,107,0.95)" fontSize="4.5">
                      door opening
                    </text>
                  </svg>
                </div>
              </div>

              <aside className="board-pieces-tray" aria-label="Piece staging tray">
                <div className="board-pieces-tray__header">
                  <span className="section-label">Staging area</span>
                  <h2>Park pieces here</h2>
                  <p>
                    Drag pieces into this open zone when you want them out of the room
                    but still visible on the board.
                  </p>
                </div>
                <div className="board-pieces-tray__slots" aria-hidden="true">
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              </aside>

              {pieces
                .slice()
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((piece) => {
                  const isSelected = piece.id === selectedId;
                  return (
                    <div
                      key={piece.id}
                      className={`board-piece board-piece--${piece.shape}${isSelected ? " board-piece--selected" : ""}`}
                      style={{
                        left: `${(piece.x / BOARD.width) * 100}%`,
                        top: `${(piece.y / BOARD.height) * 100}%`,
                        width: `${(piece.width / BOARD.width) * 100}%`,
                        height: `${(piece.height / BOARD.height) * 100}%`,
                        transform: `translate(-50%, -50%) rotate(${piece.rotation}deg)`,
                        zIndex: piece.zIndex,
                        clipPath: pieceClipPaths[piece.shape],
                      }}
                      onPointerDownCapture={() => bringToFront(piece.id)}
                      aria-label={`${piece.label}, ${formatInches(piece.width)} by ${formatInches(piece.height)}, rotation ${Math.round(piece.rotation)} degrees`}
                    >
                      <button
                        className="board-piece__move-handle"
                        type="button"
                        onPointerDown={(event) => startMove(event, piece)}
                        aria-label={`Move ${piece.label}`}
                      >
                        {piece.label}
                      </button>
                      <button
                        className="board-piece__rotate-handle"
                        type="button"
                        onPointerDown={(event) => startRotate(event, piece)}
                        aria-label={`Rotate ${piece.label}`}
                      >
                        ⟳
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          <aside className="board-pieces-panel">
            <div className="board-pieces-panel__section">
              <h2>Add a piece</h2>
              <label>
                Label
                <input
                  type="text"
                  value={draft.label}
                  onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
                />
              </label>
              <label>
                Shape
                <select
                  value={draft.shape}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      shape: event.target.value === "pentagon" ? "pentagon" : "rectangle",
                    }))
                  }
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="pentagon">Five-sided piece</option>
                </select>
              </label>
              <div className="board-pieces-panel__row">
                <label>
                  Width
                  <input
                    type="number"
                    min="4"
                    step="0.5"
                    value={draft.width}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        width: Number(event.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  Height
                  <input
                    type="number"
                    min="4"
                    step="0.5"
                    value={draft.height}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        height: Number(event.target.value),
                      }))
                    }
                  />
                </label>
              </div>
              <button type="button" className="board-pieces-button" onClick={addPiece}>
                Add piece
              </button>
              <button
                type="button"
                className="board-pieces-button board-pieces-button--ghost"
                onClick={resetBoard}
              >
                Reset demo
              </button>
            </div>

            <div className="board-pieces-panel__section">
              <h2>Selected piece</h2>
              {selectedPiece ? (
                <>
                  <label>
                    Label
                    <input
                      type="text"
                      value={selectedPiece.label}
                      onChange={(event) => updatePiece(selectedPiece.id, { label: event.target.value })}
                    />
                  </label>
                  <div className="board-pieces-panel__row">
                    <label>
                      X
                      <input
                        type="number"
                        min="0"
                        max={BOARD.width}
                        step="0.5"
                        value={selectedPiece.x}
                        onChange={(event) =>
                          updatePiece(selectedPiece.id, { x: Number(event.target.value) })
                        }
                      />
                    </label>
                    <label>
                      Y
                      <input
                        type="number"
                        min="0"
                        max={BOARD.height}
                        step="0.5"
                        value={selectedPiece.y}
                        onChange={(event) =>
                          updatePiece(selectedPiece.id, { y: Number(event.target.value) })
                        }
                      />
                    </label>
                  </div>
                  <div className="board-pieces-panel__row">
                    <label>
                      Width
                      <input
                        type="number"
                        min="4"
                        step="0.5"
                        value={selectedPiece.width}
                        onChange={(event) =>
                          updatePiece(selectedPiece.id, { width: Number(event.target.value) })
                        }
                      />
                    </label>
                    <label>
                      Height
                      <input
                        type="number"
                        min="4"
                        step="0.5"
                        value={selectedPiece.height}
                        onChange={(event) =>
                          updatePiece(selectedPiece.id, { height: Number(event.target.value) })
                        }
                      />
                    </label>
                  </div>
                  <label>
                    Rotation
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={selectedPiece.rotation}
                      onChange={(event) =>
                        updatePiece(selectedPiece.id, { rotation: Number(event.target.value) })
                      }
                    />
                  </label>
                  <p className="board-pieces-panel__hint">
                    Drag the label to move a piece. Drag the small rotate handle to
                    spin it however you want.
                  </p>
                </>
              ) : (
                <p className="board-pieces-panel__hint">Select a piece to edit it.</p>
              )}
            </div>

            <div className="board-pieces-panel__section">
              <h2>Room measurements</h2>
              <dl className="board-pieces-facts">
                <div>
                  <dt>Top wall</dt>
                  <dd>{formatInches(ROOM.top)}</dd>
                </div>
                <div>
                  <dt>Left wall</dt>
                  <dd>{formatInches(ROOM.left)}</dd>
                </div>
                <div>
                  <dt>Right wall</dt>
                  <dd>{formatInches(ROOM.right)}</dd>
                </div>
                <div>
                  <dt>Door</dt>
                  <dd>{formatInches(ROOM.door)}</dd>
                </div>
                <div>
                  <dt>Lower span</dt>
                  <dd>{formatInches(ROOM.lowerSpan)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
