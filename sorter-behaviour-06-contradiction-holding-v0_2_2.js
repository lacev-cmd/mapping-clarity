// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 06  Contradiction Holding  v0.2.2
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: hold conflicting signals as a real map state
// instead of flattening them into a false conclusion.
// Two opposed signals may both be real. The sorter names
// the tension — it does not resolve it prematurely.
//
// v0.2.2 — regex precision pass:
//   — statedGoalRx: removed `I want to` (too short and common —
//     fires on any forward-looking language).
//   — statedCapabilityRx: removed `I manage` (fires on "I manage
//     to get through" etc — not a capability claim) and `I am
//     strong` (too broad — fires in grief and illness contexts).
//   — capabilityBreakdownRx: replaced `I reacted` with `I reacted
//     badly` (bare `I reacted` fires on neutral reaction language).
//   — negativeDetailRx: removed `but then`, `except`, `however`,
//     `although` (common connectives — fire on any contrast, not
//     just contradiction of positive framing).
//
// v0.2.1 —
//   — Test cases: structured entries replacing prose descriptions.
//   — Multiline regex collapsed: leading-space alternation bug fixed.
//
// v0.2.0 — full pattern library:
//   — statedChangeRx added: language claiming change or
//     improvement that may contradict entry pattern.
//   — samePatternRx added: language indicating the pattern
//     is repeating — contradicts stated change.
//   — statedGoalRx added: goal or priority language.
//   — noActionRx added: absence of action toward stated goal.
//   — statedCapabilityRx added: capability claims.
//   — breakdownRx added: breakdown language contradicting
//     stated capability.
//   — positiveFrameRx added: positive overall framing.
//   — negativeFrameRx added: negative specific detail that
//     contradicts positive framing.
//   — selfContradictionRx added: single-sentence self-
//     contradictions that regex can reliably catch.
// ══════════════════════════════════════════════════════════

const BehaviourContradictionHolding = {

  id:       'contradiction-holding',
  name:     'Contradiction Holding',
  version:  '0.2.2',

  purpose:
    'Hold conflicting signals as a real map state. Name the tension without deciding which side is the truth.',

  coreRule:
    'Humans and systems often contain true tensions. Two opposed signals may both be real. The sorter names the tension — it does not resolve it, judge it, or treat it as dishonesty.',


  // ── Contradiction Types ───────────────────────────────────

  contradictionTypes: [
    { key: 'unresolved_tension',          label: 'Unresolved tension',                    desc: 'Two opposing signals both present. Neither clearly dominant.' },
    { key: 'direction_behaviour',         label: 'Direction–behaviour tension',            desc: 'Stated direction and actual behaviour point in different ways.' },
    { key: 'claimed_change_vs_pattern',   label: 'Claimed change vs repeated pattern',    desc: '"I have changed" and evidence of the same pattern both appear.' },
    { key: 'stated_goal_vs_reality',      label: 'Stated goal vs current reality',         desc: 'A goal is named but entries show no movement toward it.' },
    { key: 'capability_vs_breakdown',     label: 'Capability vs breakdown',               desc: 'A capability is claimed and breakdown of that capability also appears.' },
    { key: 'motivation_vs_non_contact',   label: 'Motivation vs loss of contact',         desc: 'Motivation stated toward something but actual contact or action absent.' },
    { key: 'positive_frame_vs_detail',    label: 'Positive framing vs negative detail',   desc: 'Overall positive framing contradicted by specific described events.' },
    { key: 'evidence_conflict',           label: 'Evidence conflict',                     desc: 'Two entries provide directly conflicting factual accounts.' },
    { key: 'self_contradiction',          label: 'Self-contradiction within entry',        desc: 'A single entry contains directly opposing claims.' },
    { key: 'requires_context',            label: 'Requires context',                      desc: 'Contradiction detected but correction or context may explain it.' },
  ],


  // ── Stated Change Language ────────────────────────────────
  // Claims of change, improvement, or being different.
  // Contradiction arises when the same pattern continues.

  statedChangeRx: /\b(I have changed|I am different now|I am a different person|things have changed|I have turned a corner|I have moved on|I have grown|I have learned|I am not that person anymore|that is not who I am|I have left that behind|I am better now|I am in a better place|things are better|I have improved|I have made progress|I have come a long way|I am doing well|I am doing better|things are going well|I have got my head straight|I have sorted myself out|I have got it together|I would not do that now|I know better now|I handle things differently|the old me|the person I was|back then I was different)\b/i,


  // ── Same Pattern Language ─────────────────────────────────
  // Pattern repeating — contradicts stated change.

  samePatternRx: /\b(same thing|same mistake|same pattern|same cycle|same loop|same situation|same again|back to it|back to where|back at the start|back to square one|I did it again|it happened again|there I was again|same as before|same old|history repeating|round and round|going in circles|I keep doing|I always do|I never learn|I end up|every time I|it always ends the same|it always goes the same way|nothing has really changed|not much has changed|I am still doing|the pattern continues|the cycle continues|I fell back into)\b/i,


  // ── Stated Goal or Priority ───────────────────────────────
  // Goal, priority, or value language.

  statedGoalRx: /\b(my goal is|my aim is|my priority is|what I want is|what matters to me|I am working toward|I am trying to achieve|I am focused on|family is everything|family comes first|my children|my kids come first|work is my priority|my career matters|the most important thing is|I care most about|what I am doing this for|the reason I|I am doing this for|this is all for|I want to get back to|I want to rebuild|I want to prove|I want to show|my future|what I am aiming for|where I want to be|health is my priority|recovery is my priority|staying clean is everything)\b/i,


  // ── No Action Toward Goal ─────────────────────────────────
  // Goal stated but no movement visible.
  // Structural — detected across entries, not within one.

  noActionSignals: [
    'No contact language present despite family stated as priority.',
    'No work or employment action language despite career stated as goal.',
    'No recovery action language despite staying clean stated as priority.',
    'No health action language despite health stated as priority.',
  ],


  // ── Stated Capability ─────────────────────────────────────
  // Claims of skill or ability.

  statedCapabilityRx: /\b(I can handle|I am able to|I am capable of|I know how to|I am good at|I am resilient|I bounce back|I cope well|I keep my cool|I stay calm|I do not react|I walk away|I have the skills|I have what it takes|I am ready|I can do this|I have done it before|I know I can|I have the strength|I am disciplined|I am consistent|I am reliable|I follow through)\b/i,


  // ── Capability Breakdown ──────────────────────────────────
  // Contradicts stated capability.

  capabilityBreakdownRx: /\b(I lost it|I snapped|I reacted badly|I blew up|I could not hold it|I gave in|I caved|I went back|I slipped|I relapsed|I broke|I could not|I was not able to|I failed to|I did not manage to|I fell apart|I crumbled|I collapsed|I could not cope|it all fell apart|I was not ready|I could not handle it|I thought I could but|I told myself I could but|I said I would but)\b/i,


  // ── Positive Overall Framing ──────────────────────────────

  positiveFrameRx: /\b(things are good|things are going well|I am doing well|everything is fine|I am in a good place|life is good|I am happy|I am positive|things have improved|no major issues|no concerns|no problems|all good|nothing to worry about|on the right track|making progress|I feel strong|I feel confident|I feel ready)\b/i,


  // ── Negative Specific Detail ──────────────────────────────
  // Specific negative events that contradict positive framing.

  negativeDetailRx: /\b(despite that|having said that|but actually|but really|if I am honest|to be honest|the truth is|it is not all|it is not quite|not everything is|not all is|there is one thing|there is something|I should mention|I need to say|there was an incident|something happened|it went wrong|it did not go well|I struggled with|I had a hard time|it was difficult when|it got hard when)\b/i,


  // ── Self-Contradiction Within Entry ──────────────────────
  // Single-entry contradictions regex can reliably catch.

  selfContradictionRx: /\b(I want to but I do not|I say one thing and do another|I know I should but I|I tell myself but then|I am trying but I keep|I mean to but I never|part of me wants to and part of me does not|I feel two ways about|I am torn between|I am conflicted|on one hand and on the other|both things are true|I believe it but I also|I want it but I also|I feel it but I also do not|I both want and do not want)\b/i,


  // ── Detection Pattern Shape ───────────────────────────────

  detectionShape: {
    a:    'Pattern matching the first signal.',
    b:    'Pattern matching the opposing signal.',
    text: 'Output text naming the tension. Must not assign cause or resolve the tension.',
  },


  // ── Output Rules ──────────────────────────────────────────

  outputRules: {
    nameOnly:      'The output names the tension. It does not say which side is true.',
    noMotive:      'Do not assign motive, dishonesty, or weakness to the contradiction.',
    bothReal:      'State that both signals may be real — this is not resolved by the sorter.',
    correction:    'If a correction explains the contradiction, adjust output — but do not blindly suppress the tension if entries still show it.',
    evidenceFirst: 'If specific evidence opposes a general statement, the specific evidence is the more reliable signal.',
  },


  // ── What Contradiction Can Mean ───────────────────────────

  possibleMeanings: [
    'Transition — genuine change that is partial or incomplete.',
    'Competing pressures pulling in different directions.',
    'Incomplete information — one side of the tension is underwritten.',
    'Shame preventing honest account of one side.',
    'Context shift — different entries reflect different moments.',
    'Unresolved state — both things are true at different times.',
    'Grief or loss holding two opposed states simultaneously.',
    'Recovery — the old pattern and the new one both present during transition.',
  ],


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'False resolution — collapsing tension into a clean conclusion.',
    'Moral judgement.',
    'Overconfidence in either direction.',
    'Treating contradiction as proof of dishonesty.',
    'Losing the most informative part of the map.',
    'Missing self-contradiction within a single entry.',
    'Missing positive-frame vs negative-detail tension.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Detection pattern too broad — false contradictions across unrelated entries.',
    'No evidence snippets — output is generic and unhelpful.',
    'Contradiction output resolves rather than names.',
    'Contradiction treated as failure state rather than live map state.',
    'Correction not applied — tension repeats after user has explained it.',
    'Self-contradiction within entry missed.',
    'Positive framing accepted at face value — negative detail not surfaced.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'Do not use contradiction as proof of lying. Contradiction is a map state — not a verdict. The sorter names the tension only.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'CTH-01',
      entries:  [
        { text: 'I have changed. I am a different person now. Things have changed.', date: '2026-01-01' },
        { text: 'Same mistake again. Same old pattern. I fell back into it.', date: '2026-01-20' },
      ],
      expected: { contradictions: { hasContradiction: true } },
    },
    {
      id:       'CTH-02',
      entries:  [
        { text: 'Family is everything. My kids come first. I feel good about it.', date: '2026-01-01' },
        { text: 'Things are difficult. I am struggling with everything.', date: '2026-01-15' },
      ],
      expected: { contradictions: { hasContradiction: true } },
    },
    {
      id:       'CTH-03',
      entries:  [
        { text: 'Things are going well. I am in a good place. No major issues.', date: '2026-01-01' },
        { text: 'But actually, if I am honest, there was an incident this week.', date: '2026-01-15' },
      ],
      expected: { contradictions: { hasContradiction: true } },
    },
    {
      id:       'CTH-04',
      entries:  [
        { text: 'I keep my cool. I stay calm. I do not react.', date: '2026-01-01' },
        { text: 'I lost it when they pushed me. I snapped and reacted badly.', date: '2026-01-20' },
      ],
      expected: { contradictions: { hasContradiction: true } },
    },
    {
      id:       'CTH-05',
      entries:  [
        { text: 'I am trying but I keep not following through. I mean to but I never do.', date: '2026-01-01' },
        { text: 'Same thing again today.', date: '2026-01-10' },
      ],
      expected: { contradictions: { hasContradiction: true } },
    },
    {
      id:       'CTH-06',
      entries:  [
        { text: 'I have changed. Same mistake again though. I am different now.', date: '2026-01-01' },
        { text: 'Things are better but the same old pattern.', date: '2026-01-15' },
      ],
      expected: { contradictions: { hasContradiction: true } },
    },
    {
      id:       'CTH-07',
      entries:  [
        { text: 'I am ready. I have what it takes. I can handle this.', date: '2026-01-01' },
        { text: 'I could not handle it. I was not ready. I told myself I could but I collapsed.', date: '2026-01-15' },
      ],
      expected: { contradictions: { hasContradiction: true } },
    },
  ],

};
