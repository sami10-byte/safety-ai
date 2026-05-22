let violationIndex = 0;
function addViolation(v={}){
  violationIndex++;
  const div = document.createElement('div');
  div.className='violation';
  div.innerHTML = `<label>وصف المخالفة<input name="v_desc" value="${v.desc||''}" placeholder="مثال: عدم ارتداء معدات الوقاية"></label><label>الملاحظات<input name="v_note" value="${v.note||''}" placeholder="ملاحظات"></label><label>الخطورة<select name="v_risk"><option>منخفضة</option><option selected>متوسطة</option><option>عالية</option></select></label>`;
  document.getElementById('violations').appendChild(div);
}
addViolation();
async function load(){
  const reports = await fetch('/api/reports').then(r=>r.json()).catch(()=>[]);
  document.getElementById('reportsCount').textContent = reports.length;
  document.getElementById('openCount').textContent = reports.reduce((a,r)=>a+(r.violations?.length||0),0);
  document.getElementById('projectsCount').textContent = new Set(reports.map(r=>r.projectName)).size;
  document.getElementById('reportsList').innerHTML = reports.map(r=>`<div class="list-item"><div><b>${r.projectName}</b><br><small>${new Date(r.createdAt).toLocaleString('ar-SA')}</small></div><button onclick='renderReport(${JSON.stringify(r).replaceAll("'","&#39;")})'>عرض</button></div>`).join('') || 'لا توجد تقارير محفوظة بعد';
}
function collectViolations(form){
  const desc = [...form.querySelectorAll('[name="v_desc"]')];
  const notes = [...form.querySelectorAll('[name="v_note"]')];
  const risks = [...form.querySelectorAll('[name="v_risk"]')];
  return desc.map((d,i)=>({desc:d.value, note:notes[i].value, risk:risks[i].value})).filter(v=>v.desc.trim());
}
document.getElementById('reportForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  fd.set('violations', JSON.stringify(collectViolations(form)));
  const report = await fetch('/api/reports',{method:'POST',body:fd}).then(r=>r.json());
  renderReport(report); form.reset(); document.getElementById('violations').innerHTML=''; addViolation(); load();
});
function renderReport(r){
  document.getElementById('reportArea').hidden=false;
  document.getElementById('reportMeta').textContent = `المشروع: ${r.projectName} | الموقع: ${r.location||'-'} | التاريخ: ${new Date(r.createdAt).toLocaleDateString('ar-SA')}`;
  const rows = (r.violations||[]).map((v,i)=>`<tr><td>${i+1}</td><td>${v.desc}</td><td>${r.images?.[i]?`<img src="${r.images[i]}" style="max-width:180px;border-radius:8px">`:'—'}</td><td>${v.note||'—'}</td><td>${v.risk||'متوسطة'}</td></tr>`).join('');
  document.getElementById('reportContent').innerHTML = `<table class="report-table"><thead><tr><th>م</th><th>وصف المخالفة</th><th>صورة المخالفة</th><th>الملاحظات</th><th>الخطورة</th></tr></thead><tbody>${rows}</tbody></table><h3>التوصيات العامة</h3><ul>${(r.recommendations||[]).map(x=>`<li>${x}</li>`).join('')}</ul><h3>ملاحظات عامة</h3><p>${r.notes||'—'}</p><div class="signatures"><div class="signature"><b>مسؤول السلامة</b><br>الاسم: ${r.safetyOfficer||''}<br><br>التوقيع:</div><div class="signature"><b>مدير المشروع</b><br>الاسم: ${r.projectManager||''}<br><br>التوقيع:</div></div>`;
  window.scrollTo({top:document.getElementById('reportArea').offsetTop-10,behavior:'smooth'});
}
load();
