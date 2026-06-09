// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 15  External Constraint Reading  v0.2.2
// v0.2.2: partialBlockRx: replaced dead alternation `I cannot
//   do X but I can` with `I cannot do that but I can`.
// v0.2.0: defaultConstraintRx expanded, changeableRx and
//         fixedConstraintRx added, partialBlockRx added.
// ══════════════════════════════════════════════════════════

const BehaviourExternalConstraintReading = {

  id:       'external-constraint-reading',
  name:     'External Constraint Reading',
  version:  '0.2.2',

  purpose:
    'Distinguish non-movement caused by external constraint from non-movement caused by internal avoidance. A person who cannot move is in a different situation from one who will not.',

  coreRule:
    'Not all non-movement is avoidance. External constraints — systems, institutions, other people, resources, legal conditions, physical reality — can block movement regardless of the person\'s will.',

  constraintTypes: [
    { key: 'institutional', label: 'Institutional constraint', desc: 'A system or organisation is the source of the block.' },
    { key: 'legal',         label: 'Legal constraint',         desc: 'A legal condition or order prevents or shapes what is possible.' },
    { key: 'resource',      label: 'Resource constraint',      desc: 'Absence of money, housing, ID, transport, or other material resource.' },
    { key: 'other_person',  label: 'Other person constraint',  desc: 'Another person\'s action or refusal is blocking movement.' },
    { key: 'physical',      label: 'Physical constraint',      desc: 'Illness, disability, or pain limits what is possible.' },
    { key: 'information',   label: 'Information constraint',   desc: 'Required information has not arrived.' },
    { key: 'time',          label: 'Time constraint',          desc: 'A waiting period or external schedule is the limiting factor.' },
    { key: 'access',        label: 'Access constraint',        desc: 'Required service or resource is not available or accessible.' },
  ],


  // ── Default Constraint Language ───────────────────────────
  // Full vocabulary range of external block language.

  defaultConstraintRx: /\b(I am waiting for|I am still waiting for|I have been waiting for|they have not|they have not responded|they have not decided|they have not come back|the system|the process|the organisation|the institution|the authority|it has not been approved|no decision yet|I have not heard|I have not been told|waiting for the decision|waiting for the outcome|waiting for the result|I cannot get|I cannot access|I cannot obtain|I cannot afford|I do not have the|there is no|there is not one available|it is not available|there is a waiting list|they told me to wait|I have been told to wait|I was told I need to|it depends on|I need them to|it is out of my hands|I have no control over|I cannot do this without|I cannot proceed without|I need X before I can|the block is|the barrier is|the obstacle is|what is stopping me is|I am being held up by|I am stuck because of|I cannot move because)\b/i,


  // ── Changeable Constraint ─────────────────────────────────
  // Constraint that may be acted on — escalation, alternative channel.

  changeableConstraintRx: /\b(I could escalate|I could chase|I could follow up|I could push|there might be another way|there might be an alternative|I could try a different|I could approach from a different angle|I could ask someone else|I could contact a different|it might be worth trying|it might be worth asking|is there another channel|is there another route|is there another option|I have not tried|I have not asked|I have not checked whether|I could get someone to help me with this|I could get support with this)\b/i,


  // ── Fixed Constraint ──────────────────────────────────────
  // Constraint with no available action — the wait is required.

  fixedConstraintRx: /\b(nothing I can do|there is nothing I can do|I have no choice but to wait|I have exhausted all options|I have tried everything|there is no other way|I have to wait|I must wait|I have no alternative but to wait|it is legally required that I wait|the law requires|the order says|I cannot appeal|I cannot challenge|it is final|it is decided|the waiting list is|the wait is|the timeline is set|it will take|there is a mandatory|there is a required|it is a process that takes)\b/i,


  // ── Partial Block ─────────────────────────────────────────
  // Some dimensions blocked but not all.

  partialBlockRx: /\b(I cannot do that but I can|blocked on one thing but not on|I am stuck on that part but|that aspect is blocked but other things are not|while I wait for|in the meantime I can|while that is being decided I could|that is out of my hands but|I cannot control that but I can control|one door is closed but|that channel is blocked but)\b/i,

  detectionRules: {
    sourceFirst:         'Before reading non-movement as avoidance, check for external constraint language.',
    evidenceRequired:    'External constraint must be evidenced in material — not assumed.',
    avoidanceStillPossible: 'External constraint does not rule out avoidance. Both can be true.',
    partialBlock:        'Some constraints partially block — name what is still possible.',
    changeable:          'Note whether the constraint is changeable by the person\'s action.',
  },

  prevents: [
    'Misreading blocked movement as avoidance.',
    'Producing a next move that requires what the person cannot access.',
    'Missing systemic or institutional source of non-movement.',
    'Implying the person could move if they simply tried harder.',
    'Overlooking resource absence as a real constraint.',
  ],

  failureModes: [
    'Constraint language too broad — flags strategic waiting as external block.',
    'External constraint used to explain all non-movement — avoidance missed.',
    'Constraint read as permanent when it may be temporary.',
    'Partial block missed — person can still move on some dimensions.',
    'No distinction between changeable and fixed constraints.',
  ],

  boundary:
    'This behaviour does not judge whether the constraint is legitimate. It reads what the material describes as blocking. Where the constraint appears exaggerated or inconsistent, that is a contradiction — Behaviour 06.',

  testCases: [
    {
      id:       'ECR-01',
      entries:  [{ text: 'I am still waiting for the housing decision. Nothing I can do until then.', date: '2026-01-01' }],
      expected: { constraints: { hasConstraints: true } },
    },
    {
      id:       'ECR-02',
      entries:  [{ text: 'I cannot proceed without the documents. I cannot start until I have them.', date: '2026-01-01' }],
      expected: { constraints: { hasConstraints: true } },
    },
    {
      id:       'ECR-03',
      entries:  [{ text: 'I keep saying I will call but I have not done it yet. I keep putting it off.', date: '2026-01-01' }],
      expected: { constraints: {} },
    },
    {
      id:       'ECR-04',
      entries:  [{ text: 'My solicitor has not responded to any of my messages or emails.', date: '2026-01-01' }],
      expected: { constraints: {} },
    },
    {
      id:       'ECR-05',
      entries:  [{ text: 'I cannot work because of my health condition. Also I have not looked into alternatives.', date: '2026-01-01' }],
      expected: { constraints: {} },
    },
    {
      id:       'ECR-06',
      entries:  [{ text: 'That part is blocked but I could work on other things while waiting for it to clear.', date: '2026-01-01' }],
      expected: { constraints: {} },
    },
  ],
};
