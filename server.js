const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Database = require('better-sqlite3');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'hse.db'));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT,
  manager TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_no TEXT,
  project_id INTEGER,
  project_name TEXT,
  location TEXT,
  inspector TEXT,
  report_date TEXT,
  violation_type TEXT,
  risk_level TEXT,
  status TEXT DEFAULT 'مفتوح',
  observation TEXT,
  ai_report TEXT,
  actions TEXT,
  image_path TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS risks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity TEXT,
  hazards TEXT,
  controls TEXT,
  risk_level TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

const countProjects = db.prepare('SELECT COUNT(*) AS c FROM projects').get().c;
if (!countProjects) {
  db.prepare('INSERT INTO projects (name, location, manager) VALUES (?, ?, ?)').run('مشروع تجريبي', 'جدة', 'مدير المشروع');
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '.jpg');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

function cleanArabic(text) {
  return (text || '').toString().trim();
}

function fallbackReport(data) {
  const obs = cleanArabic(data.observation);
  const type = cleanArabic(data.violation_type) || 'مخالفة سلامة مهنية';
  const risk = cleanArabic(data.risk_level) || 'متوسط';
  return `ملخص الملاحظة:\nتم رصد ${type} في موقع العمل، وتتمثل الملاحظة في: ${obs || 'وجود حالة غير مطابقة لاشتراطات الصحة والسلامة المهنية.'}\n\nمستوى الخطورة:\n${risk}\n\nالأثر المحتمل:\nقد تؤدي هذه الحالة إلى إصابات للعاملين أو تلف بالممتلكات أو تعطيل سير العمل في حال عدم معالجتها.\n\nالإجراء التصحيحي المطلوب:\n1. إيقاف النشاط المتأثر مؤقتًا عند وجود خطر مباشر.\n2. تأمين منطقة العمل ووضع وسائل التحذير المناسبة.\n3. تصحيح المخالفة وفق متطلبات السلامة المعتمدة.\n4. توعية العاملين بالإجراء الصحيح قبل استئناف العمل.\n\nالإجراء الوقائي:\nتنفيذ جولات تفتيش دورية، وتوثيق الملاحظات، ومتابعة إغلاقها من قبل مسؤول السلامة وإدارة المشروع.`;
}

async function generateAIReport(data) {
  if (!process.env.OPENAI_API_KEY) return fallbackReport(data);
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `اكتب تقرير صحة وسلامة مهنية عربي رسمي وخالٍ من الأخطاء. اجعله منظمًا بعناوين: ملخص الملاحظة، مستوى الخطورة، الأثر المحتمل، الإجراء التصحيحي، الإجراء الوقائي، توصية مسؤول السلامة. لا تذكر أنك ذكاء اصطناعي. البيانات: ${JSON.stringify(data)}`;
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });
    return response.choices?.[0]?.message?.content || fallbackReport(data);
  } catch (e) {
    return fallbackReport(data);
  }
}

app.get('/api/dashboard', (req, res) => {
  const reports = db.prepare('SELECT COUNT(*) AS c FROM reports').get().c;
  const projects = db.prepare('SELECT COUNT(*) AS c FROM projects').get().c;
  const open = db.prepare("SELECT COUNT(*) AS c FROM reports WHERE status != 'مغلق'").get().c;
  const high = db.prepare("SELECT COUNT(*) AS c FROM reports WHERE risk_level = 'عالي'").get().c;
  const latest = db.prepare('SELECT * FROM reports ORDER BY id DESC LIMIT 8').all();
  res.json({ reports, projects, open, high, latest });
});

app.get('/api/projects', (req, res) => {
  res.json(db.prepare('SELECT * FROM projects ORDER BY id DESC').all());
});

app.post('/api/projects', (req, res) => {
  const { name, location, manager } = req.body;
  if (!name) return res.status(400).json({ error: 'اسم المشروع مطلوب' });
  const info = db.prepare('INSERT INTO projects (name, location, manager) VALUES (?, ?, ?)').run(name, location || '', manager || '');
  res.json({ id: info.lastInsertRowid });
});

app.get('/api/reports', (req, res) => {
  res.json(db.prepare('SELECT * FROM reports ORDER BY id DESC').all());
});

app.get('/api/reports/:id', (req, res) => {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
  if (!report) return res.status(404).json({ error: 'التقرير غير موجود' });
  res.json(report);
});

app.post('/api/reports', upload.single('image'), async (req, res) => {
  const data = req.body;
  const project = data.project_id ? db.prepare('SELECT * FROM projects WHERE id = ?').get(data.project_id) : null;
  const reportNo = data.report_no || `HSE-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
  const ai = await generateAIReport({ ...data, project_name: project?.name || data.project_name });
  const info = db.prepare(`INSERT INTO reports
    (report_no, project_id, project_name, location, inspector, report_date, violation_type, risk_level, status, observation, ai_report, actions, image_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(reportNo, data.project_id || null, project?.name || data.project_name || '', data.location || project?.location || '', data.inspector || '', data.report_date || new Date().toISOString().slice(0,10), data.violation_type || '', data.risk_level || 'متوسط', data.status || 'مفتوح', data.observation || '', ai, data.actions || '', imagePath);
  res.json({ id: info.lastInsertRowid, ai_report: ai });
});

app.post('/api/risks', async (req, res) => {
  const { activity } = req.body;
  let hazards = 'مخاطر محتملة مرتبطة بالنشاط، مثل السقوط أو الصدمات أو الإصابات اليدوية حسب طبيعة العمل.';
  let controls = 'توفير معدات الوقاية الشخصية، عزل منطقة العمل، الإشراف المستمر، والتأكد من تدريب العاملين.';
  let level = 'متوسط';
  if (process.env.OPENAI_API_KEY && activity) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const r = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: `قيّم مخاطر نشاط HSE التالي بالعربية باختصار وأرجع JSON فقط بالمفاتيح hazards, controls, risk_level: ${activity}` }],
        temperature: 0.2
      });
      const parsed = JSON.parse(r.choices[0].message.content.replace(/```json|```/g, '').trim());
      hazards = parsed.hazards || hazards; controls = parsed.controls || controls; level = parsed.risk_level || level;
    } catch (e) {}
  }
  const info = db.prepare('INSERT INTO risks (activity, hazards, controls, risk_level) VALUES (?, ?, ?, ?)').run(activity || '', hazards, controls, level);
  res.json({ id: info.lastInsertRowid, activity, hazards, controls, risk_level: level });
});

app.get('/api/risks', (req, res) => res.json(db.prepare('SELECT * FROM risks ORDER BY id DESC').all()));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`HSE AI Platform running on ${PORT}`));
