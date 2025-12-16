export interface Sport {
  id: string;
  name: string;
  icon: string;
}

export const sports: Sport[] = [
  { id: 'football', name: 'Football (Soccer)', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'rugby', name: 'Rugby', icon: '🏉' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'american-football', name: 'American Football', icon: '🏈' },
  { id: 'hockey', name: 'Hockey', icon: '🏒' },
  { id: 'table-tennis', name: 'Table Tennis', icon: '🏓' },
  { id: 'badminton', name: 'Badminton', icon: '🏸' },
  { id: 'boxing', name: 'Boxing', icon: '🥊' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'athletics', name: 'Athletics', icon: '🏃' },
  { id: 'cycling', name: 'Cycling', icon: '🚴' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
  { id: 'handball', name: 'Handball', icon: '🤾' }
];
