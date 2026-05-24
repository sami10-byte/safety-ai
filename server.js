const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HSE AI</title>

<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial}
body{background:#f5f7f6;padding:20px}
.header{background:#065f46;color:white;padding:30px;border-radius:24px;text-align:center}
.header h1{font-size:42px;margin-bottom:10px}
.header p{font-size:20px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:25px;margin-top:30px}
.card{background:white;border-radius:25px;padding:35px;text-align:center;box-shadow:0 8px 25px rgba(0,0,0,.10)}
.card h2{color:#065f46;font-size:32px;margin:15px 0}
.card p{font-size:20px;line-height:1.8;color:#444}
.btn{display:inline-block;background:#065f46;color:white;padding:15px 30px;border-radius:15px;text-decoration:none;font-size:22px;margin-top:20px;border:none;cursor:pointer}
input,textarea{width:100%;padding:15px;border-radius:14px;border:1px solid #ccc;font-size:18px;margin-top:15px}
.answer{display:none;background:#ecfdf5;margin-top:20px;padding:20px;border-radius:15px;text-align:right;line-height:2;font-size:18px}
.footer{margin-top:30px;background:#065f46;color:white;padding:20px;border-radius:18px;text-align:center;font-size:20px}
</style>
</head>

<body>

<div class="header">
  <h1>🛡️ صحة وسلامة مهنية</h1>
  <p>بيئة آمنة .. عمل مستدام</p>
  <p>منصة ذكية لإدارة تقارير الصحة والسلامة المهنية</p>
</div>

<div class="cards">

  <div class="card">
    <div style="font-size:70px">📋</div>
    <h2>تقرير مخالفات صحة وسلامة مهنية</h2>
    <p>إدخال بيانات المخالفة وإصدار تقرير احترافي.</p>
    <a href="/reports" class="btn">دخول إلى التقارير</a>
  </div>

  <div class="card">
    <div style="font-size:70px;color:#d62828">?</div>
    <h2>اسألني</h2>
    <p>اسأل أي شيء يخص الصحة والسلامة المهنية.</p>

    <textarea id="question" rows="4" placeholder="اكتب سؤالك هنا..."></textarea>

    <button class="btn" onclick="askAI()">اسأل الآن</button>

    <div id="answer" class="answer"></div>
  </div>

</div>

<div class="footer">
تطوير وإنشاء المنصة: سامي الأسمري
</div>

<script>
async function askAI(){
  const question = document.getElementById("question").value.trim();
  const answer = document.getElementById("answer");

  if(!question){
    answer.style.display = "block";
    answer.innerHTML = "اكتب السؤال أولاً.";
    return;
  }

  answer.style.display = "block";
  answer.innerHTML = "جاري تجهيز الإجابة...";

  try{
    const res = await fetch("/ask-ai", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ question })
    });

    const data = await res.json();
    answer.innerHTML = data.answer;
  }catch(err){
    answer.innerHTML = "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.";
  }
}
</script>

</body>
</html>
`);
});

app.post("/ask-ai", async (req, res) => {
  const question = req.body.question || "";

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      answer:
        "إجابة مبدئية: يجب تقييم المخاطر، تأمين منطقة العمل، استخدام معدات الوقاية الشخصية، وتطبيق الإجراءات التصحيحية حسب اشتراطات الصحة والسلامة المهنية."
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "أنت خبير صحة وسلامة مهنية HSE. أجب باللغة العربية فقط، بإجابة واضحة ومختصرة وعملية، واذكر المخاطر والإجراءات التصحيحية عند الحاجة."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.json({
        answer: "تعذر الحصول على إجابة من الذكاء الاصطناعي. تأكد من مفتاح OpenAI في Render."
      });
    }

    res.json({
      answer: data.choices[0].message.content.replace(/\\n/g, "<br>")
    });

  } catch (error) {
    res.json({
      answer: "حدث خطأ في الاتصال بالذكاء الاصطناعي."
    });
  }
});

app.get("/reports", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>تقرير مخالفات</title>

<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial}
body{background:#f1f5f9;padding:20px}
.form{max-width:900px;margin:auto;background:white;padding:25px;border-radius:20px;box-shadow:0 5px 20px rgba(0,0,0,.08)}
h1{color:#065f46;margin-bottom:20px}
input,textarea{width:100%;padding:15px;margin:10px 0 20px;border:1px solid #ddd;border-radius:12px;font-size:16px}
button,a{background:#065f46;color:white;border:none;padding:14px 24px;border-radius:12px;text-decoration:none;font-size:18px;margin:5px;display:inline-block}
.report{display:none;width:190mm;min-height:277mm;margin:25px auto;background:white;padding:8mm;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,.1)}
.report-header{text-align:center;border-bottom:2px solid #065f46;padding-bottom:12px;margin-bottom:12px}
.report-header h1{font-size:28px}
.info{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
.info div{border:1px solid #ccc;padding:8px;text-align:center;border-radius:8px}
.section{border:1px solid #ccc;border-radius:10px;margin-bottom:10px;overflow:hidden}
.section-title{background:#065f46;color:white;padding:8px;font-weight:bold}
.box{padding:10px;line-height:1.7;font-size:14px}
.image-box{text-align:center}
.image-box img{width:85%;max-height:220px;object-fit:cover;border-radius:8px}
.footer{background:#065f46;color:white;padding:10px;border-radius:8px;text-align:center;margin-top:12px;font-size:13px}
@media print{
  @page{size:A4 portrait;margin:8mm}
  body{background:white;padding:0;margin:0}
  .form,button,a{display:none!important}
  .report{display:block!important;width:190mm;min-height:auto;margin:0 auto;padding:8mm;box-shadow:none;border-radius:0}
}
</style>
</head>

<body>

<div class="form">
<h1>إنشاء تقرير مخالفات</h1>

<input id="project" placeholder="اسم المشروع">
<input id="safety" placeholder="مسؤول السلامة">
<input id="manager" placeholder="مدير المشروع">

<textarea id="violation" rows="4" placeholder="ماهي المخالفة؟"></textarea>

<input id="image" type="file" accept="image/*">

<textarea id="notes" rows="4" placeholder="ملاحظات عامة"></textarea>

<textarea id="recs" rows="4" placeholder="توصيات عامة"></textarea>

<button onclick="generateReport()">توليد التقرير</button>
<button onclick="window.print()">طباعة / PDF</button>
<a href="/">رجوع</a>
</div>

<div id="report" class="report">

<div class="report-header">
<div style="font-size:45px">🪖🛡️</div>
<h1>تقرير مخالفات صحة وسلامة مهنية</h1>
</div>

<div class="info">
<div><b>اسم المشروع</b><br><span id="rProject"></span></div>
<div><b>مسؤول السلامة</b><br><span id="rSafety"></span></div>
<div><b>مدير المشروع</b><br><span id="rManager"></span></div>
</div>

<div class="section">
<div class="section-title">1. ماهي المخالفة</div>
<div class="box" id="rViolation"></div>
</div>

<div class="section">
<div class="section-title">2. صورة المخالفة</div>
<div class="box image-box" id="rImage">لا توجد صورة</div>
</div>

<div class="section">
<div class="section-title">3. ملاحظات عامة</div>
<div class="box" id="rNotes"></div>
</div>

<div class="section">
<div class="section-title">4. توصيات عامة</div>
<div class="box" id="rRecs"></div>
</div>

<div class="footer">
السلامة مسؤوليتنا جميعاً | تطوير وإنشاء المنصة: سامي الأسمري
</div>

</div>

<script>
function generateReport(){
  document.getElementById("report").style.display = "block";

  document.getElementById("rProject").innerText = document.getElementById("project").value || "غير محدد";
  document.getElementById("rSafety").innerText = document.getElementById("safety").value || "غير محدد";
  document.getElementById("rManager").innerText = document.getElementById("manager").value || "غير محدد";
  document.getElementById("rViolation").innerText = document.getElementById("violation").value || "لا توجد مخالفة";
  document.getElementById("rNotes").innerText = document.getElementById("notes").value || "لا توجد ملاحظات.";
  document.getElementById("rRecs").innerText = document.getElementById("recs").value || "الالتزام بمتطلبات السلامة المهنية.";

  const file = document.getElementById("image").files[0];

  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      document.getElementById("rImage").innerHTML = "<img src='" + e.target.result + "'>";
    };
    reader.readAsDataURL(file);
  }

  setTimeout(() => {
    document.getElementById("report").scrollIntoView({behavior:"smooth"});
  }, 300);
}
</script>

</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log("HSE AI running on port " + PORT);
});
