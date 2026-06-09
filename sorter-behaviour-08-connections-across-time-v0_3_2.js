// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 08  Connections Across Time  v0.3.2
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: detect recurring patterns separated by time.
// A connection is a recurrence prompt — not a conclusion.
//
// v0.3.2 — regex precision pass:
//   — triggerRx: removed bare `when I X` fragments (`when I am`,
//     `when things get`, `when it gets hard`, `when I am tired`,
//     `when I am stressed`, `when I am alone`, `when I am isolated`,
//     `when I am with`, `when I see`, `when I go to`, `when I am near`,
//     `when I feel`, `when I start to feel`, `when things fall`,
//     `when it all`, `when everything`, `when I cannot`).
//     These fire on any conditional sentence. Retained only the
//     explicit trigger-naming phrases (`the trigger is`, `what sets
//     it off`, `it happens when`, etc.) and the named condition
//     phrases that carry enough specificity to be reliable.
//
// v0.3.1 —
//   — Test cases: structured entries replacing prose descriptions.
//   — Multiline regex collapsed: leading-space alternation bug fixed.
//
// v0.3.0 — pattern library added:
//   — recurrenceRx: language the person uses to name
//     their own recurring patterns.
//   — triggerRx: condition language that appears before
//     recurring breakdown or stuck points.
//   — positiveRecurrenceRx: recurring capability or
//     strength signals worth surfacing.
//   — dismissalRx: language indicating a connection
//     has been dismissed by the person.
// ══════════════════════════════════════════════════════════

const BehaviourConnectionsAcrossTime = {

  id:       'connections-across-time',
  name:     'Connections Across Time',
  version:  '0.3.2',

  purpose:
    'Detect recurring patterns separated by time. Surface recurrence that would be missed by reading only adjacent entries.',

  coreRule:
    'A pressure, skill, stuck point, or pattern appearing weeks apart may be more significant than material repeated yesterday. Time separation can increase meaning. A connection is a prompt — not a conclusion.',


  // ── Connection Types ──────────────────────────────────────

  connectionTypes: [
    { key: 'repeating_pressure',   label: 'Repeating pressure pattern',   desc: 'Same pressure signal across a meaningful time gap.' },
    { key: 'repeating_stuck',      label: 'Repeating stuck pattern',       desc: 'Same stuck or non-movement signal across a meaningful time gap.' },
    { key: 'repeating_capability', label: 'Repeating capability',          desc: 'Same skill or positive signal across a meaningful time gap.' },
    { key: 'positive_connection',  label: 'Positive connection',           desc: 'A strength or capability is recurring.' },
    { key: 'negative_connection',  label: 'Negative connection',           desc: 'A pressure or breakdown is recurring.' },
    { key: 'trigger_pattern',      label: 'Trigger pattern',               desc: 'Same conditions appear before recurring breakdown.' },
    { key: 'user_confirmed',       label: 'User confirmed connection',     desc: 'User has acknowledged the connection as meaningful.' },
    { key: 'user_dismissed',       label: 'User dismissed connection',     desc: 'User has indicated the connection is not meaningful.' },
    { key: 'watch_only',           label: 'Connection remains watch-only', desc: 'Connection detected but not yet confirmed or dismissed.' },
  ],


  // ── Self-Named Recurrence ─────────────────────────────────
  // The person names their own pattern — highest signal value.

  recurrenceRx: /\b(same pattern|same cycle|same loop|same situation|same thing again|I keep doing this|I keep ending up here|I keep coming back to this|I always|I never|every time|it always happens|it always ends|it always goes the same|history repeating|round and round|I have been here before|I have done this before|I recognise this|I know this pattern|I see this pattern|this is familiar|the pattern is|the cycle is|the loop is|the trigger is|I find myself here again|I am back to|I have returned to|I said this before|I wrote this before|I have been in this place before)\b/i,


  // ── Trigger Language ──────────────────────────────────────
  // Conditions that appear before recurring breakdown or stuck points.

  triggerRx: /\b(after a difficult|after a conflict|after a bad|after a hard|when money is|when I have no|the trigger is|what sets it off|what starts it|what breaks it|conditions that|situations that|the circumstances that|it happens when|it breaks when|it starts when|it begins when)\b/i,


  // ── Positive Recurrence ───────────────────────────────────
  // Recurring capability or strength signals.

  positiveRecurrenceRx: /\b(I always manage|I always find a way|I always come back|I always recover|even when|despite everything|no matter what|through it all|I have done this before and I did it|I have been here before and I came through|I am resilient|I bounce back|I keep going|I do not give up|this is something I can do|this is something I have done|I have proven|I have shown|I have demonstrated|my strength|my resilience|what I am capable of|something that works for me|something that has always helped|something I rely on|a skill I have|a tool that works)\b/i,


  // ── Dismissal Language ────────────────────────────────────
  // Person has dismissed a connection.

  dismissalRx: /\b(that is not the same|that is different|that is not connected|those are not related|that does not apply|that is not relevant|I would not say that|I do not see that|I do not think that is|it is not a pattern|it is just a coincidence|it just happened|nothing to do with|unrelated|different situation|different context|I disagree with that|that is not accurate|that is not what happened)\b/i,


  // ── Detection Rules ───────────────────────────────────────

  minimumSeparationDays: 14,

  detectionRules: {
    minimumSeparation:
      'Use minimumSeparationDays. Two appearances closer than this threshold do not qualify as a time-separated connection.',
    strengthByRecurrence:
      'Three or more appearances across separate periods is stronger than two.',
    contextRequired:
      'Two entries sharing a word but describing different contexts should not produce a strong connection.',
    selfNamedHighest:
      'When the person names their own pattern using recurrenceRx, this is the strongest connection signal.',
    triggerPatternValue:
      'When the same conditions appear before recurring breakdown across multiple periods, surface the trigger pattern explicitly.',
    dismissalRespected:
      'A user-dismissed connection must not reappear in the same form unless the pattern resurfaces significantly.',
    dismissalThreshold:
      'Three dismissed instances of the same signal may re-surface as a watch-pattern regardless of dismissal.',
  },


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'Missing recurrence across non-adjacent entries.',
    'Treating incidents as isolated when they are part of a pattern.',
    'Losing long-range signal in a high-volume record.',
    'Forgetting earlier material that is still relevant.',
    'Repeating a connection the user has already dismissed.',
    'Missing trigger patterns that precede recurring breakdown.',
    'Missing positive recurrence — recurring strength not surfaced.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Too many weak connections — noise overwhelms signal.',
    'Same topic, different meaning — false connection.',
    'No context around matched entries — connection is hollow.',
    'User dismissal not stored or respected.',
    'Old connections dominate the current map.',
    'Connections treated as proof rather than prompt.',
    'Trigger pattern missed — only the breakdown surfaced, not the conditions.',
    'Positive recurrence missed — only negative patterns surfaced.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'Do not treat a connection as causation. A connection is a recurrence prompt. It needs context before any action or conclusion.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'CAT-01',
      entries:  [
        { text: 'Money is tight. Same cycle as before. I keep ending up here.', date: '2026-01-01' },
        { text: 'Money pressure again. The pattern continues.', date: '2026-01-22' },
      ],
      expected: { connections: { count: 1 } },
    },
    {
      id:       'CAT-02',
      entries:  [
        { text: 'I know this pattern. I always end up here. The pattern is clear.', date: '2026-01-01' },
        { text: 'Same thing happening again. The cycle continues.', date: '2026-01-15' },
      ],
      expected: { connections: { selfNamed: true } },
    },
    {
      id:       'CAT-03',
      entries:  [
        { text: 'I showed up again despite everything. I have done this before.', date: '2026-01-01' },
        { text: 'Attended again. Positive recurrence of this capability.', date: '2026-02-05' },
      ],
      expected: { connections: { hasPositive: true } },
    },
    {
      id:       'CAT-04',
      entries:  [
        { text: 'Money pressure present. The cycle of debt.', date: '2026-01-01' },
        { text: 'Money again. The same loop continues.', date: '2026-01-22' },
      ],
      expected: { connections: { count: 1 } },
    },
    {
      id:       'CAT-05',
      entries:  [
        { text: 'When I am isolated it triggers the pattern. The trigger is being alone.', date: '2026-01-01' },
        { text: 'Isolated again. The trigger appeared and the pattern followed.', date: '2026-01-22' },
      ],
      expected: { connections: { hasTrigger: true } },
    },
    {
      id:       'CAT-06',
      entries:  [
        { text: 'I keep ending up in the same situation. The cycle repeats.', date: '2026-01-01' },
        { text: 'Round and round. Same pattern again.', date: '2026-01-22' },
      ],
      expected: { connections: { count: 1 } },
    },
  ],

};
