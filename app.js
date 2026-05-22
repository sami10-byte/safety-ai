async function generateReport(){
 const btn=document.querySelector('button');
 const report=document.getElementById('report');
 report.textContent='جاري توليد التقرير...';
 const data={projectName:v('projectName'),safetyOfficer:v('safetyOfficer'),managerName:v('managerName'),location:v('location'),violation:v('violation'),notes:v('notes')};
 try{const r=await fetch('/api/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); const j=await r.json(); report.textContent=j.report||'تعذر توليد التقرير';}
 catch(e){report.textContent='حدث خطأ. تأكد من تشغيل الموقع.'}
}
function v(id){return document.getElementById(id).value.trim()}
function copyReport(){navigator.clipboard.writeText(document.getElementById('report').textContent); alert('تم نسخ التقرير')}
