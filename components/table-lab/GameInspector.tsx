import type { CardEffect, LabCard } from "./types";

type GameInspectorProps = {
  applyEffect: (effect: CardEffect, choice?: string) => void;
  flipCard: (cardId: string) => void;
  log: string[];
  selectedCard: LabCard | null;
  toggleFaceUp: (cardId: string) => void;
  turnCard: (cardId: string) => void;
};

export function GameInspector({
  applyEffect,
  flipCard,
  log,
  selectedCard,
  toggleFaceUp,
  turnCard,
}: GameInspectorProps) {
  return (
    <>
      <section>
        <h2>Card display</h2>
        {selectedCard ? (
          <>
            <div className={`table-lab-card-preview table-lab-card-preview--${selectedCard.imageTone}`}>
              <div className="table-lab-card-preview__art">
                <span>{selectedCard.face === "front" ? "Front" : "Back"}</span>
              </div>
              <div>
                <span className="mini-label">{selectedCard.type}</span>
                <h3>
                  {selectedCard.face === "front"
                    ? selectedCard.frontTitle
                    : selectedCard.backTitle}
                </h3>
                <p>
                  {selectedCard.face === "front"
                    ? selectedCard.frontText
                    : selectedCard.backText}
                </p>
              </div>
            </div>
            <div className="table-lab-card-controls">
              <button type="button" onClick={() => flipCard(selectedCard.id)}>
                Flip face
              </button>
              <button type="button" onClick={() => turnCard(selectedCard.id)}>
                Turn 90
              </button>
              <button type="button" onClick={() => toggleFaceUp(selectedCard.id)}>
                {selectedCard.faceUp ? "Turn down" : "Turn up"}
              </button>
            </div>
          </>
        ) : (
          <p>Click a face-up card to inspect its front, metadata, and actions.</p>
        )}
      </section>

      <section>
        <h2>Rules on this card</h2>
        {selectedCard?.faceUp ? (
          <div className="table-lab-effect-list">
            {selectedCard.effects.map((effect) => (
              <article className={`table-lab-effect table-lab-effect--${effect.mode}`} key={effect.id}>
                <span>{effect.mode}</span>
                <strong>{effect.label}</strong>
                <p>{effect.description}</p>
                <em>{effect.timing}</em>
                {effect.mode === "may" && effect.operation === "choose" ? (
                  <div className="table-lab-effect__actions">
                    <button type="button" onClick={() => applyEffect(effect, "plus")}>
                      +{effect.value}
                    </button>
                    <button type="button" onClick={() => applyEffect(effect, "minus")}>
                      -{effect.value}
                    </button>
                    <button type="button" onClick={() => applyEffect(effect, "skip")}>
                      Skip
                    </button>
                  </div>
                ) : null}
                {effect.mode === "may" && effect.operation !== "choose" ? (
                  <div className="table-lab-effect__actions">
                    <button type="button" onClick={() => applyEffect(effect, "use")}>
                      Use
                    </button>
                    <button type="button" onClick={() => applyEffect(effect, "skip")}>
                      Skip
                    </button>
                  </div>
                ) : null}
                {effect.mode === "must" ? (
                  <div className="table-lab-effect__actions">
                    <button type="button" onClick={() => applyEffect(effect, "must")}>
                      Apply required
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p>Face-down cards hide their rules until turned up.</p>
        )}
      </section>

      <section>
        <h2>Action log</h2>
        <ol className="table-lab-log">
          {log.map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
