export interface Milestone {
  id: string;
  label: string;
  target: number;
  unit: string;
  dataSource: 'holders' | 'marketCap' | 'discord' | 'launch';
}

export const MILESTONES: Milestone[] = [
  { id: 'holders', label: '10K Holders', target: 10000, unit: 'holders', dataSource: 'holders' },
  { id: 'marketCap', label: '$1M Market Cap', target: 1000000, unit: 'USD', dataSource: 'marketCap' },
  { id: 'discord', label: '5K Discord Members', target: 5000, unit: 'members', dataSource: 'discord' },
  { id: 'launch', label: 'Feature Launch', target: 1, unit: 'launch', dataSource: 'launch' },
];
