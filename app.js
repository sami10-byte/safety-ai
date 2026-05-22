const $ = s => document.querySelector(s); const $$ = s => document.querySelectorAll(s);
const api = async (url, opts={}) => { const r = await fetch(url, opts); return r.json(); };
$$('.nav').forEach(btn=>btn.onclick=()=>{ $$('.nav').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); $$('.page').forEach(p=>p.classList.remove('show')); $('#'+btn.dataset.page).classList.add('show'); $('#pageTitle').textContent=btn.textContent; refresh(); });
document.querySelector('[name=report_date]').value = new Date().toISOString().slice(0,10);
function riskChip(v){ return `<span class="chip ${v==='عالي'?'red':''}">${v||'متوسط'}</span>` }
async function refresh(){ loadDashboard(); loadProjects(); loadReports(); loadRisks(); }
async function loadDashboard(){ const d=await api('/api/dashboard'); $('#statReports').textContent=d.reports; $('#statProjects').textContent=d.projects; $('#statOpen').textContent=d.open; $('#statHigh').textContent=d.high; $('#latestReports').innerHTML = tableReports(d.latest||[]); }
function tableReports(items){ if(!items.length) return '<div class="empty">لا توجد تقارير بعد.</div>'; return `<div class="row head"><span>رقم التقرير</span><span>المشروع</span><span>الخطورة</span><span>الحالة</span></div>`+items.map(r=>`<div class="row"><b>${r.report_no}</b><span>${r.project_name||'-'}</span><span>${riskChip(r.risk_level)}</span><span>${r.status}</span></div>`).join(''); }
async function loadProjects(){ const p=await api('/api/projects'); $('#projectSelect').innerHTML='<option value="">بدون</option>'+p.map(x=>`<option value="${x.id}">${x.name}</option>`).join(''); $('#projectsList').innerHTML = p.length? `<div class="row head"><span>المشروع</span><span>الموقع</span><span>المدير</span><span>التاريخ</span></div>`+p.map(x=>`<div class="row"><b>${x.name}</b><span>${x.location||'-'}</span><span>${x.manager||'-'}</span><span>${(x.created_at||'').slice(0,10)}</span></div>`).join(''):'<div class="empty">لا توجد مشاريع.</div>'; }
async function loadReports(){ const r=await api('/api/reports'); $('#reportsList').innerHTML=tableReports(r); }
async function loadRisks(){ const r=await api('/api/risks'); $('#risksList').innerHTML = r.length? `<div class="row head"><span>النشاط</span><span>المخاطر</span><span>التحكم</span><span>الخطورة</span></div>`+r.map(x=>`<div class="row"><b>${x.activity}</b><span>${x.hazards}</span><span>${x.controls}</span><span>${riskChip(x.risk_level)}</span></div>`).join(''):'<div class="empty">لا يوجد تقييم مخاطر.</div>'; }
$('#projectForm').onsubmit=async e=>{ e.preventDefault(); await api('/api/projects',{method:'POST',body:new URLSearchParams(new FormData(e.target))}); e.target.reset(); refresh(); };
$('#riskForm').onsubmit=async e=>{ e.preventDefault(); const fd=new FormData(e.target); $('#riskResult').textContent='جاري التقييم...'; const r=await api('/api/risks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({activity:fd.get('activity')})}); $('#riskResult').innerHTML=`<b>المخاطر:</b><br>${r.hazards}<br><br><b>إجراءات التحكم:</b><br>${r.controls}<br><br><b>الخطورة:</b> ${riskChip(r.risk_level)}`; refresh(); };
$('#reportForm').onsubmit=async e=>{ e.preventDefault(); const btn=e.target.querySelector('button'); btn.textContent='جاري التوليد...'; btn.disabled=true; const r=await fetch('/api/reports',{method:'POST',body:new FormData(e.target)}).then(x=>x.json()); const full=await api('/api/reports/'+r.id); renderReport(full); btn.textContent='توليد وحفظ التقرير'; btn.disabled=false; refresh(); };
function renderReport(r){ $('#reportPreview').innerHTML=`
<div class="paper-head"><div><h2>تقرير ملاحظة صحة وسلامة مهنية</h2><p>HSE Observation Report</p></div><div class="badge">HSE</div></div>
<div class="meta"><span>رقم التقرير: ${r.report_no}</span><span>التاريخ: ${r.report_date}</span><span>الحالة: ${r.status}</span></div>
<div class="meta"><span>المشروع: ${r.project_name||'-'}</span><span>الموقع: ${r.location||'-'}</span><span>مسؤول السلامة: ${r.inspector||'-'}</span></div>
<div class="section-title">بيانات المخالفة</div>
<div class="meta"><span>نوع المخالفة: ${r.violation_type||'-'}</span><span>مستوى الخطورة: ${r.risk_level||'-'}</span><span>منشئ النظام: سامي الأسمري</span></div>
${r.image_path?`<div class="section-title">صورة المخالفة</div><img class="obs-img" src="${r.image_path}">`:''}
<div class="section-title">وصف الملاحظة</div><div class="report-text">${r.observation||'-'}</div>
<div class="section-title">التقرير والتوصيات</div><div class="report-text">${r.ai_report||'-'}</div>
${r.actions?`<div class="section-title">إجراءات إضافية</div><div class="report-text">${r.actions}</div>`:''}
<div class="signatures"><div class="sig"><b>توقيع مسؤول السلامة</b><br><br>الاسم: ${r.inspector||'سامي الأسمري'}</div><div class="sig"><b>توقيع مدير المشروع</b><br><br>الاسم:</div></div>`; }
refresh();
