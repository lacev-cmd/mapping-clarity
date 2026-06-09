// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 09  Movement / Non-Movement Reading  v0.3.2
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: separate actual movement from mood, intention,
// explanation, or repeated description. Feeling better is
// not automatically movement. Feeling worse is not
// automatically failure.
//
// v0.3.2 — regex precision pass:
//   — loadMovementRx: removed bare `even though`, `despite`,
//     `although`, `in spite of`, `regardless`, `anyway`, `still`
//     (fire on common connective language — longer phrases carry
//     the load-movement signal without them).
//   — structureRx: removed bare `I changed` (fires on "I changed
//     my mind" etc — `I changed how I` and `I changed where I`
//     already in the list), `I ended` (too short), `I left`
//     (too short — `I walked away from` covers the intent).
//
// v0.3.0 — full pattern library:
//   — defaultActionRx expanded to cover the full range of
//     evidenced action language across domains.
//   — defaultStuckRx expanded to cover circling, repetition,
//     and non-movement language in its full vocabulary range.
//   — intentionRx added: detects intention without action.
//   — moodOnlyRx added: detects mood language that does not
//     constitute movement.
//   — internalMovementRx added: detects evidenced internal
//     movement (naming, acknowledging, returning) that is
//     real movement but not external action.
//   — loadMovementRx added: movement under load — held
//     despite pressure.
//   — collapseRecoveryRx added: returning after a break —
//     not just describing the break.
//   — structureRx added: structural changes that constitute
//     movement without a single discrete action verb.
//   — negationRx added: action language negated — not movement.
//   — All patterns carry inline notes on what they catch
//     and what they must not overcatch.
// ══════════════════════════════════════════════════════════

const BehaviourMovementNonMovementReading = {

  id:       'movement-non-movement-reading',
  name:     'Movement / Non-Movement Reading',
  version:  '0.3.2',

  purpose:
    'Separate actual movement from mood, intention, explanation, and repeated description. Read what changed — not how it feels.',

  coreRule:
    'Movement means something changed in behaviour, structure, contact, decision, repair, test, routine, or action. Feeling better is not automatically movement. Feeling worse is not automatically failure.',


  // ── Movement Output Types ─────────────────────────────────

  movementOutputTypes: [
    { key: 'moving',       label: 'What is moving',       desc: 'Evidenced change — action taken, structure changed, contact made, decision held.' },
    { key: 'not_moving',   label: 'What is not moving',   desc: 'Intention stated repeatedly without action. Same description returning without a different response.' },
    { key: 'under_load',   label: 'What is under load',   desc: 'Movement is present but occurring under pressure. Note the load — it is part of the signal.' },
    { key: 'emerging',     label: 'What is emerging',     desc: 'New movement appearing for the first time — not yet confirmed as pattern.' },
    { key: 'circling',     label: 'What is circling',     desc: 'Same material returning without a changed approach or outcome.' },
    { key: 'avoided',      label: 'What is avoided',      desc: 'Movement toward a specific area is consistently absent. See Behaviour 04.' },
    { key: 'thin',         label: 'Movement thin',        desc: 'One instance. Not yet pattern.' },
    { key: 'weak',         label: 'Movement weak',        desc: 'Beginning to show but not consistent.' },
    { key: 'moderate',     label: 'Movement moderate',    desc: 'Present across multiple entries.' },
    { key: 'strong',       label: 'Movement strong',      desc: 'Consistent and evidenced across the period.' },
    { key: 'not_visible',  label: 'Movement not visible', desc: 'No movement signal in this period. May reflect sparse material, internal-only work, or a period of load.' },
  ],


  // ── What Counts as Movement ───────────────────────────────

  movementEvidence: [
    'A call made, not just planned.',
    'A session attended, not just intended.',
    'A boundary held under pressure.',
    'A repair started, not just wished for.',
    'A decision made and acted on.',
    'A routine established and repeated.',
    'A test attempted.',
    'A structure changed.',
    'An escalation made.',
    'Help asked for.',
    'Harm reduced.',
    'A line held.',
    'A condition changed.',
    'Something noticed earlier than before.',
    'Something named honestly that was previously avoided.',
    'Returning after a collapse — not just describing the collapse.',
    'Contact restored after absence.',
    'A commitment kept under load.',
    'A pattern interrupted — did not do what was previously always done.',
    'Something finished that was started.',
    'A document submitted, filed, or sent.',
    'An appointment kept.',
    'A difficult conversation initiated.',
    'A boundary named to the person it involves.',
    'A step taken even without feeling ready.',
  ],


  // ── What Does Not Count as Movement ──────────────────────

  notMovement: [
    'Describing an intention to act.',
    'Feeling better about a situation.',
    'Deciding to do something without doing it.',
    'Repeating the same reflection about a stuck point.',
    'Expressing hope or optimism without corresponding action.',
    'Writing about understanding the problem without changing approach.',
    'Describing what should happen without describing what did happen.',
    'Naming what needs to change without changing it.',
    'Revisiting a decision already made without acting on it.',
    'Expressing motivation or readiness without a corresponding action.',
    'Describing what others need to do.',
    'Re-explaining a situation without a new response to it.',
  ],


  // ── Default Action Language ───────────────────────────────
  // Conservative by design. Generic verbs excluded.
  // Domain guides supply their own defaultActionRx extensions.
  // Full vocabulary range — grouped by action type for clarity.
  //
  // NOTE: these patterns require first-person past tense as
  // the primary signal. "I called" counts. "Calling" alone
  // does not — it may be intention, not completed action.

  defaultActionRx: /\b(I called|I rang|I phoned|I texted|I messaged|I emailed|I wrote to|I reached out|I made contact|I attended|I showed up|I went to|I turned up|I was there|I kept the appointment|I did not miss|I completed|I finished|I got it done|I followed through|I saw it through|I did not give up on|I submitted|I filed|I sent|I handed in|I delivered|I posted|I applied|I registered|I signed up|I enrolled|I booked|I scheduled|I arranged|I paid|I transferred|I sorted the|I cleared|I settled|I spoke to|I talked to|I told|I said to|I had the conversation|I brought it up|I raised it|I reported|I contacted|I notified|I informed|I flagged|I started and completed|I began and finished|I asked for help|I reached out for support|I used the support|I called the helpline|I kept my appointment|I did not cancel|I rescheduled and attended|I held the boundary|I said no|I kept my distance|I did not go back|I stayed away|I returned to|I went back to|I picked it up again|I restarted|I tried again|I named it|I said it out loud|I admitted|I was honest about|I told the truth about|I made the decision|I committed to|I chose|I agreed to|I reduced|I cut down|I stopped|I have not used|I did not take|I stayed clean|I exercised|I went for a walk|I moved|I got outside|I slept|I ate|I looked after myself|I took care of|I repaired|I apologised|I made amends|I addressed it|I interrupted the pattern|I did something different|I did not do what I usually do)\b/i,


  // ── Default Stuck Language ────────────────────────────────
  // Full vocabulary range of non-movement, circling, and
  // repetition language. Grouped by stuck type.

  defaultStuckRx: /\b(same thing|same situation|same place|same spot|same pattern|same loop|same cycle|same again|nothing changed|nothing has changed|nothing is different|nothing moves|nothing is moving|back to where|back to square one|back at the start|back where I was|right back to|going in circles|round and round|spinning my wheels|treading water|I always|every time|it always|it never|I never|I keep|I keep doing|I keep ending up|I keep coming back to|I keep finding myself|no further|no further forward|no closer|no progress|still no|still stuck|still waiting|same loop|same rut|same road|same result|same outcome|I have not moved|I have not done anything|I have not made progress|I have not changed|it has not moved|it has not changed|it is the same|it is no different|I tried but|I started but|I meant to but|I was going to but|I do not know how to move|I cannot see a way|I cannot get started|I do not know where to begin|months have passed|weeks have gone by|time keeps going|another week|another month|I am in the same|I find myself in the same|I am back in the same)\b/i,


  // ── Intention Without Action ──────────────────────────────
  // Detects intention language — planning, deciding, meaning to —
  // without corresponding action language.
  // A match here is not movement unless paired with an action signal.

  intentionRx: /\b(I am going to|I will|I plan to|I intend to|I want to|I need to|I should|I ought to|I have decided to|I have made up my mind to|I am thinking about|I am considering|I am hoping to|I am trying to|I am working up to|I am getting ready to|I am going to start|I am going to do|I am going to try|I am going to make|I told myself|I promised myself|I said I would|I keep meaning to|I keep planning to|next week|next time|when I am ready|when things settle|when I have the energy|I just need to|I only need to|all I have to do is|it would not take much to|I know I need to|I know I should|I know what I need to do)\b/i,


  // ── Mood Language ─────────────────────────────────────────
  // Detects mood and feeling language.
  // Not movement on its own — but not failure either.
  // Paired with action language: movement under emotional load.
  // Alone: mood signal only.

  moodOnlyRx: /\b(I feel|I felt|I am feeling|I have been feeling|I feel better|I feel worse|I feel good|I feel bad|I feel okay|I feel fine|I am happy|I am sad|I am anxious|I am worried|I am scared|I am hopeful|I am optimistic|I am pessimistic|I am frustrated|I am angry|I am relieved|I feel lighter|I feel heavier|I feel clearer|I feel confused|my mood|my mental state|my headspace|my mindset|emotionally|mentally|psychologically|inside|deep down|I have been in a good place|I have been in a bad place|I have been struggling mentally|it feels different|it feels the same|it feels easier|it feels harder|something shifted|something feels different|I feel a shift)\b/i,


  // ── Internal Movement ─────────────────────────────────────
  // Evidenced internal movement — naming, acknowledging, returning,
  // honest self-accounting. Real movement, not external action.
  // Requires specific naming — vague "I reflected" does not count.

  internalMovementRx: /\b(I named it|I said it out loud|I admitted to myself|I acknowledged|I accepted|I was honest with myself|I stopped pretending|I faced it|I looked at it|I realised|I understood for the first time|I saw the pattern|I noticed|I caught myself|I recognised|I became aware|I saw what I was doing|I let myself|I allowed myself|I gave myself permission|I stopped fighting|I stopped avoiding it|I stopped pretending it was not there|I stopped making excuses|I told someone|I said it to someone|I shared it|I was honest with|I did not hide it|I sat with it|I stayed with it|I did not run from it|I did not distract myself from|I returned to it|I went back to it|I kept thinking about it honestly|I grieved|I cried|I let it out|I processed|I worked through)\b/i,


  // ── Movement Under Load ───────────────────────────────────
  // Movement that happened despite difficulty, low energy,
  // or high pressure. This is meaningful — it shows capability
  // holding under adverse conditions. See Behaviour 05.

  loadMovementRx: /\b(I did it anyway|I went anyway|I showed up anyway|I kept the appointment anyway|I did not feel like it but|I was exhausted but|I was struggling but|I was scared but|I did not want to but|I forced myself|I pushed through|even when it was hard|even when I did not want to|even under pressure|I held it together|I kept going|I did not stop|I carried on|I persisted|I did not give in|I did not give up|I stayed with it|I did not walk away)\b/i,


  // ── Collapse Recovery ─────────────────────────────────────
  // Returning after a relapse, break, or failure.
  // This is movement — the return, not the collapse.
  // The collapse is data. The return is signal.

  collapseRecoveryRx: /\b(I got back on|I restarted|I reset|I started again|I came back|I picked it up again|back on track|I did not stay down|I tried again|I returned|I got back to|after the slip|after the relapse|after the break|after I fell|after I failed|I kept going|I did not let it end there|I used it as information|I learned from it|I did not make it mean everything|I did not give up entirely|I tried again even after|one slip did not become two|I caught it early|I recovered faster than before|I am back|I returned to the attempt|I have not given up)\b/i,


  // ── Structure Change ──────────────────────────────────────
  // Changes to routines, environments, relationships, or
  // arrangements that constitute movement without a single
  // discrete action verb.

  structureRx: /\b(I reorganised|I restructured|I rearranged|I set up|I put in place|I established a routine|I built a structure|I created a system|I made a plan and started|I removed|I got rid of|I cleared out|I cut off|I walked away from|I moved out|I moved in|I changed where I|I changed how I|I changed when I|I no longer|I stopped going|I stopped seeing|I stopped using|I am no longer in|I switched|I replaced|I substituted|I found an alternative|I built in|I added|I introduced|I committed to a|I locked in|the arrangement changed|the situation changed|my circumstances changed|I am in a different|I live differently|I work differently|I operate differently)\b/i,


  // ── Negated Action ────────────────────────────────────────
  // Action language that is explicitly negated.
  // Must not be counted as movement — the action did not happen.

  negatedActionRx: /\b(I did not call|I did not attend|I did not go|I did not show up|I did not complete|I did not submit|I did not apply|I did not book|I did not pay|I did not follow through|I cancelled|I missed|I skipped|I avoided|I did not keep|I forgot to|I never got to|I meant to call but|I was going to attend but|I had planned to go but|I still have not|I have not yet|I have not been able to|I have not managed to|I tried to but|I attempted to but|I started to but did not finish)\b/i,


  // ── Movement Strength Assessment ─────────────────────────
  // Used by the runtime to assess movement pattern strength
  // across entries. Not a single-entry read.

  movementStrength: {
    thin:     { independentDays: 1, desc: 'One instance. Not yet pattern.' },
    weak:     { independentDays: 2, desc: 'Beginning to show. Not yet consistent.' },
    moderate: { independentDays: 3, desc: 'Present across multiple entries.' },
    strong:   { independentDays: 4, desc: 'Consistent and evidenced across the period.' },
  },


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'Mistaking mood improvement for progress.',
    'Mistaking distress for failure.',
    'Mistaking intention for action.',
    'Mistaking repeated reflection for change.',
    'Producing motivational output without evidential basis.',
    'Missing real movement because it is not external or visible.',
    'Overcalling non-movement during unavoidable load or constraint.',
    'Treating collapse as the end of movement rather than data.',
    'Missing movement under load because the entry sounds negative.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Action language too generic — false movement signals.',
    'Domain-specific action language missing — real movement missed.',
    'One action overstated as a new pattern.',
    'Internal movement missed because entries are sparse.',
    'Non-movement overcalled during unavoidable constraint or recovery period.',
    'Intention language counted as action language.',
    'Mood improvement counted as movement.',
    'Negated action not filtered — false positive movement.',
    'Movement under load missed because entry tone is negative.',
    'Collapse recovery missed — the return not read as movement.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'Do not define movement only as external productivity. Some domains include internal movement — but it must still be evidenced by specific material in the entries, not inferred from mood. Do not treat the absence of action language as proof of non-movement — sparse material may simply not capture what happened.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'MNM-01',
      entries:  [{ text: 'I decided I should call. I think I will do it soon.', date: '2026-01-01' }],
      expected: { movement: { isMoving: false } },
    },
    {
      id:       'MNM-02',
      entries:  [{ text: 'I attended the appointment. I booked the next one too.', date: '2026-01-01' }],
      expected: { movement: { isMoving: true } },
    },
    {
      id:       'MNM-03',
      entries:  [{ text: 'I felt much better this week. Much happier.', date: '2026-01-01' }],
      expected: { movement: { isMoving: false } },
    },
    {
      id:       'MNM-04',
      entries:  [{ text: 'I felt awful but I attended anyway. I showed up despite everything.', date: '2026-01-01' }],
      expected: { movement: { isMoving: true } },
    },
    {
      id:       'MNM-05',
      entries:  [{ text: 'Same thing again. Nothing changed. Still stuck.', date: '2026-01-01' }],
      expected: { movement: { isMoving: false } },
    },
    {
      id:       'MNM-06',
      entries:  [{ text: 'I admitted to myself honestly that the pattern was not working.', date: '2026-01-01' }],
      expected: { movement: {} },
    },
    {
      id:       'MNM-07',
      entries:  [{ text: 'I relapsed but got back on it the very next day.', date: '2026-01-01' }],
      expected: { movement: {} },
    },
    {
      id:       'MNM-08',
      entries:  [{ text: 'I was going to call but I did not. I meant to but it did not happen.', date: '2026-01-01' }],
      expected: { movement: { isMoving: false } },
    },
    {
      id:       'MNM-09',
      entries:  [{ text: 'I removed myself from the group and changed my number completely.', date: '2026-01-01' }],
      expected: { movement: {} },
    },
    {
      id:       'MNM-10',
      entries:  [{ text: 'I know I need to do something but I do not know where to start.', date: '2026-01-01' }],
      expected: { movement: { isMoving: false } },
    },
    {
      id:       'MNM-11',
      entries:  [{ text: 'I did not want to go but I attended anyway. I showed up.', date: '2026-01-01' }],
      expected: { movement: { isMoving: true } },
    },
    {
      id:       'MNM-12',
      entries:  [{ text: 'I have not called. I keep meaning to but I have not done it.', date: '2026-01-01' }],
      expected: { movement: { isMoving: false } },
    },
  ],

};
