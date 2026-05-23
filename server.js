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

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;
}

body{
background:#eef2f1;
}

.hero{
min-height:100vh;
padding:40px;
display:flex;
align-items:center;
justify-content:center;
background:#f4f7f6;
}

.wrap{
max-width:1200px;
width:100%;
text-align:center;
}

.logo{
font-size:80px;
}

h1{
font-size:52px;
color:#064e3b;
margin:15px 0;
}

.desc{
font-size:23px;
line-height:2;
color:#333;
}

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
gap:30px;
margin-top:50px;
}

.card{
background:white;
padding:35px;
border-radius:25px;
box-shadow:0 10px 30px rgba(0,0,0,.12);
}

.card-icon{
font-size:70px;
}

.card h2{
font-size:34px;
color:#065f46;
margin:15px 0;
}

.card p{
font-size:20px;
line-height:1.8;
color:#444;
}

.btn{
display:inline-block;
margin-top:25px;
background:#065f46;
color:white;
text-decoration:none;
padding:16px 35px;
border-radius:14px;
font-size:22px;
}

.footer{
margin-top:35px;
background:#065f46;
color:white;
padding:18px;
border-radius:15px;
font-size:20px;
}

</style>
</head>

<body>

<section class="hero">

<div class="wrap">

<div class="logo">🛡️</div>

<h1>صحة وسلامة مهنية</h1>

<p class="desc">
بيئة آمنة .. عمل مستدام
</p>

<p class="desc">
منصة ذكية لإدارة تقارير الصحة والسلامة المهنية
</p>

<div class="cards">

<div class="card">

<div class="card-icon">📋</div>

<h2>تقرير مخالفات صحة وسلامة مهنية</h2>

<p>
إدخال بيانات المخالفة وإصدار تقرير احترافي.
</p>

<a href="/reports" class="btn">
دخول إلى التقارير
</a>

</div>

<div class="card">

<div class="card-icon">❓</div>

<h2>اسألني</h2>

<p>
عن أي شيء يخص الصحة والسلامة المهنية.
</p>

<a href="/ask" class="btn">
اسأل الآن
</a>

</div>

</div>

<div class="footer">
تطوير وإنشاء المنصة: سامي الأسمري
</div>

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

body{
font-family:Arial;
background:#f3f4f6;
padding:20px;
}

.card{
background:white;
max-width:850px;
margin:auto;
padding:30px;
border-radius:20px;
}

h1{
color:#064e3b;
margin-bottom:20px;
}

textarea{
width:100%;
padding:15px;
border-radius:12px;
border:1px solid #ddd;
font-size:18px;
}

button,a{
background:#065f46;
color:white;
padding:14px 22px;
border-radius:12px;
border:none;
text-decoration:none;
font-size:18px;
display:inline-block;
margin-top:15px;
}

.answer{
background:#ecfdf5;
margin-top:20px;
padding:20px;
border-radius:15px;
line-height:2;
display:none;
font-size:18px;
}

</style>

</head>

<body>

<div class="card">

<h1>اسألني عن الصحة والسلامة المهنية</h1>

<textarea id="q" rows="5" placeholder="اكتب سؤالك هنا"></textarea>

<br>

<button onclick="ask()">إرسال</button>

<a href="/">رجوع</a>

<div id="answer" class="answer"></div>

</div>

<script>

async function ask(){

var q=document.getElementById("q").value;

if(!q){
alert("اكتب السؤال أولاً");
return;
}

var res=await fetch("/ask-ai",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
question:q
})
});

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
"يجب تقييم المخاطر وتأمين الموقع واستخدام معدات الوقاية الشخصية حسب اشتراطات السلامة المهنية."
});

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
background:#eef2f1;
padding:20px;
}

.form{
background:white;
max-width:1100px;
margin:auto;
padding:25px;
border-radius:20px;
box-shadow:0 8px 25px rgba(0,0,0,.1);
}

h1{
color:#064e3b;
margin-bottom:20px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:15px;
}

input,textarea{
width:100%;
padding:14px;
border:1px solid #ddd;
border-radius:12px;
margin:8px 0 15px;
font-size:16px;
}

label{
font-weight:bold;
color:#064e3b;
}

button,a{
background:#064e3b;
color:white;
padding:13px 22px;
border:none;
border-radius:12px;
text-decoration:none;
font-size:17px;
margin:5px;
display:inline-block;
}

.report{
max-width:1000px;
margin:30px auto;
background:white;
display:none;
border-radius:10px;
overflow:hidden;
border:1px solid #ccc;
}

.report-header{
padding:20px;
text-align:center;
border-bottom:2px solid #ccc;
}

.report-header h1{
font-size:40px;
color:#064e3b;
}

.info{
display:grid;
grid-template-columns:repeat(3,1fr);
border-bottom:1px solid #ccc;
}

.info div{
padding:18px;
text-align:center;
border-left:1px solid #ccc;
font-size:18px;
}

.section{
padding:18px 30px;
}

.section-title{
background:#065f46;
color:white;
padding:12px;
font-size:22px;
border-radius:10px 10px 0 0;
}

.box{
border:1px solid #aaa;
padding:20px;
line-height:2;
font-size:20px;
border-radius:0 0 10px 10px;
}

.image-box{
border:1px solid #aaa;
padding:20px;
text-align:center;
border-radius:0 0 10px 10px;
}

.image-box img{
width:90%;
max-height:320px;
object-fit:cover;
border-radius:8px;
}

ul{
padding-right:25px;
line-height:2;
font-size:18px;
}

.footer{
background:#065f46;
color:white;
padding:18px;
display:grid;
grid-template-columns:repeat(3,1fr);
text-align:center;
margin-top:20px;
}

@media print{

@page{
size:A4 portrait;
margin:5mm;
}

body{
background:white;
padding:0;
margin:0;
}

.form,
button,
a{
display:none!important;
}

.report{
display:block!important;
width:100%;
max-width:none;
margin:0;
padding:5mm;
border:none;
transform:scale(0.75);
transform-origin:top center;
}

}

</style>

</head>

<body>

<div class="form">

<h1>إدخال بيانات التقرير</h1>

<div class="grid">

<div>
<label>اسم المشروع</label>
<input id="project">
</div>

<div>
<label>مسؤول السلامة</label>
<input id="safety">
</div>

<div>
<label>مدير المشروع</label>
<input id="manager">
</div>

</div>

<label>ماهي المخالفة؟</label>

<textarea id="violation" rows="4"></textarea>

<label>صورة المخالفة</label>

<input id="img" type="file" accept="image/*">

<label>ملاحظات عامة</label>

<textarea id="notes" rows="4"></textarea>

<label>توصيات عامة</label>

<textarea id="recs" rows="4"></textarea>

<button onclick="generate()">
توليد التقرير
</button>

<button onclick="window.print()">
طباعة / PDF
</button>

<a href="/">
رجوع
</a>

</div>

<div id="report" class="report">

<div class="report-header">

<div style="font-size:70px">🪖🛡️</div>

<h1>تقرير مخالفات صحة وسلامة مهنية</h1>

</div>

<div class="info">

<div>
<b>اسم المشروع</b>
<br><br>
<span id="rProject"></span>
</div>

<div>
<b>مسؤول السلامة</b>
<br><br>
<span id="rSafety"></span>
</div>

<div>
<b>مدير المشروع</b>
<br><br>
<span id="rManager"></span>
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

<div class="image-box" id="rImage">
لا توجد صورة
</div>

</div>

<div class="section">

<div class="section-title">
3. ملاحظات عامة
</div>

<div class="box">
<ul id="rNotes"></ul>
</div>

</div>

<div class="section">

<div class="section-title">
4. توصيات عامة
</div>

<div class="box">
<ul id="rRecs"></ul>
</div>

</div>

<div class="footer">

<div>
📅 التاريخ:
<span id="rDate"></span>
</div>

<div>
🛡️ السلامة مسؤوليتنا جميعاً
</div>

<div>
📄 رقم التقرير:
<span id="rNo"></span>
</div>

</div>

</div>

<script>

function toList(text){

return text
.split("\\n")
.filter(Boolean)
.map(x => "<li>"+x+"</li>")
.join("");

}

function readImage(){

return new Promise(resolve => {

const file=document.getElementById("img").files[0];

if(!file){
resolve("");
return;
}

const reader=new FileReader();

reader.onload=e => resolve(e.target.result);

reader.readAsDataURL(file);

});

}

async function generate(){

document.getElementById("report").style.display="block";

document.getElementById("rProject").innerText =
document.getElementById("project").value || "غير محدد";

document.getElementById("rSafety").innerText =
document.getElementById("safety").value || "غير محدد";

document.getElementById("rManager").innerText =
document.getElementById("manager").value || "غير محدد";

document.getElementById("rViolation").innerText =
document.getElementById("violation").value || "لا توجد مخالفة";

document.getElementById("rNotes").innerHTML =
toList(document.getElementById("notes").value);

document.getElementById("rRecs").innerHTML =
toList(document.getElementById("recs").value);

document.getElementById("rDate").innerText =
new Date().toLocaleDateString("ar-SA");

document.getElementById("rNo").innerText =
"HSR-" + Date.now().toString().slice(-6);

const img = await readImage();

document.getElementById("rImage").innerHTML =
img ? "<img src='"+img+"'>" : "لا توجد صورة";

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

console.log("HSE AI running on port " + PORT);

});
