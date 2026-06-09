// ══════════════════════════════════════════════════════════
// SORTER BEHAVIOUR — 11  Private Record to Optional Handover  v0.1.0
// Portable sorter primitive. Self-contained config.
// No engine code here. No domain assumptions.
//
// Purpose: allow a private map to become a structured
// handover only when the person chooses. Private honesty
// comes first. If the map is perceived as surveillance,
// the person performs — and the map lies.
// ══════════════════════════════════════════════════════════

const BehaviourPrivateRecordToOptionalHandover = {

  id:       'private-record-to-optional-handover',
  name:     'Private Record to Optional Handover',
  version:  '0.1.0',

  purpose:
    'Allow a private map to become a structured handover only when the person chooses. Ownership stays with the person until they decide otherwise.',

  coreRule:
    'Private honesty comes first. Sharing comes later — only if voluntary. If the person believes the map is surveillance, compliance capture, or professional judgement, they will perform. If they perform, the map lies.',


  // ── Ownership Rules ───────────────────────────────────────

  ownershipRules: {
    ownerIsPerson:
      'The person owns the map. Not the system. Not the professional. Not the institution.',
    sharingVoluntary:
      'Sharing must be an active choice by the person. It must never be the default.',
    scopeControlled:
      'The person determines what is included in any export — by time window, by topic, or by specific entries.',
    noCoerciveUse:
      'The map must not be used as a condition of receiving support, as a compliance check, or as evidence against the person.',
  },


  // ── Handover Output Types ─────────────────────────────────

  handoverOutputTypes: [
    { key: 'timeline',              label: 'Timeline',                     desc: 'Chronological record of entries and key events.' },
    { key: 'current_state',         label: 'Current state summary',        desc: 'Where things stand now — movement, gaps, pressure, direction.' },
    { key: 'what_moved',            label: 'What moved',                   desc: 'Evidenced changes across the period.' },
    { key: 'what_stuck',            label: 'What remained stuck',          desc: 'Non-movement — patterns that returned without change.' },
    { key: 'what_under_load',       label: 'What was under load',          desc: 'Pressures and capability breakdown periods.' },
    { key: 'what_avoided',          label: 'What was avoided',             desc: 'Structural or lexical avoidance in the record.' },
    { key: 'what_contradicted',     label: 'What contradicted',            desc: 'Tensions held across the period.' },
    { key: 'what_changed',          label: 'What changed over time',       desc: 'Shift from baseline to current — direction of travel.' },
    { key: 'what_unresolved',       label: 'What remains unresolved',      desc: 'Open gaps and tensions that have not closed.' },
    { key: 'professional_first',    label: 'What the professional should know first', desc: 'The most relevant single thing for the receiving context.' },
    { key: 'outside_scope',         label: 'What is explicitly outside scope', desc: 'Areas the person has chosen not to include.' },
  ],


  // ── Required Export Caveats ───────────────────────────────
  // Any handover output must include these statements.

  requiredCaveats: [
    'Based only on material entered by the person — not independently verified.',
    'Not a diagnosis.',
    'Not a risk score.',
    'Not a legal finding.',
    'Not a compliance assessment.',
    'Not a professional clinical record.',
  ],


  // ── Privacy Rules ─────────────────────────────────────────

  privacyRules: {
    minimisationDefault:
      'Privacy minimisation is the default position. Include only what is necessary for the chosen scope.',
    identifiersDefault:
      'Personal identifiers should be omitted unless explicitly included by the person.',
    redactionSupport:
      'Deployments should support optional redaction of specific entries or topics before export.',
  },


  // ── What This Prevents ────────────────────────────────────

  prevents: [
    'One-session memory dump replacing a meaningful record.',
    'Crisis-only narration that misrepresents the arc.',
    'Professional relying only on surface presentation.',
    'Person losing ownership of their own record.',
    'Coercive use by institutions.',
    'Private map becoming surveillance.',
  ],


  // ── Failure Modes ─────────────────────────────────────────

  failureModes: [
    'Sharing becomes default rather than opt-in.',
    'Export includes more personal data than the person intended.',
    'Professional treats map output as verified fact.',
    'Institution uses the map coercively or as a condition of support.',
    'Person edits entries for performance because they expect review.',
    'Map mistaken for diagnosis, risk score, or compliance evidence.',
  ],


  // ── Boundary ──────────────────────────────────────────────

  boundary:
    'Do not build this as surveillance. Do not build it as parole scoring. Do not build it as employee monitoring. Do not build it as diagnosis. Do not build it as compliance enforcement. The handover is only valuable if the private record was honest. The private record is only honest if the person owns it.',


  // ── Test Cases ────────────────────────────────────────────

  testCases: [
    {
      id:       'PRH-01',
      input:    'Person chooses not to share.',
      expected: 'No handover generated.',
    },
    {
      id:       'PRH-02',
      input:    'Person exports to a professional.',
      expected: 'Structured summary with required caveats attached.',
    },
    {
      id:       'PRH-03',
      input:    'Entry includes personal identifiers.',
      expected: 'Redact or minimise by default.',
    },
    {
      id:       'PRH-04',
      input:    'Professional asks for a risk score.',
      expected: 'Not supported. Outside the scope of this behaviour.',
    },
    {
      id:       'PRH-05',
      input:    'Person wants only the last month exported.',
      expected: 'Export scoped to chosen window only.',
    },
  ],

};
