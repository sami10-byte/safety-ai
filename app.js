const form = document.getElementById('reportForm');
const result = document.getElementById('result');
const copyBtn = document.getElementById('copyBtn');
const printBtn = document.getElementById('printBtn');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  result.textContent = 'جاري توليد التقرير...';
  const formData = new FormData(form);

  try {
    const res = await fetch('/api/generate-report', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'حدث خطأ');
    result.textContent = data.report;
  } catch (err) {
    result.textContent = err.message;
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(result.textContent);
  copyBtn.textContent = 'تم النسخ';
  setTimeout(() => copyBtn.textContent = 'نسخ', 1500);
});

printBtn.addEventListener('click', () => window.print());
