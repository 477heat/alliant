import Link from "next/link";
import { FlippableMissionCard } from "../../components/FlippableMissionCard";
import { FlippableSoulCharacterCard } from "../../components/FlippableSoulCharacterCard";
import { GlossaryTerm } from "../../components/GlossaryTerm";
import { SoulDeedFeedbackGate } from "../../components/SoulDeedFeedbackGate";

const tableZones = [
  {
    label: "Phone",
    title: "Site-generated character",
    detail: "Sweetpea comes from the player's Source Soul, not a shuffled deck.",
  },
  {
    label: "Deck 01",
    title: "Mission deck",
    detail: "Worlds, hidden pressure, and modifier halves come from Mission Cards.",
  },
  {
    label: "Deck 02",
    title: "Item deck",
    detail: "Missions allow Item draws through resonance, item type, or pressure text.",
  },
  {
    label: "Player area",
    title: "Loadout + inventory",
    detail: "The Character carries Items, but each Mission sets the active loadout.",
  },
] as const;

const itemCards = [
  {
    name: "Ash Compass",
    type: "Tool",
    element: "Fire",
    attribute: "Wisdom",
    effect: "May Tune +/-1",
  },
  {
    name: "Iron Vow",
    type: "Relic",
    element: "Metal",
    attribute: "Fortitude",
    effect: "Must Add +2",
  },
  {
    name: "Root Key",
    type: "Bridge",
    element: "Wood",
    attribute: "Kinship",
    effect: "Enter Wood if harmonious",
  },
  {
    name: "Glass Lens",
    type: "Tool",
    element: "Air",
    attribute: "Arcana",
    effect: "May Subtract -1",
  },
  {
    name: "Flood Thread",
    type: "Charm",
    element: "Water",
    attribute: "Presence",
    effect: "Must Tune +/-1",
  },
] as const;

const pressureTurns = [
  {
    turn: "01",
    state: "revealed",
    title: "Signal Static",
    detail: "Pressure Attribute: Wisdom. Block 1 Drain or lose 1 Wisdom.",
  },
  {
    turn: "02",
    state: "hidden",
    title: "Face down",
    detail: "Reveal after Pressure 01 resolves.",
  },
  {
    turn: "03",
    state: "hidden",
    title: "Face down",
    detail: "May carry an Item allowance.",
  },
  {
    turn: "04",
    state: "hidden",
    title: "Face down",
    detail: "May force a Must effect.",
  },
  {
    turn: "05",
    state: "hidden",
    title: "Final pressure",
    detail: "May award an Access Marker.",
  },
] as const;

const workingIdeas = [
  "The site generates the Character Card from the Source Soul.",
  "The paper table uses two active decks: Mission and Item.",
  "Missions show World Resonance with two harmonious elements in parentheses.",
  "Mission success uses a target range, not highest number wins.",
  "Pressure count is public, but pressure details reveal one at a time.",
  "Items, Missions, and Characters share the same source attribute vocabulary.",
  "Character carry limit and Mission active loadout can be separate numbers.",
  "Gained inventory is riskier than the Character's stable carry slots.",
] as const;

const clashes = [
  "Character deck vs site-generated Characters: use a roster/demo pool only, not a third active deck.",
  "One shared Adventure deck vs Mission plus Item decks: current direction is two active decks.",
  "All twelve attributes on every card vs readable cards: use the shared vocabulary, but print only relevant attributes.",
  "Five modifiers on every Mission vs pressure count: do not lock both until the first paper test.",
  "Fully chosen loadout vs shuffled draw: choose the stack, then shuffle if we want uncertainty.",
  "Character Cards as dual-use modifiers vs personal Soul identity: hold this idea for later.",
] as const;

const harmonyElements = [
  { key: "fire", name: "Fire", harmonious: "Air + Earth" },
  { key: "air", name: "Air", harmonious: "Fire + Metal" },
  { key: "metal", name: "Metal", harmonious: "Air + Water" },
  { key: "water", name: "Water", harmonious: "Metal + Wood" },
  { key: "wood", name: "Wood", harmonious: "Water + Earth" },
  { key: "earth", name: "Earth", harmonious: "Wood + Fire" },
] as const;

export const metadata = {
  title: "Quantum Tunnel Mock Game Room | Alliant",
  description:
    "A visual paper-game room for testing Quantum Tunnel character, mission, item, pressure, and tuning rules.",
};

export default function QuantumTunnelPage() {
  return (
    <main className="alliant-page playtest-page">
      <div className="page-backdrop" aria-hidden="true" />

      <header className="site-header">
        <Link className="brand-mark" href="/" aria-label="Alliant home">
          <span className="brand-dot" />
          <span>Alliant</span>
        </Link>
        <nav className="project-nav" aria-label="Playtest navigation">
          <Link href="/">Home</Link>
          <Link href="/dictionary">Dictionary</Link>
          <Link href="#setup">Setup</Link>
          <Link href="#mission">Mission</Link>
          <Link href="#harmony">Harmony</Link>
          <Link href="#pressure">Pressure</Link>
          <Link href="#feedback">Feedback</Link>
          <Link href="#clashes">Clashes</Link>
        </nav>
      </header>

      <section className="playtest-hero" aria-labelledby="playtest-title">
        <div>
          <p className="eyebrow">Quantum Tunnel / mock game room</p>
          <h1 id="playtest-title">Game Room</h1>
        </div>
        <p>
          Current working model: the site generates the{" "}
          <GlossaryTerm term="Character Card">Character Card</GlossaryTerm>, the
          table uses a <GlossaryTerm term="Mission Deck">Mission deck</GlossaryTerm>{" "}
          and an <GlossaryTerm term="Item Deck">Item deck</GlossaryTerm>, and
          the run is decided by <GlossaryTerm term="Target Range">target ranges</GlossaryTerm>{" "}
          plus <GlossaryTerm term="Tuning">tuning</GlossaryTerm>.
        </p>
      </section>

      <section className="color-key" aria-label="Visual color key">
        <span>Color key</span>
        <div>
          <i className="color-key__swatch color-key__swatch--green" aria-hidden="true" />
          <strong>Green</strong>
          <p>locked protocol as we decide it</p>
        </div>
        <div>
          <i className="color-key__swatch color-key__swatch--yellow" aria-hidden="true" />
          <strong>Yellow</strong>
          <p>liked and staying for playtest</p>
        </div>
      </section>

      <SoulDeedFeedbackGate />

      <section className="setup-strip" id="setup" aria-label="Current table setup">
        {tableZones.map((zone) => (
          <article className="setup-tile" key={zone.label}>
            <span>{zone.label}</span>
            <strong>{zone.title}</strong>
            <p>{zone.detail}</p>
          </article>
        ))}
      </section>

      <section className="tabletop-grid" aria-label="Quantum Tunnel tabletop layout">
        <article className="soul-sheet">
          <div className="board-heading">
            <p className="section-label">
              <GlossaryTerm term="Soul Card">Soul card</GlossaryTerm> +{" "}
              <GlossaryTerm term="Character Card">Character card</GlossaryTerm>
            </p>
            <h2>Source and playable form</h2>
          </div>
          <FlippableSoulCharacterCard />
        </article>

        <article className="mission-panel" id="mission">
          <div className="board-heading">
            <p className="section-label">
              <GlossaryTerm term="Mission Card">Mission card</GlossaryTerm>
            </p>
            <h2>World + hidden pressure</h2>
          </div>
          <FlippableMissionCard />
          <div className="modifier-rule">
            <strong>Access check</strong>
            <p>
              Wood can enter Wood by implication. Water and Earth are{" "}
              <GlossaryTerm term="Harmonious Access">harmonious</GlossaryTerm>.
              Sweetpea needs a Bridge Item or prior Wood Mark.
            </p>
          </div>
        </article>

        <article className="gate-panel" id="gate">
          <div className="board-heading">
            <p className="section-label">
              <GlossaryTerm term="Target Range">Target range</GlossaryTerm>
            </p>
            <h2>Fit the World</h2>
          </div>
          <div className="gate-meter">
            <span>14</span>
            <div className="gate-window">
              <span>easy range</span>
            </div>
            <span>20</span>
          </div>
          <p className="gate-total">5 + 6 + 6 = 17</p>
          <div className="tuning-stack" aria-label="Tuning math example">
            <div>
              <span>Raw force</span>
              <strong>Body + Focus + Bond</strong>
            </div>
            <div>
              <span>Hard range</span>
              <strong>16-18</strong>
            </div>
            <div>
              <span>Absolute target</span>
              <strong>17 exactly</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="harmony-zone" id="harmony" aria-label="Harmonious element diagram">
        <div className="board-heading">
          <p className="section-label">
            <GlossaryTerm term="Harmonious Access">Harmonious access</GlossaryTerm>
          </p>
          <h2>Element harmony map</h2>
        </div>
        <div className="harmony-layout">
          <div className="harmony-ring" aria-label="Provisional six-element harmony ring">
            <div className="harmony-ring__track" aria-hidden="true" />
            <div className="harmony-ring__core">
              <span>World</span>
              <strong>Resonance</strong>
            </div>
            {harmonyElements.map((element) => (
              <article
                className={`harmony-node harmony-node--${element.key}`}
                key={element.key}
              >
                <strong>{element.name}</strong>
                <span>{element.harmonious}</span>
              </article>
            ))}
          </div>
          <article className="harmony-example-card">
            <span className="mini-label">Mission notation test</span>
            <h3>Wood (Water, Earth)</h3>
            <div className="harmony-access-grid" aria-label="Wood world access example">
              <div className="harmony-access-card harmony-access-card--direct">
                <span>Direct</span>
                <strong>Wood</strong>
                <p>Same element. May attempt the World.</p>
              </div>
              <div className="harmony-access-card harmony-access-card--harmonious">
                <span>Harmonious</span>
                <strong>Water / Earth</strong>
                <p>Compatible entry. Less control than direct resonance.</p>
              </div>
              <div className="harmony-access-card harmony-access-card--blocked">
                <span>Bridge needed</span>
                <strong>Fire / Air / Metal</strong>
                <p>Needs a Mark, Item, Creature, or prior unlock.</p>
              </div>
            </div>
            <p>
              Read the parentheses as the two elements that can enter without
              matching the World exactly. The exact full chart is still being
              tested.
            </p>
          </article>
        </div>
      </section>

      <section className="pressure-zone" id="pressure" aria-label="Hidden pressure turns">
        <div className="board-heading">
          <p className="section-label">
            <GlossaryTerm term="Pressure Count">Pressure count</GlossaryTerm>
          </p>
          <h2>Five attached Mission cards, revealed one at a time</h2>
        </div>
        <div className="mission-track mission-track--five">
          {pressureTurns.map((pressure) => (
            <div
              className={`pressure-card pressure-card--${pressure.state}`}
              key={pressure.turn}
            >
              <span>Pressure {pressure.turn}</span>
              <strong>{pressure.title}</strong>
              <p>{pressure.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="loadout-zone" id="loadout" aria-label="Item deck and loadout examples">
        <div className="board-heading">
          <p className="section-label">
            <GlossaryTerm term="Item Deck">Item deck</GlossaryTerm>
          </p>
          <h2>Items tune the same attributes Missions test</h2>
        </div>
        <div className="loadout-cards">
          {itemCards.map((card) => (
            <article className="game-card" key={card.name}>
              <span className="card-type">{card.type}</span>
              <h3>{card.name}</h3>
              <div className="card-stat">
                <GlossaryTerm term={card.attribute}>{card.attribute}</GlossaryTerm>
              </div>
              <p>
                {card.element} / {card.effect}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rules-balance-grid" id="clashes" aria-label="Working ideas and clashes">
        <article>
          <div className="board-heading">
            <p className="section-label">Working together</p>
            <h2>Ideas that currently fit</h2>
          </div>
          <ul className="rules-list">
            {workingIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </article>
        <article>
          <div className="board-heading">
            <p className="section-label">Still clashing</p>
            <h2>Ideas to resolve before locking</h2>
          </div>
          <ul className="rules-list rules-list--warn">
            {clashes.map((clash) => (
              <li key={clash}>{clash}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
