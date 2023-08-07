import React, { useEffect, useState } from "react";

const StarePorudzbine=()=>{

    const [porudzbina, setPorudzbine]=useState([]);

    const formatDate=(dateString)=>{
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateString).toLocaleDateString('en-US', options).replace(',', '');
    
    }

    useEffect(()=>{
        fetch("https://localhost:44388/Porudzbina/allPorudzbineProdavcaStare?korisnikId=11", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        })
        .then((response)=> response.json())
        .then((data)=>{
            console.log(data);
            setPorudzbine(data);
        })
        .catch((error)=>{
            console.error("Greška prilikom dobavljanja podataka sa servera:", error);
        });
    },[]);


    return(
        <div>
            <h1 style={{color: "#279980"}}>Moje porudzbine</h1>
            <table>
                <thead>
                    <tr>
                        <th>Adresa Dostave</th>
                        <th>Komentar</th>
                        <th>Vreme isporuke</th>
                    </tr>
                </thead>
                <tbody>
                {porudzbina.map((porudzbina, index)=>(
                    <tr key={index}>
                        <td>{porudzbina.adresaDostave}</td>
                        <td>{porudzbina.komentar}</td>
                        <td>{formatDate(porudzbina.vremeIsporuke)}</td>
                    </tr>
                ))}    
                </tbody>  
            </table>
        </div>
    );
};

export default StarePorudzbine;