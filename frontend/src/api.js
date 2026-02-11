import API_BASE_URL from "./config";

/**
 * Helper to handle HTTP errors
 */
async function handleResponse(res) {
  if (!res.ok) {
    let errorDetail = "";
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || JSON.stringify(errorJson);
    } catch (e) {
      errorDetail = res.statusText;
    }
    throw new Error(`Error ${res.status}: ${errorDetail}`);
  }
  return res.json();
}

/**
 * 1. Generate Spectrogram (Preview)
 */
export async function fetchSpectrogram({ file, startSec, endSec }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("startSec", startSec);
  formData.append("endSec", endSec);

  // CHANGED: Prepend API_BASE_URL
  const res = await fetch(`${API_BASE_URL}/api/spectrogram`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

/**
 * 2. Analyze Audio (Main Session)
 */
export async function analyzeAudio({ 
  file, 
  startSec, 
  endSec, 
  prompt, 
  modelId, 
  temperature, 
  thinkingBudget,
  mode,
  bpm,
  chords
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("startSec", startSec);
  formData.append("endSec", endSec);
  formData.append("prompt", prompt);
  formData.append("modelId", modelId);
  formData.append("temperature", String(temperature));
  formData.append("thinkingBudget", String(thinkingBudget));
  formData.append("mode", mode);

  if (bpm) formData.append("bpm", String(bpm));
  if (chords && chords.length > 0) formData.append("chords", JSON.stringify(chords));

  // CHANGED: Prepend API_BASE_URL
  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

/**
 * 3. Send Chat Reply
 */
export async function sendChatMessage(sessionId, message) {
  const formData = new FormData();
  formData.append("sessionId", sessionId);
  formData.append("message", message);

  // CHANGED: Prepend API_BASE_URL
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}