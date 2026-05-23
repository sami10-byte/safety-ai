const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

let reports = [];

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

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
background:#f3f4f6;
}

.navbar{
background:#4c1d95;
color:white;
padding:20px;
display:flex;
justify-content:space-between;
align-items:center;
}

.logo{
font-size:34px;
font-weight:bold;
}

.creator{
font-size:15px;
}

.container{
padding:25px;
max-width:1200px;
margin:auto;
}

.hero{
background:white;
padding:35px;
border-radius:22px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
margin-bottom:25px;
}

.hero h1{
color:#4c1d95;
font-size:42px;
margin-bottom:10px;
}

.hero p{
font-size:20px;
line-height:1.8;
}

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
gap:20px;
}

.card{
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
transition:0.3s;
}

.card:hover{
transform:translateY(-5px);
}

.card h2{
color:#4c1d95;
margin-bottom:10px;
font-size:28px;
}

.card p{
line-height:1.8;
}

.btn{
display:inline-block;
margin-top:20px;
background:#4c1d95;
color:white;
padding:14px 22px;
border-radius:12px;
text-decoration:none;
font-size:18px;
}

.ai-box{
margin-top:30px;
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
}

.ai-box h2{
color:#4c1d95;
margin-bottom:15px;
}

textarea{
width:100%;
padding:15px;
border-radius:12px;
border:1px solid #ddd;
font-size:18px;
margin-top:10px;
margin-bottom:15px;
}

button{
background:#4c1d95;
color:white;
border:none;
padding:14px 25px;
border-radius:12px;
font-size:18px;
cursor:pointer;
}

.answer{
margin-top:20px;
background:#f5f3ff;
padding:20px;
border-radius:15px;
line-height:2;
display:none;
}

</style>

</head>

<body>

<div class="navbar">
<div class="logo">HSE AI</div>
<div class="creator">
تطوير وإنشاء: سامي الأسمري
</div>
</div>

<div class="container">

<div class="hero">
<h1>منصة الصحة والسلامة المهنية</h1>
<p>
منصة ذكية لإدارة التقارير والمخالفات والتفتيش بالمشاريع باستخدام الذكاء الاصطناعي.
</p>
</div>

<div class="cards">

<div class="card">
<h2>التقارير</h2>
<p>
إنشاء تقارير سلامة احترافية شبيهة بالتقارير الرسمية.
</p>
<a href="/reports" class="btn">فتح</a>
</div>

<div class="card">
<h2>التقارير المحفوظة</h2>
<p>
عرض جميع التقارير السابقة المحفوظة داخل النظام.
</p>
<a href="/saved" class="btn">عرض</a>
</div>

</div>

<div class="ai-box">

<h2>اسألني عن السلامة المهنية 🤖</h2>

<textarea id="question" rows="4" placeholder="اكتب سؤالك هنا..."></textarea>

<button onclick="askAI()">إرسال السؤال</button>

<div class="answer" id="answer"></div>

</div>

</div>

<script>

async function askAI(){

const question = document.getElementById("question").value;

if(!question){
alert("اكتب السؤال أولاً");
return;
}

const res = await fetch("/ask-ai",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({question})
});

const data = await res.json();

document.getElementById("answer").style.display="block";

document.getElementById("answer").innerHTML =
"<strong>إجابة الذكاء الاصطناعي:</strong><br><br>" + data.answer;

}

</script>

</body>
</html>
`);
});

app.post("/ask-ai", async (req,res)=>{

const question = req.body.question;

if(!process.env.OPENAI_API_KEY){

return res.json({
answer:
"يجب الالتزام بمتطلبات الصحة والسلامة المهنية واستخدام معدات الوقاية الشخصية وتطبيق اشتراطات السلامة بالموقع."
});

}

try{

const response = await fetch("https://api.openai.com/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + process.env.OPENAI_API_KEY
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[
{
role:"system",
content:"أنت خبير صحة وسلامة مهنية HSE وتجيب بالعربية بشكل احترافي."
},
{
role:"user",
content:question
}
]
})
});

const data = await response.json();

res.json({
answer:data.choices[0].message.content
});

}catch(error){

res.json({
answer:"حدث خطأ بالاتصال بالذكاء الاصطناعي."
});

}

});

app.get("/reports",(req,res)=>{

res.send(`

<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>تقرير سلامة</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;
}

body{
background:#f3f4f6;
padding:20px;
}

.container{
max-width:1200px;
margin:auto;
}

.card{
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
margin-bottom:20px;
}

h1{
color:#4c1d95;
margin-bottom:20px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:15px;
}

input,textarea{
width:100%;
padding:15px;
border-radius:12px;
border:1px solid #ddd;
margin-top:8px;
margin-bottom:15px;
font-size:16px;
}

button{
background:#4c1d95;
color:white;
border:none;
padding:14px 22px;
border-radius:12px;
font-size:18px;
cursor:pointer;
}

.report{
background:white;
padding:30px;
border-radius:20px;
border:2px solid #ddd;
display:none;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th{
background:#4c1d95;
color:white;
padding:12px;
}

td{
border:1px solid #ddd;
padding:15px;
text-align:center;
}

.footer{
margin-top:30px;
display:flex;
justify-content:space-between;
}

.sign{
width:45%;
border-top:1px solid #000;
padding-top:10px;
text-align:center;
}

img{
width:180px;
border-radius:10px;
}

</style>

</head>

<body>

<div class="container">

<div class="card">

<h1>إنشاء تقرير سلامة</h1>

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
<label>التاريخ</label>
<input type="date" id="date">
</div>

</div>

<label>المخالفة الأولى</label>
<input id="v1">

<input type="file" id="img1">

<label>المخالفة الثانية</label>
<input id="v2">

<input type="file" id="img2">

<label>المخالفة الثالثة</label>
<input id="v3">

<input type="file" id="img3">

<label>التوصيات</label>

<textarea id="recommendations" rows="5"></textarea>

<button onclick="generateReport()">توليد التقرير</button>

<button onclick="window.print()">طباعة PDF</button>

</div>

<div class="report" id="report">

<h1 style="text-align:center">
تقرير سلامة مهنية
</h1>

<br>

<p><strong>اسم المشروع:</strong> <span id="rProject"></span></p>

<p><strong>مسؤول السلامة:</strong> <span id="rSafety"></span></p>

<p><strong>التاريخ:</strong> <span id="rDate"></span></p>

<table>

<thead>

<tr>
<th>م</th>
<th>وصف المخالفة</th>
<th>صورة المخالفة</th>
</tr>

</thead>

<tbody id="tableBody">

</tbody>

</table>

<br>

<h2 style="color:#4c1d95">
التوصيات العامة
</h2>

<p id="rRecommendations" style="line-height:2"></p>

<div class="footer">

<div class="sign">
مسؤول السلامة
</div>

<div class="sign">
مدير المشروع
</div>

</div>

<br><br>

<center>
تطوير وإنشاء المنصة: سامي الأسمري
</center>

</div>

</div>

<script>

async function readImage(id){

return new Promise(resolve=>{

const file = document.getElementById(id).files[0];

if(!file){
resolve("");
return;
}

const reader = new FileReader();

reader.onload = e => resolve(e.target.result);

reader.readAsDataURL(file);

});

}

async function generateReport(){

document.getElementById("report").style.display="block";

document.getElementById("rProject").innerText =
document.getElementById("project").value;

document.getElementById("rSafety").innerText =
document.getElementById("safety").value;

document.getElementById("rDate").innerText =
document.getElementById("date").value;

const violations = [

{
text:document.getElementById("v1").value,
img:await readImage("img1")
},

{
text:document.getElementById("v2").value,
img:await readImage("img2")
},

{
text:document.getElementById("v3").value,
img:await readImage("img3")
}

];

let html = "";

violations.forEach((v,i)=>{

html +=
"<tr>" +
"<td>"+(i+1)+"</td>" +
"<td>"+v.text+"</td>" +
"<td>"+(v.img ? "<img src='"+v.img+"'>" : "")+"</td>" +
"</tr>";

});

document.getElementById("tableBody").innerHTML = html;

document.getElementById("rRecommendations").innerText =
document.getElementById("recommendations").value;

}

</script>

</body>

</html>

`);

});

app.get("/saved",(req,res)=>{

let html = reports.map(r=>{

return \`
<div style="background:white;padding:20px;border-radius:15px;margin-bottom:15px">
<h2>\${r.project}</h2>
<p>\${r.date}</p>
</div>
\`;

}).join("");

if(!html){
html="<h2>لا توجد تقارير محفوظة</h2>";
}

res.send(\`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>التقارير</title>
<style>
body{
background:#f3f4f6;
padding:20px;
font-family:Arial;
}
</style>
</head>
<body>
<h1>التقارير المحفوظة</h1>
\${html}
</body>
</html>
\`);

});

app.listen(PORT,()=>{

console.log("HSE AI Running on port " + PORT);

});
