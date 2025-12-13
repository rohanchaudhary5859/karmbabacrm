
import React, { useState } from "react";
import axios from "axios";

export default function Executives() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);

  async function importExecs() {
    const res = await axios.post("/api/linkedin/import-execs", {
      keyword,
      location,
    });
    setResult(res.data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Import Executives</h2>
      <input placeholder="Keyword" onChange={e => setKeyword(e.target.value)} />
      <input placeholder="Location" onChange={e => setLocation(e.target.value)} />
      <button onClick={importExecs}>Search</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
