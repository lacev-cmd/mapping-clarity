// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 17  Horizon Reading  v0.1.1
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: project the current arc forward to a named
// horizon and compare it to the person's stated intended
// state. The gap between projected and intended is the
// planning surface.
//
// v0.1.1 — regex precision pass:
//   — trajectoryRx: removed `I am treading water` — it also
//     appears in velocitySignals.stalled, creating a
//     classification conflict (holding steady vs stalled).
//     Stalled is the correct home for this phrase.
//
// !! EXTRAPOLATION WARNING !!
// This is the only behaviour in the sorter system that
// works with material it has not seen. Every output from
// this behaviour is a projection — not a reading. It must
// be labelled as such. Confidence gating is mandatory.
// A thin arc produces a wide uncertain projection.
// A wide uncertain projection must not be presented as
// a confident forecast.
// ══════════════════════════════════════════════════════════

const BehaviourHorizonReading = {

  id:       'horizon-reading',
  name:     'Horizon Reading',
  version:  '0.1.1',

  purpose:
    'Project the current arc forward to a named horizon. Produce two states at that horizon: the projected state (where the arc is pointing) and the intended state (where the person says they want to be). The gap between them is the planning surface.',

  coreRule:
    'This behaviour extrapolates — it does not read. Every output is a projection from current arc and must be labelled as such. The projection is only as reliable as the arc beneath it. A thin or partial arc produces a wide, uncertain projection. Projection confidence is always lower than map confidence — never equal, never higher.',


  // ── Horizon Configuration ─────────────────────────────────
  // Set by deployment or cartridge. Guides may override.

  horizonConfig: {
    defaultHorizonDays:  90,    // 3 months — minimum meaningful horizon.
    shortHorizonDays:    30,    // Minimum allowed. Below this the projection
                                // collapses to next-useful-move territory.
    mediumHorizonDays:   90,
    longHorizonDays:     180,
    extendedHorizonDays: 365,
    minimumArcPeriods:   3,     // Minimum independent periods needed to project.
    minimumArcDays:      21,    // Minimum arc span in days before projecting.
  },


  // ── Horizon Types ─────────────────────────────────────────

  horizonTypes: [
    {
      key:   'short',
      days:  30,
      label: '30-day horizon',
      desc:  'Immediate planning window. High sensitivity to current load and constraint.',
    },
    {
      key:   'medium',
      days:  90,
      label: '90-day horizon',
      desc:  'Near-term planning. Arc trajectory has time to shift. Load effects visible.',
    },
    {
      key:   'long',
      days:  180,
      label: '6-month horizon',
      desc:  'Medium-term planning. Structural changes possible. Pattern-level shifts visible.',
    },
    {
      key:   'extended',
      days:  365,
      label: '12-month horizon',
      desc:  'Long-term planning. Meaningful only with a strong, consistent arc. Wide uncertainty band.',
    },
  ],


  // ── Intended Horizon Language ─────────────────────────────
  // Signals that the person is describing a future intended state.
  // This is what the horizon map compares the projection against.

  intendedStateRx: /\b(I want to be|I want to get|I want to have|I want to get to|I want to reach|I want to repair|I want to rebuild|I want to fix|I want to get closer|I am working toward|I am building toward|I am heading toward|my goal is|my aim is|my intention is|what I am working for|where I want to be|what I want my life to look like|by then I want|this time next year|the future I want|the life I want|what I am building|I want to be in a position where|I want to have reached|I want to be done with|I want to be clear of|I want to be stable|I want to be settled|I want to be free of|the plan is to|I intend to have|I intend to be|I hope to|I am aiming for|I am aiming to)\b/i,


  // ── Trajectory Language ───────────────────────────────────
  // Signals describing the direction of the current arc —
  // distinct from stated intention.

  trajectoryRx: /\b(things are improving|things are getting better|things are better|I am making progress|I am moving forward|I am building momentum|I am gaining ground|things are getting harder|things are getting worse|I am falling behind|I am losing ground|I am slipping|I am struggling more|things are holding steady|nothing is changing|I am maintaining|I am holding on|I am keeping it together|the direction is|where this is going|I can see this heading|this is trending|the pattern is moving|the arc is|I am on track|I am off track|I am drifting|I am stabilising|made progress|making progress|still improving|moving forward|on track|getting better|going well|getting there|things are moving|heading in the right direction|good progress|positive progress)\b/i,


  // ── Arc Velocity Signals ──────────────────────────────────
  // Rate of change in the current arc.

  velocitySignals: {
    accelerating: /\b(faster now|picking up|gaining speed|building more quickly|more each week|more each month|more frequently|more consistently|things are moving quickly now|things are moving faster|progress is accelerating|momentum is building)\b/i,
    decelerating: /\b(slowing down|losing momentum|less frequent|less consistent|harder to maintain|harder to keep up|the pace has dropped|not moving as fast|stalling|plateauing|levelling off|not gaining as much|progress has slowed)\b/i,
    stalled: /\b(stuck|not moving|nothing is changing|same place|no progress|treading water|going round|back to square one|the same as before|no different|not moving forward)\b/i,
  },


  // ── Projection Blockers ───────────────────────────────────
  // Conditions that reduce projection reliability significantly.
  // Any active blocker must be named in the horizon output.

  projectionBlockers: [
    {
      key:   'no_direction',
      label: 'No intended state',
      desc:  'The person has not stated where they want to be. The horizon map cannot compute a gap without a destination.',
      severity: 'critical',
    },
    {
      key:   'thin_arc',
      label: 'Arc too thin to project',
      desc:  'Fewer than the minimum required independent periods. Projection is unreliable.',
      severity: 'critical',
    },
    {
      key:   'arc_too_short',
      label: 'Arc span too short',
      desc:  'Arc spans fewer than the minimum required days. Not enough time has passed to establish a trajectory.',
      severity: 'critical',
    },
    {
      key:   'high_load',
      label: 'Current load is high',
      desc:  'High load compresses what is visible in the arc. Projection under high load has wide uncertainty.',
      severity: 'moderate',
    },
    {
      key:   'active_constraint',
      label: 'Active external constraint',
      desc:  'An external constraint is currently blocking movement. The projected state depends on whether it clears.',
      severity: 'moderate',
    },
    {
      key:   'contradicted_direction',
      label: 'Stated direction contradicts arc',
      desc:  'The person\'s stated intended state and the arc\'s current trajectory are pointing in different directions. The gap may be wider than visible.',
      severity: 'moderate',
    },
    {
      key:   'stalled_arc',
      label: 'Arc is stalled',
      desc:  'No movement detected across multiple periods. Projection assumes continuation of stall unless a state change is detected.',
      severity: 'moderate',
    },
    {
      key:   'recent_state_change',
      label: 'Recent state change',
      desc:  'A significant state change has occurred recently. The arc before the change may not represent the current trajectory.',
      severity: 'low',
    },
  ],


  // ── Projection Confidence Tiers ───────────────────────────
  // Projection confidence is always one tier below map confidence.
  // It cannot exceed 'supported' regardless of arc strength.

  projectionConfidenceTiers: [
    {
      key:   'not_projectable',
      label: 'Not projectable',
      desc:  'Arc is too thin or direction is absent. No projection produced.',
      mapConfidenceFloor: null,
    },
    {
      key:   'wide_uncertainty',
      label: 'Wide uncertainty',
      desc:  'Projection produced but range is very wide. Directional only — not reliable for planning.',
      mapConfidenceFloor: 'thin',
    },
    {
      key:   'indicative',
      label: 'Indicative',
      desc:  'Arc gives a plausible direction. Projection is useful for planning but not reliable at specifics.',
      mapConfidenceFloor: 'partial',
    },
    {
      key:   'moderate',
      label: 'Moderate confidence',
      desc:  'Arc is consistent and well-established. Projection is reliable for planning. Specific outcomes still uncertain.',
      mapConfidenceFloor: 'supported',
    },
  ],


  // ── Gap Types ─────────────────────────────────────────────
  // The structural relationship between projected and intended state.

  gapTypes: [
    {
      key:   'aligned',
      label: 'Arc aligned with intention',
      desc:  'The projected state at the horizon is consistent with the stated intended state. No significant gap.',
    },
    {
      key:   'closing',
      label: 'Gap closing',
      desc:  'The arc is moving toward the intended state. Gap exists but is narrowing.',
    },
    {
      key:   'holding',
      label: 'Gap holding',
      desc:  'The arc is not moving meaningfully toward or away from the intended state. Gap is stable but not closing.',
    },
    {
      key:   'widening',
      label: 'Gap widening',
      desc:  'The arc is moving away from the intended state. Gap is growing.',
    },
    {
      key:   'diverging',
      label: 'Arc diverging from intention',
      desc:  'The arc is pointing in a different direction from the stated intention. Without a change, the horizon state will be significantly different from the intended state.',
    },
    {
      key:   'unreachable',
      label: 'Horizon may be unreachable at current velocity',
      desc:  'The intended state may be unreachable at the current rate of movement within the stated horizon. Not a verdict — a structural observation.',
    },
    {
      key:   'no_baseline',
      label: 'No intended state to compare against',
      desc:  'Direction has not been stated. Gap cannot be computed.',
    },
  ],


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'Confusing a projection with a reading.',
    'Producing a confident forecast from a thin arc.',
    'Presenting the projected state as what will happen.',
    'Missing the gap between trajectory and intention.',
    'Treating stated intention as current trajectory.',
    'Ignoring load and constraint effects on projection reliability.',
    'Projecting beyond what the arc supports.',
    'Collapsing the planning surface into a single next move.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Projection presented without extrapolation label — treated as a reading.',
    'Confident projection from a thin or partial arc.',
    'Intended state not separated from projected state.',
    'Gap type assigned without enough arc material to support it.',
    'Projection blockers present but not named in output.',
    'Horizon too short — collapses into next-useful-move territory.',
    'Horizon too long relative to arc span — projection is meaningless.',
    'Load and constraint effects on projection not carried through.',
    'Recent state change ignored — stale arc projected forward.',
  ],


  // ── Output Shape ──────────────────────────────────────────

  outputShape: {
    horizon:           'The named horizon being projected to (days and label).',
    projectedState:    'What the current arc points toward at this horizon. Labelled as projection.',
    intendedState:     'What the person has stated they want at or before this horizon.',
    gapType:           'The structural relationship between projected and intended state.',
    gapDescription:    'One or two sentences describing what the gap is and what is producing it.',
    projectionConfidence: 'The confidence tier for this projection — always one tier below map confidence.',
    activeBlockers:    'Any projection blockers present and their severity.',
    planningPrompt:    'One open question the gap raises for the person. Not a recommendation. Not a next move. A structural question about the gap.',
  },


  // ── Reading Rules ─────────────────────────────────────────

  readingRules: {
    extrapolationLabel:
      'Every projection output must carry the label "projected" or "projection" — not "will", "is", or "shows". The map reads the past and present. This behaviour extrapolates.',
    intentionSeparation:
      'Stated intention and arc trajectory are read separately. They may point in the same direction or different directions. Do not merge them.',
    confidenceCeiling:
      'Projection confidence cannot exceed "moderate" regardless of arc strength. It cannot match map confidence — always one tier below.',
    blockerNaming:
      'Any active projection blocker must appear in the output. Do not suppress blockers to produce a cleaner projection.',
    noVerdict:
      'The horizon output is not a verdict. "You will not reach your goal" is not a valid output. "The current arc points away from the stated intention at this horizon" is.',
    planningNotPrescribing:
      'The planning prompt is a structural question, not a recommendation. The behaviour surfaces the gap — it does not tell the person how to close it.',
    shortHorizonRefusal:
      'If the stated horizon is shorter than shortHorizonDays, refuse the projection and direct to next-useful-move behaviour instead.',
    thinArcRefusal:
      'If the arc does not meet minimumArcPeriods or minimumArcDays, produce a not_projectable output with the reason named. Do not project on thin material.',
  },


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'This behaviour extrapolates. It does not read. Every output is a projection from the current arc and must be labelled as such. It does not predict what will happen. It describes where the arc is pointing and what the gap to the stated intention looks like from here. It does not prescribe how to close the gap. It does not produce a verdict about whether the person will succeed. It surfaces structure — not fate.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'HR-01',
      baseline: 'I want to be stable and debt free within a year. That is my goal.',
      entries:  [
        { text: 'Made progress this week. Contacted the creditor and agreed a plan.', date: '2026-01-01' },
        { text: 'Paid down some of the debt. Things are improving.', date: '2026-01-22' },
        { text: 'Budget is holding. I am working toward stability.', date: '2026-02-10' },
        { text: 'On track. Moving forward steadily toward my goal.', date: '2026-03-05' },
      ],
      expected: { horizonMap: { projectable: true, gapType: 'closing' } },
    },
    {
      id:       'HR-02',
      baseline: '',
      entries:  [
        { text: 'Things are difficult right now.', date: '2026-01-01' },
        { text: 'Still struggling.', date: '2026-01-10' },
      ],
      expected: { horizonMap: { projectable: false } },
    },
    {
      id:       'HR-03',
      baseline: 'I want to repair the relationship.',
      entries:  [
        { text: 'Fine on the surface. We are okay.', date: '2026-01-01' },
        { text: 'Same distance. Nothing has changed between us.', date: '2026-01-22' },
        { text: 'Same pattern. I keep meaning to bring it up but have not.', date: '2026-02-10' },
        { text: 'Going in circles. Same argument again.', date: '2026-03-01' },
      ],
      expected: { horizonMap: { projectable: true, gapType: 'widening' } },
    },
    {
      id:       'HR-04',
      baseline: 'I want to be stable.',
      entries:  [
        { text: 'Making progress.', date: '2026-01-01' },
        { text: 'Moving forward.', date: '2026-01-22' },
        { text: 'Still on track.', date: '2026-02-10' },
      ],
      expected: { horizonMap: { projectable: true } },
    },
    {
      id:       'HR-05',
      baseline: 'I want to get stable.',
      entries:  [
        { text: 'Stuck again. Nothing is changing.', date: '2026-01-01' },
        { text: 'No progress. Same place as before.', date: '2026-01-22' },
        { text: 'Still going round in circles. Back to square one.', date: '2026-02-10' },
        { text: 'Not moving forward. Treading water.', date: '2026-03-05' },
      ],
      expected: { horizonMap: { projectable: true } },
    },
    {
      id:       'HR-06',
      baseline: 'I want to repair the relationship and get closer.',
      entries:  [
        { text: 'I reached out this week. We talked properly.', date: '2026-01-01' },
        { text: 'I called them. Things are improving between us.', date: '2026-01-22' },
        { text: 'I made contact again. We had a good conversation.', date: '2026-02-10' },
        { text: 'I am making effort and it is working. Things are better between us.', date: '2026-03-05' },
      ],
      expected: { horizonMap: { projectable: true, gapType: 'closing' } },
    },
    {
      id:       'HR-07',
      baseline: 'I want to be debt free.',
      entries:  [
        { text: 'Money is overwhelming. I do not know where to start.', date: '2026-01-01' },
        { text: 'Contacted the creditor. It is overwhelming but I am trying.', date: '2026-01-22' },
        { text: 'I am paralysed by the debt. Cannot face the statements.', date: '2026-02-10' },
        { text: 'Still overwhelming. High load. Cannot face it.', date: '2026-03-05' },
      ],
      expected: { horizonMap: { projectable: true } },
    },
    {
      id:       'HR-08',
      baseline: 'I want to be in a better position.',
      entries:  [
        { text: 'Things were getting better. Making real progress.', date: '2026-01-01' },
        { text: 'Still improving. Moving forward.', date: '2026-01-22' },
        { text: 'A significant change happened. Everything has shifted.', date: '2026-02-10' },
        { text: 'The situation is completely different now. Hard to know what to do.', date: '2026-03-05' },
      ],
      expected: { horizonMap: { projectable: true } },
    },
  ],

};
