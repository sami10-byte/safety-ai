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
body{background:#eef2f1}
.hero{min-height:100vh;background:#f4f7f6;padding:40px;display:flex;align-items:center;justify-content:center}
.wrap{max-width:1100px;width:100%;text-align:center}
.logo{font-size:70px}
h1{font-size:48px;color:#064e3b;margin:15px 0}
p{font-size:21px;line-height:1.8}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:25px;margin-top:40px}
.card{background:white;border-radius:28px;padding:35px;box-shadow:0 10px 30px rgba(0,0,0,.12)}
.card h2{color:#064e3b;font-size:32px;margin:15px}
.btn{display:inline-block;background:#065f46;color:white;text-decoration:none;padding:16px 35px;border-radius:14px;font-size:22px;margin-top:25px}
.footer{background:#064e3b;color:white;padding:18px;border-radius:18px;margin-top:35px}
</style>
</head>
<body>
<section class="hero">
<div class="wrap">
<div class="logo">🛡️</div>
<h1>صحة وسلامة مهنية</h1>
<p>بيئة آمنة .. عمل مستدام</p>
<p>منصة ذكية لإدارة تقارير الصحة والسلامة المهنية</p>

<div class="cards">
<div class="card">
<div style="font-size:70px">📋</div>
<h2>تقرير مخالفات صحة وسلامة مهنية</h2>
<p>إدخال بيانات المخالفة وإصدار تقرير احترافي.</p>
<a class="btn" href="/reports">دخول إلى التقارير</a>
</div>

<div class="card">
<div style="font-size:70px">❓</div>
<h2>اسألني</h2>
<p>عن أي شيء يخص الصحة والسلامة المهنية.</p>
<a class="btn" href="/ask">اسأل الآن</a>
</div>
</div>

<div class="footer">تطوير وإنشاء المنصة: سامي الأسمري</div>
</div>
</section>
</body>
</html>
`);
});

app.get("/ask", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>اسألني</title>
<style>
body{font-family:Arial;background:#f3f4f6;padding:20px}
.card{background:white;max-width:850px;margin:auto;padding:30px;border-radius:20px}
h1{color:#064e3b}
textarea{width:100%;padding:15px;border-radius:12px;border:1px solid #ddd;font-size:18px}
button,a{background:#065f46;color:white;padding:14px 22px;border-radius:12px;border:none;text-decoration:none;font-size:18px}
.answer{background:#ecfdf5;margin-top:20px;padding:20px;border-radius:15px;line-height:2;display:none}
</style>
</head>
<body>
<div class="card">
<h1>اسألني عن الصحة والسلامة المهنية</h1>
<textarea id="q" rows="5" placeholder="اكتب سؤالك هنا"></textarea><br><br>
<button onclick="ask()">إرسال</button>
<a href="/">رجوع</a>
<div id="answer" class="answer"></div>
</div>
<script>
async function ask(){
var q=document.getElementById("q").value;
if(!q){alert("اكتب السؤال أولاً");return;}
var res=await fetch("/ask-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});
var data=await res.json();
document.getElementById("answer").style.display="block";
document.getElementById("answer").innerHTML=data.answer;
}
</script>
</body>
</html>
`);
});

app.post("/ask-ai", (req, res) => {
  const q = req.body.question || "";
  res.json({
    answer:
      "بخصوص سؤالك: <b>" + q + "</b><br><br>" +
      "يجب تقييم الخطر، تأمين منطقة العمل، استخدام معدات الوقاية الشخصية، وتطبيق الإجراءات التصحيحية حسب اشتراطات الصحة والسلامة المهنية."
  });
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
*{box-sizing:border-box;font-family:Arial;margin:0;padding:0}
body{background:#eef2f1;padding:20px}
.form{background:white;max-width:1050px;margin:auto;padding:25px;border-radius:20px;box-shadow:0 8px 25px rgba(0,0,0,.1)}
h1{color:#064e3b;margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:15px}
input,textarea{width:100%;padding:14px;border:1px solid #ddd;border-radius:12px;margin:8px 0 15px;font-size:16px}
label{font-weight:bold;color:#064e3b}
button,a{background:#064e3b;color:white;padding:13px 22px;border:none;border-radius:12px;text-decoration:none;font-size:17px;margin:5px;display:inline-block}
.report{max-width:1050px;margin:30px auto;background:white;border-radius:12px;display:none;overflow:hidden;border:1px solid #cfd8d5}
.report-header{padding:25px 35px;border-bottom:2px solid #777;display:flex;align-items:center;justify-content:space-between}
.report-header h1{font-size:34px;text-align:center;color:#064e3b}
.logo-box{font-size:55px;color:#064e3b}
.info-row{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:2px solid #777}
.info-item{padding:18px;text-align:center;border-left:1px solid #aaa;font-size:18px}
.info-item b{color:#064e3b;display:block;margin-bottom:8px}
.section{padding:24px 40px}
.section-title{background:#064e3b;color:white;padding:12px 22px;border-radius:10px 10px 0 0;font-size:22px;font-weight:bold;display:inline-block;min-width:300px;text-align:center}
.box{border:1px solid #888;border-radius:10px;padding:25px;margin-top:-1px;line-height:2;font-size:21px;min-height:120px}
.photo-box{border:1px solid #888;border-radius:10px;padding:25px;margin-top:-1px;text-align:center}
.photo-box img{width:90%;max-height:330px;object-fit:cover;border-radius:8px}
ul{padding-right:25px;line-height:2;font-size:20px}
.footer{background:#064e3b;color:white;padding:20px 35px;display:grid;grid-template-columns:1fr 1fr 1fr;text-align:center;font-size:18px;margin-top:25px}
@media(max-width:750px){
.info-row,.footer{grid-template-columns:1fr}
.report-header{flex-direction:column;gap:10px}
.section{padding:18px}
.section-title{min-width:100%}
}
@media print{
.form,button,a{display:none!important}
body{background:white;padding:0}
.report{display:block;margin:0;max-width:none;border:none;border-radius:0}
}
</style>
</head>
<body>

<div class="form">
<h1>إدخال بيانات تقرير المخالفة</h1>

<div class="grid">
<div><label>اسم المشروع</label><input id="project" placeholder="مشروع إنشاء مبنى إداري"></div>
<div><label>مسؤول السلامة</label><input id="safety" placeholder="أحمد محمد الشريف"></div>
<div><label>مدير المشروع</label><input id="manager" placeholder="خالد عبدالعزيز السالم"></div>
</div>

<label>ما هي المخالفة؟</label>
<textarea id="violation" rows="4" placeholder="عدم ارتداء معدات الوقاية الشخصية المناسبة..."></textarea>

<label>صورة المخالفة</label>
<input id="img" type="file" accept="image/*">

<label>ملاحظات عامة</label>
<textarea id="notes" rows="4">تم رصد المخالفة في الموقع.
تم توجيه العامل شفهياً بضرورة الالتزام باشتراطات السلامة.
تكرار هذه المخالفة قد يؤدي إلى إصابات أو غرامات نظامية.</textarea>

<label>توصيات عامة</label>
<textarea id="rec" rows="4">الالتزام بارتداء معدات الوقاية الشخصية المناسبة في جميع الأوقات.
تكثيف برامج التوعية والتثقيف حول أهمية السلامة في موقع العمل.
تطبيق نظام إنذار واضح للمخالفات واتخاذ الإجراءات التصحيحية اللازمة.</textarea>

<button onclick="generate()">توليد التقرير</button>
<button onclick="window.print()">طباعة / PDF</button>
<a href="/">رجوع</a>
</div>

<div id="report" class="report">

<div class="report-header">
<div class="logo-box">🪖🛡️</div>
<h1>تقرير مخالفات صحة وسلامة مهنية</h1>
<div></div>
</div>

<div class="info-row">
<div class="info-item"><b>اسم المشروع:</b><span id="rProject"></span></div>
<div class="info-item"><b>مسؤول السلامة:</b><span id="rSafety"></span></div>
<div class="info-item"><b>مدير المشروع:</b><span id="rManager"></span></div>
</div>

<div class="section">
<div class="section-title">1. ماهي المخالفة ⚠️</div>
<div class="box" id="rViolation"></div>
</div>

<div class="section">
<div class="section-title">2. صورة المخالفة 📷</div>
<div class="photo-box" id="rImage">لا توجد صورة</div>
</div>

<div class="section">
<div class="section-title">3. ملاحظات عامة 📄</div>
<div class="box"><ul id="rNotes"></ul></div>
</div>

<div class="section">
<div class="section-title">4. توصيات عامة ✅</div>
<div class="box"><ul id="rRec"></ul></div>
</div>

<div class="footer">
<div>📅 تاريخ التقرير: <span id="rDate"></span></div>
<div>🛡️ السلامة مسؤوليتنا جميعاً</div>
<div>📄 رقم التقرير: <span id="rNo"></span></div>
</div>

</div>

<script>
function readImage(){
return new Promise(function(resolve){
var file=document.getElementById("img").files[0];
if(!file){resolve("");return;}
var reader=new FileReader();
reader.onload=function(e){resolve(e.target.result);}
reader.readAsDataURL(file);
});
}

function listFromText(text){
return text.split("\\n").filter(Boolean).map(function(x){return "<li>"+x+"</li>";}).join("");
}

async function generate(){
document.getElementById("report").style.display="block";

document.getElementById("rProject").innerText=document.getElementById("project").value || "غير محدد";
document.getElementById("rSafety").innerText=document.getElementById("safety").value || "غير محدد";
document.getElementById("rManager").innerText=document.getElementById("manager").value || "غير محدد";
document.getElementById("rViolation").innerText=document.getElementById("violation").value || "لم يتم إدخال المخالفة";
document.getElementById("rNotes").innerHTML=listFromText(document.getElementById("notes").value);
document.getElementById("rRec").innerHTML=listFromText(document.getElementById("rec").value);
document.getElementById("rDate").innerText=new Date().toLocaleDateString("ar-SA");
document.getElementById("rNo").innerText="HSR-" + Date.now().toString().slice(-6);

var img=await readImage();
document.getElementById("rImage").innerHTML=img ? "<img src='"+img+"'>" : "لا توجد صورة";

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
