
import React from "react";

export default function LinkedInConnect() {
  function connect() {
    window.location.href = "/api/linkedin/auth";
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Connect LinkedIn</h2>
      <p>Connect your LinkedIn account to import executives.</p>
      <button onClick={connect}>Connect LinkedIn</button>
    </div>
  );
}
