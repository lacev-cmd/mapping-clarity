// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 10  Next Useful Move  v0.1.1
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: produce one bounded next move that improves the
// map or the state. Not a life plan. Not advice theatre.
// Not motivational coaching. One useful move — the next
// input or action that would reduce uncertainty, expose
// the real pressure, or create movement.
// ══════════════════════════════════════════════════════════

const BehaviourNextUsefulMove = {

  id:       'next-useful-move',
  name:     'Next Useful Move',
  version:  '0.1.1',

  purpose:
    'Produce one bounded next move that improves the map or the state. Not multiple options. Not a plan. One move.',

  coreRule:
    'When material is messy, the most useful output is often not an answer. It is the next input or action that would reduce uncertainty, expose the real pressure, or create movement.',


  // ── Priority Order ────────────────────────────────────────
  // Evaluate in this order. Stop at the first that applies.

  priorityOrder: [
    {
      rank:      1,
      condition: 'Active correction marked primary.',
      move:      'Add more specific material about the primary topic.',
      rationale: 'The user has flagged this as most important. The map cannot read it clearly yet.',
    },
    {
      rank:      2,
      condition: 'Direction is missing.',
      move:      'State the direction clearly.',
      rationale: 'The map cannot assess fit or movement without knowing what is being aimed for. One honest sentence about the realistic direction — not the aspirational version.',
    },
    {
      rank:      3,
      condition: 'Special cartridge gap prompt defined for a blocking hard gap.',
      move:      'Use domain-specific gap prompt if available.',
      rationale: 'The domain cartridge may provide more precise language for its most important missing piece.',
    },
    {
      rank:      4,
      condition: 'Contradiction present.',
      move:      'Name the conditions — not just the pattern.',
      rationale: 'Describe the specific conditions where each side of the tension is true. Context is more useful than a clean story.',
    },
    {
      rank:      5,
      condition: 'A skill is breaking under load.',
      move:      'Describe one moment when the skill broke down.',
      rationale: 'The capability exists but is not yet consistent. A specific breakdown moment is more useful than a summary.',
    },
    {
      rank:      6,
      condition: 'Pressure is active with no structural response visible.',
      move:      'Describe what would reduce the main pressure.',
      rationale: 'The pressure is real and there is no response in the material. What would change it?',
    },
    {
      rank:      7,
      condition: 'Open gap present.',
      move:      'Fill the open gap.',
      rationale: 'Required material is absent. The map cannot read this area until it arrives.',
    },
    {
      rank:      8,
      condition: 'Strongest active pressure point.',
      move:      'Add material about the most active pressure.',
      rationale: 'Fallback — the most loaded area in the current map.',
    },
  ],


  // ── Output Shape ──────────────────────────────────────────

  outputShape: {
    move:      'One short, direct action or input statement.',
    rationale: 'One or two sentences explaining why this move matters now. Not generic. Tied to the current map state.',
  },


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'Generic advice not tied to the current map.',
    'Over-planning — producing ten actions instead of one.',
    'False certainty — acting before the map has enough material.',
    'Avoiding the clearest missing input.',
    'Giving a move that sounds like diagnosis.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Move too generic — could apply to any situation.',
    'Move sounds like a diagnosis or risk assessment.',
    'Move overreaches beyond what the material supports.',
    'Move ignores safety context.',
    'Move asks for information the person cannot provide.',
    'Priority order not followed — lower-rank condition used when higher-rank applies.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'Do not pretend the next useful move is the correct life decision. It is the next bounded move based on current material. Where material is thin, the move should improve the map — not over-direct the person.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'NUM-01',
      baseline: 'Things are difficult.',
      entries:  [
        { text: 'Just getting through each day.', date: '2026-01-01' },
        { text: 'Still struggling.', date: '2026-01-15' },
      ],
      expected: { nextMove: { move: 'Add more honest material — the map cannot produce a reliable next move yet.' } },
    },
    {
      id:       'NUM-02',
      baseline: '',
      entries:  [
        { text: 'Things are okay.', date: '2026-01-01' },
        { text: 'Same as before.', date: '2026-01-15' },
      ],
      expected: { nextMove: { move: 'Add more honest material — the map cannot produce a reliable next move yet.' } },
    },
    {
      id:       'NUM-03',
      baseline: '',
      entries:  [
        { text: 'I have changed. Same mistake again though.', date: '2026-01-01' },
        { text: 'Things are better. But the same old pattern again.', date: '2026-01-15' },
      ],
      expected: { nextMove: { move: 'Add more honest material — the map cannot produce a reliable next move yet.' } },
    },
    {
      id:       'NUM-04',
      baseline: '',
      entries:  [
        { text: 'I keep my cool normally. But I lost it today.', date: '2026-01-01' },
        { text: 'Usually fine but snapped again under pressure.', date: '2026-01-15' },
      ],
      expected: { nextMove: { move: 'Add more honest material — the map cannot produce a reliable next move yet.' } },
    },
    {
      id:       'NUM-05',
      baseline: 'I want to be stable. That is my goal.',
      entries:  [
        { text: 'Making progress. Contacted the relevant people.', date: '2026-01-01' },
        { text: 'Still moving forward. Things are improving.', date: '2026-01-20' },
        { text: 'On track.', date: '2026-02-05' },
      ],
      expected: { nextMove: { move: 'Add more honest material — the map cannot produce a reliable next move yet.' } },
    },
  ],

};
