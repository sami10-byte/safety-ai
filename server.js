const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database(path.join(__dirname, 'reports.db'));

app.use(cors());
app.use(bodyParser.json({limit:'12mb'}));
app.use(express.static(__dirname));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectName TEXT,
    safetyOfficer TEXT,
    projectManager TEXT,
    violations TEXT,
    notes TEXT,
    recommendations TEXT,
    createdAt TEXT
  )`);
});

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function fallbackReport(data){
  const violations = (data.violations || []).map((v, i) => ({
    no: i+1,
    desc: v.desc || 'مخالفة سلامة مهنية',
    note: v.note || 'يلزم اتخاذ الإجراء التصحيحي فورًا والتحقق من الإغلاق.'
  }));
  return {
    projectName: data.projectName || 'اسم المشروع',
    safetyOfficer: data.safetyOfficer || 'سامي الاسمري',
    projectManager: data.projectManager || '',
    generalNotes: data.notes || 'تم رصد المخالفات الموضحة أعلاه أثناء الجولة الميدانية، ويوصى بسرعة المعالجة وفق متطلبات الصحة والسلامة المهنية.',
    recommendations: [
      'الالتزام بجميع اشتراطات الصحة والسلامة المهنية.',
      'توفير معدات الوقاية الشخصية لجميع العاملين.',
      'إجراء تفتيشات دورية على الموقع.',
      'تدريب العاملين على إجراءات السلامة.',
      'التأكد من تطبيق الإجراءات التصحيحية للمخالفات.'
    ],
    violations
  };
}

app.post('/api/generate', async (req, res) => {
  const data = req.body || {};
  try {
    if(!client){ return res.json(fallbackReport(data)); }
    const prompt = `أنت خبير صحة وسلامة مهنية في السعودية. حسّن صياغة تقرير مخالفات سلامة بصيغة JSON فقط دون markdown.
المدخلات: ${JSON.stringify(data)}
المطلوب JSON بالمفاتيح: projectName,safetyOfficer,projectManager,generalNotes,recommendations array,violations array of {no,desc,note}. اجعل اللغة عربية رسمية وخالية من الأخطاء.`;
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{role:'user', content: prompt}],
      temperature: 0.2
    });
    const txt = completion.choices[0].message.content.replace(/```json|```/g,'').trim();
    res.json(JSON.parse(txt));
  } catch(e){ res.json(fallbackReport(data)); }
});

app.post('/api/reports', (req,res)=>{
  const r = req.body || {};
  db.run(`INSERT INTO reports (projectName,safetyOfficer,projectManager,violations,notes,recommendations,createdAt) VALUES (?,?,?,?,?,?,?)`,
    [r.projectName, r.safetyOfficer, r.projectManager, JSON.stringify(r.violations||[]), r.generalNotes||'', JSON.stringify(r.recommendations||[]), new Date().toISOString()],
    function(err){ if(err) return res.status(500).json({error:err.message}); res.json({id:this.lastID}); }
  );
});
app.get('/api/reports', (req,res)=>{
  db.all(`SELECT * FROM reports ORDER BY id DESC`, [], (err, rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json(rows.map(r=>({...r, violations: JSON.parse(r.violations||'[]'), recommendations: JSON.parse(r.recommendations||'[]')})));
  });
});
app.get('*', (req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(PORT, ()=> console.log(`Safety AI running on ${PORT}`));
