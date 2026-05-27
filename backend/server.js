const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data store for MVP
let slots = [
  { id: 1, time: '09:00 AM', date: '2026-05-20', available: true },
  { id: 2, time: '10:00 AM', date: '2026-05-20', available: true },
  { id: 3, time: '11:00 AM', date: '2026-05-20', available: true },
  { id: 4, time: '02:00 PM', date: '2026-05-20', available: true },
  { id: 5, time: '03:00 PM', date: '2026-05-20', available: true },
];

let appointments = [];
let nextAppointmentId = 1;

// POST /doctor/login
app.post('/doctor/login', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded credentials for MVP
  if (username === 'doctor' && password === 'password123') {
    res.json({ success: true, token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// GET /slots
app.get('/slots', (req, res) => {
  // Return only available slots for patients
  const availableSlots = slots.filter(slot => slot.available);
  res.json({ success: true, data: availableSlots });
});

// POST /appointments
app.post('/appointments', (req, res) => {
  const { name, phone, age, problem, slotId } = req.body;
  
  if (!name || !phone || !age || !problem || !slotId) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const slotIndex = slots.findIndex(s => s.id === parseInt(slotId));
  
  if (slotIndex === -1 || !slots[slotIndex].available) {
    return res.status(400).json({ success: false, message: 'Slot not available' });
  }

  // Mark slot as booked
  slots[slotIndex].available = false;

  const newAppointment = {
    id: nextAppointmentId++,
    name,
    phone,
    age,
    problem,
    slot: slots[slotIndex],
    bookedAt: new Date().toISOString()
  };

  appointments.push(newAppointment);

  res.json({ success: true, message: 'Appointment booked', data: newAppointment });
});

// GET /appointments
app.get('/appointments', (req, res) => {
  // Simple check for doctor token
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer mock-jwt-token') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  res.json({ success: true, data: appointments });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
