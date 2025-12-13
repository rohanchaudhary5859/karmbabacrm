
import React, { useState } from "react";
import axios from "axios";

export default function MatchScore(){
  const [result,setResult]=useState(null);

  async function calculate(){
    const res=await axios.post("/api/matchmaking/get-best",{
      lead:{
        category:"Rice",
        price_min:100,
        price_max:150,
        country:"UAE",
        moq:500,
        certifications:["FSSAI","ISO"]
      },
      suppliers:[
        { id:"S1", categories:["Rice"], price_min:90, price_max:160, country_pref:["UAE"], capacity:2000, certifications:["ISO"] },
        { id:"S2", categories:["Pulses"], price_min:80, price_max:120, country_pref:["USA"], capacity:1000, certifications:["FSSAI"] }
      ]
    });
    setResult(res.data);
  }

  return (
    <div>
      <button onClick={calculate}>Calculate Match</button>
      <pre>{JSON.stringify(result,null,2)}</pre>
    </div>
  );
}
