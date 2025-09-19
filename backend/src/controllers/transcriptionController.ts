import { Request, Response } from "express";
import {
  createTranscription,
  listTranscriptions,
} from "../services/transcriptionService.js";

export async function postTranscription(req: Request, res: Response) {
  try {
    const { audioUrl } = req.body as { audioUrl?: string };
    if (!audioUrl || typeof audioUrl !== "string") {
      return res.status(400).json({ error: "audioUrl is required (string)" });
    }
    const result = await createTranscription(audioUrl);
    return res.json({ id: result._id, createdAt: result.createdAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTranscriptions(_req: Request, res: Response) {
  try {
    const items = await listTranscriptions();
    return res.json({ items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
