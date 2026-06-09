// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 16  Meta Reading  v0.2.1
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: read the person's engagement with the map itself.
// Is the map being used as a mirror or a stage?
// Are entries becoming more honest or more performed?
//
// v0.2.0 — full pattern library:
//   — honestySignals expanded: full vocabulary range of
//     genuine self-accounting language.
//   — performanceSignals expanded: full vocabulary range of
//     managed, performed, and compliance-recording language.
//   — formulaicRx added: repetitive structural patterns
//     that indicate the map is being managed.
//   — crisisOnlyRx added: language that appears only at
//     crisis points — map used as pressure valve.
//   — deepeningSignals expanded: markers of increasing
//     honesty and engagement over time.
//   — thinningSignals expanded: markers of decreasing
//     engagement and formulaic drift.
// ══════════════════════════════════════════════════════════

const BehaviourMetaReading = {

  id:       'meta-reading',
  name:     'Meta Reading',
  version:  '0.2.1',

  purpose:
    'Read the person\'s engagement with the map over time. Is the map being used as a mirror or a stage? Are entries becoming more honest or more performed?',

  coreRule:
    'A map that is being performed for is not a map. It is a compliance record. Performed entries produce a false picture. The map must be able to detect when its own picture is unreliable because of how it is being used.',


  // ── Engagement Types ──────────────────────────────────────

  engagementTypes: [
    { key: 'honest',     label: 'Honest engagement',     desc: 'Entries contain self-correction, contradiction, admission of difficulty, and material that does not reflect well. The map is being used as a mirror.' },
    { key: 'performed',  label: 'Performed engagement',  desc: 'Entries consistently present positive framing, achievement language, and absence of difficulty. Compliance recording rather than honest account.' },
    { key: 'selective',  label: 'Selective engagement',  desc: 'Some areas written about extensively. Others known to be significant consistently absent.' },
    { key: 'deepening',  label: 'Deepening engagement',  desc: 'Entries becoming more specific, more honest, more willing to name difficulty over time.' },
    { key: 'thinning',   label: 'Thinning engagement',   desc: 'Entries becoming shorter, less specific, or more formulaic.' },
    { key: 'crisis_only',label: 'Crisis-only engagement',desc: 'Entries appear primarily when something has gone wrong.' },
    { key: 'irregular',  label: 'Irregular engagement',  desc: 'Entry frequency inconsistent in a way that affects map reliability.' },
  ],


  // ── Honesty Signals ───────────────────────────────────────
  // Full vocabulary range of genuine self-accounting.
  // Presence of these signals suggests the map is being used honestly.

  honestySignals: [
    {
      key: 'self_correction',
      rx: /\b(I was wrong|I got that wrong|I need to correct|I have to be honest|if I am honest|if I am being honest|to be honest|the truth is|I lied|I was not honest|I was not being truthful|I was not being real|I have not been telling the truth|I have been hiding|I have been avoiding admitting|I said it was fine but it was not|I said I was okay but I was not|I told myself|I convinced myself|I pretended|looking back|on reflection|thinking about it honestly|I need to correct something|I said before that|I was wrong about|that was not accurate|that was not true|that was not the full picture)\b/i,
    },
    {
      key: 'admission',
      rx: /\b(I failed|I broke it|I relapsed|I slipped|I went back|I did it again|I did not|I could not|I was not able to|I let it go|I gave up|I gave in|I caved|I avoided|I have not done|I have been avoiding|I missed|I cancelled|I did not show up|I did not follow through|I was not honest|I have not been|I have been lying to myself|I made a mistake|I got it wrong|I handled it badly|I lost my temper|I reacted|I should not have|I regret)\b/i,
    },
    {
      key: 'difficulty_named',
      rx: /\b(it is hard|it is difficult|it is not easy|I am struggling|I am finding it hard|I do not know|I am not sure|I cannot see|I am lost|I am confused|I do not have the answer|I have no idea|I do not know what to do|I am stuck|I cannot face|I cannot start|I cannot make myself|I am scared|I am worried|I am anxious about|I dread|it weighs on me|it is on my mind|it is bothering me|it is troubling me|I have been carrying|I have been holding|it is heavy|I do not know how to|I am not sure how to|I cannot figure out)\b/i,
    },
    {
      key: 'self_contradiction',
      rx: /\b(but also|at the same time|on the other hand|and yet|I know I should but|I want to but|I say one thing and|I am not consistent|I keep saying but|I tell myself but|part of me and part of me|I am torn|I am conflicted|I feel two ways|both things are true for me|I believe it but I also|I want it but I also resist)\b/i,
    },
    {
      key: 'unflattering_material',
      rx: /\b(I am not proud of|I am ashamed of|I regret|I should not have|it was not my best|I handled it badly|I was wrong to|I let people down|I disappointed|I hurt|I caused|I made it worse|I made things difficult|I did not help|I was not there|I was selfish|I was not thinking|I only thought of myself|my worst|at my worst|when I was at my worst|my lowest point)\b/i,
    },
  ],


  // ── Performance Signals ───────────────────────────────────
  // Full vocabulary range of managed, performed, and
  // compliance-recording language.

  performanceSignals: [
    {
      key: 'achievement_only',
      rx: /\b(I did well|I am doing great|I am doing really well|everything is good|things are going well|I have been strong|I have been consistent|I am on track|I am making progress|I am proud|I am pleased|no issues|no concerns|no problems|nothing to report|all good|going well|on track as usual|continuing as planned|I am positive|I am confident|I feel good about|I feel strong|I have it under control|I am managing well|I am handling it|I have been keeping to|I have maintained|I have not deviated)\b/i,
    },
    {
      key: 'formulaic',
      rx: /\b(as I mentioned|as before|same as last time|same as previously|nothing to report|no issues to report|nothing new|no change|continuing as normal|business as usual|as expected|as planned|I am still doing|I am still on|still going well|still no problems|week was fine|week went well|week was good|another good week|nothing significant|nothing major|nothing worth mentioning|keeping busy|staying focused|staying positive|staying on track)\b/i,
    },
    {
      key: 'absence_of_difficulty',
      desc: 'No difficulty language, no admission, no self-correction across multiple entries. Structural — not a single-entry signal.',
    },
    {
      key: 'always_resolved',
      desc: 'Every entry ends with resolution or positive framing. Difficulty appears only as overcome. Structural.',
    },
  ],


  // ── Formulaic Structure ───────────────────────────────────
  // Entry structure that suggests a template is being followed
  // rather than honest account being written.

  formulaicRx: /\b(this week I|last week I|today I|this month I|I continued|I maintained|I kept up|I followed|I adhered to|in terms of|with regard to|regarding|as for|on the topic of|I would say|I would describe|I would summarise|to summarise|overall|in summary|in conclusion|to conclude|looking forward to|planning to|intending to|aiming to continue|I feel that|I believe that|I think that|it seems that|it appears that)\b/i,


  // ── Crisis-Only Signals ───────────────────────────────────
  // Entry language that appears primarily after crises.

  crisisOnlyRx: /\b(I do not know what to do|everything has gone wrong|I need help|it has all fallen apart|I have hit rock bottom|I am in crisis|I cannot cope|I have nowhere to turn|I am desperate|something has happened|there has been an incident|it has gone badly|I have to write this|I need to record|I had to say something|after what happened|following the incident|in light of recent events)\b/i,


  // ── Deepening Indicators ──────────────────────────────────

  deepeningIndicators: [
    'Entries become more specific over time — named people, dates, conditions.',
    'Admissions appear that were absent in earlier entries.',
    'Person corrects or revisits earlier statements.',
    'Difficulty is named without immediate resolution.',
    'Unflattering material appears — things that do not reflect well.',
    'Self-contradiction named within entries.',
    'Entry length increases over time with specific content.',
    'New topics appear that were not in the original baseline.',
    'The person names what they have been avoiding saying.',
  ],


  // ── Thinning Indicators ───────────────────────────────────

  thinningIndicators: [
    'Entry length decreases over time without external cause.',
    'Specific detail replaced by general summary.',
    'Entries become formulaic or repetitive in structure.',
    'Gaps between entries increase without explanation.',
    'Honesty signals disappear from recent entries.',
    'Entries begin to read like reports rather than accounts.',
    'Difficulty stops appearing in entries.',
    'Resolution appears in every entry regardless of what is described.',
    'The same phrases recur across entries with minor variation.',
  ],


  // ── Output Rules ──────────────────────────────────────────

  outputRules: {
    noJudgement:
      'Performance or thinning engagement is named as a map reliability issue — not a character verdict.',
    mapReliabilityEffect:
      'If performance signals dominate, the map must note that its picture may be unreliable.',
    noAccusation:
      'Do not tell the person they are lying to the map. Name the pattern and its effect on reliability.',
    deepeningAcknowledged:
      'Deepening engagement is a positive map signal. The picture is becoming more reliable.',
  },


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'A performed map being treated as an honest one.',
    'The map producing confident reads from unreliable material.',
    'Compliance recording being mistaken for genuine self-account.',
    'Missing the signal that the person has stopped trusting the map.',
    'Producing a handover based on a performed record.',
    'Missing deepening engagement — treating honesty as noise.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Performance signals too narrow — misses subtle performance.',
    'Honesty signals too broad — counts generic reflection as genuine admission.',
    'Thinning engagement blamed on person when external cause is present.',
    'Crisis-only pattern misread as avoidance rather than engagement style.',
    'Meta reading output presented in a way that feels accusatory.',
    'Formulaic language flagged when the person is genuinely consistent.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'This behaviour reads the relationship between the person and the map — not the person\'s honesty in the world. A person may be performed for the map and entirely honest in other contexts. Meta reading names what kind of thing the map is being given — not what kind of person is giving it.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'MR-01',
      entries:  [
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-01-01' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-01-08' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-01-15' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-01-22' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-01-29' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-02-05' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-02-12' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-02-19' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-02-26' },
        { text: 'Everything is fine. Making progress. On the right track. No concerns.', date: '2026-03-05' },
      ],
      expected: { metaReading: { mapReliable: false } },
    },
    {
      id:       'MR-02',
      entries:  [
        { text: 'Things okay.', date: '2026-01-01' },
        { text: 'Okay week.', date: '2026-01-08' },
        { text: 'If I am honest, things have been harder than I let on. The truth is I have been struggling.', date: '2026-01-15' },
        { text: 'I was wrong about that. It did not go as well as I said. I have to admit it.', date: '2026-01-22' },
        { text: 'Being more honest now. I have to be honest about what is really happening.', date: '2026-01-29' },
      ],
      expected: { metaReading: { mapReliable: true } },
    },
    {
      id:       'MR-03',
      entries:  [
        { text: 'This week I continued as normal. No issues. Keeping on track. All good.', date: '2026-01-01' },
        { text: 'This week I continued as normal. No issues. Keeping on track. All good.', date: '2026-01-08' },
        { text: 'This week I continued as normal. No issues. Keeping on track. All good.', date: '2026-01-15' },
        { text: 'Short.', date: '2026-01-22' },
        { text: '.', date: '2026-01-29' },
      ],
      expected: { metaReading: {} },
    },
    {
      id:       'MR-04',
      entries:  [
        { text: 'Crisis this week. Very bad. I cannot cope. Everything has fallen apart.', date: '2026-01-01' },
        { text: 'Bad again. Another crisis. Cannot deal with this.', date: '2026-02-15' },
        { text: 'Crisis again. Something has happened and I am not coping.', date: '2026-04-01' },
      ],
      expected: { metaReading: {} },
    },
    {
      id:       'MR-05',
      entries:  [
        { text: 'I was wrong about that. If I am honest, it did not go well. I have to admit it.', date: '2026-01-01' },
        { text: 'Being honest now. I need to be honest about what happened.', date: '2026-01-15' },
      ],
      expected: { metaReading: { mapReliable: true } },
    },
    {
      id:       'MR-06',
      entries:  [
        { text: 'This week I continued as normal. No issues. Keeping on track. Making progress.', date: '2026-01-01' },
        { text: 'This week I continued as normal. No issues. Keeping on track. Making progress.', date: '2026-01-08' },
        { text: 'This week I continued as normal. No issues. Keeping on track. Making progress.', date: '2026-01-15' },
      ],
      expected: { metaReading: {} },
    },
    {
      id:       'MR-07',
      entries:  [
        { text: 'The addiction issue came up once and it was difficult.', date: '2026-01-01' },
        { text: 'Things okay.', date: '2026-01-15' },
        { text: 'Getting through.', date: '2026-01-29' },
        { text: 'Fine.', date: '2026-02-12' },
        { text: 'Same.', date: '2026-02-26' },
      ],
      expected: { metaReading: {} },
    },
  ],

};
