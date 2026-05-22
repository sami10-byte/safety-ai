
const form = document.getElementById('reportForm');
const set = (id,v)=>document.getElementById(id).textContent=v||'-';
function updatePreview(){
 const d = new FormData(form);
 set('pProject', d.get('projectName'));
 set('pOfficer', d.get('safetyOfficer'));
 set('pManager', d.get('projectManager'));
 set('pLocation', d.get('location'));
 set('pRisk', d.get('riskLevel'));
 set('pViolation', d.get('violation'));
 set('pNotes', d.get('notes'));
}
form.addEventListener('input', updatePreview);
form.addEventListener('submit', async e=>{
 e.preventDefault();
 const res = await fetch('/api/reports',{method:'POST',body:new FormData(form)});
 if(res.ok){ alert('تم حفظ التقرير بنجاح'); loadReports(); }
 else alert('حدث خطأ أثناء الحفظ');
});
async function loadReports(){
 const res = await fetch('/api/reports');
 const list = await res.json();
 document.getElementById('reportsList').innerHTML = list.map(r=>`
  <div class="saved">
    <b>${r.projectName || 'بدون اسم'}</b><br>
    <span>${new Date(r.createdAt).toLocaleString('ar-SA')}</span><br>
    <small>${r.violation || ''}</small>
  </div>`).join('') || '<p>لا توجد تقارير محفوظة بعد.</p>';
}
updatePreview(); loadReports();
