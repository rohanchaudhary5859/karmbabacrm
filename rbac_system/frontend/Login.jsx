
import React, { useState } from "react";
import axios from "axios";

export default function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [result,setResult] = useState("");

    async function doLogin(){
        const res = await axios.post("/api/auth/login",{email,password});
        localStorage.setItem("token", res.data.token);
        setResult("Logged in as " + res.data.role);
    }

    return (
        <div>
            <input placeholder="email" onChange={e=>setEmail(e.target.value)} />
            <input placeholder="password" type="password" onChange={e=>setPassword(e.target.value)} />
            <button onClick={doLogin}>Login</button>
            <p>{result}</p>
        </div>
    );
}
