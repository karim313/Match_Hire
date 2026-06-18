const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://cvanalysisapp.runasp.net/api").replace(/\/$/, '');

export function getAnalyzeEndpoint() {
  return `${API_BASE}/Cv/analyze-and-suggest-jobs`;
}

/** Upload directly to backend — skips Next.js proxy (one network hop instead of two). */
export function uploadCvForAnalysis(
  file: File,
  accessToken: string | undefined,
  onProgress: (pct: number) => void,
  signal: AbortSignal
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    if (!API_BASE) {
      reject(new Error('عنوان الخادم غير مُعرَّف.'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.min(45, Math.round((event.loaded / event.total) * 45)));
      }
    };

    xhr.onload = () => {
      onProgress(100);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.message || data.title || 'حدث خطأ أثناء تحليل الملف.'));
        }
      } catch {
        reject(new Error('استجابة غير صالحة من الخادم.'));
      }
    };

    xhr.onerror = () => reject(new Error('فشل الاتصال بالخادم. تحقق من الإنترنت.'));
    xhr.onabort = () => reject(new Error('تم إلغاء العملية.'));
    xhr.ontimeout = () => reject(new Error('انتهت مهلة التحليل. حاول مرة أخرى.'));

    xhr.timeout = 5 * 60 * 1000; // 5 min — AI analysis can be slow

    signal.addEventListener('abort', () => xhr.abort());

    xhr.open('POST', getAnalyzeEndpoint());
    if (accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }
    xhr.send(formData);
  });
}
