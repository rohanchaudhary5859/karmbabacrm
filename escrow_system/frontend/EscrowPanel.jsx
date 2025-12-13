
import React, { useState } from "react";
import axios from "axios";

export default function EscrowPanel(){
    const [msg,setMsg] = useState("");

    async function create(){
        const res = await axios.post("/api/escrow/create", {
            buyerId:"buyer1",
            sellerId:"seller1",
            amount:5000,
            currency:"USD"
        });
        setMsg("Escrow Created: " + res.data.id);
    }

    return (
        <div>
            <button onClick={create}>Create Escrow</button>
            <p>{msg}</p>
        </div>
    );
}
