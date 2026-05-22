const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'reports.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]', 'utf8');

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^\w.\-]/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

function readReports() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '[]'); }
  catch { return []; }
}
function writeReports(reports) {
  fs.writeFileSync(DB_FILE, JSON.stringify(reports, null, 2), 'utf8');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/reports', (req, res) => {
  res.json(readReports());
});

app.post('/api/reports', upload.array('images', 10), (req, res) => {
  const reports = readReports();
  const images = (req.files || []).map(f => '/uploads/' + f.filename);
  const report = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    projectName: req.body.projectName || '',
    safetyOfficer: req.body.safetyOfficer || '',
    projectManager: req.body.projectManager || '',
    location: req.body.location || '',
    violation: req.body.violation || '',
    notes: req.body.notes || '',
    riskLevel: req.body.riskLevel || 'متوسط',
    images
  };
  reports.unshift(report);
  writeReports(reports);
  res.json({ ok: true, report });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`HSE AI Platform running on port ${PORT}`);
});