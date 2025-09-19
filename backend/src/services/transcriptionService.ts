import axios from "axios";
import Transcription, { ITranscription } from "../models/Transcription.js";

async function checkUrlReachable(url: string, retries = 2): Promise<void> {
  let attempt = 0;
  let lastErr: unknown = null;
  while (attempt <= retries) {
    try {
      await axios.head(url, { timeout: 5000 });
      return;
    } catch (e) {
      lastErr = e;
      attempt++;
      if (attempt > retries) break;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  // console.warn("Could not reach URL, continuing as mock:", lastErr);
}

export async function createTranscription(
  audioUrl: string
): Promise<ITranscription> {
  await checkUrlReachable(audioUrl, 2);
  const transcriptionText = "transcribed text";
  const record = new Transcription({
    audioUrl,
    transcription: transcriptionText,
  });
  return await record.save();
}

export async function listTranscriptions(): Promise<ITranscription[]> {
  return await Transcription.find().sort({ createdAt: -1 }).lean();
}
