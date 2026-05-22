const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function defaultDb(){
  return {
    seq: { projects: 1, reports: 1, risks: 1 },
    projects: [{ id: 1, name: 'مشروع تجريبي', location: 'جدة', manager: 'مدير المشروع', created_at: new Date().toISOString() }],
    reports: [],
    risks: []
  };
}
function readDb(){
  try {
    if (!fs.existsSync(DB_FILE)) writeDb(defaultDb());
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    db.seq ||= { projects: 1, reports: 1, risks: 1 };
    db.projects ||= [];
    db.reports ||= [];
    db.risks ||= [];
    return db;
  } catch (e) {
    const db = defaultDb();
    writeDb(db);
    return db;
  }
}
function writeDb(db){
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}
function nextId(db, key){
  const max = Math.max(0, ...db[key].map(x => Number(x.id) || 0));
  const id = Math.max(Number(db.seq[key]) || 0, max) + 1;
  db.seq[key] = id;
  return id;
}

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname || '.jpg') || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});
const upload = multer({ storage });

function cleanArabic(text) { return (text || '').toString().trim(); }
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
    const response = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.3 });
    return response.choices?.[0]?.message?.content || fallbackReport(data);
  } catch { return fallbackReport(data); }
}

app.get('/api/dashboard', (req, res) => {
  const db = readDb();
  const reports = db.reports.length;
  const projects = db.projects.length;
  const open = db.reports.filter(r => r.status !== 'مغلق').length;
  const high = db.reports.filter(r => r.risk_level === 'عالي').length;
  const latest = [...db.reports].sort((a,b)=>b.id-a.id).slice(0,8);
  res.json({ reports, projects, open, high, latest });
});
app.get('/api/projects', (req, res) => res.json([...readDb().projects].sort((a,b)=>b.id-a.id)));
app.post('/api/projects', (req, res) => {
  const { name, location, manager } = req.body;
  if (!name) return res.status(400).json({ error: 'اسم المشروع مطلوب' });
  const db = readDb();
  const id = nextId(db, 'projects');
  db.projects.push({ id, name, location: location || '', manager: manager || '', created_at: new Date().toISOString() });
  writeDb(db);
  res.json({ id });
});
app.get('/api/reports', (req, res) => res.json([...readDb().reports].sort((a,b)=>b.id-a.id)));
app.get('/api/reports/:id', (req, res) => {
  const report = readDb().reports.find(r => Number(r.id) === Number(req.params.id));
  if (!report) return res.status(404).json({ error: 'التقرير غير موجود' });
  res.json(report);
});
app.post('/api/reports', upload.single('image'), async (req, res) => {
  const db = readDb();
  const data = req.body;
  const project = data.project_id ? db.projects.find(p => Number(p.id) === Number(data.project_id)) : null;
  const id = nextId(db, 'reports');
  const reportNo = data.report_no || `HSE-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
  const ai = await generateAIReport({ ...data, project_name: project?.name || data.project_name });
  const report = {
    id, report_no: reportNo, project_id: data.project_id || null,
    project_name: project?.name || data.project_name || '',
    location: data.location || project?.location || '',
    inspector: data.inspector || '', report_date: data.report_date || new Date().toISOString().slice(0,10),
    violation_type: data.violation_type || '', risk_level: data.risk_level || 'متوسط', status: data.status || 'مفتوح',
    observation: data.observation || '', ai_report: ai, actions: data.actions || '', image_path: imagePath,
    created_at: new Date().toISOString()
  };
  db.reports.push(report); writeDb(db); res.json({ id, ai_report: ai });
});
app.post('/api/risks', async (req, res) => {
  const { activity } = req.body;
  let hazards = 'مخاطر محتملة مرتبطة بالنشاط، مثل السقوط أو الصدمات أو الإصابات اليدوية حسب طبيعة العمل.';
  let controls = 'توفير معدات الوقاية الشخصية، عزل منطقة العمل، الإشراف المستمر، والتأكد من تدريب العاملين.';
  let level = 'متوسط';
  if (process.env.OPENAI_API_KEY && activity) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const r = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: `قيّم مخاطر نشاط HSE التالي بالعربية باختصار وأرجع JSON فقط بالمفاتيح hazards, controls, risk_level: ${activity}` }], temperature: 0.2 });
      const parsed = JSON.parse(r.choices[0].message.content.replace(/```json|```/g, '').trim());
      hazards = parsed.hazards || hazards; controls = parsed.controls || controls; level = parsed.risk_level || level;
    } catch {}
  }
  const db = readDb(); const id = nextId(db, 'risks');
  const risk = { id, activity: activity || '', hazards, controls, risk_level: level, created_at: new Date().toISOString() };
  db.risks.push(risk); writeDb(db); res.json(risk);
});
app.get('/api/risks', (req, res) => res.json([...readDb().risks].sort((a,b)=>b.id-a.id)));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`HSE AI Platform running on ${PORT}`));
