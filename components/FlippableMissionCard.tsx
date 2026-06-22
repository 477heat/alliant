"use client";

import { type MouseEvent, useState } from "react";
import { GlossaryTerm } from "./GlossaryTerm";

export function FlippableMissionCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  function toggleFlip() {
    setIsFlipped((current) => !current);
  }

  function handleCardClick(event: MouseEvent<HTMLDivElement>) {
    if (
      event.target instanceof Element &&
      event.target.closest("button, a, input, select, textarea")
    ) {
      return;
    }

    toggleFlip();
  }

  return (
    <div className="mission-card-flipper">
      <button
        aria-pressed={isFlipped}
        className="mission-flip-button"
        onClick={toggleFlip}
        type="button"
      >
        {isFlipped ? "Mission" : "Pressure"}
      </button>
      <div
        className={`mission-card-inner${isFlipped ? " mission-card-inner--flipped" : ""}`}
        onClick={handleCardClick}
      >
        <div className="mission-card-face mission-card-face--front" aria-hidden={isFlipped}>
          <div className="dual-mission-card" aria-label="Dual-use mission card example">
            <div className="mission-half mission-half--top">
              <span className="mini-label">
                Top half / <GlossaryTerm term="Mission">mission</GlossaryTerm>
              </span>
              <h3>Glass Orchard</h3>
              <dl className="mission-facts mission-facts--locked">
                <div>
                  <dt>
                    <GlossaryTerm term="World Resonance">World Resonance</GlossaryTerm>
                  </dt>
                  <dd>Wood (Water, Earth)</dd>
                </div>
                <div>
                  <dt>
                    <GlossaryTerm term="Checked Attributes">Check Stats</GlossaryTerm>
                  </dt>
                  <dd>Body + Focus + Bond</dd>
                </div>
                <div>
                  <dt>
                    <GlossaryTerm term="Target Range">Target</GlossaryTerm>
                  </dt>
                  <dd>14-20 Easy</dd>
                </div>
                <div>
                  <dt>
                    <GlossaryTerm term="Pressure Count">Pressure Count</GlossaryTerm>
                  </dt>
                  <dd>5</dd>
                </div>
                <div>
                  <dt>Loadout</dt>
                  <dd>3 active Items</dd>
                </div>
              </dl>
            </div>
            <div className="mission-divider" aria-hidden="true" />
            <div className="mission-half mission-half--bottom">
              <div className="modifier-rotated">
                <span className="mini-label">Bottom half / pressure-modifier</span>
                <h3>Signal Static</h3>
                <p>
                  Pressure Stat: Focus. Requirement: block 1 Drain or lose 1
                  Focus. Advance after resolving.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mission-card-face mission-card-face--back" aria-hidden={!isFlipped}>
          <div className="pressure-back-card">
            <span className="mini-label">Pressure / modifier face</span>
            <h3>Signal Static</h3>
            <dl>
              <div>
                <dt>Pressure Stat</dt>
                <dd>Focus</dd>
              </div>
              <div>
                <dt>Requirement</dt>
                <dd>Block 1 Drain or lose 1 Focus</dd>
              </div>
              <div>
                <dt>Advance</dt>
                <dd>Resolve, then reveal the next Pressure</dd>
              </div>
            </dl>
            <p>
              If Sweetpea loses 1 Focus, the Mission total shifts from
              <strong> 17 </strong>
              to
              <strong> 16</strong>, still inside the Easy range.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
