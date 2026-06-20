export const glossary = {
  Battle:
    "A direct fight with a threat. Battle is one kind of mission problem, not the whole game.",
  Boost:
    "A card effect that raises or adjusts a stat for a short time, usually for one turn or one final gate.",
  Character:
    "The person, soul, or vessel going into the mission. The character carries the main stats.",
  Defense:
    "A card type that blocks harm, prevents stat loss, or protects the character from mission pressure.",
  Drain:
    "A loss of a stat during the mission. For example, losing 1 Focus is a Focus drain.",
  Echo:
    "The memory and soul-connection stat. Echo helps with continuity, identity, and returning with what was learned.",
  Exhaust:
    "To turn a card off after it is used. An exhausted card usually cannot be used again until recovered.",
  "Final Gate":
    "The last test of the mission. The game checks specific stats to decide fail, partial return, or full success.",
  Focus:
    "The clarity stat. Focus helps with aim, signal reading, attention, and mental control.",
  "Full Success":
    "The best mission result. The character completes the goal and keeps the main reward.",
  Grace:
    "The timing stat. Grace helps with movement, rescue, dodging, and careful action.",
  Loadout:
    "The small set of cards the character brings into the mission. In the first test, the loadout is 5 cards.",
  "Minor Threat":
    "A smaller enemy or danger that one simple battle card can usually clear.",
  Mission:
    "The goal of the run. A mission tells the player what they are trying to fix, survive, rescue, or recover.",
  "Mission Pressure":
    "The problem the mission creates each turn. It can be an enemy, drain, broken signal, rescue, or other danger.",
  "Partial Return":
    "A middle result. The character gets out, but only brings back a weaker reward or incomplete progress.",
  Pressure:
    "The danger level of the run. More pressure means the mission is becoming harder to survive or finish cleanly.",
  Recovery:
    "A card type that brings back a used card, restores a lost stat, or reduces pressure.",
  Reward:
    "What the character keeps after the mission. A reward might be an item, fragment, companion, or unlock.",
  "Signal Fragment":
    "The first test reward. It proves the character found useful signal data inside the mission.",
  Soul:
    "The continuing identity of the character. The soul is what carries memory and consequence between missions.",
  Stat:
    "A number on the character card. Stats show what the character is good at.",
  Threat:
    "An enemy, hazard, or danger created by the mission.",
  Tool:
    "A practical card type that solves a specific problem without being only a boost, defense, recovery, or battle card.",
  Vigor:
    "The survival stat. Vigor helps with body strain, toughness, endurance, and physical danger.",
  Will:
    "The resolve stat. Will helps with courage, resistance, pressure, and not collapsing under stress.",
} as const;

export type GlossaryTermKey = keyof typeof glossary;

export function getGlossaryDefinition(term: GlossaryTermKey) {
  return glossary[term];
}
