import {
  type FitCheckMetadata,
  type FitCheckQuestion,
  type SectionKey,
  type ServitizationStage,
  type ValueDriver,
} from '@/lib/types/fit-check';

export const SECTION_LABELS: Record<SectionKey, string> = {
  customer_context: 'Customer Context',
  operational_value: 'Operational Value Priorities',
  service_delivery: 'Service / Delivery Feasibility',
  implementation_feasibility: 'Implementation Feasibility',
};

export const EMPTY_METADATA: FitCheckMetadata = {
  respondentRole: '',
  targetIndustry: '',
  assetCategory: '',
  companySize: '',
};

const FOUR_POINT_OPTIONS = [
  { value: 1 as const, label: '' },
  { value: 2 as const, label: '' },
  { value: 3 as const, label: '' },
  { value: 4 as const, label: '' },
];

export const FIT_CHECK_QUESTIONS: FitCheckQuestion[] = [
  {
    id: 'Q1',
    index: 1,
    section: 'customer_context',
    prompt: "How critical is this equipment to the customer's operation?",
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Low' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Moderate' },
      { ...FOUR_POINT_OPTIONS[2], label: 'High' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Mission-critical' },
    ],
  },
  {
    id: 'Q2',
    index: 2,
    section: 'customer_context',
    prompt: 'What is the main reason a service-based model would be attractive here?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Reduce upfront investment' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Offload maintenance / complexity' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Access newer technology faster' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Guarantee uptime / performance' },
    ],
  },
  {
    id: 'Q3',
    index: 3,
    section: 'customer_context',
    prompt: 'What is the main consequence if this equipment underperforms?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Minor inconvenience' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Higher cost / service effort' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Downtime / lost production' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Quality / safety / compliance risk' },
    ],
  },
  {
    id: 'Q4',
    index: 4,
    section: 'operational_value',
    prompt: 'Which outcome matters most for this equipment?',
    options: [
      { value: 1, label: 'Availability / uptime' },
      { value: 2, label: 'Production effectiveness' },
      { value: 3, label: 'Output quality' },
      { value: 4, label: 'Cost efficiency' },
      { value: 5, label: 'Safety / compliance' },
      { value: 6, label: 'Technical support / ease of operation' },
    ],
  },
  {
    id: 'Q5',
    index: 5,
    section: 'operational_value',
    prompt: 'How frequent or damaging are failures / interventions?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Rare and low impact' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Occasional and manageable' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Recurring and costly' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Frequent or highly damaging' },
    ],
  },
  {
    id: 'Q6',
    index: 6,
    section: 'customer_context',
    prompt: 'How important is it for the customer to shift from CapEx to OpEx?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Not important' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Somewhat important' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Important' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Very important' },
    ],
  },
  {
    id: 'Q7',
    index: 7,
    section: 'service_delivery',
    prompt: 'How strong is your after-sales / service capability today?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Very weak' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Basic / reactive' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Structured' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Strong / proactive' },
    ],
  },
  {
    id: 'Q8',
    index: 8,
    section: 'service_delivery',
    prompt: 'How well can you monitor performance and verify delivered value?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Hardly at all' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Mostly manual' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Partly digital' },
      {
        ...FOUR_POINT_OPTIONS[3],
        label: 'Clearly measurable / digitally monitored',
      },
    ],
  },
  {
    id: 'Q9',
    index: 9,
    section: 'service_delivery',
    prompt: 'How predictable are maintenance costs and service needs?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Highly unpredictable' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Somewhat variable' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Reasonably predictable' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Very predictable' },
    ],
  },
  {
    id: 'Q10',
    index: 10,
    section: 'service_delivery',
    prompt: 'How standardized and redeployable is the asset?',
    options: [
      {
        ...FOUR_POINT_OPTIONS[0],
        label: 'Highly customized / hard to redeploy',
      },
      { ...FOUR_POINT_OPTIONS[1], label: 'Somewhat customized' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Fairly standardized' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Highly standardized / reusable' },
    ],
  },
  {
    id: 'Q11',
    index: 11,
    section: 'implementation_feasibility',
    prompt: 'How ready is the business to absorb risk and manage more complex contracts?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Very limited' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Limited' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Moderate' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Strong' },
    ],
  },
  {
    id: 'Q12',
    index: 12,
    section: 'implementation_feasibility',
    prompt: 'How credible is the business case for one narrow pilot?',
    options: [
      { ...FOUR_POINT_OPTIONS[0], label: 'Mostly conceptual' },
      { ...FOUR_POINT_OPTIONS[1], label: 'Unclear' },
      { ...FOUR_POINT_OPTIONS[2], label: 'Plausible' },
      { ...FOUR_POINT_OPTIONS[3], label: 'Strong and quantifiable' },
    ],
  },
];

export const SERVITIZATION_STAGES: ServitizationStage[] = [
  {
    id: 'pure_product',
    level: 0,
    title: 'Pure Product',
  },
  {
    id: 'product_oriented_services',
    level: 1,
    title: 'Product-Oriented Services',
  },
  {
    id: 'use_oriented_services',
    level: 2,
    title: 'Use-Oriented Services',
  },
  {
    id: 'result_oriented_services',
    level: 3,
    title: 'Result-Oriented Services',
  },
];

export const STAGE_CONTENT = {
  pure_product: {
    interpretation: 'Traditional product sales are still the best fit today.',
    nextStep: 'Build service basics and better operational visibility first.',
    avoidForNow: 'Do not force leasing or performance-based contracts.',
  },
  product_oriented_services: {
    interpretation:
      'The strongest opportunity is to build service layers around owned equipment.',
    nextStep:
      'Focus on maintenance, diagnostics, monitoring, spare parts, and service visibility.',
    avoidForNow:
      'Do not move too early into asset-heavy or outcome-heavy models.',
  },
  use_oriented_services: {
    interpretation:
      'You may be ready for leasing, rental, or access-based service models in selected cases.',
    nextStep:
      'Pilot one standardized asset category or customer segment.',
    avoidForNow:
      'Do not promise full performance outcomes unless measurability and predictability are strong.',
  },
  result_oriented_services: {
    interpretation:
      'You may be ready for outcome-based models such as pay-per-use, pay-per-output, or uptime-linked offers.',
    nextStep:
      'Pilot one narrow, measurable performance-based offer.',
    avoidForNow:
      'Do not scale too quickly across heterogeneous or weak-fit assets.',
  },
} as const;

export const VALUE_DRIVERS: Record<number, ValueDriver> = {
  1: { id: 'availability_uptime', label: 'Availability / uptime' },
  2: { id: 'production_effectiveness', label: 'Production effectiveness' },
  3: { id: 'output_quality', label: 'Output quality' },
  4: { id: 'cost_efficiency', label: 'Cost efficiency' },
  5: { id: 'safety_compliance', label: 'Safety / compliance' },
  6: { id: 'technical_support_ease', label: 'Technical support / ease of operation' },
};

export const AUDIENCE_OPTIONS = [
  {
    value: 'oem' as const,
    label: 'Equipment manufacturer / OEM',
    description:
      'You design, build, and distribute physical assets directly to end users or via channels.',
  },
  {
    value: 'service_provider' as const,
    label: 'Service provider / distributor',
    description:
      'You operate, maintain, or distribute assets manufactured by third parties.',
  },
  {
    value: 'other' as const,
    label: 'Other',
    description:
      'Financial institution, software vendor, or an alternative operating structure.',
  },
];

export const FIT_CHECK_STORAGE_KEY = 'equi-eaas-fit-check-submission';
