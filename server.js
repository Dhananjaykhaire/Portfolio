const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'portfolio-backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/site-info', (_req, res) => {
  res.json({
    owner: 'Dhananjay Khaire',
    currentYear: new Date().getFullYear(),
    rights: 'All rights reserved.'
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});
