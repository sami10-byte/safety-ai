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
.hero{min-height:100vh;background:linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.9)),url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400');background-size:cover;background-position:center;padding:40px}
.head{text-align:center;color:#064e3b;margin-bottom:40px}
.head h1{font-size:52px;margin:15px 0}
.head p{font-size:22px;line-height:1.8}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:30px;max-width:1000px;margin:auto}
.card{background:white;border-radius:28px;padding:35px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.12)}
.icon{font-size:80px}
.card h2{color:#064e3b;font-size:34px;margin:15px}
.card p{font-size:20px;line-height:1.8}
.btn{display:inline-block;background:#065f46;color:white;text-decoration:none;padding:16px 35px;border-radius:14px;font-size:22px;margin-top:25px}
.footer{background:#064e3b;color:white;padding:20px;margin-top:50px;border-radius:20px;display:flex;justify-content:space-around;gap:15px;flex-wrap:wrap;font-size:18px}
</style>
</head>
<body>
<section class="hero">
<div class="head">
<div style="font-size:70px">🛡️</div>
<h1>صحة وسلامة مهنية</h1>
<p>بيئة آمنة .. عمل مستدام</p>
<p>منصة ذكية لإدارة تقارير الصحة والسلامة المهنية</p>
</div>

<div class="cards">
<div class="card">
<div class="icon">📋</div>
<h2>تقرير صحة وسلامة مهنية</h2>
<p>إنشاء تقرير احترافي مع صور المخالفات والتوصيات والتوقيعات.</p>
<a class="btn" href="/reports">دخول إلى التقارير</a>
</div>

<div class="card">
<div class="icon">❓</div>
<h2>اسألني</h2>
<p>عن أي شيء يخص الصحة والسلامة المهنية.</p>
<a class="btn" href="/ask">اسأل الآن</a>
</div>
</div>

<div class="footer">
<span>🛡️ السلامة مسؤولية الجميع</span>
<span>👷 نحن نهتم</span>
<span>✅ نلتزم بالمعايير</span>
<span>❤️ صحة اليوم .. أمان الغد</span>
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
.card{background:white;max-width:800px;margin:auto;padding:30px;border-radius:20px;box-shadow:0 8px 25px rgba(0,0,0,.1)}
h1{color:#065f46}
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

app.post("/ask-ai", async (req, res) => {
  const q = req.body.question || "";
  res.json({
    answer:
      "إجابة مبدئية: بخصوص سؤالك: <b>" +
      q +
      "</b><br>يجب تقييم الخطر، تأمين منطقة العمل، استخدام معدات الوقاية الشخصية، وتطبيق الإجراءات التصحيحية حسب اشتراطات الصحة والسلامة المهنية."
  });
});

app.get("/reports", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>تقرير سلامة</title>
<style>
*{box-sizing:border-box;font-family:Arial;margin:0;padding:0}
body{background:#f3f4f6;padding:20px}
.form{background:white;max-width:1000px;margin:auto;padding:25px;border-radius:20px;box-shadow:0 8px 25px rgba(0,0,0,.1)}
h1{color:#35106f;margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:15px}
input,textarea{width:100%;padding:14px;border:1px solid #ddd;border-radius:12px;margin:8px 0 15px;font-size:16px}
label{font-weight:bold;color:#35106f}
button,a{background:#35106f;color:white;padding:13px 22px;border:none;border-radius:12px;text-decoration:none;font-size:17px;margin:5px;display:inline-block}
.report{max-width:1050px;margin:30px auto;background:white;padding:20px;border-radius:12px;display:none}
.top-box{border:1px solid #d7c9ef;border-radius:8px;margin-bottom:15px;overflow:hidden}
.section-head{display:flex;align-items:center;justify-content:space-between;background:#f9f7ff;color:#35106f;font-weight:bold;padding:10px;border-bottom:1px solid #d7c9ef}
.section-icon{background:#35106f;color:white;padding:12px;border-radius:6px;font-size:20px}
.project-name{font-size:26px;padding:18px;text-align:center}
table{width:100%;border-collapse:collapse}
th{background:#35106f;color:white;padding:12px;border:1px solid #d7c9ef}
td{border:1px solid #d7c9ef;padding:12px;text-align:center;vertical-align:middle}
.pic{width:260px;height:130px;object-fit:cover}
.lines{color:#aaa;line-height:2.2;text-align:right}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}
.box{border:1px solid #d7c9ef;border-radius:8px;overflow:hidden}
.box h3{background:#f9f7ff;color:#35106f;padding:10px}
.box-content{padding:14px;min-height:110px;line-height:2}
.signs{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}
.sign{border:1px solid #d7c9ef;border-radius:8px;padding:12px}
.sign h3{color:#35106f;text-align:center;margin-bottom:12px}
.line{height:34px;border-bottom:1px solid #aaa;margin-bottom:8px}
.footer{text-align:center;margin-top:20px;color:#35106f;border-top:2px solid #35106f;padding-top:10px}
@media(max-width:700px){.two,.signs{grid-template-columns:1fr}.pic{width:100%}}
@media print{.form,button,a{display:none}.report{display:block;margin:0;border-radius:0}body{background:white;padding:0}}
</style>
</head>
<body>

<div class="form">
<h1>إدخال بيانات التقرير</h1>

<div class="grid">
<div><label>اسم المشروع</label><input id="project" placeholder="مخطط درة الجنوب"></div>
<div><label>مسؤول السلامة</label><input id="safety" placeholder="سامي الأسمري"></div>
<div><label>مدير المشروع</label><input id="manager" placeholder="اسم مدير المشروع"></div>
</div>

<div class="grid">
<div><label>المخالفة 1</label><input id="v1" placeholder="عدم ارتداء معدات الوقاية الشخصية"><input id="img1" type="file" accept="image/*"></div>
<div><label>المخالفة 2</label><input id="v2" placeholder="تمديدات كهربائية مكشوفة"><input id="img2" type="file" accept="image/*"></div>
<div><label>المخالفة 3</label><input id="v3" placeholder="عدم توفر طفاية حريق صالحة"><input id="img3" type="file" accept="image/*"></div>
</div>

<label>ملاحظات عامة</label>
<textarea id="notes" rows="3" placeholder="اكتب الملاحظات العامة"></textarea>

<label>التوصيات العامة</label>
<textarea id="rec" rows="5">الالتزام بجميع اشتراطات الصحة والسلامة المهنية.
توفير معدات الوقاية الشخصية لجميع العاملين.
إجراء تفتيش دوري على الموقع.
تدريب العاملين على إجراءات السلامة.
التأكد من تطبيق الإجراءات التصحيحية للمخالفات.</textarea>

<button onclick="generate()">توليد التقرير</button>
<button onclick="window.print()">طباعة / PDF</button>
<a href="/">رجوع</a>
</div>

<div id="report" class="report">

<div class="top-box">
<div class="section-head">
<span>1. اسم المشروع</span>
<span class="section-icon">📋</span>
</div>
<div class="project-name" id="rProject"></div>
</div>

<div class="top-box">
<div class="section-head">
<span>2. المخالفات المرصودة</span>
<span class="section-icon">⚠️</span>
</div>

<table>
<thead>
<tr>
<th>م</th>
<th>وصف المخالفة</th>
<th>صورة المخالفة</th>
<th>الملاحظات</th>
</tr>
</thead>
<tbody id="rows"></tbody>
</table>
</div>

<div class="two">
<div class="box">
<h3>3. ملاحظات عامة ✏️</h3>
<div class="box-content" id="rNotes"></div>
</div>

<div class="box">
<h3>4. التوصيات العامة 📋</h3>
<div class="box-content" id="rRec"></div>
</div>
</div>

<div class="signs">
<div class="sign">
<h3>مسؤول السلامة</h3>
<p>الاسم: <span id="rSafety"></span></p>
<div class="line"></div>
<p>التوقيع:</p>
<div class="line"></div>
</div>

<div class="sign">
<h3>مدير المشروع</h3>
<p>الاسم: <span id="rManager"></span></p>
<div class="line"></div>
<p>التوقيع:</p>
<div class="line"></div>
</div>
</div>

<div class="footer">تطوير وإنشاء المنصة: سامي الأسمري</div>

</div>

<script>
function readImage(id){
return new Promise(function(resolve){
var file=document.getElementById(id).files[0];
if(!file){resolve("");return;}
var reader=new FileReader();
reader.onload=function(e){resolve(e.target.result);}
reader.readAsDataURL(file);
});
}

async function generate(){
document.getElementById("report").style.display="block";

var project=document.getElementById("project").value || "غير محدد";
var safety=document.getElementById("safety").value || "";
var manager=document.getElementById("manager").value || "";

document.getElementById("rProject").innerText=project;
document.getElementById("rSafety").innerText=safety;
document.getElementById("rManager").innerText=manager;

var violations=[
{t:document.getElementById("v1").value || "عدم ارتداء معدات الوقاية الشخصية", img:await readImage("img1")},
{t:document.getElementById("v2").value || "تمديدات كهربائية مكشوفة", img:await readImage("img2")},
{t:document.getElementById("v3").value || "عدم توفر طفاية حريق صالحة", img:await readImage("img3")}
];

var html="";
violations.forEach(function(v,i){
html+="<tr>";
html+="<td>"+(i+1)+"</td>";
html+="<td>"+v.t+"</td>";
html+="<td>"+(v.img ? "<img class='pic' src='"+v.img+"'>" : "لا توجد صورة")+"</td>";
html+="<td class='lines'>.........................<br>.........................<br>.........................</td>";
html+="</tr>";
});
document.getElementById("rows").innerHTML=html;

document.getElementById("rNotes").innerText=document.getElementById("notes").value || "........................................";
var rec=document.getElementById("rec").value.split("\\n").filter(Boolean);
document.getElementById("rRec").innerHTML="<ul>"+rec.map(function(x){return "<li>"+x+"</li>"}).join("")+"</ul>";

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
