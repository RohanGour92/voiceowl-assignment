import axios from "axios";
import Transcription from "../models/Transcription.js";
async function checkUrlReachable(url, retries = 2) {
    let attempt = 0;
    let lastErr = null;
    while (attempt <= retries) {
        try {
            await axios.head(url, { timeout: 5000 });
            return;
        }
        catch (e) {
            lastErr = e;
            attempt++;
            if (attempt > retries)
                break;
            await new Promise((r) => setTimeout(r, 500 * attempt));
        }
    }
    // console.warn("Could not reach URL, continuing as mock:", lastErr);
}
export async function createTranscription(audioUrl) {
    await checkUrlReachable(audioUrl, 2);
    const transcriptionText = "transcribed text";
    const record = new Transcription({
        audioUrl,
        transcription: transcriptionText,
    });
    return await record.save();
}
export async function listTranscriptions() {
    return await Transcription.find().sort({ createdAt: -1 }).lean();
}
