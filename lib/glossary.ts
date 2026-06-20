export const glossary = {
  Battle:
    "A direct fight with a threat. Battle is one kind of mission problem, not the whole game.",
  "Advance Step":
    "The end of a turn. Move to the next pressure turn, or go to the final gate if the mission track is finished.",
  Block:
    "To stop a bad effect before it hurts the character. A defense card usually blocks drain or damage.",
  Boost:
    "A card effect that raises or adjusts a stat for a short time, usually for one turn or one final gate.",
  Character:
    "The person, soul, or vessel going into the mission. The character carries the main stats.",
  Clear:
    "To remove a threat or problem from the mission so it does not keep hurting the character.",
  Defense:
    "A card type that blocks harm, prevents stat loss, or protects the character from mission pressure.",
  Drain:
    "A loss of a stat during the mission. For example, losing 1 Focus is a Focus drain.",
  Element:
    "The mission tag that decides whether a modifier turns on. If the modifier element matches the mission element, the modifier applies.",
  Echo:
    "The memory and soul-connection stat. Echo helps with continuity, identity, and returning with what was learned.",
  Exhaust:
    "To turn a card off after it is used. An exhausted card usually cannot be used again until recovered.",
  "Final Gate":
    "The last test of the mission. The game checks specific stats to decide fail, partial return, or full success.",
  Fail:
    "The lowest mission result. The soul gets out, but the main reward is not earned yet.",
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
  "Mission Card":
    "A dual-use card. The top half is used as the mission, and the upside-down bottom half is used as a modifier when attached to another mission.",
  Modifier:
    "The upside-down half of a mission card. It changes a mission only when its element matches the mission element.",
  "Active Modifier":
    "A modifier that turns on because its element matches the mission element.",
  "Mission Pressure":
    "The problem the mission creates each turn. It can be an enemy, drain, broken signal, rescue, or other danger.",
  "Null Modifier":
    "A modifier that does nothing because its element does not match the mission element.",
  "Partial Return":
    "A middle result. The character gets out, but only brings back a weaker reward or incomplete progress.",
  Pressure:
    "The danger level of the run. More pressure means the mission is becoming harder to survive or finish cleanly.",
  "Pressure Turn":
    "One round of danger from the mission. Reveal a pressure card, respond with your loadout, resolve what happens, then advance.",
  Recover:
    "To bring back a used card or restore something that was lost earlier in the mission.",
  Recovery:
    "A card type that brings back a used card, restores a lost stat, or reduces pressure.",
  "Response Step":
    "The part of the turn where the player chooses what to do. Usually this means using one loadout card or accepting the risk.",
  Reward:
    "What the character keeps after the mission. A reward might be an item, fragment, companion, or unlock.",
  "Reveal Step":
    "The start of a pressure turn. Flip or reveal the next mission pressure card and read the problem.",
  "Resolve Step":
    "The part of the turn where the chosen answer happens. Any danger that was not blocked or cleared now affects the character.",
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
  Turn:
    "One complete player cycle: reveal pressure, respond with a card or choice, resolve the result, then advance.",
  Vigor:
    "The survival stat. Vigor helps with body strain, toughness, endurance, and physical danger.",
  Will:
    "The resolve stat. Will helps with courage, resistance, pressure, and not collapsing under stress.",
} as const;

export type GlossaryTermKey = keyof typeof glossary;

export function getGlossaryDefinition(term: GlossaryTermKey) {
  return glossary[term];
}
