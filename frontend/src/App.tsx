import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

type Item = {
  _id: string;
  audioUrl: string;
  transcription: string;
  createdAt: string;
};

export default function App() {
  const [audioUrl, setAudioUrl] = useState("https://example.com/sample.mp3");
  const [items, setItems] = useState<Item[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await api.get("/transcription");
    setItems(res.data.items || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/transcription", { audioUrl });
      setMsg("Saved with ID: " + res.data.id);
      setAudioUrl("");
      await load();
    } catch (err: any) {
      setMsg("Error: " + (err?.response?.data?.error || "failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, Arial" }}>
      <h1>VoiceOwl Demo</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          style={{ flex: 1, padding: 8 }}
          placeholder="Enter audio URL"
        />
        <button disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "..." : "Submit"}
        </button>
      </form>
      {msg && <p>{msg}</p>}
      <h2>All Transcriptions</h2>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        {items.length === 0 && <p>No transcriptions yet.</p>}
        {items.map((it) => (
          <div
            key={it._id}
            style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
          >
            <div>
              <b>ID:</b> {it._id}
            </div>
            <div>
              <b>Audio URL:</b> {it.audioUrl}
            </div>
            <div>
              <b>Transcription:</b> {it.transcription}
            </div>
            <div>
              <b>Created:</b> {new Date(it.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
