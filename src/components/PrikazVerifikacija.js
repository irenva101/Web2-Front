import React,{useEffect, useState} from "react";
import jwtDecode from "jwt-decode";

const PrikazVerifikacija=()=>{

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options).replace(/\//g, '-');
    }

    const statusProdavca=(tipKorisnika, verifikovan)=>{
        //logika za upis statusa u polje u tabeli
        if(tipKorisnika===2 && !verifikovan){
            return <p style={{color: "#E13232"}}>Odbijen</p>
        }else if(tipKorisnika===1 && verifikovan){
            return <p style={{color: "#55E132"}}>Prihvacen</p>
        }else if(tipKorisnika===1 && !verifikovan){
            return <p style={{color: "#F2A81B"}}>Procesira se</p>
        }
    }

    const [loading, setLoading]=useState(true);
    const [prodavac, setProdavce] =useState([]);
    
    useEffect(()=>{
        var token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        console.log(decodedToken["Id"]);
        fetch("https://localhost:44388/Korisnik/allKorisnike", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }, 
            mode: 'cors',
        })
        .then((response)=>response.json())
        .then((data)=>{
            const prodavci=data.filter(korisnik=>korisnik.tipKorisnika ===1 || korisnik.tipKorisnika===2);
            setProdavce(prodavci);
            console.log(prodavci);
            setLoading(false);

        })
        .catch((error)=>{
            console.log("Greska prilikom dobavljanja svihKrisnika sa beka.");
            console.log(error);
        })
    },[]);
 
    return(
        <div>
            <h1 style={{color: "#279980"}}>Prikaz verifikacija</h1>

            {loading?(
                <p>Učitavanje...</p>
            ): prodavac.length===0 ? (
                <p>Trenutno nema korisnika koji cekaju na verifikaciju.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Slika  </th>
                            <th>Korisnicko Ime</th>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Email</th>
                            <th>Datum rodjenja</th>
                            <th>Adresa</th>
                            <th>Postarina</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {prodavac.map((prodavac)=>(
                        <tr key={prodavac.id}>
                            <td>
                                <img
                                    src={prodavac.slikaKorisnika}
                                    alt="Ucitavnje slike"
                                    style={{ width: "100px" }}
                                />
                            </td>
                            <td>{prodavac.korisnickoIme}</td>
                            <td>{prodavac.ime}</td>
                            <td>{prodavac.prezime}</td>
                            <td>{prodavac.email}</td>
                            <td>{formatDate(prodavac.datumRodjenja)}</td>
                            <td>{prodavac.adresa}</td>
                            <td>{prodavac.postarina}</td>
                            <td>{statusProdavca(prodavac.tipKorisnika, prodavac.verifikovan)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default  PrikazVerifikacija;
