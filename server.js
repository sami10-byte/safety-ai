const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

let reports = [];

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/", (req, res) => {
  res.redirect("/reports");
});

app.get("/reports", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HSE AI - تقرير سلامة</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:Arial,Tahoma,sans-serif}
body{background:#f3f4f6;padding:14px;color:#111}
.page{max-width:1050px;margin:auto}
.topbar{background:#35106f;color:#fff;border-radius:18px;padding:18px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center}
.topbar h1{font-size:30px}
.creator{font-size:14px;opacity:.9}
.card{background:#fff;border-radius:18px;padding:18px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,.08)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
input,textarea,select{width:100%;padding:13px;border:1px solid #ddd;border-radius:12px;margin-top:7px;font-size:15px}
label{font-weight:bold;color:#35106f}
button,.btn{background:#35106f;color:white;border:none;border-radius:12px;padding:13px 18px;font-size:16px;margin:5px;text-decoration:none;display:inline-block}
.report{background:white;width:100%;padding:22px;border:1px solid #d8c9ff;border-radius:14px}
.report-header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #35106f;padding-bottom:15px;margin-bottom:18px}
.logo{display:flex;gap:10px;align-items:center;color:#35106f}
.logo-icon{font-size:46px}
.report-title{text-align:center;font-size:34px;font-weight:bold}
.qr{border:1px solid #d8c9ff;border-radius:10px;padding:8px;font-size:42px}
.section-title{background:#35106f;color:white;padding:12px;border-radius:10px;margin:16px 0 0;font-weight:bold}
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #d8c9ff;border-radius:12px;overflow:hidden}
.info-box{padding:14px;border-left:1px solid #d8c9ff;border-bottom:1px solid #eee;text-align:center}
.info-box b{color:#35106f;display:block;margin-bottom:8px}
table{width:100%;border-collapse:collapse;margin-top:0}
th{background:#35106f;color:white;padding:12px;border:1px solid #cbbcff}
td{border:1px solid #d8c9ff;padding:12px;text-align:center;vertical-align:middle}
.violation-img{width:220px;max-height:130px;object-fit:cover;border-radius:6px}
.notes-lines{line-height:2.2;color:#999;text-align:right}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.box{border:1px solid #d8c9ff;border-radius:12px;overflow:hidden}
.box h3{background:#f7f3ff;color:#35106f;padding:12px;border-bottom:1px solid #d8c9ff}
.box-content{padding:14px;min-height:115px;line-height:2}
.signatures{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.sign{border:1px solid #d8c9ff;border-radius:12px;padding:14px}
.line{height:36px;border-bottom:1px solid #aaa;margin:8px 0}
.footer{border-top:3px solid #35106f;margin-top:18px;padding-top:10px;display:flex;justify-content:space-between;color:#35106f;font-size:14px}
.hidden{display:none}
@media(max-width:700px){
  .report-header{flex-direction:column;gap:12px}
  .info-grid,.two-col,.signatures{grid-template-columns:1fr}
  .report-title{font-size:26px}
  .violation-img{width:100%}
}
@media print{
  body{background:white;padding:0}
  .no-print{display:none!important}
  .card{box-shadow:none}
  .report{border:none;border-radius:0}
}
</style>
</head>
<body>

<div class="page">

<div class="topbar no-print">
  <h1>HSE AI</h1>
  <div class="creator">تطوير وإنشاء: سامي الأسمري</div>
</div>

<div class="card no-print">
<h2 style="color:#35106f;margin-bottom:15px">إنشاء تقرير سلامة احترافي</h2>

<div class="grid">
  <div><label>اسم المشروع</label><input id="project" placeholder="مثال: مخطط درة الجنوب"></div>
  <div><label>موقع المشروع</label><input id="location" placeholder="مثال: الرياض - حي النفل"></div>
  <div><label>رقم التقرير</label><input id="reportNo" placeholder="HSE-001"></div>
  <div><label>مسؤول السلامة</label><input id="safety" placeholder="اسم مسؤول السلامة"></div>
  <div><label>القسم / الإدارة</label><input id="department" placeholder="إدارة المشاريع"></div>
  <div><label>التاريخ</label><input id="date" type="date"></div>
</div>

<br>

<h3 style="color:#35106f">المخالفات المرصودة</h3>

<div class="grid">
  <div><label>المخالفة 1</label><input id="v1" placeholder="عدم ارتداء معدات الوقاية الشخصية"><input id="img1" type="file" accept="image/*"></div>
  <div><label>المخالفة 2</label><input id="v2" placeholder="تمديدات كهربائية مكشوفة"><input id="img2" type="file" accept="image/*"></div>
  <div><label>المخالفة 3</label><input id="v3" placeholder="عدم توفر طفاية حريق صالحة"><input id="img3" type="file" accept="image/*"></div>
</div>

<label>ملاحظات عامة</label>
<textarea id="notes" rows="3" placeholder="اكتب الملاحظات العامة"></textarea>

<label>التوصيات العامة</label>
<textarea id="recommendations" rows="4">الالتزام بجميع اشتراطات الصحة والسلامة المهنية.
توفير معدات الوقاية الشخصية لجميع العاملين.
إجراء تفتيش دوري على الموقع.
تدريب العاملين على إجراءات السلامة.
التأكد من تطبيق الإجراءات التصحيحية للمخالفات.</textarea>

<div>
  <button onclick="generateReport()">توليد التقرير</button>
  <button onclick="saveReport()">حفظ التقرير</button>
  <button onclick="window.print()">طباعة / PDF</button>
  <a class="btn" href="/saved">التقارير المحفوظة</a>
</div>
</div>

<div id="reportArea" class="card hidden">
<div class="report">

  <div class="report-header">
    <div class="logo">
      <div class="logo-icon">🛡️</div>
      <div>
        <h2>HSE AI</h2>
        <p>منصة تقارير الصحة والسلامة المهنية</p>
      </div>
    </div>

    <div class="report-title">تقرير سلامة مهنية</div>

    <div class="qr">▦</div>
  </div>

  <div class="section-title">1. بيانات المشروع</div>
  <div class="info-grid">
    <div class="info-box"><b>اسم المشروع</b><span id="rProject"></span></div>
    <div class="info-box"><b>موقع المشروع</b><span id="rLocation"></span></div>
    <div class="info-box"><b>تاريخ التقرير</b><span id="rDate"></span></div>
    <div class="info-box"><b>القسم / الإدارة</b><span id="rDepartment"></span></div>
    <div class="info-box"><b>مسؤول السلامة</b><span id="rSafety"></span></div>
    <div class="info-box"><b>رقم التقرير</b><span id="rReportNo"></span></div>
  </div>

  <div class="section-title">2. المخالفات المرصودة</div>
  <table>
    <thead>
      <tr>
        <th>م</th>
        <th>وصف المخالفة</th>
        <th>صورة المخالفة</th>
        <th>الملاحظات</th>
      </tr>
    </thead>
    <tbody id="violationsTable"></tbody>
  </table>

  <div class="two-col">
    <div class="box">
      <h3>3. ملاحظات عامة</h3>
      <div class="box-content" id="rNotes"></div>
    </div>

    <div class="box">
      <h3>4. التوصيات العامة</h3>
      <div class="box-content" id="rRecommendations"></div>
    </div>
  </div>

  <div class="signatures">
    <div class="sign">
      <h3>مسؤول السلامة</h3>
      <p>الاسم:</p>
      <div class="line"></div>
      <p>التوقيع:</p>
      <div class="line"></div>
    </div>

    <div class="sign">
      <h3>مدير المشروع</h3>
      <p>الاسم:</p>
      <div class="line"></div>
      <p>التوقيع:</p>
      <div class="line"></div>
    </div>
  </div>

  <div class="footer">
    <span>السلامة أولاً</span>
    <span>تطوير وإنشاء المنصة: سامي الأسمري</span>
    <span>HSE AI © 2026</span>
  </div>

</div>
</div>

</div>

<script>
let currentReportHTML = "";

function readImage(inputId){
  return new Promise(resolve => {
    const file = document.getElementById(inputId).files[0];
    if(!file){ resolve(""); return; }
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

async function generateReport(){
  document.getElementById("rProject").innerText = document.getElementById("project").value || "غير محدد";
  document.getElementById("rLocation").innerText = document.getElementById("location").value || "غير محدد";
  document.getElementById("rDate").innerText = document.getElementById("date").value || new Date().toLocaleDateString("ar-SA");
  document.getElementById("rDepartment").innerText = document.getElementById("department").value || "غير محدد";
  document.getElementById("rSafety").innerText = document.getElementById("safety").value || "غير محدد";
  document.getElementById("rReportNo").innerText = document.getElementById("reportNo").value || "HSE-" + Date.now();

  const violations = [
    { text: document.getElementById("v1").value || "عدم ارتداء معدات الوقاية الشخصية", img: await readImage("img1") },
    { text: document.getElementById("v2").value || "تمديدات كهربائية مكشوفة", img: await readImage("img2") },
    { text: document.getElementById("v3").value || "عدم توفر طفاية حريق صالحة", img: await readImage("img3") }
  ];

  let rows = "";

  violations.forEach((v, i) => {
    rows += "<tr>";
    rows += "<td>" + (i + 1) + "</td>";
    rows += "<td>" + v.text + "</td>";
    rows += "<td>" + (v.img ? "<img class='violation-img' src='" + v.img + "'>" : "لا توجد صورة") + "</td>";
    rows += "<td class='notes-lines'>.........................<br>.........................<br>.........................</td>";
    rows += "</tr>";
  });

  document.getElementById("violationsTable").innerHTML = rows;

  document.getElementById("rNotes").innerText =
    document.getElementById("notes").value || "لا توجد ملاحظات عامة.";

  const rec = document.getElementById("recommendations").value.split("\\n").filter(Boolean);
  document.getElementById("rRecommendations").innerHTML =
    "<ul>" + rec.map(x => "<li>" + x + "</li>").join("") + "</ul>";

  document.getElementById("reportArea").classList.remove("hidden");

  currentReportHTML = document.getElementById("reportArea").innerHTML;
}

async function saveReport(){
  await generateReport();

  fetch("/save-report", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      project:document.getElementById("project").value || "غير محدد",
      date:new Date().toLocaleString("ar-SA"),
      report:currentReportHTML
    })
  })
  .then(res => res.json())
  .then(() => alert("تم حفظ التقرير بنجاح ✅"));
}
</script>

</body>
</html>
  `);
});

app.post("/save-report", (req, res) => {
  reports.push({
    id: Date.now(),
    project: req.body.project,
    date: req.body.date,
    report: req.body.report
  });

  res.json({ success:true });
});

app.get("/saved", (req, res) => {
  let list = reports.map(r => {
    return "<div class='card'><h2>" + r.project + "</h2><p>" + r.date + "</p><a class='btn' href='/saved/" + r.id + "'>عرض</a></div>";
  }).join("");

  if(!list){
    list = "<div class='card'><h2>لا توجد تقارير محفوظة</h2></div>";
  }

  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>التقارير المحفوظة</title>
<style>
body{font-family:Arial;background:#f3f4f6;padding:20px}
.card{background:white;padding:20px;border-radius:15px;margin-bottom:15px}
h1,h2{color:#35106f}
.btn{background:#35106f;color:white;padding:10px 15px;border-radius:10px;text-decoration:none}
</style>
</head>
<body>
<h1>التقارير المحفوظة</h1>
<a class="btn" href="/reports">إنشاء تقرير</a>
<a class="btn" href="/">الرئيسية</a>
<br><br>
${list}
</body>
</html>
  `);
});

app.get("/saved/:id", (req, res) => {
  const report = reports.find(r => r.id == req.params.id);

  if(!report){
    return res.send("التقرير غير موجود");
  }

  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>عرض التقرير</title>
<style>
body{background:#fff;font-family:Arial;padding:20px}
button,a{background:#35106f;color:white;padding:10px 15px;border-radius:10px;text-decoration:none;border:none}
@media print{button,a{display:none}}
</style>
</head>
<body>
${report.report}
<br><br>
<button onclick="window.print()">طباعة / PDF</button>
<a href="/saved">رجوع</a>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log("HSE AI running on port " + PORT);
});
