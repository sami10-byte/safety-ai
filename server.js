const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

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
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;
}

body{
background:#f5f5f5;
padding:20px;
}

.header{
background:linear-gradient(90deg,#065f46,#047857);
color:white;
padding:30px;
border-radius:20px;
text-align:center;
margin-bottom:25px;
}

.header h1{
font-size:40px;
margin-bottom:10px;
}

.header p{
font-size:18px;
}

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
gap:20px;
margin-top:20px;
}

.card{
background:white;
padding:30px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
text-align:center;
}

.card h2{
color:#065f46;
margin-bottom:15px;
font-size:30px;
}

.card p{
font-size:18px;
color:#555;
line-height:1.7;
}

.btn{
display:inline-block;
margin-top:20px;
background:#065f46;
color:white;
padding:14px 30px;
border-radius:12px;
text-decoration:none;
font-size:20px;
}

.footer{
margin-top:30px;
text-align:center;
color:#666;
font-size:16px;
}

</style>
</head>

<body>

<div class="header">
<h1>HSE AI</h1>
<p>منصة الصحة والسلامة المهنية</p>
<p style="margin-top:10px;">تطوير وإنشاء : سامي الأسمري</p>
</div>

<div class="cards">

<div class="card">
<h2>📋 التقارير</h2>
<p>
إنشاء تقارير المخالفات المهنية
وطباعة التقارير بصيغة احترافية.
</p>
<a href="/reports" class="btn">دخول إلى التقارير</a>
</div>

<div class="card">
<h2>🤖 اسألني</h2>
<p>
اسأل أي سؤال يخص الصحة والسلامة المهنية
وسيجيبك الذكاء الاصطناعي.
</p>
<a href="#" class="btn">اسأل الآن</a>
</div>

</div>

<div class="footer">
السلامة مسؤولية الجميع
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

<title>تقرير مخالفات</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;
}

body{
background:#f1f5f9;
padding:20px;
}

.form{
max-width:900px;
margin:auto;
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
margin-bottom:30px;
}

.form h1{
margin-bottom:20px;
color:#065f46;
}

input,
textarea{
width:100%;
padding:15px;
margin-top:10px;
margin-bottom:20px;
border:1px solid #ddd;
border-radius:12px;
font-size:16px;
}

button{
background:#065f46;
color:white;
border:none;
padding:15px 25px;
border-radius:12px;
font-size:18px;
cursor:pointer;
}

.report{
display:none;
width:190mm;
min-height:277mm;
margin:auto;
background:white;
padding:10mm;
border-radius:10px;
box-shadow:0 0 10px rgba(0,0,0,0.1);
}

.report-header{
text-align:center;
border-bottom:2px solid #065f46;
padding-bottom:15px;
margin-bottom:15px;
}

.report-header h1{
color:#065f46;
font-size:34px;
margin-bottom:10px;
}

.top-info{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:10px;
margin-bottom:15px;
}

.info-box{
border:1px solid #ccc;
padding:10px;
text-align:center;
border-radius:10px;
}

.section{
margin-top:18px;
border:1px solid #ccc;
border-radius:12px;
overflow:hidden;
}

.section-title{
background:#065f46;
color:white;
padding:12px;
font-size:20px;
font-weight:bold;
}

.box{
padding:18px;
line-height:2;
font-size:17px;
}

.image-box{
text-align:center;
}

.image-box img{
width:100%;
max-height:260px;
object-fit:cover;
border-radius:10px;
}

.footer{
margin-top:25px;
background:#065f46;
color:white;
padding:12px;
border-radius:10px;
display:flex;
justify-content:space-between;
font-size:14px;
}

@media print{

@page{
size:A4 portrait;
margin:8mm;
}

body{
background:white;
padding:0;
margin:0;
}

.form{
display:none!important;
}

button{
display:none!important;
}

.report{
display:block!important;
width:190mm;
min-height:277mm;
max-width:190mm;
margin:0 auto;
padding:8mm;
border:none;
box-shadow:none;
border-radius:0;
}

.report-header h1{
font-size:26px;
}

.section-title{
font-size:16px;
padding:8px;
}

.box{
font-size:14px;
padding:10px;
line-height:1.7;
}

.image-box img{
width:85%;
max-height:230px;
}

.footer{
font-size:12px;
padding:8px;
}

}

</style>
</head>

<body>

<div class="form">

<h1>إنشاء تقرير مخالفات</h1>

<input type="text" id="project" placeholder="اسم المشروع">

<input type="text" id="safety" placeholder="مسؤول السلامة">

<input type="text" id="manager" placeholder="مدير المشروع">

<textarea id="violation" rows="5" placeholder="وصف المخالفة"></textarea>

<textarea id="notes" rows="4" placeholder="ملاحظات عامة"></textarea>

<textarea id="recommend" rows="4" placeholder="توصيات عامة"></textarea>

<input type="file" id="image">

<button onclick="generateReport()">
توليد التقرير
</button>

</div>

<div class="report" id="report">

<div class="report-header">
<h1>تقرير مخالفات صحة وسلامة مهنية</h1>
</div>

<div class="top-info">

<div class="info-box">
<strong>اسم المشروع</strong>
<p id="rProject"></p>
</div>

<div class="info-box">
<strong>مسؤول السلامة</strong>
<p id="rSafety"></p>
</div>

<div class="info-box">
<strong>مدير المشروع</strong>
<p id="rManager"></p>
</div>

</div>

<div class="section">
<div class="section-title">
1. ماهي المخالفة
</div>

<div class="box" id="rViolation"></div>
</div>

<div class="section">
<div class="section-title">
2. صورة المخالفة
</div>

<div class="box image-box">
<img id="rImage">
</div>
</div>

<div class="section">
<div class="section-title">
3. ملاحظات عامة
</div>

<div class="box" id="rNotes"></div>
</div>

<div class="section">
<div class="section-title">
4. توصيات عامة
</div>

<div class="box" id="rRecommend"></div>
</div>

<div class="footer">
<div>السلامة مسؤوليتنا جميعاً</div>
<div id="date"></div>
</div>

<br><br>

<button onclick="window.print()">
طباعة / حفظ PDF
</button>

</div>

<script>

function generateReport(){

const project =
document.getElementById("project").value;

const safety =
document.getElementById("safety").value;

const manager =
document.getElementById("manager").value;

const violation =
document.getElementById("violation").value;

const notes =
document.getElementById("notes").value;

const recommend =
document.getElementById("recommend").value;

document.getElementById("rProject").innerText = project;
document.getElementById("rSafety").innerText = safety;
document.getElementById("rManager").innerText = manager;
document.getElementById("rViolation").innerText = violation;
document.getElementById("rNotes").innerText = notes;
document.getElementById("rRecommend").innerText = recommend;

const today = new Date().toLocaleDateString("ar-SA");

document.getElementById("date").innerText =
"تاريخ التقرير : " + today;

const file =
document.getElementById("image").files[0];

if(file){

const reader = new FileReader();

reader.onload = function(e){
document.getElementById("rImage").src =
e.target.result;
};

reader.readAsDataURL(file);

}

document.getElementById("report").style.display =
"block";

window.scrollTo({
top:document.body.scrollHeight,
behavior:"smooth"
});

}

</script>

</body>
</html>
`);
});

app.listen(PORT, () => {
console.log("HSE AI Running on port " + PORT);
});
