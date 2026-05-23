const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

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
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;
}

body{
background:#f3f4f6;
padding:20px;
}

.navbar{
background:#4c1d95;
color:white;
padding:20px;
border-radius:20px;
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
}

.logo{
font-size:34px;
font-weight:bold;
}

.creator{
font-size:15px;
}

.hero{
background:white;
padding:30px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
margin-bottom:25px;
}

.hero h1{
color:#4c1d95;
margin-bottom:15px;
}

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:20px;
}

.card{
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
}

.card h2{
color:#4c1d95;
margin-bottom:10px;
}

.btn{
display:inline-block;
margin-top:15px;
background:#4c1d95;
color:white;
padding:12px 20px;
border-radius:10px;
text-decoration:none;
}

.ai-box{
margin-top:30px;
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
}

textarea{
width:100%;
padding:15px;
border-radius:12px;
border:1px solid #ddd;
margin-top:15px;
margin-bottom:15px;
font-size:18px;
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

<div class="logo">
HSE AI
</div>

<div class="creator">
تطوير وإنشاء: سامي الأسمري
</div>

</div>

<div class="hero">

<h1>
منصة الصحة والسلامة المهنية
</h1>

<p>
منصة ذكية لإدارة التقارير والمخالفات والتفتيش بالمشاريع.
</p>

</div>

<div class="cards">

<div class="card">

<h2>
التقارير
</h2>

<p>
إنشاء تقارير سلامة احترافية.
</p>

<a href="/reports" class="btn">
فتح
</a>

</div>

<div class="card">

<h2>
الذكاء الاصطناعي
</h2>

<p>
اسأل الذكاء الاصطناعي عن السلامة المهنية.
</p>

<a href="#ai" class="btn">
فتح
</a>

</div>

</div>

<div class="ai-box" id="ai">

<h2>
اسأل الذكاء الاصطناعي 🤖
</h2>

<textarea id="question" rows="4"></textarea>

<button onclick="askAI()">
إرسال
</button>

<div class="answer" id="answer"></div>

</div>

<script>

async function askAI(){

const q = document.getElementById("question").value;

const res = await fetch("/ask-ai",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
question:q
})
});

const data = await res.json();

document.getElementById("answer").style.display="block";

document.getElementById("answer").innerHTML = data.answer;

}

</script>

</body>

</html>

`);

});

app.post("/ask-ai",(req,res)=>{

const question = req.body.question;

res.json({
answer:
"الذكاء الاصطناعي استقبل سؤالك: " + question
});

});

app.get("/reports",(req,res)=>{

res.send(`

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

.card{
background:white;
padding:25px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.08);
max-width:1100px;
margin:auto;
}

h1{
color:#4c1d95;
margin-bottom:20px;
}

input,textarea{
width:100%;
padding:15px;
border-radius:12px;
border:1px solid #ddd;
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
margin-top:30px;
padding:25px;
border:2px solid #ddd;
border-radius:20px;
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

</style>

</head>

<body>

<div class="card">

<h1>
إنشاء تقرير سلامة
</h1>

<input id="project" placeholder="اسم المشروع">

<input id="safety" placeholder="مسؤول السلامة">

<textarea id="violations" rows="5" placeholder="وصف المخالفات"></textarea>

<button onclick="generateReport()">
توليد التقرير
</button>

<div class="report" id="report">

<h1>
تقرير السلامة المهنية
</h1>

<p id="reportText"></p>

<button onclick="window.print()">
طباعة PDF
</button>

</div>

</div>

<script>

function generateReport(){

const project =
document.getElementById("project").value;

const safety =
document.getElementById("safety").value;

const violations =
document.getElementById("violations").value;

const html =

"<table>" +

"<tr>" +
"<th>اسم المشروع</th>" +
"<td>" + project + "</td>" +
"</tr>" +

"<tr>" +
"<th>مسؤول السلامة</th>" +
"<td>" + safety + "</td>" +
"</tr>" +

"<tr>" +
"<th>وصف المخالفات</th>" +
"<td>" + violations + "</td>" +
"</tr>" +

"</table>";

document.getElementById("reportText").innerHTML = html;

document.getElementById("report").style.display = "block";

}

</script>

</body>

</html>

`);

});

app.listen(PORT, () => {

console.log("Server running on port " + PORT);

});
