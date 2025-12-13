
import React, { useState } from "react";
import axios from "axios";

export default function GenerateInvoice(){
    const [msg,setMsg] = useState("");

    async function generate(){
        const payload = {
            exporter:"KARM BABA EXPORTS",
            importer:"Dubai Market",
            product:"Basmati Rice",
            hs_code:"10063020",
            quantity:"2000kg",
            price:"$1200",
            origin:"India",
            incoterm:"FOB"
        };
        const res = await axios.post("/api/export/invoice", payload, { responseType:"blob" });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf");
        document.body.appendChild(link);
        link.click();
        setMsg("Invoice Generated!");
    }

    return(
        <div>
            <button onClick={generate}>Generate Invoice</button>
            <p>{msg}</p>
        </div>
    );
}
