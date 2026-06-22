"use client";

import { type MouseEvent, useState } from "react";
import { GlossaryTerm } from "./GlossaryTerm";

const sourceAttributes = [
  { label: "Presence", value: 47 },
  { label: "Wealth", value: 75 },
  { label: "Fortitude", value: 103 },
  { label: "Cunning", value: 72 },
  { label: "Flair", value: 46 },
  { label: "Vigor", value: 40 },
  { label: "Kinship", value: 97 },
  { label: "Potency", value: 62 },
  { label: "Wisdom", value: 78 },
  { label: "Prestige", value: 77 },
  { label: "Influence", value: 69 },
  { label: "Arcana", value: 91 },
] as const;

const characterStats = [
  { label: "Body", value: "5", detail: "Vigor 40 + Fortitude 103 = 143." },
  { label: "Resolve", value: "4", detail: "Presence 47 + Prestige 77 = 124." },
  {
    label: "Focus",
    value: "6",
    modifier: "+/-1",
    detail: "Wisdom 78 + Arcana 91 = 169.",
  },
  { label: "Guile", value: "3", detail: "Cunning 72 + Flair 46 = 118." },
  {
    label: "Bond",
    value: "6",
    modifier: "+/-1",
    detail: "Kinship 97 + Influence 69 = 166.",
  },
  { label: "Charge", value: "4", detail: "Potency 62 + Wealth 75 = 137." },
] as const;

const characterAttributes = [
  { id: "western-earth", label: "Earth", value: "+/-3", use: "western resonance" },
  { id: "chinese-earth", label: "Earth", value: "+/-3", use: "chinese resonance" },
  { id: "kinship", label: "Kinship", value: 97, use: "support checks" },
  { id: "potency", label: "Potency", value: 62, use: "raw force" },
] as const;

type ElementName = "Earth" | "Fire" | "Metal";

function ElementGlyph({ element }: { element: ElementName }) {
  return (
    <span
      aria-label={element}
      className={`element-glyph element-glyph--${element.toLowerCase()}`}
      role="img"
    />
  );
}

export function FlippableSoulCharacterCard() {
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
    <div className="soul-character-flipper">
      <button
        aria-pressed={isFlipped}
        className="soul-character-flip-button"
        onClick={toggleFlip}
        type="button"
      >
        {isFlipped ? "Show Source Soul" : "Show Playable Card"}
      </button>
      <div
        className={`soul-character-card-inner${
          isFlipped ? " soul-character-card-inner--flipped" : ""
        }`}
        onClick={handleCardClick}
      >
        <div
          aria-hidden={isFlipped}
          className="soul-character-card-face soul-character-card-face--front"
        >
          <div
            aria-label="Portrait soul card example"
            className="character-card-frame soul-card-frame"
          >
            <div className="soul-core">
              <div className="soul-sigil" aria-hidden="true">
                SP
              </div>
              <div>
                <span className="mini-label">Source Soul / profile</span>
                <strong>Sweetpea</strong>
                <p>
                  Western: Capricorn. Chinese: Earth Goat. Ordo Elementa:{" "}
                  <span className="inline-element-icons">
                    <GlossaryTerm term="Earth">
                      <ElementGlyph element="Earth" />
                    </GlossaryTerm>
                    <GlossaryTerm term="Earth">
                      <ElementGlyph element="Earth" />
                    </GlossaryTerm>
                  </span>
                </p>
              </div>
            </div>
            <div className="attribute-grid">
              {sourceAttributes.map((attribute) => (
                <div className="attribute-tile" key={attribute.label}>
                  <span>
                    <GlossaryTerm term={attribute.label}>
                      {attribute.label}
                    </GlossaryTerm>
                  </span>
                  <strong>{attribute.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          aria-hidden={!isFlipped}
          className="soul-character-card-face soul-character-card-face--back"
        >
          <div
            aria-label="Playable tabletop character card example"
            className="character-card-frame tabletop-character-card"
          >
            <div className="character-card-top">
              <span className="mini-label">
                <GlossaryTerm term="Character Stats">
                  Playable table card
                </GlossaryTerm>
              </span>
              <h3>Sweetpea</h3>
              <div
                aria-label="Earth and Earth range-tuning scout"
                className="element-title-row"
              >
                <GlossaryTerm term="Earth">
                  <ElementGlyph element="Earth" />
                </GlossaryTerm>
                <GlossaryTerm term="Earth">
                  <ElementGlyph element="Earth" />
                </GlossaryTerm>
                <span>range-tuning scout</span>
              </div>
            </div>
            <div className="character-stat-list">
              {characterStats.map((stat) => (
                <div className="character-stat-row" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>
                    {stat.value}
                    {"modifier" in stat ? (
                      <>
                        {" "}
                        <em className="stat-modifier">{stat.modifier}</em>
                      </>
                    ) : null}
                  </strong>
                  <p>{stat.detail}</p>
                </div>
              ))}
            </div>
            <div className="character-attribute-strip">
              {characterAttributes.map((attribute) => (
                <div className="character-attribute" key={attribute.id}>
                  <span>
                    {attribute.label === "Earth" ? (
                      <GlossaryTerm term={attribute.label}>
                        <ElementGlyph element={attribute.label} />
                      </GlossaryTerm>
                    ) : (
                      <GlossaryTerm term={attribute.label}>
                        {attribute.label}
                      </GlossaryTerm>
                    )}
                  </span>
                  <strong>{attribute.value}</strong>
                  <em>{attribute.use}</em>
                </div>
              ))}
            </div>
            <p className="character-card-note">
              Stats use a 3-10 scale. Only the top two pair totals get +/-.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
