// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 02  Baseline vs Live Material  v0.2.1
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: compare the starting declared state against later
// material. The baseline is not onboarding copy — it is the
// first map. Later entries confirm it, contradict it, weaken
// it, update it, or reveal what was invisible at the start.
//
// v0.2.0 — pattern library added:
//   — resolutionRx: language suggesting a baseline issue
//     has been addressed.
//   — avoidanceSignalRx: absence language that may mean
//     resolved, avoided, or simply not written about.
//   — emergenceRx: new material appearing post-baseline.
//   — directionRx: goal and direction language.
//   — capabilityClaimRx: skill claims at baseline that
//     can be tracked against entry behaviour.
//   — driftRx: topic framing that has shifted from baseline.
// ══════════════════════════════════════════════════════════

const BehaviourBaselineVsLiveMaterial = {

  id:       'baseline-vs-live-material',
  name:     'Baseline vs Live Material',
  version:  '0.2.1',

  purpose:
    'Compare the starting declared state against later material. Detect drift, contradiction, emergence, and silence without treating any of them as dishonesty.',

  coreRule:
    'People often describe one state at the beginning and then reveal a different state through later entries. The sorter detects that difference. It does not assign motive.',


  // ── Baseline Role ─────────────────────────────────────────

  baselineRole: {
    description:   'The first declared map of the situation. The most complete self-account available at the start. Not truth — declared state.',
    notStatic:     'The baseline is not a fixed reference to check compliance against. It is the starting position. Later material may legitimately update it.',
    notOnboarding: 'The baseline is not a form to fill. It is the most honest account the person can give at the time of writing.',
  },


  // ── Resolution Language ───────────────────────────────────
  // Suggests a baseline issue has been addressed.
  // Must be treated as possible resolution — not confirmed.

  resolutionRx: /\b(sorted|resolved|dealt with|handled|addressed|fixed|closed|finished|no longer an issue|no longer a problem|that is behind me|moved past|I got through it|I came through it|it is done|it is over|I sorted it|I resolved it|I dealt with it|I fixed it|I closed it|it worked out|it came good|it came right|I found a way through|I found a solution|I found an answer|no longer relevant|no longer applies|that chapter is closed)\b/i,


  // ── Absence Signal ────────────────────────────────────────
  // Topic from baseline absent from entries — cannot distinguish
  // resolved, avoided, or simply not written about.

  absenceSignals: [
    'Topic named at baseline has not appeared in any entry.',
    'Topic named at baseline appeared once then disappeared.',
    'Topic named at baseline only reappears in context of crisis.',
  ],


  // ── Emergence Language ────────────────────────────────────
  // New material appearing post-baseline — not present at start.

  emergenceRx: /\b(something new|a new issue|a new problem|a new pressure|something has come up|something has happened|something has changed|I did not mention|I did not say|I forgot to include|I left out|there is something else|there is more|there is another thing|since then|after I wrote that|after the baseline|since I started|something I did not realise|I did not know at the time|I have realised since|I have noticed since|I have become aware of)\b/i,


  // ── Direction Language ────────────────────────────────────
  // Goal and direction language — detectable at baseline
  // and trackable across entries.

  directionRx: /\b(my goal|my aim|my direction|what I want|what I am working toward|I want to|I am trying to achieve|I am working toward|I am focused on|my plan|my intention|what I intend|where I want to be|what I am doing this for|the reason I am here|why I am doing this|what I want back|what I want to rebuild|what I want to prove|my future|the future I want|what matters to me|what I care about|I want to get to|I want to reach|I am heading toward)\b/i,


  // ── Capability Claim ──────────────────────────────────────
  // Skill claims at baseline — trackable against entry behaviour.

  capabilityClaimRx: /\b(I am good at|I am capable of|I can handle|I manage well|I know how to|I am able to|I have the skill|I have experience|I have done it before|I am disciplined|I am reliable|I follow through|I keep commitments|I stay calm|I do not react|I walk away|I handle pressure|I have support|I have people around me|I have a network|I have a routine|I have structure|I have a plan)\b/i,


  // ── Drift Signals ─────────────────────────────────────────
  // Topic framing that has shifted meaningfully from baseline.

  driftRx: /\b(actually|in fact|to be honest|if I am honest|the truth is|it is more like|it is actually|it is not quite|it is different from|that was not quite right|I overstated|I understated|I was not quite honest about|I did not fully explain|it is more complicated than|it is more serious than|I realise now|I see now|I understand now|looking back|on reflection|it was not as|it was more|I was not as|I was more)\b/i,


  // ── Comparison Output Types ───────────────────────────────

  outputTypes: [
    { key: 'baseline_pressure_still_visible',  label: 'Baseline pressure still visible',              desc: 'A pressure named at baseline continues to appear in entries.' },
    { key: 'baseline_pressure_absent',         label: 'Baseline pressure absent from current entries', desc: 'Cannot distinguish resolved, avoided, or not written about without more material.' },
    { key: 'stated_skill_not_demonstrated',    label: 'Baseline skill stated but not demonstrated',   desc: 'A capability claimed at baseline has not appeared in entry behaviour.' },
    { key: 'new_gap_emerging',                 label: 'New gap emerging after baseline',              desc: 'Something not in baseline is now appearing as a pressure or gap.' },
    { key: 'baseline_issue_possibly_resolved', label: 'Baseline issue possibly resolved',             desc: 'Not reappeared and entries suggest forward movement in that area.' },
    { key: 'baseline_issue_possibly_avoided',  label: 'Baseline issue possibly avoided',              desc: 'Not reappeared but no resolution language visible either.' },
    { key: 'baseline_issue_not_written_about', label: 'Baseline issue not written about',             desc: 'Topic has disappeared. No signal either way.' },
    { key: 'direction_missing',                label: 'Direction missing at baseline',                desc: 'No direction stated at baseline. The map is reading movement without a destination.' },
    { key: 'direction_emerging',               label: 'Direction now emerging',                       desc: 'Direction absent at baseline is now appearing in entries.' },
    { key: 'baseline_drift',                   label: 'Baseline framing has drifted',                 desc: 'Later entries reframe baseline material — earlier account may have been incomplete.' },
  ],


  // ── Reading Rules ─────────────────────────────────────────

  readingRules: {
    silence:
      'Silence on a topic after baseline does not mean resolution. It may mean resolved, avoided, or simply not written about. State the ambiguity — do not resolve it.',
    absence:
      'Absence of a stated skill in entries does not mean the skill is gone. It may mean the conditions for it have not arisen. Read absence as a gap in evidence, not a gap in capability.',
    contradiction:
      'When baseline and entries contradict, the entries carry more weight — they are more recent and more specific. Name the contradiction without assigning cause.',
    emergence:
      'New material appearing in entries that was absent at baseline is an emerging signal. Treat with appropriate confidence based on Behaviour 01 independent counting.',
    drift:
      'If the person reframes baseline material in later entries, the reframing carries weight. The baseline was the best account at the time — not a fixed truth.',
  },


  // ── Correction Interaction ────────────────────────────────

  correctionInteraction:
    'If a correction marks baseline material as stale, that signal should be downgraded or suppressed in comparison. Apply corrections before running the baseline comparison pass.',


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'Treating the baseline as static truth.',
    'Treating later entries without their baseline context.',
    'Missing state drift over time.',
    'Missing declared capability that never appears in action.',
    'Missing new material that was absent at the start.',
    'Over-reading silence as resolution.',
    'Missing drift where the person reframes their own baseline.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Over-reading silence as resolution.',
    'Over-reading absence as avoidance.',
    'Bad regex coverage producing false open gaps.',
    'Treating vague baseline material as strong evidence.',
    'Failing to apply corrections before comparison.',
    'Missing drift — treating later reframing as contradiction rather than update.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'Do not treat baseline mismatch as deception. It may reflect new information, changed conditions, avoidance, shame, poor initial wording, or incomplete first capture. The sorter reports the mismatch — not the motive.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'BLM-01',
      baseline: 'Money has been a major pressure for years.',
      entries:  [
        { text: 'Things are okay.', date: '2026-01-01' },
        { text: 'Getting through.', date: '2026-01-15' },
        { text: 'Nothing much to report.', date: '2026-01-29' },
        { text: 'Carrying on.', date: '2026-02-12' },
        { text: 'Still the same.', date: '2026-02-26' },
      ],
      expected: { baseline: {} },
    },
    {
      id:       'BLM-02',
      baseline: 'I keep a routine. I show up every day without fail.',
      entries:  [
        { text: 'Things are difficult.', date: '2026-01-01' },
        { text: 'Struggling a bit.', date: '2026-01-15' },
      ],
      expected: { baseline: {} },
    },
    {
      id:       'BLM-03',
      baseline: 'Things are okay.',
      entries:  [
        { text: 'My family have been on my mind a lot recently.', date: '2026-01-01' },
        { text: 'Family situation is complicated.', date: '2026-01-15' },
        { text: 'Still thinking about family.', date: '2026-01-29' },
      ],
      expected: { baseline: {} },
    },
    {
      id:       'BLM-04',
      baseline: 'Money is not an issue. Finances are fine.',
      entries:  [
        { text: 'Really struggling with money this week. Debt is building.', date: '2026-01-01' },
        { text: 'Money pressure continues. Very tight.', date: '2026-01-15' },
        { text: 'Financial situation getting worse.', date: '2026-01-29' },
      ],
      expected: { baseline: {} },
    },
    {
      id:       'BLM-05',
      baseline: 'I was doing well last year.',
      entries:  [
        { text: 'If I am honest, that was not quite right when I wrote it. Things were not good.', date: '2026-01-01' },
        { text: 'I have to be honest about the baseline now.', date: '2026-01-15' },
      ],
      expected: { baseline: {} },
    },
    {
      id:       'BLM-06',
      baseline: 'Money has been a problem. Things are very difficult financially.',
      entries:  [
        { text: 'Money has been a problem for a while.', date: '2026-01-01' },
        { text: 'Still tight financially.', date: '2026-01-15' },
        { text: 'Financial pressure continues.', date: '2026-01-29' },
        { text: 'Getting by but money is still the issue.', date: '2026-02-12' },
        { text: 'No change to the financial situation.', date: '2026-02-26' },
      ],
      expected: { baseline: {} },
    },
  ],

};
