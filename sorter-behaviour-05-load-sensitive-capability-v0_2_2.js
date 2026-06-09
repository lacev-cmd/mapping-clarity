// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 05  Load-Sensitive Capability  v0.2.2
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: distinguish a skill that appears in calm conditions
// from one that holds under pressure. A capability is not
// fully reliable until it survives load. Breakdown under load
// is a reliability reading — not a verdict on character.
//
// v0.2.2 — regex precision pass:
//   — pain load signal: removed `my back` and `my joints`
//     (too short — fire on any mention regardless of pain context).
//   — fear load signal: removed `what if` (too broad — fires on
//     planning and speculation, not just fear).
//   — institutional load signal: removed `official`, `the system`,
//     `the organisation`, `bureaucracy` (too broad — match too
//     many non-institutional-pressure contexts).
//   — relational load signal: replaced `domestic` with
//     `domestic violence` (bare `domestic` matches chores etc).
//   — heldUnderLoadRx: removed `still`, `anyway`, `regardless`
//     (too short and common — longer phrases carry the signal).
//
// v0.2.0 — full pattern library:
//   — defaultLoadSignals expanded: full vocabulary range
//     across all generic load types.
//   — breakdownRx added: language indicating capability
//     broke under pressure.
//   — heldUnderLoadRx added: language indicating capability
//     held despite pressure.
//   — calmOnlyRx added: capability described in calm
//     conditions without load context.
//   — stalenessRx added: capability described as past or
//     no longer present.
// ══════════════════════════════════════════════════════════

const BehaviourLoadSensitiveCapability = {

  id:       'load-sensitive-capability',
  name:     'Load-Sensitive Capability',
  version:  '0.2.2',

  purpose:
    'Distinguish a skill shown in calm conditions from a skill that holds under pressure. Read reliability, not worth.',

  coreRule:
    'A capability is not fully reliable until it survives load. The same person may show a skill in ordinary conditions and lose it under stress, pain, conflict, time pressure, fear, shame, fatigue, or institutional pressure.',


  // ── Skill Status Tiers ────────────────────────────────────

  skillStatusTiers: [
    { key: 'absent',                        label: 'Skill absent',                              desc: 'No evidence of this capability in entries.' },
    { key: 'appearing',                     label: 'Skill appearing',                           desc: 'Capability visible in at least one entry. Not yet confirmed.' },
    { key: 'strengthening',                 label: 'Skill strengthening',                       desc: 'Capability appearing across multiple independent entries.' },
    { key: 'strong',                        label: 'Skill strong',                              desc: 'Capability consistently demonstrated across the period.' },
    { key: 'stale',                         label: 'Skill stale',                               desc: 'Capability was present in earlier material but has not appeared recently.' },
    { key: 'breaking_under_load',           label: 'Skill breaking under load',                 desc: 'Capability is present but shows signs of collapse when pressure arrives.' },
    { key: 'not_reliable_under_pressure',   label: 'Skill present but not load-tested',         desc: 'Skill demonstrated in calm conditions only.' },
    { key: 'held_under_load',               label: 'Skill held under load',                     desc: 'Capability demonstrated specifically under conditions of pressure.' },
  ],


  // ── Load Signal Types ─────────────────────────────────────
  // Full vocabulary range. Grouped by load type.
  // Domain guides extend with sector-specific signals.

  defaultLoadSignals: [
    {
      key: 'stress',
      rx: /\b(stress|stressed|stressful|under pressure|pressure building|pressure mounting|high pressure|intense pressure|under a lot of pressure|everything at once|too much going on|overwhelmed|overwhelm|at breaking point|stretched thin|cannot cope|hard to cope|struggling to cope|barely coping|on the edge)\b/i,
    },
    {
      key: 'conflict',
      rx: /\b(argument|argued|arguing|fight|fighting|confrontation|confronted|difficult conversation|heated|it escalated|it got heated|we fell out|falling out|they pushed|pushed back|push back|they came at me|they challenged|tension|tense|volatile|hostile|aggressive|it blew up|it kicked off)\b/i,
    },
    {
      key: 'pain',
      rx: /\b(pain|painful|hurting|in agony|agony|flare|flare up|bad day physically|chronic pain|pain levels|my condition|my health|physical pain|in a lot of pain|unable to move|physically difficult|body struggling|my illness|unwell|sick|not well physically)\b/i,
    },
    {
      key: 'fatigue',
      rx: /\b(exhausted|exhaustion|worn out|tired|tiredness|depleted|running on empty|no energy|low energy|drained|burned out|burnout|burnt out|fatigued|cannot keep going|nothing left|I have nothing left|empty|I am running out|I cannot sustain|I am flagging|I am fading)\b/i,
    },
    {
      key: 'fear',
      rx: /\b(scared|afraid|frightened|anxious|anxiety|terrified|terror|dread|dreading|fearful|I fear|I am scared|I am afraid|I am terrified|I am dreading|panic|panicking|panic attack|heart racing|I froze|I shut down from fear|the fear of|the thought of|worst case)\b/i,
    },
    {
      key: 'shame',
      rx: /\b(shame|ashamed|embarrassed|embarrassment|humiliated|humiliation|exposed|judged|being judged|they will judge|what will they think|I feel like a failure|I feel worthless|I feel pathetic|I am so stupid|I cannot face|I am too embarrassed|I cannot let them see|the shame of|the embarrassment of|I could not look them in the eye)\b/i,
    },
    {
      key: 'time',
      rx: /\b(rushed|rushing|no time|deadline|running late|last minute|time pressure|pressure of time|not enough time|I ran out of time|I did not have time|everything at once|too many things|too much on my plate|juggling|I could not fit it in|there was no time|the clock was|the deadline)\b/i,
    },
    {
      key: 'institutional',
      rx: /\b(hearing|adjudication|review|assessment|inspection|board|panel|they decided|the decision came|waiting for the decision|court|tribunal|review date|appeal|formal process|red tape|waiting on them)\b/i,
    },
    {
      key: 'financial',
      rx: /\b(money|no money|broke|debt|in debt|overdrawn|behind on|cannot pay|could not pay|bills|rent|eviction|arrears|financial pressure|money problems|money stress|running out of money|I have nothing left financially|living on nothing|scraping by)\b/i,
    },
    {
      key: 'isolation',
      rx: /\b(alone|lonely|loneliness|isolated|no one|no support|no one to talk to|cut off|by myself|on my own|no one around|I had no one|nobody|I was alone|completely alone|no contact|out of contact|I could not reach anyone|there was nobody)\b/i,
    },
    {
      key: 'relational',
      rx: /\b(relationship broke|they left|split up|separated|divorce|falling out|estranged|no contact with family|family issues|problems at home|domestic violence|the relationship|my partner|my ex|they are not speaking to me|I am not speaking to them|family conflict|family pressure|difficult at home)\b/i,
    },
    {
      key: 'mental_health',
      rx: /\b(depression|depressed|low mood|very low|dark place|dark period|mental health|mental health crisis|breakdown|hit a wall|cannot get out of bed|not functioning|struggling mentally|intrusive thoughts|dissociating|not present|spiralling|I hit a low|the lowest I have been|I was not okay)\b/i,
    },
  ],


  // ── Breakdown Language ────────────────────────────────────
  // Capability broke under pressure — specific to a skill.

  breakdownRx: /\b(I lost it|I lost my temper|I snapped|I blew up|I exploded|I reacted badly|I could not hold it|I could not keep it together|I fell apart|I broke down|I gave in|I gave up|I caved|I folded|I crumbled|I collapsed|I went back|I slipped|I relapsed|I broke the pattern|I broke the rule|I stopped|I missed|I did not go|I did not keep|I could not maintain|the structure broke|the routine broke|I abandoned|I dropped|it all fell apart|everything fell apart|I could not function|under pressure I|when it got hard I|when the pressure came I|in the moment I|when it happened I|when they pushed I)\b/i,


  // ── Held Under Load ───────────────────────────────────────
  // Capability held despite pressure.

  heldUnderLoadRx: /\b(even though|despite|although|in spite of|I did it anyway|I kept going anyway|I showed up anyway|I held it anyway|I did not feel like it but|I was exhausted but|I was scared but|I was under pressure but|even when it was hard|even in that moment|I pushed through|I held it together|I kept my head|I stayed calm|I did not react|I did not engage|I walked away|I removed myself|I maintained|I kept the boundary|I kept the routine|I kept going|I held on|I did not give in|I did not give up|I stayed with it|under pressure I still|even when they pushed I|despite everything I)\b/i,


  // ── Calm-Only Language ────────────────────────────────────
  // Capability described without load context.
  // Not a negative signal — but not load-tested either.

  calmOnlyRx: /\b(usually|normally|generally|typically|most of the time|as a rule|in ordinary circumstances|when things are calm|when things are normal|day to day|on a good day|when I am okay|when I am well|most days|most weeks|on the whole|by and large|I tend to|I am usually|I am generally|I normally|in general I|under normal conditions|in normal circumstances)\b/i,


  // ── Staleness Language ────────────────────────────────────
  // Capability was present but is no longer current.

  capabilityStaleRx: /\b(I used to|I used to be able to|I could once|there was a time when I|I was good at|I was capable of|I managed to once|I no longer|I cannot anymore|I have lost the ability|I have lost that|it used to work|I used to manage|I used to handle it|that skill is gone|that is not me anymore|I am not that person|since then I|after that I could not|it changed after)\b/i,


  // ── Reading Rule ──────────────────────────────────────────

  readingRule:
    'Read load-sensitive capability locally where possible. Do not mark breakdown just because pressure and negation appear in the same entry. Check the sentence or nearby sentence around the skill mention. Whole-entry reading blurs success and breakdown.',


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'Overstating capability based on calm-condition evidence.',
    'Treating intention as demonstrated skill.',
    'Treating calm-state skill as pressure-tested skill.',
    'Missing genuine resilience shown under load.',
    'Missing breakdown conditions that recur.',
    'Missing stale capability that no longer operates.',
    'Conflating load language with breakdown when the skill actually held.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Whole-entry reading blurs success and breakdown into the same signal.',
    'Negation close to skill language triggers false breakdown.',
    'Load and skill appear in same entry but describe different events.',
    'Domain skill definition too vague to detect reliably.',
    'No local evidence snippet to support the tier assigned.',
    'Held-under-load signal missed because entry tone is negative.',
    'Stale capability counted as current skill.',
    'Calm-only capability overstated as reliable.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'Do not treat breakdown under load as failure of character. It may indicate insufficient support, excessive load, unrealistic conditions, pain, danger, or incomplete preparation. The map reads reliability — not worth.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'LSC-01',
      entries:  [{ text: 'Someone pushed me. I kept my head down and said nothing. I stayed calm.', date: '2026-01-01' }],
      expected: { load: {} },
    },
    {
      id:       'LSC-02',
      entries:  [{ text: 'I tried to keep calm but I lost it and blew up. I could not hold it together.', date: '2026-01-01' }],
      expected: { load: { capabilityStatus: 'breaking_under_load' } },
    },
    {
      id:       'LSC-03',
      entries:  [
        { text: 'I usually keep my routine. But after the difficult call I stopped going.', date: '2026-01-01' },
        { text: 'The emotional pressure broke the structure completely.', date: '2026-01-15' },
      ],
      expected: { load: {} },
    },
    {
      id:       'LSC-04',
      entries:  [{ text: 'I attended every session despite the pain and difficulty. I kept going.', date: '2026-01-01' }],
      expected: { load: {} },
    },
    {
      id:       'LSC-05',
      entries:  [{ text: 'I used to do this but not anymore. It has been months.', date: '2026-01-01' }],
      expected: { load: {} },
    },
    {
      id:       'LSC-06',
      entries:  [{ text: 'Generally I manage fine when things are calm. It is just the hard moments that are the problem.', date: '2026-01-01' }],
      expected: { load: {} },
    },
    {
      id:       'LSC-07',
      entries:  [{ text: 'I was exhausted and scared but I still showed up and did it.', date: '2026-01-01' }],
      expected: { load: {} },
    },
    {
      id:       'LSC-08',
      entries:  [{ text: 'The pressure from the institution was immense but I did not react. I walked away from the conflict.', date: '2026-01-01' }],
      expected: { load: {} },
    },
  ],

};
