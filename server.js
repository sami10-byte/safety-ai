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
background:#f5f5f5;
overflow-x:hidden;
}

.hero{
min-height:100vh;
display:flex;
align-items:center;
justify-content:center;
padding:40px;
background:
linear-gradient(rgba(255,255,255,0.85),rgba(255,255,255,0.9)),
url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400');
background-size:cover;
background-position:center;
}

.container{
max-width:1200px;
width:100%;
}

.top{
text-align:center;
margin-bottom:40px;
}

.logo{
font-size:70px;
margin-bottom:10px;
}

.top h1{
font-size:58px;
color:#065f46;
margin-bottom:15px;
}

.top h2{
font-size:28px;
color:#047857;
margin-bottom:20px;
}

.top p{
font-size:22px;
color:#444;
line-height:2;
max-width:900px;
margin:auto;
}

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(350px,1fr));
gap:30px;
margin-top:50px;
}

.card{
background:white;
border-radius:30px;
padding:40px;
box-shadow:0 10px 30px rgba(0,0,0,0.1);
text-align:center;
transition:0.3s;
}

.card:hover{
transform:translateY(-10px);
}

.icon{
font-size:90px;
margin-bottom:20px;
}

.card h3{
font-size:38px;
margin-bottom:20px;
color:#065f46;
}

.card p{
font-size:22px;
line-height:1.8;
color:#444;
margin-bottom:30px;
}

.btn{
display:inline-block;
background:#065f46;
color:white;
padding:18px 40px;
border-radius:18px;
font-size:24px;
text-decoration:none;
transition:0.3s;
border:none;
cursor:pointer;
}

.btn:hover{
background:#047857;
}

.footer{
background:#064e3b;
color:white;
padding:25px;
margin-top:60px;
display:flex;
justify-content:space-around;
flex-wrap:wrap;
gap:20px;
font-size:22px;
}

.ai-box{
margin-top:30px;
display:none;
}

textarea{
width:100%;
padding:20px;
border-radius:20px;
border:1px solid #ddd;
font-size:20px;
margin-top:20px;
margin-bottom:20px;
}

.answer{
background:#ecfdf5;
padding:25px;
border-radius:20px;
margin-top:20px;
font-size:22px;
line-height:2;
display:none;
}

@media(max-width:768px){

.top h1{
font-size:40px;
}

.top h2{
font-size:24px;
}

.card h3{
font-size:30px;
}

}

</style>

</head>

<body>

<section class="hero">

<div class="container">

<div class="top">

<div class="logo">🛡️</div>

<h1>
صحة وسلامة مهنية
</h1>

<h2>
بيئة آمنة .. عمل مستدام
</h2>

<p>
نلتزم بحماية الأرواح والممتلكات من خلال تعزيز ثقافة السلامة المهنية
والتحسين المستمر لأداء الصحة والسلامة المهنية.
</p>

</div>

<div class="cards">

<div class="card">

<div class="icon">📋</div>

<h3>
تقرير صحة وسلامة مهنية
</h3>

<p>
استعرض التقارير والإحصائيات ومؤشرات الأداء الخاصة بالصحة والسلامة المهنية.
</p>

<a href="/reports" class="btn">
دخول إلى التقارير
</a>

</div>

<div class="card">

<div class="icon">❓</div>

<h3>
اسألني
</h3>

<p>
عن أي شيء يخص صحة وسلامة مهنية
</p>

<button class="btn" onclick="openAI()">
اسأل الآن
</button>

<div class="ai-box" id="aiBox">

<textarea id="question" rows="4" placeholder="اكتب سؤالك هنا"></textarea>

<button class="btn" onclick="askAI()">
إرسال السؤال
</button>

<div class="answer" id="answer"></div>

</div>

</div>

</div>

<div class="footer">

<div>
🛡️ السلامة مسؤولية الجميع
</div>

<div>
👷 نحن نهتم
</div>

<div>
✅ نلتزم بالمعايير
</div>

<div>
❤️ صحة اليوم .. أمان الغد
</div>

</div>

</div>

</section>

<script>

function openAI(){

document.getElementById("aiBox").style.display = "block";

}

async function askAI(){

const question =
document.getElementById("question").value;

const response = await fetch("/ask-ai",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
question
})

});

const data = await response.json();

document.getElementById("answer").style.display="block";

document.getElementById("answer").innerHTML =
data.answer;

}

</script>

</body>

</html>

`);

});

app.post("/ask-ai",(req,res)=>{

const question = req.body.question;

let answer = "";

if(question.includes("خوذة")){

answer =
"يجب ارتداء الخوذة الواقية داخل مواقع العمل لحماية الرأس من الأجسام الساقطة.";

}

else if(question.includes("حريق")){

answer =
"يجب توفير طفايات حريق صالحة وفحصها بشكل دوري داخل المشروع.";

}

else if(question.includes("سقوط")){

answer =
"يجب استخدام وسائل الحماية من السقوط عند العمل في المرتفعات.";

}

else{

answer =
"تم استلام سؤالك: " + question +
"<br><br>سيتم تطوير الذكاء الاصطناعي لاحقًا للإجابة الاحترافية.";

}

res.json({
answer
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

.container{
max-width:1000px;
margin:auto;
}

.card{
background:white;
padding:30px;
border-radius:25px;
box-shadow:0 10px 30px rgba(0,0,0,0.08);
}

h1{
color:#065f46;
margin-bottom:25px;
}

input,textarea{
width:100%;
padding:16px;
border-radius:15px;
border:1px solid #ddd;
margin-bottom:20px;
font-size:18px;
}

button{
background:#065f46;
color:white;
padding:15px 25px;
border:none;
border-radius:15px;
font-size:20px;
cursor:pointer;
}

.report{
margin-top:30px;
background:white;
padding:30px;
border-radius:25px;
display:none;
}

</style>

</head>

<body>

<div class="container">

<div class="card">

<h1>
إنشاء تقرير سلامة
</h1>

<input id="project" placeholder="اسم المشروع">

<input id="safety" placeholder="اسم مسؤول السلامة">

<textarea id="violations" rows="5" placeholder="وصف المخالفات"></textarea>

<button onclick="generateReport()">
توليد التقرير
</button>

</div>

<div class="report" id="report">

<h1>
تقرير السلامة المهنية
</h1>

<div id="reportText"></div>

<br>

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

document.getElementById("report").style.display="block";

document.getElementById("reportText").innerHTML =

"<h2>اسم المشروع: " + project + "</h2>" +

"<h3>مسؤول السلامة: " + safety + "</h3>" +

"<hr><br>" +

"<h3>وصف المخالفات:</h3>" +

"<p>" + violations + "</p>" +

"<br><h3>التوصيات:</h3>" +

"<ul>" +

"<li>الالتزام الكامل بإجراءات السلامة.</li>" +

"<li>توفير معدات الوقاية الشخصية.</li>" +

"<li>متابعة تنفيذ التصحيحات.</li>" +

"</ul>";

}

</script>

</body>

</html>

`);

});

app.listen(PORT, () => {

console.log("HSE AI Running on Port " + PORT);

});
