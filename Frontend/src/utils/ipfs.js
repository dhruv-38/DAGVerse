
export async function uploadToIPFS(content, filename = 'help.txt') {
  // POST to your backend proxy endpoint

  const url = 'http://localhost:8000/api/upload-to-ipfs';

  // If content is a File or Blob, use it directly; otherwise, treat as string
  let file;
  if (content instanceof File || content instanceof Blob) {
    file = content;
  } else {
    const blob = new Blob([content], { type: "text/plain" });
    file = new File([blob], filename);
  }

  const data = new FormData();
  data.append("file", file);
  data.append("network", "public");

  const res = await fetch(url, {
    method: "POST",
    body: data,
  });

  if (!res.ok) throw new Error('Failed to upload to backend IPFS proxy');
  const response = await res.json();
  return response.data.cid;
}

export async function uploadSessionToIPFS(code, language, filename = 'session.json') {
  // POST to your backend proxy endpoint
  const url = 'http://localhost:8000/api/upload-to-ipfs';

  const json = JSON.stringify({ code, language });
  const blob = new Blob([json], { type: 'application/json' });
  const file = new File([blob], filename);

  const data = new FormData();
  data.append('file', file);
  data.append('network', 'public');

  const res = await fetch(url, {
    method: 'POST',
    body: data,
  });

  if (!res.ok) throw new Error('Failed to upload session to backend IPFS proxy');
  const response = await res.json();
  return response.data.cid;
} 