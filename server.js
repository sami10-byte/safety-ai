import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(express.static('public'));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));

function buildPrompt({ projectName, location, date, violationType, description, riskLevel, action }) {
  return `أنت خبير صحة وسلامة مهنية HSE في مشاريع البناء داخل السعودية. اكتب تقرير مخالفة/ملاحظة سلامة مهنية باللغة العربية بصياغة رسمية وواضحة.

بيانات التقرير:
- اسم المشروع: ${projectName || 'غير محدد'}
- الموقع: ${location || 'غير محدد'}
- التاريخ: ${date || 'غير محدد'}
- نوع الملاحظة/المخالفة: ${violationType || 'غير محدد'}
- مستوى الخطورة: ${riskLevel || 'غير محدد'}
- وصف الحالة: ${description || 'غير محدد'}
- الإجراء المطلوب: ${action || 'غير محدد'}

المطلوب إخراج التقرير بهذا الشكل:
1. عنوان التقرير
2. ملخص تنفيذي
3. وصف المخالفة/الملاحظة
4. المخاطر المحتملة
5. المتطلبات أو المراجع العامة للسلامة بدون ادعاء مادة نظامية محددة إن لم تكن مؤكدة
6. الإجراءات التصحيحية الفورية
7. الإجراءات الوقائية لمنع التكرار
8. المسؤول عن الإجراء والمدة المقترحة
9. خاتمة رسمية
10. ملاحظة: التقرير يحتاج مراجعة مسؤول السلامة قبل الاعتماد النهائي

اجعل النص جاهزًا للنسخ في تقرير PDF.`;
}

app.post('/api/generate-report', upload.single('photo'), async (req, res) => {
  try {
    if (!client) return res.status(500).json({ error: 'OPENAI_API_KEY غير مضاف في ملف .env' });

    const { projectName, location, date, violationType, description, riskLevel, action } = req.body;
    const input = [{ role: 'user', content: [{ type: 'input_text', text: buildPrompt({ projectName, location, date, violationType, description, riskLevel, action }) }] }];

    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const mime = req.file.mimetype || 'image/jpeg';
      input[0].content.push({ type: 'input_image', image_url: `data:${mime};base64,${base64}` });
      input[0].content[0].text += '\n\nحلّل الصورة المرفقة إن أمكن، واذكر أي ملاحظات سلامة ظاهرة فيها بحذر وبدون جزم بما لا يظهر.';
    }

    const response = await client.responses.create({
      model: 'gpt-5.5',
      input,
      max_output_tokens: 1600
    });

    res.json({ report: response.output_text || 'لم يتم توليد تقرير.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء توليد التقرير. تأكد من المفتاح والاتصال.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`HSE AI Report site running on http://localhost:${port}`));
