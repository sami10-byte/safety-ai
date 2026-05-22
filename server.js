const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("*", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>HSE AI</title>
      <style>
        body{font-family:Arial;background:#f5f7fb;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
        div{background:white;padding:35px;border-radius:20px;text-align:center;box-shadow:0 10px 30px #ddd}
        h1{color:#4c1d95}
      </style>
    </head>
    <body>
      <div>
        <h1>HSE AI</h1>
        <p>منصة الصحة والسلامة المهنية</p>
        <p>تطوير: سامي الأسمري</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log("HSE AI is running on port " + PORT);
});
