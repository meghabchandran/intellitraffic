// Replace with real API data once the backend is ready.
export const alerts = [
  { id: 1, type: 'Heavy Congestion', place: 'MG Road Junction', ago: '2 min ago', level: 'high' },
  { id: 2, type: 'Accident reported', place: 'NH 66 Junction', ago: '5 min ago', level: 'medium' },
  { id: 3, type: 'Road maintenance', place: 'Central Road', ago: '12 min ago', level: 'low' },
]

export const cases = [
  { id: 1, type: 'Accident reported', place: 'NH 66 Junction', ago: '5 min ago', level: 'high' },
]

export const stats = [
  { key: 'flow', label: 'Traffic Flow', value: '1,248', unit: 'veh/hr' },
  { key: 'speed', label: 'Average Speed', value: '24', unit: 'km/h' },
  { key: 'congestion', label: 'Congestion', value: '68%', unit: '' },
  { key: 'delay', label: 'Average Delay', value: '7.4', unit: 'min' },
]

export const trend = [
  { t: '09:00', v: 28 }, { t: '09:10', v: 48 }, { t: '09:20', v: 40 },
  { t: '09:30', v: 62 }, { t: '09:40', v: 42 }, { t: '09:50', v: 34 }, { t: '10:00', v: 78 },
]

export const routes = [
  { id: 1, min: 10, miles: 7.9 },
  { id: 2, min: 11, miles: 4.3 },
  { id: 3, min: 11, miles: 6.6 },
]
