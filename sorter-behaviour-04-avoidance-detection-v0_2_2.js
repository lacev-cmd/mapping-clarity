// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 04  Avoidance Detection  v0.2.2
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: detect when something important is being delayed,
// circled, or written about without action. Avoidance is
// drag on the map — not a moral failure, not a character
// verdict. The missing move often matters more than the
// visible emotion.
//
// v0.2.2 — regex precision pass:
//   — indirectAvoidanceRx: removed `I might` (too broad —
//     fires on unrelated uncertain language).
//   — indirectAvoidanceRx: removed bare `I am not sure`
//     (legitimate uncertainty, not avoidance on its own —
//     `I am not sure when`, `I am not sure where to start`,
//     `I am not sure it will help`, `I am not sure I am ready`
//     retained as they carry deferral specificity).
//
// v0.2.0 — full pattern library:
//   — lexicalAvoidanceRx expanded: full vocabulary range of
//     self-named avoidance language.
//   — indirectAvoidanceRx added: avoidance language that
//     does not name itself as avoidance.
//   — deflectionRx added: topic-changing and minimising
//     language that signals avoidance without naming it.
//   — knowingWithoutDoingRx added: understanding the problem
//     without changing the response.
//   — defaultActionRx expanded to match movement v0.3.0 scope.
//   — notAvoidance list expanded with full vocabulary.
// ══════════════════════════════════════════════════════════

const BehaviourAvoidanceDetection = {

  id:       'avoidance-detection',
  name:     'Avoidance Detection',
  version:  '0.2.2',

  purpose:
    'Detect when something important is being delayed, circled, or written about without action. Read the missing move, not the presence of emotion.',

  coreRule:
    'Avoidance is drag. It is not dishonesty, weakness, or failure. The map names it — it does not judge it.',


  // ── Detection Mechanisms ──────────────────────────────────

  mechanisms: {

    lexical: {
      name:  'Lexical avoidance',
      desc:  'Explicit avoidance language. The person names their own drag.',
      outputSingle:   'One instance of avoidance language — worth noting what is being named as undone.',
      outputRepeated: 'Avoidance language across multiple entries — the person is naming their own drag without acting on it.',
    },

    indirect: {
      name: 'Indirect avoidance',
      desc: 'Avoidance language that does not name itself as avoidance — circling, hedging, maybe-language.',
    },

    structural: {
      name:           'Structural avoidance',
      desc:           'A pressure appears across multiple entries but no action, resolution, decision, or escalation appears beside it.',
      outputTemplate: '{pressure} appears in multiple entries but no action language appears alongside it.',
      threshold:      2,
    },

    deflection: {
      name: 'Deflection',
      desc: 'Topic-changing or minimising language that redirects away from something significant.',
    },

    knowingWithoutDoing: {
      name: 'Knowing without doing',
      desc: 'Understanding the problem without changing the response to it.',
    },

  },


  // ── Lexical Avoidance ─────────────────────────────────────
  // Self-named avoidance — the person explicitly describes
  // their own delay, putting-off, or resistance.

  lexicalAvoidanceRx: /\b(I have been avoiding|I keep avoiding|I am avoiding|I have avoided|I keep putting it off|I keep putting off|I have been putting off|I put it off|I keep meaning to|I keep saying I will|I keep telling myself|I have not done it|I have not started|I have not gone back|I have not followed through|I have not dealt with|I have not faced|I have not addressed|I have not tackled|I cannot bring myself|I cannot make myself|I cannot face|I cannot start|I know I should|I know I need to|I know I have to|I am not ready|I do not feel ready|I am not there yet|I have been putting it to the back|I have been ignoring|I have been burying|I keep delaying|I keep postponing|I keep deferring|I have been dragging my feet|I have been stalling|I have been hesitating|I am scared to|I am afraid to|I am worried about|I dread|I do not want to deal with|I do not want to face|I do not want to think about|I have been burying my head|I have been hiding from|I have been running from)\b/i,


  // ── Indirect Avoidance ────────────────────────────────────
  // Avoidance without naming it — hedging, maybe-language,
  // future-framing, and vague deferral.

  indirectAvoidanceRx: /\b(maybe I will|maybe next week|maybe when|maybe if|perhaps I should|perhaps when|I might try|I might look into|I might get around to|at some point|eventually|one day|when the time is right|when things settle|when I am ready|when I have the energy|when things calm down|when it gets easier|I am not sure when|I have not decided when|I have not figured out when|I will see|I will think about it|I will consider it|I will look into it|it is on my list|it is something I want to do|it is something I need to look at|I have been thinking about it|I am still thinking|I am still deciding|I am not sure where to start|I do not know how to start|I am figuring out how|I am not sure it will help|I am not sure it is worth it|I am not sure I am ready)\b/i,


  // ── Deflection Language ───────────────────────────────────
  // Redirecting away from a significant topic — minimising,
  // changing subject, or framing away from responsibility.

  deflectionRx: /\b(anyway|but anyway|moving on|changing the subject|on a different note|it does not matter|it is not important|it is not a big deal|it is fine really|I do not want to dwell|I do not want to go into it|I would rather not talk about|let us not focus on|that is not the main thing|that is not what matters|there are more important things|other things are more pressing|it is what it is|nothing I can do|what will be will be|no point worrying|I try not to think about it|I try not to dwell|I push it to the back|I distract myself|I keep busy so I do not have to|I stay busy to avoid|it is easier not to think about|I cope by not thinking about)\b/i,


  // ── Knowing Without Doing ─────────────────────────────────
  // Understanding the problem without changing the response.
  // Awareness without action is not movement.

  knowingWithoutDoingRx: /\b(I know what I need to do|I know what the problem is|I know what I should do|I understand the issue|I understand why|I get why|I see why|I know why|I am aware|I know it is|I recognise|I can see that|I understand that|I know I need to change|I know things need to change|I know something has to change|I have figured out|I have worked out|I have realised|I have understood|I know the pattern|I see the pattern|I understand the cycle|I know it is not working|I can see it is not working|I understand it is not helping|it is clear to me|it is obvious to me|I can see clearly|I understand fully)\b/i,


  // ── Default Action Language ───────────────────────────────
  // Aligned with movement v0.3.0. Absence of these signals
  // in a pressure-heavy entry is the structural avoidance signal.

  defaultActionRx: /\b(I called|I rang|I phoned|I texted|I messaged|I emailed|I wrote to|I reached out|I attended|I showed up|I went to|I turned up|I kept the appointment|I completed|I finished|I followed through|I saw it through|I submitted|I filed|I sent|I handed in|I delivered|I applied|I registered|I signed up|I booked|I scheduled|I arranged|I paid|I cleared|I settled|I spoke to|I talked to|I told|I had the conversation|I brought it up|I raised it|I reported|I contacted|I notified|I flagged|I asked for help|I used the support|I called the helpline|I held the boundary|I said no|I kept my distance|I returned to|I picked it up again|I restarted|I tried again|I named it|I admitted|I was honest about|I told the truth about|I made the decision|I committed to|I chose|I reduced|I cut down|I stopped|I stayed clean|I repaired|I apologised|I addressed it|I interrupted the pattern|I did something different)\b/i,


  // ── Output Types ──────────────────────────────────────────

  outputTypes: [
    { key: 'one_off',             label: 'One-off avoidance mention' },
    { key: 'repeated_lexical',    label: 'Repeated lexical avoidance' },
    { key: 'indirect',            label: 'Indirect avoidance — hedging and deferral' },
    { key: 'structural',          label: 'Structural avoidance — pressure without response' },
    { key: 'deflection',          label: 'Deflection — topic redirected away from' },
    { key: 'knowing_not_doing',   label: 'Knowing without doing' },
    { key: 'consequence_no_move', label: 'Consequence described without a corresponding move' },
    { key: 'suppressed',          label: 'Avoidance suppressed by correction' },
    { key: 'needs_more_material', label: 'Avoidance signal requires more material to confirm' },
  ],


  // ── What Is Not Avoidance ─────────────────────────────────

  notAvoidance: [
    'Strategic waiting where the right moment matters.',
    'Rest during genuine recovery.',
    'Safety planning before acting.',
    'Delay caused by lack of resources, not lack of will.',
    'Grief taking its time.',
    'Medical or professional advice to wait.',
    'External constraint blocking the action — see Behaviour 15.',
    'Deliberate fallow period in creative work.',
    'Waiting for a required third party to respond.',
    'Not contacting someone under legal restriction.',
    'Choosing not to act on something the person has genuinely considered and set aside.',
    'A different priority taking precedence — see Behaviour 14.',
  ],


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'Mistaking emotional description for movement.',
    'Missing the actual blocked point.',
    'Treating "I know" as action.',
    'Treating repeated summaries as progress.',
    'Moralising failure to act.',
    'Missing indirect avoidance that does not name itself.',
    'Missing deflection that redirects away from the significant topic.',
    'Flagging strategic waiting, grief, or constraint as avoidance.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Too broad: flags rest, grief, recovery, or strategic delay as avoidance.',
    'Too narrow: misses indirect avoidance and deflection language.',
    'Action regex too generic — false resolutions.',
    'Domain-specific action language missing.',
    'Correction not applied to avoidance flags.',
    'Pressure and action appear in same entry but are unrelated — false resolution.',
    'External constraint misread as avoidance — Behaviour 15 must run first.',
    'Knowing-without-doing missed because awareness language sounds like progress.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'Do not shame the person. Do not assume motive. Do not treat strategic waiting, rest, safety planning, grief, or lack of resources as avoidance without evidence. Avoidance is a map state — not a character verdict. External Constraint Reading (Behaviour 15) must run before avoidance detection to prevent misclassification.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'AVD-01',
      entries:  [{ text: 'I have been avoiding the programme. I keep not going.', date: '2026-01-01' }],
      expected: { avoidance: { hasAvoidance: true } },
    },
    {
      id:       'AVD-02',
      entries:  [{ text: 'Maybe I will call next week when things settle down a bit.', date: '2026-01-01' }],
      expected: { avoidance: { hasAvoidance: true } },
    },
    {
      id:       'AVD-03',
      entries:  [
        { text: 'I have been avoiding it. I keep putting it off.', date: '2026-01-01' },
        { text: 'Still avoiding it. Maybe next week.', date: '2026-01-15' },
        { text: 'Still not done it. I keep deferring.', date: '2026-01-29' },
      ],
      expected: { avoidance: { hasAvoidance: true } },
    },
    {
      id:       'AVD-04',
      entries:  [{ text: 'I know what the problem is. I understand the pattern. I just have not done anything about it.', date: '2026-01-01' }],
      expected: { avoidance: { hasAvoidance: true } },
    },
    {
      id:       'AVD-05',
      entries:  [{ text: 'Anyway, things are fine. I do not want to dwell on it. Moving on.', date: '2026-01-01' }],
      expected: { avoidance: { hasAvoidance: true } },
    },
    {
      id:       'AVD-06',
      entries:  [{ text: 'I am waiting for the housing decision. Nothing I can do until it comes through.', date: '2026-01-01' }],
      expected: { avoidance: {} },
    },
    {
      id:       'AVD-07',
      entries:  [{ text: 'I am on medical advice not to do this yet. Doctor says wait.', date: '2026-01-01' }],
      expected: { avoidance: {} },
    },
    {
      id:       'AVD-08',
      entries:  [{ text: 'I did not go for two days. I have been avoiding it and putting it off.', date: '2026-01-01' }],
      expected: { avoidance: { hasAvoidance: true } },
    },
  ],

};
