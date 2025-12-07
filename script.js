// Utilities: file -> base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function postJSON(path, body) {
  const resp = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    let err;
    try { err = await resp.json(); } catch(e) { err = { error: resp.statusText }; }
    throw err;
  }
  return await resp.json();
}

// Image -> PDF
document.getElementById('convertImgBtn').addEventListener('click', async () => {
  const file = document.getElementById('imgFile').files[0];
  const out = document.getElementById('imgResult'); out.textContent = '';
  if (!file) return alert('Select an image');
  try {
    out.textContent = 'Encoding...';
    const b64 = await fileToBase64(file);
    out.textContent = 'Uploading...';
    const data = await postJSON('/api/image-to-pdf', { filename: file.name, contentBase64: b64 });
    if (data.url) out.innerHTML = `<a href="${data.url}" target="_blank">Download PDF</a>`;
    else out.textContent = JSON.stringify(data);
  } catch (e) { out.textContent = 'Error: ' + (e.error || e.message || JSON.stringify(e)); }
});

// Merge PDFs
document.getElementById('mergeBtn').addEventListener('click', async () => {
  const files = Array.from(document.getElementById('mergeFiles').files);
  const out = document.getElementById('mergeResult'); out.textContent = '';
  if (!files.length) return alert('Select files');
  try {
    out.textContent = 'Encoding files...';
    const filesB64 = [];
    for (const f of files) {
      const b64 = await fileToBase64(f);
      filesB64.push({ filename: f.name, contentBase64: b64 });
    }
    out.textContent = 'Uploading...';
    const data = await postJSON('/api/merge-pdf', { files: filesB64 });
    if (data.url) out.innerHTML = `<a href="${data.url}" target="_blank">Download Merged PDF</a>`;
    else out.textContent = JSON.stringify(data);
  } catch (e) { out.textContent = 'Error: ' + (e.error || e.message || JSON.stringify(e)); }
});

// Compress PDF
document.getElementById('compressBtn').addEventListener('click', async () => {
  const file = document.getElementById('compressFile').files[0];
  const out = document.getElementById('compressResult'); out.textContent = '';
  if (!file) return alert('Select a file');
  try {
    out.textContent = 'Encoding...';
    const b64 = await fileToBase64(file);
    out.textContent = 'Uploading...';
    const data = await postJSON('/api/compress-pdf', { filename: file.name, contentBase64: b64 });
    if (data.url) out.innerHTML = `<a href="${data.url}" target="_blank">Download Compressed PDF</a>`;
    else out.textContent = JSON.stringify(data);
  } catch (e) { out.textContent = 'Error: ' + (e.error || e.message || JSON.stringify(e)); }
});

// Split PDF
document.getElementById('splitBtn').addEventListener('click', async () => {
  const file = document.getElementById('splitFile').files[0];
  const pages = document.getElementById('splitPages').value.trim();
  const out = document.getElementById('splitResult'); out.textContent = '';
  if (!file) return alert('Select a file');
  try {
    out.textContent = 'Encoding...';
    const b64 = await fileToBase64(file);
    out.textContent = 'Uploading...';
    const data = await postJSON('/api/split-pdf', { filename: file.name, contentBase64: b64, pages });
    // pdf.co split returns urls array or similar
    if (data.urls && data.urls.length) {
      out.innerHTML = data.urls.map(u => `<div><a href="${u}" target="_blank">Download Part</a></div>`).join('');
    } else if (data.url) {
      out.innerHTML = `<a href="${data.url}" target="_blank">Download Result</a>`;
    } else out.textContent = JSON.stringify(data);
  } catch (e) { out.textContent = 'Error: ' + (e.error || e.message || JSON.stringify(e)); }
});

// Rotate PDF
document.getElementById('rotateBtn').addEventListener('click', async () => {
  const file = document.getElementById('rotateFile').files[0];
  const angle = document.getElementById('rotateAngle').value;
  const out = document.getElementById('rotateResult'); out.textContent = '';
  if (!file) return alert('Select a file');
  try {
    out.textContent = 'Encoding...';
    const b64 = await fileToBase64(file);
    out.textContent = 'Uploading...';
    const data = await postJSON('/api/rotate-pdf', { filename: file.name, contentBase64: b64, angle });
    if (data.url) out.innerHTML = `<a href="${data.url}" target="_blank">Download Rotated PDF</a>`;
    else out.textContent = JSON.stringify(data);
  } catch (e) { out.textContent = 'Error: ' + (e.error || e.message || JSON.stringify(e)); }
});

// Protect PDF (add password)
document.getElementById('protectBtn').addEventListener('click', async () => {
  const file = document.getElementById('protectFile').files[0];
  const password = document.getElementById('protectPassword').value || '';
  const out = document.getElementById('protectResult'); out.textContent = '';
  if (!file) return alert('Select a file');
  if (!password) return alert('Enter a password to protect the PDF');
  try {
    out.textContent = 'Encoding...';
    const b64 = await fileToBase64(file);
    out.textContent = 'Uploading...';
    const data = await postJSON('/api/protect-pdf', { filename: file.name, contentBase64: b64, password });
    if (data.url) out.innerHTML = `<a href="${data.url}" target="_blank">Download Protected PDF</a>`;
    else out.textContent = JSON.stringify(data);
  } catch (e) { out.textContent = 'Error: ' + (e.error || e.message || JSON.stringify(e)); }
});

// Unlock PDF (remove password)
document.getElementById('unlockBtn').addEventListener('click', async () => {
  const file = document.getElementById('unlockFile').files[0];
  const password = document.getElementById('unlockPassword').value || '';
  const out = document.getElementById('unlockResult'); out.textContent = '';
  if (!file) return alert('Select a file');
  if (!password) return alert('Enter the current password');
  try {
    out.textContent = 'Encoding...';
    const b64 = await fileToBase64(file);
    out.textContent = 'Uploading...';
    const data = await postJSON('/api/unlock-pdf', { filename: file.name, contentBase64: b64, password });
    if (data.url) out.innerHTML = `<a href="${data.url}" target="_blank">Download Unlocked PDF</a>`;
    else out.textContent = JSON.stringify(data);
  } catch (e) { out.textContent = 'Error: ' + (e.error || e.message || JSON.stringify(e)); }
});
