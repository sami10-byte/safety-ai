const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

let reports = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HSE AI</title>

<style>
*{
  box-sizing:border-box;
  font-family:Arial;
  margin:0;
  padding:0;
}

body{
  background:#f3f4f6;
}

.navbar{
  background:#4c1d95;
  color:white;
  padding:18px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.container{
  padding:20px;
}

.hero,.card{
  background:white;
  padding:25px;
  border-radius:18px;
  box-shadow:0 5px 20px rgba(0,0,0,.08);
  margin-bottom:20px;
}

.cards{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:20px;
  margin-top:20px;
}

h1,h2{
  color:#4c1d95;
}

.btn{
  display:inline-block;
  background:#4c1d95;
  color:white;
  padding:10px 18px;
  border-radius:10px;
  text-decoration:none;
  margin-top:15px;
}
</style>
</head>

<body>

<div class="navbar">
  <h1>HSE AI</h1>
  <span>تطوير وإنشاء: سامي الأسمري</span>
</div>

<div class="container">

  <div class="hero">
    <h2>مرحباً سامي 👋</h2>
    <p>منصة ذكية لإدارة تقارير الصحة والسلامة المهنية.</p>
  </div>

  <div class="cards">

    <div class="card">
      <h2>إنشاء تقرير</h2>
      <p>إنشاء تقرير سلامة جديد.</p>
      <a href="/reports" class="btn">فتح</a>
    </div>

    <div class="card">
      <h2>التقارير المحفوظة</h2>
      <p>عرض جميع التقارير السابقة.</p>
      <a href="/saved" class="btn">عرض</a>
    </div>

  </div>

</div>

</body>
</html>
  `);
});

app.get("/reports", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>إنشاء تقرير</title>

<style>

*{
  box-sizing:border-box;
  font-family:Arial;
  margin:0;
  padding:0;
}

body{
  background:#f5f5f5;
  padding:20px;
}

.container{
  max-width:900px;
  margin:auto;
}

.card{
  background:white;
  padding:25px;
  border-radius:20px;
  margin-bottom:20px;
  box-shadow:0 5px 20px rgba(0,0,0,.08);
}

h1,h2,h3{
  color:#4c1d95;
  margin-bottom:15px;
}

input,textarea,select{
  width:100%;
  padding:15px;
  margin:10px 0 20px;
  border-radius:12px;
  border:1px solid #ddd;
  font-size:16px;
}

button,.btn{
  background:#4c1d95;
  color:white;
  border:none;
  padding:14px 22px;
  border-radius:12px;
  font-size:16px;
  text-decoration:none;
  display:inline-block;
}

.report-box{
  line-height:2;
  font-size:17px;
}

@media print{
  button,.btn,input,textarea,select{
    display:none;
  }

  body{
    background:white;
  }

  .card{
    box-shadow:none;
  }
}

</style>
</head>

<body>

<div class="container">

<div class="card">

<h1>إنشاء تقرير سلامة</h1>

<input id="project" placeholder="اسم المشروع">

<input id="safety" placeholder="اسم مسؤول السلامة">

<select id="risk">
<option value="منخفض">مستوى الخطورة: منخفض</option>
<option value="متوسط">مستوى الخطورة: متوسط</option>
<option value="عالي">مستوى الخطورة: عالي</option>
</select>

<textarea id="violations" rows="5" placeholder="وصف المخالفات"></textarea>

<button onclick="generateReport()">توليد التقرير</button>

<button onclick="saveReport()">حفظ التقرير</button>

<a href="/" class="btn">رجوع</a>

</div>

<div id="result" class="card" style="display:none;">
<h1>التقرير النهائي</h1>

<div id="reportText" class="report-box"></div>

<button onclick="window.print()">طباعة / حفظ PDF</button>
</div>

</div>

<script>

let finalReport = "";

function generateReport(){

const project = document.getElementById("project").value || "غير محدد";

const safety = document.getElementById("safety").value || "غير محدد";

const risk = document.getElementById("risk").value;

const violations = document.getElementById("violations").value || "لم يتم إدخال مخالفات";

finalReport =
"<h2>تقرير سلامة مهنية</h2>" +
"<p><strong>اسم المشروع:</strong> " + project + "</p>" +
"<p><strong>مسؤول السلامة:</strong> " + safety + "</p>" +
"<p><strong>مستوى الخطورة:</strong> " + risk + "</p>" +
"<hr>" +
"<h3>وصف المخالفات:</h3>" +
"<p>" + violations + "</p>" +
"<h3>المخاطر المحتملة:</h3>" +
"<ul>" +
"<li>احتمالية وقوع إصابات للعاملين.</li>" +
"<li>تعطل الأعمال أو تلف المعدات.</li>" +
"<li>مخالفة اشتراطات السلامة المهنية.</li>" +
"</ul>" +
"<h3>الإجراءات التصحيحية:</h3>" +
"<ul>" +
"<li>إيقاف العمل في منطقة الخطر عند الحاجة.</li>" +
"<li>تأمين الموقع حسب اشتراطات السلامة المهنية.</li>" +
"<li>توفير معدات الوقاية الشخصية للعاملين.</li>" +
"<li>متابعة تنفيذ الإجراءات التصحيحية.</li>" +
"</ul>" +
"<hr>" +
"<p><strong>تطوير وإنشاء المنصة:</strong> سامي الأسمري</p>";

document.getElementById("reportText").innerHTML = finalReport;

document.getElementById("result").style.display = "block";
}

function saveReport(){

generateReport();

fetch("/save-report", {

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

project:document.getElementById("project").value || "غير محدد",

safety:document.getElementById("safety").value || "غير محدد",

risk:document.getElementById("risk").value,

violations:document.getElementById("violations").value || "لم يتم إدخال مخالفات",

report:finalReport

})

})

.then(res => res.json())

.then(data => alert("تم حفظ التقرير بنجاح ✅"));

}

</script>

</body>
</html>
  `);
});

app.post("/save-report", (req, res) => {

const report = {
id: Date.now(),
date: new Date().toLocaleString("ar-SA"),
...req.body
};

reports.push(report);

res.json({ success: true });

});

app.get("/saved", (req, res) => {

let html = reports.map(r => `
<div class="card">
<h2>${r.project}</h2>

<p><strong>التاريخ:</strong> ${r.date}</p>

<p><strong>مسؤول السلامة:</strong> ${r.safety}</p>

<p><strong>الخطورة:</strong> ${r.risk}</p>

<a class="btn" href="/saved/${r.id}">عرض التقرير</a>
</div>
`).join("");

if (!html){
html = "<div class='card'><h2>لا توجد تقارير محفوظة حتى الآن</h2></div>";
}

res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
<meta charset="UTF-8">
<title>التقارير المحفوظة</title>

<style>

body{
background:#f3f4f6;
padding:20px;
font-family:Arial;
}

.container{
max-width:900px;
margin:auto;
}

.card{
background:white;
padding:25px;
border-radius:18px;
margin-bottom:20px;
box-shadow:0 5px 20px rgba(0,0,0,.08);
}

h1,h2{
color:#4c1d95;
}

.btn{
display:inline-block;
background:#4c1d95;
color:white;
padding:10px 18px;
border-radius:10px;
text-decoration:none;
margin-top:15px;
}

</style>
</head>

<body>

<div class="container">

<h1>التقارير المحفوظة</h1>

<a href="/" class="btn">الرئيسية</a>

<br><br>

${html}

</div>

</body>
</html>
`);
});

app.get("/saved/:id", (req, res) => {

const report = reports.find(r => r.id == req.params.id);

if (!report){
return res.send("التقرير غير موجود");
}

res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
<meta charset="UTF-8">
<title>عرض التقرير</title>

<style>

body{
background:#f3f4f6;
padding:20px;
font-family:Arial;
}

.card{
background:white;
padding:30px;
border-radius:18px;
max-width:900px;
margin:auto;
line-height:2;
box-shadow:0 5px 20px rgba(0,0,0,.08);
}

button,a{
background:#4c1d95;
color:white;
padding:10px 18px;
border-radius:10px;
text-decoration:none;
border:none;
}

@media print{
button,a{
display:none;
}

body{
background:white;
}

.card{
box-shadow:none;
}
}

</style>
</head>

<body>

<div class="card">

${report.report}

<br><br>

<button onclick="window.print()">طباعة / PDF</button>

<a href="/saved">رجوع</a>

</div>

</body>
</html>
`);
});

app.listen(PORT, () => {
console.log("HSE AI Running on port " + PORT);
});
