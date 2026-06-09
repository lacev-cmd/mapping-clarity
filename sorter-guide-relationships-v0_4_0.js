// ══════════════════════════════════════════════════════════
// SORTER GUIDE — Relationships  v0.4.0
// First-ring sector guide.
// Attach with: SorterSpine.attachGuide(GuideRelationships);
//
// v0.3.0 — steer block completed:
//   — confidence-calibration added.
//   — competing-priorities expanded with additional cost signals.
//   — meta-reading added.
//   — open-gap-discipline.absenceRules added.
//   — dependency_pattern added to priorityGaps.
//   — state-change-detection added.
//   All v0.2.0 fields unchanged.
// ══════════════════════════════════════════════════════════

const GuideRelationships = {

  id:      'guide-relationships',
  version: '0.4.0',
  type:    'sector',
  parent:  null,
  purpose: 'Steer sorter behaviours toward relational conditions — what is happening between people, not just inside one person. Repair, distance, dependency, stated care vs enacted care.',
  sector:  'relationships',

  sectorNotes: {
    distinctivePressures: [
      'Distance growing without acknowledgement.',
      'Repair intended but not attempted.',
      'Dependency — one person carrying more than is sustainable.',
      'The gap between stated love or care and described behaviour toward the person.',
      'Conflict that is circling without resolution.',
      'Contact that is absent when it matters.',
      'Relationships affected by a third pressure — addiction, mental health, financial, legal.',
    ],
    distinctiveMovement: [
      'Contact made when it was absent.',
      'Repair attempted — not just intended.',
      'Honest conversation had.',
      'Boundary named and held.',
      'Request made directly.',
      'Apology given and received.',
      'Distance named to the other person.',
      'Support asked for.',
      'Dependency pattern named and changed.',
    ],
    distinctiveGaps: [
      'The other person\'s state not visible — only one side of the relationship described.',
      'Repair not attempted despite being named as important.',
      'What the person actually does toward the other — not just feels.',
      'Whether contact is happening at the frequency described.',
      'What the relationship costs each person.',
    ],
    outputAudience:  'Individual, couples therapist support context, family support worker, or mediation preparation.',
    outputRegister:  'Careful. Non-partisan. Reads the gap between the stated relationship and the described one. Does not take sides.',
  },


  // ── Gaps ─────────────────────────────────────────────────

  gaps: [
    {
      key:    'what_is_done_toward_other',
      name:   'What is actually done toward the other person',
      rx:     /\b(I called|I reached out|I said|I told them|I apologised|I asked|I spent time|I was honest with|I initiated|I went to see|I made contact|I did)\b/i,
      reason: 'Feelings about a relationship are often described clearly. What the person actually does — or does not do — toward the other person is often missing. The gap between feeling and action is where the map needs material.',
    },
    {
      key:    'contact_frequency',
      name:   'Contact frequency and quality',
      rx:     /\b(we spoke|we met|I called|they called|we saw|contact|in touch|we talked|how often|we have been|I have seen|last time we)\b/i,
      reason: 'Described closeness without described contact is a significant gap. Whether contact is actually happening tells the map more than how the person feels about the relationship.',
    },
    {
      key:    'repair_status',
      name:   'Repair status',
      rx:     /\b(I apologised|we talked about it|we addressed|I said sorry|they forgave|we worked through|repair|we are okay now|it has been resolved|I brought it up)\b/i,
      reason: 'Whether repair has been attempted — not just intended — is the key signal. Repair described as important but not yet attempted is avoidance with a named object.',
    },
    {
      key:    'dependency_pattern',
      name:   'Dependency pattern',
      rx:     /\b(I depend on|they depend on me|I need them|they need me|I cannot do this without|too much on each other|I am carrying|they are carrying|the weight of)\b/i,
      reason: 'Dependency that is not named cannot be changed. Whether one person is carrying more than is sustainable — and whether that is acknowledged — shapes what movement looks like in this relationship.',
    },
    {
      key:    'direction',
      name:   'Stated direction for the relationship',
      rx:     /\b(I want to fix this|I want to repair|I want to rebuild|I want to end it|I want out|I want to leave|I want more distance|I want things to be different|I want us to work this out|I want to sort this out|I want to clear the air|I want to reconnect|I want to walk away|I have decided to|I am done|I am done with this|I am done trying|I need space from|I need distance from|I need to step back|I need to say something|I need to have the conversation|I don't know if I can keep|I don't know if this can work|I'm not sure this can continue|I've made up my mind|I've decided|I'm staying no contact|I cut ties|I chose to walk away)\b/i,
      reason: 'Without a stated direction the map cannot assess whether current activity is moving toward or away from what the person actually wants.',
    },
  ],


  // ── Skills ───────────────────────────────────────────────

  skills: [
    {
      key:              'making_contact',
      name:             'Making contact',
      rx:               /\b(I called|I reached out|I initiated|I went to see|I wrote|I texted|I made contact|I got in touch|I arranged to|I showed up)\b/i,
      loadSensitive:    true,
      isStructureSkill: true,
      works:            'Initiating contact — calls, visits, messages — rather than waiting for the other person to reach first.',
      breaks:           'Fear of rejection, past conflict, or the assumption that the other person should go first causes contact to stop — distance grows without acknowledgement.',
    },
    {
      key:              'honest_conversation',
      name:             'Having honest conversations',
      rx:               /\b(I told him how|I told him that things|I told him I loved|I told him I don't|I told him I wasn't|I told him I needed|I told him I was done|I told him I wanted|I told her how|I told her that things|I told her I loved|I told her I don't|I told her I wasn't|I told her I needed|I told her I was done|I told her I wanted|I told them how|I told them I|I told my|I finally told|I finally said it|I said it|I said what I felt|I said how I felt|I brought it up|I asked him what|I asked him why|I asked him about|I asked him where|I asked her what|I asked her why|I asked her about|I asked them|I raised it|I said it out loud|I had the conversation|I said what needed to be said|I was honest with him|I was honest with her|I was honest with them|I stopped keeping quiet|I told him things have to change|I told her things have to change|I said it straight|I put it to them|I flagged it|I raised it with my manager|I said I needed)\b/i,
      loadSensitive:    true,
      isStructureSkill: false,
      works:            'Saying what is actually true rather than the version that avoids conflict or keeps things smooth on the surface.',
      breaks:           'Conflict avoidance or fear of the other person\'s reaction causes the honest version to stay unsaid — the surface manages while the real situation does not change.',
    },
    {
      key:              'holding_boundaries',
      name:             'Holding stated boundaries',
      rx:               /\b(I said no|I said no to them|I said no to him|I said no to her|I held the boundary|I kept the distance|I stayed no contact|I didn't respond|I didn't take the call|I didn't reply|I didn't go back|I didn't let them|I didn't let him|I didn't let her|I didn't give in|I didn't cave|I kept to what I said|I stood by it|I didn't change my mind|I stayed away|I kept my distance|I cut contact|I blocked them|I blocked him|I blocked her|I stopped answering|I stopped going|I stopped covering for him|I stopped covering for her|I stopped covering for them|I stopped making excuses for him|I stopped making excuses for her|I stopped making excuses for them|I chose not to engage|I didn't get drawn back in|I didn't reach out even though|I didn't respond even though|I kept it professional|I made my position clear)\b/i,
      loadSensitive:    true,
      isStructureSkill: false,
      works:            'Maintaining a stated boundary — even when pressure, guilt, or the other person\'s response makes it hard.',
      breaks:           'Emotional pressure, guilt, or the other person\'s reaction causes the boundary to collapse — the stated and enacted position diverge.',
    },
    {
      key:              'hearing_the_other',
      name:             'Hearing the other person',
      rx:               /\b(I heard them|I listened|their point|they said|I understood what they|I could see their|from their side|their perspective|I took in what they|I let them finish)\b/i,
      loadSensitive:    true,
      isStructureSkill: false,
      works:            'Taking in the other person\'s position without immediately countering it.',
      breaks:           'Load or defensiveness converts listening into waiting to respond — the other person\'s position is not heard.',
    },
  ],


  // ── Contradictions ────────────────────────────────────────

  contradictions: [
    {
      a:    /\b(I love them|I care about them|they are important|they mean everything|I do not want to lose them|I value the relationship)\b/i,
      b:    /\b(I have not called|I have not reached out|I have not said|I have not done|I keep meaning to|same distance|I have not addressed|still not)\b/i,
      text: 'Stated care or love and absence of contact or action toward the person both appear. The gap between what is felt and what is done is the most common pattern in relational difficulty. The map reads both without deciding which is more real — but the behaviour is the more reliable signal of current state.',
    },
    {
      a:    /\b(fine|okay|not that bad|good moments|we are okay|it is okay|mostly fine|we are good)\b/i,
      b:    /\b(argument|fight|same pattern|keeps happening|can\'t go on|exhausted by it|losing hope|same distance|nothing changes between us)\b/i,
      text: 'Statements that the relationship is broadly fine and signals of significant strain both appear. The overall assessment staying positive while the specific material shows a different picture is a common pattern. Both are real — the map holds them without resolving either.',
    },
    {
      a:    /\b(I want to repair|I want to fix it|I want things to be better|I am trying|I want us to be okay)\b/i,
      b:    /\b(I have not|I keep putting off|I have not said|I have not tried|I have not reached out|still not|same situation|I keep meaning)\b/i,
      text: 'Stated desire to repair the relationship and consistent inaction toward repair both appear. Wanting repair and taking the step toward it are different things. The gap is worth naming — what is getting in the way of the step is the most useful question.',
    },
  ],


  // ── Direction Patterns ────────────────────────────────────

  directionPatterns: [
    { rx: /repair|fix|restore|work through|reconcile|rebuild/i,               label: 'toward repair or reconciliation' },
    { rx: /boundary|space|distance|less contact|I need to|protect myself/i,   label: 'toward establishing or maintaining distance' },
    { rx: /end|leave|separate|break up|divorce|walk away|done/i,              label: 'toward ending the relationship' },
    { rx: /honest|say it|tell them|name it|raise it|have the conversation/i,  label: 'toward honest conversation' },
    { rx: /different|change the dynamic|something has to change|new pattern/i, label: 'toward changing the relationship pattern' },
  ],


  // ── Steer block ───────────────────────────────────────────

  steer: {

    'open-gap-discipline': {
      priorityGaps: [
        'what_is_done_toward_other',
        'contact_frequency',
        'repair_status',
        'dependency_pattern',
        'direction',
      ],
      absenceRules: {
        actionNotFeeling:
          'Feelings about a relationship are not evidence of the relationship\'s state. What is done toward the other person is the primary signal. Described care, love, or concern without described action is a gap, not a read.',
        oneSidedMaterial:
          'Relationship material is almost always one-sided. The map reads what the person in front of it describes. It does not adjudicate the other person\'s position and does not treat the described account as the full picture.',
        repairIntentIsNotRepair:
          'Stated intention to repair is not repair. Until an action toward the other person is described, repair is a gap — not a movement.',
        dependencyNaming:
          'Dependency patterns are frequently unnamed because they are normalised. If one person is described as carrying significantly more than the other — emotionally, practically, financially — surface this as a gap even if the person does not name it as a problem.',
      },
    },

    'confidence-calibration': {
      sectorNote:
        'Relationship maps are inherently partial — the map only has access to one person\'s account. This is a structural limit, not a data quality problem. Confidence should reflect the completeness of described behaviour, not the certainty of stated feelings. High confidence requires described contact and action, not just stated closeness. Absence of described contact combined with strong stated feeling should cap confidence at partial.',
    },

    'state-change-detection': {
      minimumSeparationDays: 14,
      watchFor: [
        'Contact frequency increasing or decreasing across periods.',
        'Repair attempts appearing or remaining absent despite stated intent.',
        'Conflict patterns shifting — resolving, escalating, or changing form.',
        'Dependency balance shifting — load redistributing or increasing on one side.',
        'Direction becoming clearer — toward repair, distance, or ending.',
        'Third-party pressure — addiction, mental health, financial — worsening or resolving.',
        'Boundary stated and then held, collapsed, or renegotiated.',
      ],
    },

    'avoidance-detection': {
      defaultActionRx: /\b(I told him|I told her|I told them|I told my|I finally told|I finally said it|I brought it up|I raised it|I asked him|I asked her|I said it|I was honest with|I had the conversation|I flagged it|I said no|I held the boundary|I cut contact|I blocked|I reached out|I made contact|I called|I went to see|I wrote to|I messaged)\b/i,
      notAvoidance: [
        'Strategic distance from someone causing harm — stepping back from a harmful relationship is not avoidance of it.',
        'Not contacting someone under legal advice or a formal order.',
        'Space given deliberately as part of an agreed process — cooling-off periods, mediation gaps.',
        'Waiting for the right moment in a genuinely fragile situation where timing is the primary variable.',
        'Not initiating contact when the other person has clearly signalled they do not want it.',
        'Protecting a relationship by not having a conversation that is not yet ready — some things require more time, not less.',
        'Choosing to maintain distance from someone whose behaviour is currently unsafe.',
      ],
      avoidanceSignals: [
        'Repair named as important across multiple entries with no action toward it — intent without movement is the primary avoidance signal in this sector.',
        'Contact described as important while actual contact is absent.',
        'Conflict circling without any attempt to address the underlying issue.',
        'Boundary stated but not enacted — saying and doing diverging across entries.',
      ],
    },

    'contradiction-holding': {
      detectionShape: {
        text: 'Stated care or commitment toward someone and described behaviour toward that person are not matching. The map reads the gap between what is said about the relationship and what is done within it.',
      },
    },

    'movement-non-movement-reading': {
      movementEvidence: [
        'Contact made when it had been absent.',
        'Honest conversation initiated.',
        'Repair attempted — not just described as needed.',
        'Boundary stated directly to the other person.',
        'Apology given.',
        'Request made rather than expected to be inferred.',
        'Dependency acknowledged to the person it involves.',
        'Distance named rather than maintained silently.',
      ],
      defaultStuckRx: /\b(same distance|same argument|nothing has changed between us|we keep having|I keep meaning to|I have not said|I have not called|same pattern|going in circles|it always ends the same|I do not know how to)\b/i,
    },

    'load-sensitive-capability': {
      defaultLoadSignals: [
        { key: 'conflict',    rx: /\b(argument|fight|confrontation|they said|I said|it escalated|it got heated|we fell out|we are not speaking)\b/i },
        { key: 'distance',    rx: /\b(we are distant|we have grown apart|I do not know them anymore|there is a wall|they have pulled away|I have pulled away|no contact)\b/i },
        { key: 'dependency',  rx: /\b(I need them|I cannot do this without|I depend on|they depend on me|too much on each other|I am carrying|they are carrying)\b/i },
        { key: 'third_party', rx: /\b(because of the drinking|because of the debt|because of what happened|the addiction|the illness|the situation is affecting us)\b/i },
        { key: 'loss',        rx: /\b(I have lost them|they are gone|the relationship is over|it is broken|I do not know if we can|irreparable|I have given up)\b/i },
      ],
    },

    'competing-priorities': {
      costSignals: [
        { key: 'relational_cost',     rx: /\b(I have not been there|I was not present|they needed me|I let them down|I was not available|I missed it|I chose|I prioritised something else)\b/i },
        { key: 'honesty_vs_peace',    rx: /\b(I did not want to start|I did not want to upset|it is easier not to|I kept the peace|I did not want another argument|I did not say it)\b/i },
        { key: 'care_vs_self',        rx: /\b(I have given everything|I have nothing left|I am running on empty|I cannot keep|I have been putting them first|I have lost myself)\b/i },
        { key: 'repair_vs_safety',    rx: /\b(I want to fix it but|I want to reconnect but|I miss them but|I want them back but|it was not safe|they hurt me|I cannot go back to)\b/i },
        { key: 'loyalty_vs_harm',     rx: /\b(they are family|I cannot abandon|they need me|I owe them|but they are my|I cannot just leave|despite everything they are)\b/i },
      ],
    },

    'meta-reading': {
      sectorNote:
        'Charitable framing of the other person is the primary performance pattern in relationship material. People frequently present the other person — and the relationship — in a more positive light than the described behaviour supports. Stated overall wellbeing of the relationship combined with specific signals of strain, conflict, or distance is the key pattern. The map should weight specific described incidents over general relational assessments.',
      performanceSignals: [
        {
          key: 'relationship_okayness',
          rx:  /\b(we are okay really|it is fine mostly|there are good moments|they are not that bad|we have our problems but|it is not all bad|we are mostly good)\b/i,
        },
        {
          key: 'other_person_defence',
          rx:  /\b(they did not mean it|they are going through a lot|it is not really their fault|they have reasons|I understand why they|they cannot help it|they are trying)\b/i,
        },
      ],
    },

  },

};
