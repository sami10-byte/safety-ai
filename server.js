const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true, limit:'10mb'}));
app.use(express.static(__dirname));

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

app.post('/api/report', async (req,res)=>{
  const {projectName, safetyOfficer, managerName, violation, location, notes} = req.body;
  try {
    if(!process.env.OPENAI_API_KEY){
      return res.json({report: buildFallback({projectName,safetyOfficer,managerName,violation,location,notes})});
    }
    const OpenAI = require('openai');
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    const prompt = `اكتب تقرير مخالفة صحة وسلامة مهنية بالعربية بصيغة رسمية ومنظمة. البيانات:\nاسم المشروع: ${projectName||''}\nمسؤول السلامة: ${safetyOfficer||''}\nمدير المشروع: ${managerName||''}\nموقع المخالفة: ${location||''}\nنوع المخالفة: ${violation||''}\nملاحظات: ${notes||''}\nاجعل التقرير يحتوي: وصف المخالفة، المخاطر المحتملة، الإجراء التصحيحي، الإجراء الوقائي، وخانة توقيع مسؤول السلامة ومدير المشروع.`;
    const completion = await openai.chat.completions.create({model:'gpt-4o-mini',messages:[{role:'user',content:prompt}],temperature:0.3});
    res.json({report: completion.choices[0].message.content});
  } catch(e){
    res.json({report: buildFallback({projectName,safetyOfficer,managerName,violation,location,notes})});
  }
});

function buildFallback(d){
return `تقرير مخالفة صحة وسلامة مهنية\n\nاسم المشروع: ${d.projectName||'غير محدد'}\nمسؤول السلامة: ${d.safetyOfficer||'غير محدد'}\nمدير المشروع: ${d.managerName||'غير محدد'}\nموقع المخالفة: ${d.location||'غير محدد'}\n\nوصف المخالفة:\n${d.violation||'لم يتم إدخال وصف المخالفة.'}\n\nالملاحظات:\n${d.notes||'لا توجد ملاحظات إضافية.'}\n\nالمخاطر المحتملة:\n- احتمالية وقوع إصابات للعاملين.\n- احتمالية تعطل الأعمال أو تلف المعدات.\n- مخالفة اشتراطات الصحة والسلامة المهنية.\n\nالإجراء التصحيحي:\n- إيقاف العمل في منطقة المخالفة عند الحاجة.\n- إزالة سبب المخالفة فورًا.\n- توعية العاملين بالإجراء الصحيح.\n\nالإجراء الوقائي:\n- متابعة الموقع بشكل دوري.\n- تطبيق قائمة فحص سلامة يومية.\n- التأكد من التزام العاملين بتعليمات السلامة.\n\nالتوقيع:\nمسؤول السلامة: ____________________\nمدير المشروع: ____________________`;
}

app.listen(PORT,()=>console.log('Safety AI running on '+PORT));
