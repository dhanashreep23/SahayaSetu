import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Mock database
const users = [];
const ngos = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Mock API Server Running' });
});

// Donor Registration
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = {
      id: Date.now(),
      email,
      fullName,
      password,
      role: 'DONOR',
      token: `token_${Date.now()}`
    };

    users.push(user);
    res.status(201).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: 'DONOR',
      token: user.token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// NGO Registration
app.post('/api/auth/register-ngo', (req, res) => {
  try {
    const { name, darpanId, email, contactPhone, addressLine1, city, password } = req.body;

    if (!name || !darpanId || !email || !contactPhone || !addressLine1 || !city || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ngo = {
      id: Date.now(),
      name,
      darpanId,
      email,
      contactPhone,
      addressLine1,
      city,
      password,
      type: 'ngo',
      status: 'PENDING_APPROVAL',
      token: `token_${Date.now()}`
    };

    ngos.push(ngo);
    res.status(201).json({
      id: ngo.id,
      name: ngo.name,
      email: ngo.email,
      type: 'ngo',
      status: 'PENDING_APPROVAL',
      message: 'NGO registered successfully. Awaiting admin approval.',
      token: ngo.token
    });
  } catch (error) {
    res.status(500).json({ error: 'NGO Registration failed' });
  }
});

// Admin Registration
app.post('/api/auth/register-admin', (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const admin = {
      id: Date.now(),
      email,
      fullName,
      password,
      role: 'ADMIN',
      token: `token_${Date.now()}`
    };

    users.push(admin);
    res.status(201).json({
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: 'ADMIN',
      token: admin.token
    });
  } catch (error) {
    res.status(500).json({ error: 'Admin Registration failed' });
  }
});

// Donor Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password && u.role === 'DONOR');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: 'DONOR',
      token: user.token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// NGO Login
app.post('/api/auth/login-ngo', (req, res) => {
  try {
    const { email, password } = req.body;
    const ngo = ngos.find(n => n.email === email && n.password === password);

    if (!ngo) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (ngo.status !== 'APPROVED') {
      return res.status(403).json({ error: 'NGO not approved yet' });
    }

    res.json({
      id: ngo.id,
      name: ngo.name,
      email: ngo.email,
      type: 'ngo',
      status: ngo.status,
      token: ngo.token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all NGOs (Admin)
app.get('/api/admin/ngos', (req, res) => {
  res.json(ngos);
});

// Approve NGO
app.post('/api/admin/ngos/:ngoId/approve', (req, res) => {
  try {
    const ngo = ngos.find(n => n.id === parseInt(req.params.ngoId));
    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }
    ngo.status = 'APPROVED';
    res.json({ message: 'NGO approved', ngo });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve NGO' });
  }
});

// Disapprove NGO
app.post('/api/admin/ngos/:ngoId/disapprove', (req, res) => {
  try {
    const ngo = ngos.find(n => n.id === parseInt(req.params.ngoId));
    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }
    ngo.status = 'REJECTED';
    res.json({ message: 'NGO rejected', ngo });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject NGO' });
  }
});

app.listen(PORT, () => {
  console.log(`Mock API Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
