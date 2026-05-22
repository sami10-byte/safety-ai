const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
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
        padding:18px;
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .navbar h1{
        font-size:26px;
      }

      .container{
        padding:20px;
      }

      .cards{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        gap:20px;
        margin-top:25px;
      }

      .card{
        background:white;
        border-radius:18px;
        padding:25px;
        box-shadow:0 5px 20px rgba(0,0,0,0.08);
        transition:0.3s;
      }

      .card:hover{
        transform:translateY(-5px);
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
        padding:10px 18px;
        border-radius:10px;
        text-decoration:none;
      }

      .hero{
        background:white;
        padding:30px;
        border-radius:20px;
        margin-top:20px;
        box-shadow:0 5px 20px rgba(0,0,0,0.08);
      }

      .hero h2{
        color:#4c1d95;
        margin-bottom:10px;
      }

    </style>
  </head>

  <body>

    <div class="navbar">
      <h1>HSE AI</h1>
      <span>منصة الصحة والسلامة المهنية | تطوير وإنشاء: سامي الأسمري</span>
    </div>

    <div class="container">

      <div class="hero">
        <p style="margin-top:10px;color:#666;">
المنصة الرسمية المطورة بواسطة سامي الأسمري
</p>
        <p>
          منصة ذكية لإدارة تقارير السلامة المهنية والمخالفات والتفتيش بالمشاريع.
        </p>
      </div>

      <div class="cards">

        <div class="card">
          <h2>التقارير</h2>
          <p>إنشاء وإدارة تقارير السلامة المهنية.</p>
          <a href="/reports" class="btn">فتح</a>
        </div>

        <div class="card">
          <h2>المخالفات</h2>
          <p>تسجيل المخالفات وإرفاق الصور.</p>
          <a href="#" class="btn">فتح</a>
        </div>

        <div class="card">
          <h2>التفتيش</h2>
          <p>إدارة جولات التفتيش بالموقع.</p>
          <a href="#" class="btn">فتح</a>
        </div>

        <div class="card">
          <h2>الموظفين</h2>
          <p>إدارة موظفين السلامة والمشاريع.</p>
          <a href="#" class="btn">فتح</a>
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
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family:Arial;
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
        box-shadow:0 5px 20px rgba(0,0,0,0.08);
      }

      h1{
        color:#4c1d95;
        margin-bottom:20px;
      }

      input, textarea{
        width:100%;
        padding:15px;
        margin-top:10px;
        margin-bottom:20px;
        border-radius:12px;
        border:1px solid #ddd;
        font-size:16px;
      }

      button{
        background:#4c1d95;
        color:white;
        border:none;
        padding:15px 25px;
        border-radius:12px;
        font-size:18px;
      }

    </style>

  </head>

  <body>

    <div class="container">

      <div class="card">

        <h1>إنشاء تقرير سلامة</h1>

        <input type="text" placeholder="اسم المشروع">

        <input type="text" placeholder="اسم مسؤول السلامة">

        <textarea rows="5" placeholder="وصف المخالفات"></textarea>

        <input type="file">

        <button>توليد التقرير</button>

      </div>

    </div>
<div id="result" class="card" style="display:none;">
  <h1>التقرير النهائي</h1>
  <div id="reportText"></div>
  <button onclick="window.print()">طباعة / حفظ PDF</button>
</div>

<script>
  const button = document.querySelector("button");

  button.addEventListener("click", () => {
    const inputs = document.querySelectorAll("input");
    const textarea = document.querySelector("textarea");

    const project = inputs[0].value || "غير محدد";
    const safety = inputs[1].value || "غير محدد";
    const violations = textarea.value || "لم يتم إدخال مخالفات";

    const report = `
      <h2>تقرير سلامة مهنية</h2>
      <p><strong>اسم المشروع:</strong> ${project}</p>
      <p><strong>مسؤول السلامة:</strong> ${safety}</p>
      <hr>
      <h3>وصف المخالفات:</h3>
      <p>${violations}</p>
      <h3>التوصيات:</h3>
      <ul>
        <li>إيقاف العمل في منطقة الخطر عند الحاجة.</li>
        <li>تأمين الموقع حسب اشتراطات السلامة المهنية.</li>
        <li>توفير معدات الوقاية الشخصية للعاملين.</li>
        <li>متابعة تنفيذ الإجراءات التصحيحية.</li>
      </ul>
    `;

    document.getElementById("reportText").innerHTML = report;
    document.getElementById("result").style.display = "block";
  });
</script>
  </body>

  </html>
  `);
});
app.listen(PORT, () => {
  console.log("HSE AI Running on port " + PORT);
});
