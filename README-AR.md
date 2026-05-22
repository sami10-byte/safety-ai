# موقع تقارير الصحة والسلامة المهنية بالذكاء الاصطناعي

هذه نسخة جاهزة للرفع على Render أو Railway.

## أفضل مكان ترفع عليه
أنصحك بمنصة Render لأنها سهلة للمبتدئين وتشغل مشاريع Node.js مباشرة.

## خطوات الرفع على Render

1. فك ضغط الملف.
2. ارفع مجلد المشروع على GitHub.
3. افتح موقع Render.
4. اختر New ثم Web Service.
5. اربط حساب GitHub واختر المشروع.
6. اترك الإعدادات كالتالي:
   - Build Command: npm install
   - Start Command: npm start
7. أضف متغير البيئة:
   - Key: OPENAI_API_KEY
   - Value: ضع مفتاح OpenAI API الخاص بك
8. اضغط Deploy.

بعد النشر سيظهر لك رابط موقعك مثل:
https://hse-ai-report-site.onrender.com

## التشغيل على الكمبيوتر

ثبت Node.js ثم افتح مجلد المشروع واكتب:

```bash
npm install
npm start
```

ثم افتح:
http://localhost:3000

## مهم

لا تضع مفتاح OpenAI داخل ملفات الموقع العامة مثل public أو app.js.
المفتاح يوضع فقط في Render Environment Variables أو ملف .env محليًا.

## ملف .env للتجربة المحلية
انسخ الملف .env.example وسمّه .env ثم ضع المفتاح داخله:

OPENAI_API_KEY=ضع_مفتاحك_هنا
