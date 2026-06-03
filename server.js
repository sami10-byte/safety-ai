const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HSE AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,Tahoma,sans-serif}
body{background:#eef2f1;color:#123}
.hero{min-height:100vh;padding:35px;background:linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.92)),url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400");background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center}
.wrap{width:100%;max-width:1150px;text-align:center}
.logo{font-size:70px;margin-bottom:10px}
h1{font-size:46px;color:#064e3b;margin-bottom:10px}
.subtitle{font-size:25px;color:#065f46;font-weight:bold;margin-bottom:10px}
.desc{font-size:20px;line-height:1.8;color:#333;max-width:800px;margin:auto}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:28px;margin-top:45px}
.card{background:white;border-radius:28px;padding:35px;box-shadow:0 12px 35px rgba(0,0,0,.13);text-align:center}
.card-icon{font-size:75px;margin-bottom:15px}
.card h2{font-size:32px;color:#064e3b;margin-bottom:15px}
.card p{font-size:19px;line-height:1.8;color:#444}
.btn{display:inline-block;background:#065f46;color:white;text-decoration:none;border:none;border-radius:16px;padding:15px 32px;font-size:22px;margin-top:22px;cursor:pointer}
textarea{width:100%;min-height:120px;border:1px solid #ddd;border-radius:15px;padding:15px;font-size:18px;margin-top:18px}
.answer{display:none;background:#ecfdf5;border-radius:16px;margin-top:18px;padding:18px;line-height:2;text-align:right;font-size:17px}
.footer{background:#064e3b;color:white;border-radius:18px;padding:18px;margin-top:35px;font-size:19px}
</style>
</head>
<body>
<section class="hero">
<div class="wrap">
<div class="logo">🛡️</div>
<h1>صحة وسلامة مهنية</h1>
<div class="subtitle">بيئة آمنة .. عمل مستدام</div>
<p class="desc">منصة ذكية لإدارة تقارير مخالفات الصحة والسلامة المهنية والتفتيش بالمشاريع.</p>

<div class="cards">
<div class="card">
<div class="card-icon">📋</div>
<h2>تقرير مخالفات صحة وسلامة مهنية</h2>
<p>إدخال بيانات المخالفة وإصدار تقرير احترافي متناسق وجاهز للطباعة PDF.</p>
<a href="/reports" class="btn">دخول إلى التقارير</a>
</div>

<div class="card">
<div class="card-icon" style="color:#d62828">?</div>
<h2>اسألني</h2>
<p>اسأل أي شيء يخص الصحة والسلامة المهنية وسيتم الرد عليك بأسلوب مهني.</p>
<textarea id="question" placeholder="اكتب سؤالك هنا..."></textarea>
<button class="btn" onclick="askAI()">اسأل الآن</button>
<div id="answer" class="answer"></div>
</div>
</div>

<div class="footer">تطوير وإنشاء المنصة: سامي الأسمري</div>
</div>
</section>

<script>
async function askAI(){
  var question = document.getElementById("question").value.trim();
  var answer = document.getElementById("answer");

  if(!question){
    answer.style.display = "block";
    answer.innerHTML = "اكتب السؤال أولاً.";
    return;
  }

  answer.style.display = "block";
  answer.innerHTML = "جاري تجهيز الإجابة...";

  try{
    var res = await fetch("/ask-ai",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question:question})
    });

    var data = await res.json();
    answer.innerHTML = data.answer;
  }catch(e){
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
        "إجابة مبدئية: يجب تقييم الخطر، تأمين منطقة العمل، استخدام معدات الوقاية الشخصية المناسبة، وتطبيق الإجراءات التصحيحية حسب اشتراطات الصحة والسلامة المهنية."
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
            content: "أنت خبير صحة وسلامة مهنية HSE. أجب باللغة العربية فقط، بإجابة واضحة ومختصرة وعملية، واذكر المخاطر والإجراءات التصحيحية عند الحاجة."
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

    if (!data.choices || !data.choices[0]) {
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
<title>تقرير مخالفات صحة وسلامة مهنية</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,Tahoma,sans-serif}
body{background:#eef2f1;padding:18px;color:#111}

.form{max-width:1050px;margin:0 auto 25px;background:white;padding:25px;border-radius:22px;box-shadow:0 8px 25px rgba(0,0,0,.1)}
.form h1{color:#064e3b;margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:15px}
label{font-weight:bold;color:#064e3b}
input,textarea{width:100%;padding:14px;border:1px solid #ddd;border-radius:12px;margin:8px 0 15px;font-size:16px}
button,a{background:#064e3b;color:white;border:none;border-radius:12px;padding:13px 22px;text-decoration:none;font-size:17px;margin:5px;display:inline-block;cursor:pointer}

.report{display:none;width:190mm;min-height:277mm;margin:20px auto;background:#fff;padding:9mm;border-radius:12px;box-shadow:0 0 12px rgba(0,0,0,.12);border:1px solid #ddd}
.report-head{text-align:center;border-bottom:2px solid #064e3b;padding-bottom:10px;margin-bottom:12px}
.logo-line{font-size:42px}
.report-head h1{color:#064e3b;font-size:28px;margin-top:5px}

.info{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
.info-card{border:1px solid #d1d5db;border-radius:9px;padding:10px;text-align:center}
.info-card b{display:block;color:#064e3b;margin-bottom:6px;font-size:14px}
.info-card span{font-size:14px}

.section{border:1px solid #d1d5db;border-radius:10px;margin-bottom:10px;overflow:hidden}
.section-title{background:#064e3b;color:white;padding:9px 12px;font-weight:bold;font-size:16px}
.box{padding:11px;line-height:1.7;font-size:14px;min-height:45px}

.image-box{text-align:center;background:white;padding:12px}
.image-box img{
  display:block;
  margin:auto;
  max-width:520px;
  width:auto;
  height:auto;
  max-height:230px;
  object-fit:contain;
  border:1px solid #d1d5db;
  border-radius:10px;
  background:white;
  padding:4px;
}

.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.signature{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.sign{border:1px solid #d1d5db;border-radius:10px;padding:10px}
.sign h3{color:#064e3b;text-align:center;font-size:15px;margin-bottom:8px}
.line{height:26px;border-bottom:1px solid #999;margin-bottom:6px}
.footer-report{background:#064e3b;color:white;border-radius:9px;padding:10px;margin-top:10px;text-align:center;font-size:12px}
.small-row{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}

@media(max-width:800px){
  .report{width:100%;min-height:auto}
  .info,.two,.signature{grid-template-columns:1fr}
  .image-box img{max-width:100%;max-height:240px}
}

@media print{
  @page{size:A4 portrait;margin:7mm}
  body{background:white;padding:0;margin:0}
  .form,button,a{display:none!important}
  .report{
    display:block!important;
    width:196mm;
    min-height:283mm;
    margin:0 auto;
    padding:7mm;
    box-shadow:none;
    border:none;
    border-radius:0;
    page-break-after:avoid;
  }
  .report-head{padding-bottom:7px;margin-bottom:8px}
  .logo-line{font-size:30px}
  .report-head h1{font-size:22px}
  .info{gap:5px;margin-bottom:8px}
  .info-card{padding:6px}
  .info-card b,.info-card span{font-size:11px}
  .section{margin-bottom:7px}
  .section-title{font-size:13px;padding:6px 8px}
  .box{font-size:11.5px;line-height:1.45;padding:7px;min-height:auto}
  .image-box{padding:7px}
  .image-box img{
    max-width:430px;
    max-height:175px;
    width:auto;
    height:auto;
    object-fit:contain;
  }
  .two{gap:7px}
  .signature{gap:7px;margin-top:7px}
  .sign{padding:6px}
  .sign h3{font-size:12px;margin-bottom:4px}
  .line{height:18px;margin-bottom:4px}
  .footer-report{font-size:10px;padding:6px;margin-top:7px}
}
</style>
</head>
<body>

<div class="form">
<h1>إنشاء تقرير مخالفات احترافي</h1>

<div class="grid">
<div>
<label>اسم المشروع</label>
<input id="project" placeholder="مثال: مخطط درة الجنوب">
</div>

<div>
<label>مسؤول السلامة</label>
<input id="safety" placeholder="مثال: سامي الأسمري">
</div>

<div>
<label>مدير المشروع</label>
<input id="manager" placeholder="مثال: محمد حاتم">
</div>
</div>

<label>ماهي المخالفة؟</label>
<textarea id="violation" rows="4" placeholder="مثال: عدم ارتداء الخوذة أثناء العمل بالقرب من الحفريات"></textarea>

<label>صورة المخالفة</label>
<input id="image" type="file" accept="image/*">

<div class="grid">
<div>
<label>ملاحظات عامة</label>
<textarea id="notes" rows="4" placeholder="اكتب كل ملاحظة في سطر مستقل">تم رصد المخالفة في موقع العمل.
تم توجيه العامل بضرورة الالتزام بإجراءات السلامة.
تكرار المخالفة قد يؤدي إلى إصابات أو غرامات نظامية.</textarea>
</div>

<div>
<label>توصيات عامة</label>
<textarea id="recs" rows="4" placeholder="اكتب كل توصية في سطر مستقل">الالتزام بارتداء معدات الوقاية الشخصية المناسبة.
تأمين منطقة العمل وإزالة مصادر الخطر.
تكثيف التوعية والتفتيش الدوري في الموقع.
متابعة تنفيذ الإجراءات التصحيحية.</textarea>
</div>
</div>

<button onclick="generateReport()">توليد التقرير</button>
<button onclick="window.print()">طباعة / PDF</button>
<a href="/">رجوع</a>
</div>

<div id="report" class="report">

<div class="report-head">
<div class="logo-line">🛡️ 🪖</div>
<h1>تقرير مخالفات صحة وسلامة مهنية</h1>
</div>

<div class="info">
<div class="info-card">
<b>اسم المشروع</b>
<span id="rProject"></span>
</div>
<div class="info-card">
<b>مسؤول السلامة</b>
<span id="rSafety"></span>
</div>
<div class="info-card">
<b>مدير المشروع</b>
<span id="rManager"></span>
</div>
</div>

<div class="section">
<div class="section-title">1. ماهي المخالفة ⚠️</div>
<div class="box" id="rViolation"></div>
</div>

<div class="section">
<div class="section-title">2. صورة المخالفة 📷</div>
<div class="image-box" id="rImage">لا توجد صورة</div>
</div>

<div class="two">
<div class="section">
<div class="section-title">3. ملاحظات عامة 📄</div>
<div class="box">
<ul id="rNotes"></ul>
</div>
</div>

<div class="section">
<div class="section-title">4. توصيات عامة ✅</div>
<div class="box">
<ul id="rRecs"></ul>
</div>
</div>
</div>

<div class="signature">
<div class="sign">
<h3>مسؤول السلامة</h3>
<div>الاسم: <span id="signSafety"></span></div>
<div class="line"></div>
<div>التوقيع:</div>
<div class="line"></div>
</div>

<div class="sign">
<h3>مدير المشروع</h3>
<div>الاسم: <span id="signManager"></span></div>
<div class="line"></div>
<div>التوقيع:</div>
<div class="line"></div>
</div>
</div>

<div class="footer-report">
<div class="small-row">
<span>📅 تاريخ التقرير: <span id="rDate"></span></span>
<span>🛡️ السلامة مسؤوليتنا جميعاً</span>
<span>📄 رقم التقرير: <span id="rNo"></span></span>
</div>
<div style="margin-top:5px">تطوير وإنشاء المنصة: سامي الأسمري</div>
</div>

</div>

<script>
function listText(text){
  return text
    .split("\\n")
    .filter(function(x){ return x.trim() !== ""; })
    .map(function(x){ return "<li>" + x + "</li>"; })
    .join("");
}

function generateReport(){
  document.getElementById("report").style.display = "block";

  var project = document.getElementById("project").value || "غير محدد";
  var safety = document.getElementById("safety").value || "غير محدد";
  var manager = document.getElementById("manager").value || "غير محدد";
  var violation = document.getElementById("violation").value || "لم يتم إدخال المخالفة";
  var notes = document.getElementById("notes").value || "لا توجد ملاحظات عامة.";
  var recs = document.getElementById("recs").value || "الالتزام بمتطلبات الصحة والسلامة المهنية.";

  document.getElementById("rProject").innerText = project;
  document.getElementById("rSafety").innerText = safety;
  document.getElementById("rManager").innerText = manager;
  document.getElementById("rViolation").innerText = violation;
  document.getElementById("rNotes").innerHTML = listText(notes);
  document.getElementById("rRecs").innerHTML = listText(recs);
  document.getElementById("signSafety").innerText = safety;
  document.getElementById("signManager").innerText = manager;
  document.getElementById("rDate").innerText = new Date().toLocaleDateString("ar-SA");
  document.getElementById("rNo").innerText = "HSR-" + Date.now().toString().slice(-6);

  var file = document.getElementById("image").files[0];

  if(file){
    var reader = new FileReader();
    reader.onload = function(e){
      document.getElementById("rImage").innerHTML =
        '<img src="' + e.target.result + '" alt="صورة المخالفة">';
    };
    reader.readAsDataURL(file);
  } else {
    document.getElementById("rImage").innerHTML = "لا توجد صورة";
  }

  setTimeout(function(){
    document.getElementById("report").scrollIntoView({behavior:"smooth"});
  },300);
}
</script>

</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log("HSE AI running on port " + PORT);
});
