require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.json');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

function readDB(){
  if(!fs.existsSync(DB_PATH)) return { reports: [] };
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return { reports: [] }; }
}
function writeDB(db){ fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8'); }
function uid(){ return 'HSE-' + new Date().toISOString().slice(0,10).replaceAll('-','') + '-' + Math.random().toString(36).slice(2,7).toUpperCase(); }

function buildReport(data, aiText=''){
  const today = new Date().toLocaleDateString('ar-SA');
  const project = data.projectName || 'غير محدد';
  const location = data.location || 'غير محدد';
  const safety = data.safetyOfficer || 'غير محدد';
  const manager = data.projectManager || 'غير محدد';
  const violation = data.violation || 'لم يتم إدخال وصف المخالفة.';
  const notes = data.notes || 'لا توجد ملاحظات إضافية.';
  const risk = data.riskLevel || 'متوسط';
  const ai = aiText || `وصف المخالفة:\n${violation}\n\nالملاحظات:\n${notes}\n\nالمخاطر المحتملة:\n- احتمالية تعرض العاملين للإصابة.\n- احتمالية تعطّل الأعمال أو تلف المعدات.\n- مخالفة متطلبات الصحة والسلامة المهنية.\n\nالإجراءات التصحيحية:\n- إيقاف العمل في منطقة المخالفة عند الحاجة.\n- تأمين الموقع فورًا وتوفير وسائل التحذير المناسبة.\n- توجيه العاملين بالالتزام بمتطلبات السلامة.\n- متابعة تنفيذ الإجراء التصحيحي وتوثيق الإغلاق.`;
  return { project, location, safety, manager, risk, date: today, body: ai };
}

async function generateAI(data){
  const prompt = `اكتب تقرير صحة وسلامة مهنية عربي رسمي واحترافي وخالٍ من الأخطاء. استخدم عناوين واضحة: وصف المخالفة، الملاحظات، المخاطر المحتملة، الإجراءات التصحيحية، التوصية النهائية. لا تكرر بيانات المشروع.\nالبيانات:\nاسم المشروع: ${data.projectName}\nموقع المخالفة: ${data.location}\nوصف المخالفة: ${data.violation}\nالملاحظات: ${data.notes}\nمستوى الخطورة: ${data.riskLevel}`;
  if(process.env.OPENAI_API_KEY){
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: 'أنت خبير سعودي في الصحة والسلامة المهنية وتكتب تقارير رسمية.' }, { role: 'user', content: prompt }],
      temperature: 0.3
    });
    return completion.choices?.[0]?.message?.content || '';
  }
  return '';
}

app.post('/api/reports', upload.single('photo'), async (req, res) => {
  try{
    const data = req.body;
    let aiText = '';
    try { aiText = await generateAI(data); } catch(e) { aiText = ''; }
    const report = buildReport(data, aiText);
    const db = readDB();
    const saved = {
      id: uid(),
      createdAt: new Date().toISOString(),
      creator: 'سامي الاسمري',
      projectName: report.project,
      location: report.location,
      safetyOfficer: report.safety,
      projectManager: report.manager,
      riskLevel: report.risk,
      reportDate: report.date,
      reportBody: report.body,
      imageName: req.file ? req.file.originalname : null
    };
    db.reports.unshift(saved);
    writeDB(db);
    res.json({ ok: true, report: saved });
  } catch(err){ res.status(500).json({ ok:false, error: 'تعذر إنشاء التقرير.' }); }
});

app.get('/api/reports', (req,res)=> res.json(readDB().reports));
app.get('/api/reports/:id', (req,res)=> {
  const report = readDB().reports.find(r => r.id === req.params.id);
  if(!report) return res.status(404).json({ error:'التقرير غير موجود' });
  res.json(report);
});
app.delete('/api/reports/:id', (req,res)=> {
  const db = readDB();
  db.reports = db.reports.filter(r => r.id !== req.params.id);
  writeDB(db);
  res.json({ok:true});
});
app.get('*', (req,res)=> res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, ()=> console.log(`Safety AI Pro running on ${PORT}`));
