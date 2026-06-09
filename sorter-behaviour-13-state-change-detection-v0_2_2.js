// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 13  State Change Detection  v0.2.2
// v0.2.2: behaviouralEvidenceRx: replaced dead alternation
//   `I would have done X before but now I` (literal `X` never
//   matches real text) with `I would have before but now I`
//   and added `I would not have done that before`.
// v0.2.0: changeAssertionRx, behaviouralEvidenceRx,
//         moodShiftRx added.
// ══════════════════════════════════════════════════════════

const BehaviourStateChangeDetection = {

  id:       'state-change-detection',
  name:     'State Change Detection',
  version:  '0.2.2',

  purpose:
    'Detect genuine directional shift — not recurrence, not mood. Something that was one way is now measurably different.',

  coreRule:
    'A state change requires two readable states separated by time with evidence of both. Mood shift is not state change. Intention is not state change. A described shift without behavioural evidence is not state change.',

  changeTypes: [
    { key: 'pressure_reduced',    label: 'Pressure reduced',     desc: 'Pressure present earlier is measurably less present now.' },
    { key: 'pressure_increased',  label: 'Pressure increased',   desc: 'Pressure absent or low earlier has become more prominent.' },
    { key: 'capability_gained',   label: 'Capability gained',    desc: 'Skill absent earlier is now evidenced.' },
    { key: 'capability_lost',     label: 'Capability lost',      desc: 'Skill present earlier has stopped appearing.' },
    { key: 'direction_clarified', label: 'Direction clarified',  desc: 'Direction was absent or vague and is now stated specifically.' },
    { key: 'direction_lost',      label: 'Direction lost',       desc: 'Direction was present and has stopped appearing.' },
    { key: 'load_shifted',        label: 'Load shifted',         desc: 'Load composition has changed.' },
    { key: 'stuck_to_moving',     label: 'Stuck to moving',      desc: 'Non-movement pattern has broken.' },
    { key: 'moving_to_stuck',     label: 'Moving to stuck',      desc: 'Movement has stopped.' },
    { key: 'pattern_broken',      label: 'Pattern broken',       desc: 'Recurring pattern has not appeared despite conditions that previously triggered it.' },
  ],


  // ── Stated Change ─────────────────────────────────────────
  // Person claims a change has occurred — not yet evidenced.

  changeAssertionRx: /\b(I have changed|things have changed|I am different|something has shifted|I feel different|I think differently|I act differently|I am in a different place|things are different now|it is different now|I have moved on|I have grown|I have learned|I have developed|a shift has happened|something has changed in me|I can feel the difference|I notice the difference|I can see the change|I believe I have changed)\b/i,


  // ── Behavioural Evidence of Change ───────────────────────
  // Specific behaviour demonstrating change — not just assertion.

  behaviouralEvidenceRx: /\b(I did not react the way I used to|I handled it differently|I responded differently|I would have before but now I|I would not have done that before|the old me would have|I caught myself|I noticed and chose differently|I interrupted the pattern|for the first time I|I have not done it since|I have not been back|it has not triggered|the conditions were there but I did not|I tested it and it held|it came up and I dealt with it differently|I am doing something I could not do before|I managed something I could not manage)\b/i,


  // ── Mood Shift — Not State Change ────────────────────────

  moodShiftRx: /\b(I feel better|I feel worse|I feel different|my mood has changed|I feel more positive|I feel more negative|I feel lighter|I feel heavier|I feel hopeful|I feel hopeless|I feel optimistic|I feel pessimistic|things feel different|it feels different|something feels different|emotionally I am|mentally I am|I am in a better headspace|I am in a worse headspace)\b/i,

  changeConfidence: [
    { key: 'asserted',  label: 'Asserted only',  desc: 'Person states change. No behavioural evidence yet.' },
    { key: 'emerging',  label: 'Emerging',        desc: 'One piece of behavioural evidence. Not yet confirmed.' },
    { key: 'evidenced', label: 'Evidenced',       desc: 'Multiple independent entries support the new state.' },
    { key: 'confirmed', label: 'Confirmed',       desc: 'New state has held across a meaningful period including conditions that previously triggered the old state.' },
  ],

  minimumSeparationDays: 7,

  detectionRules: {
    twoStatesRequired:    'Both prior state and current state must be evidenced.',
    evidenceBased:        'Both states must be evidenced by entry material — not stated belief.',
    separationRequired:   'States must be separated by minimumSeparationDays.',
    directionNotMood:     'Mood shift is not state change.',
    baselineAnchor:       'Baseline is the reference point for the prior state.',
    absenceAsChange:      'Pattern present and now absent may be state change — requires minimum separation and is not simply a gap in entries.',
  },

  prevents: [
    'Mistaking mood shift for genuine change.',
    'Missing real change because it does not look like the old pattern.',
    'Treating stated change as evidenced change.',
    'Missing deterioration because overall tone is positive.',
  ],

  failureModes: [
    'Prior state not reliably established.',
    'Separation threshold too short — mood shifts read as state change.',
    'Stated change treated as confirmed without behavioural evidence.',
    'Deterioration missed because entries are sparse in current period.',
  ],

  boundary:
    'State change detection reads the material — not the person\'s character or trajectory. A detected change is a map reading, not a verdict.',

  testCases: [
    {
      id:       'SCD-01',
      baseline: 'Things have been difficult for a long time.',
      entries:  [
        { text: 'I am a different person now. I have changed completely.', date: '2026-01-01' },
        { text: 'Things have changed for me.', date: '2026-01-15' },
      ],
      expected: { stateChanges: { detected: [] } },
    },
    {
      id:       'SCD-02',
      baseline: 'Financial pressure has been the main issue. Debt and money problems.',
      entries:  [
        { text: 'Things are okay this week.', date: '2026-01-01' },
        { text: 'Managing fine.', date: '2026-01-15' },
        { text: 'No issues to speak of.', date: '2026-01-29' },
      ],
      expected: { stateChanges: {} },
    },
    {
      id:       'SCD-03',
      baseline: 'Things have been hard.',
      entries:  [
        { text: 'I felt much better this week. Really positive mood.', date: '2026-01-01' },
        { text: 'Still feeling good.', date: '2026-01-15' },
      ],
      expected: { stateChanges: {} },
    },
    {
      id:       'SCD-04',
      baseline: 'I used to react badly and lose control in difficult situations.',
      entries:  [
        { text: 'I handled it differently. I caught myself and walked away. I did not react.', date: '2026-01-01' },
        { text: 'Same situation came up. I handled it differently again. Evidence of change.', date: '2026-01-15' },
      ],
      expected: { stateChanges: { count: 2 } },
    },
    {
      id:       'SCD-05',
      baseline: 'The trigger pattern has been: isolation leads to risk behaviour.',
      entries:  [
        { text: 'I have been isolated this week. Same conditions as before.', date: '2026-01-01' },
        { text: 'Isolated again but I handled it differently this time.', date: '2026-01-15' },
      ],
      expected: { stateChanges: {} },
    },
  ],
};
