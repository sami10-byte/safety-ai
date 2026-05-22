const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ projects: [], reports: [], risks: [] }, null, 2));
}

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_ء-ي]/g, '_')}`)
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (_, res) => res.json({ ok: true, app: 'HSE AI Platform', developer: 'سامي الأسمري' }));

app.get('/api/projects', (_, res) => res.json(readDb().projects));
app.post('/api/projects', (req, res) => {
  const db = readDb();
  const project = { id: id('project'), name: req.body.name || 'مشروع جديد', manager: req.body.manager || '', safety: req.body.safety || '', createdAt: new Date().toISOString() };
  db.projects.unshift(project); writeDb(db); res.json(project);
});

app.get('/api/reports', (_, res) => res.json(readDb().reports));
app.post('/api/reports', upload.array('images', 12), (req, res) => {
  const db = readDb();
  let violations = [];
  try { violations = JSON.parse(req.body.violations || '[]'); } catch {}
  const files = (req.files || []).map(f => `/uploads/${f.filename}`);
  const report = {
    id: id('report'),
    projectName: req.body.projectName || 'غير محدد',
    safetyOfficer: req.body.safetyOfficer || '',
    projectManager: req.body.projectManager || '',
    location: req.body.location || '',
    notes: req.body.notes || '',
    violations,
    images: files,
    recommendations: [
      'الالتزام بجميع اشتراطات الصحة والسلامة المهنية.',
      'توفير معدات الوقاية الشخصية لجميع العاملين.',
      'تنفيذ الإجراءات التصحيحية للمخالفات المرصودة.',
      'إجراء تفتيش دوري على موقع العمل.',
      'تدريب العاملين على مخاطر النشاط ومتطلبات السلامة.'
    ],
    createdAt: new Date().toISOString()
  };
  db.reports.unshift(report); writeDb(db); res.json(report);
});
app.get('/api/reports/:id', (req, res) => {
  const report = readDb().reports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

app.post('/api/risks', (req, res) => {
  const db = readDb();
  const risk = { id: id('risk'), ...req.body, createdAt: new Date().toISOString() };
  db.risks.unshift(risk); writeDb(db); res.json(risk);
});
app.get('/api/risks', (_, res) => res.json(readDb().risks));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`HSE AI Platform running on port ${PORT}`));
