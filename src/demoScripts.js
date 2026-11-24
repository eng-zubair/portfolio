// Scripted (zero-cost) AI receptionist conversations for the hero demo.
// All names, addresses and booking refs are fictional.
//
// Step types:
//   ai / caller  -> a transcript line (typed out)
//   tool         -> a function call the AI makes, with its result
//   field        -> fills one field of the booking card
//   booked       -> marks the booking as confirmed

export const demoScenarios = [
  {
    id: 'plumbing',
    tab: 'Plumbing',
    business: 'Mike’s Plumbing',
    cardTitle: 'New booking',
    fields: [['name', 'Caller'], ['service', 'Job'], ['address', 'Address'], ['when', 'Visit']],
    steps: [
      { type: 'ai', text: 'Thanks for calling Mike’s Plumbing. How can I help you today?' },
      { type: 'caller', text: 'Hi, I’ve got water leaking under my kitchen sink.' },
      { type: 'field', key: 'service', value: 'Kitchen sink leak' },
      { type: 'ai', text: 'Sorry to hear that — we can definitely help. Can I get your name?' },
      { type: 'caller', text: 'It’s Sarah.' },
      { type: 'field', key: 'name', value: 'Sarah' },
      { type: 'ai', text: 'Thanks, Sarah. What’s the address we’d be coming out to?' },
      { type: 'caller', text: '14 Oak Avenue, Somerset.' },
      { type: 'tool', name: 'check_service_area', args: 'city: "Somerset"', result: 'covered' },
      { type: 'field', key: 'address', value: '14 Oak Ave, Somerset' },
      { type: 'tool', name: 'check_availability', args: 'day: "today"', result: '10:00, 14:00' },
      { type: 'ai', text: 'Good news, we cover your area. I have 10 AM or 2 PM today — which works better?' },
      { type: 'caller', text: '2 PM, please.' },
      { type: 'tool', name: 'book_appointment', args: 'time: "14:00"', result: 'BK-4F9Q2' },
      { type: 'field', key: 'when', value: 'Today, 2:00 PM' },
      { type: 'tool', name: 'send_sms', args: 'to: caller', result: 'sent' },
      { type: 'ai', text: 'You’re booked for 2 PM today, and I’ve texted you a confirmation. Anything else?' },
      { type: 'booked' },
    ],
  },
  {
    id: 'dental',
    tab: 'Dental',
    business: 'BrightSmile Dental',
    cardTitle: 'Appointment',
    fields: [['name', 'Patient'], ['service', 'Reason'], ['doctor', 'Dentist'], ['when', 'Time']],
    steps: [
      { type: 'ai', text: 'Good morning, BrightSmile Dental. How can I help?' },
      { type: 'caller', text: 'Hi, I chipped a tooth last night and it’s a bit sensitive.' },
      { type: 'field', key: 'service', value: 'Chipped tooth · urgent' },
      { type: 'ai', text: 'Ouch, sorry about that. Are you an existing patient with us?' },
      { type: 'caller', text: 'Yes — Daniel Reed.' },
      { type: 'tool', name: 'find_patient', args: 'name: "Daniel Reed"', result: 'found' },
      { type: 'field', key: 'name', value: 'Daniel Reed' },
      { type: 'tool', name: 'check_availability', args: 'type: "emergency"', result: 'tomorrow 09:15' },
      { type: 'ai', text: 'Found you, Daniel. Dr. Khan has an emergency slot tomorrow at 9:15 AM. Shall I book it?' },
      { type: 'caller', text: 'Yes, please.' },
      { type: 'tool', name: 'book_appointment', args: 'slot: "tomorrow 09:15"', result: 'confirmed' },
      { type: 'field', key: 'doctor', value: 'Dr. Khan' },
      { type: 'field', key: 'when', value: 'Tomorrow, 9:15 AM' },
      { type: 'ai', text: 'Done. Try to avoid very hot or cold drinks until then — see you tomorrow!' },
      { type: 'booked' },
    ],
  },
  {
    id: 'restaurant',
    tab: 'Restaurant',
    business: 'Saffron Table',
    cardTitle: 'Reservation',
    fields: [['name', 'Guest'], ['party', 'Party'], ['when', 'When'], ['notes', 'Notes']],
    steps: [
      { type: 'ai', text: 'Saffron Table, how can I help you this evening?' },
      { type: 'caller', text: 'Can I book a table for six on Friday?' },
      { type: 'field', key: 'party', value: '6 guests' },
      { type: 'tool', name: 'check_tables', args: 'party: 6, day: "Fri"', result: '19:00, 20:30' },
      { type: 'ai', text: 'Of course. I have 7:00 or 8:30 PM on Friday for six. Which would you like?' },
      { type: 'caller', text: 'Seven o’clock. And one of us is vegetarian.' },
      { type: 'field', key: 'when', value: 'Friday, 7:00 PM' },
      { type: 'field', key: 'notes', value: '1 vegetarian guest' },
      { type: 'ai', text: 'Noted — I’ll let the kitchen know. May I have a name for the booking?' },
      { type: 'caller', text: 'Ali Hassan.' },
      { type: 'field', key: 'name', value: 'Ali Hassan' },
      { type: 'tool', name: 'book_table', args: 'time: "19:00"', result: 'table 12' },
      { type: 'ai', text: 'All set, Ali — a table for six at 7 PM on Friday. We’ll text you a reminder.' },
      { type: 'booked' },
    ],
  },
]
