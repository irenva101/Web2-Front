import React,{useState, useEffect} from "react";

const Verifikacija=()=>{

    const [prodavac, setProdavce] =useState([]);
    const [loading, setLoading]=useState(true);

    const formatDate = (dateString) => {
        console.log(dateString);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options).replace(/\//g, '-');
    }

    useEffect(()=>{
        fetch("https://localhost:44388/Korisnik/neverProdavce", {
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
            },
            mode:'cors',
        })
        .then((response)=>response.json())
        .then((data)=> {
            console.log(data);
            setProdavce(data);
            setLoading(false)
        })
        .catch((error)=>{
            console.error("Greska prilikom dobavljanja podataka sa servera:", error);
            setLoading(false); 
        });

    },[]);

    const handleVerifikacija = (index) => {
        // Implementirajte logiku za verifikaciju
        console.log(`Verifikacija prodavca sa indeksom ${index}`);
        fetch(`https://localhost:44388/Korisnik/verProdavca?idKorisnika=${index}`, {
                method: "POST",
                body: JSON.stringify(index),
                headers: {
                    "Content-Type": "application/json",
                },
                mode: 'cors',
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });

    }
        
    
        const handleOdbijVerifikaciju = (index) => {
            // Implementirajte logiku za odbijanje verifikacije
            console.log(`Odbijanje verifikacije prodavca sa indeksom ${index}`);
            fetch(`https://localhost:44388/Korisnik/neverProdavca?idKorisnika=${index}`, {
                method: "POST",
                body: JSON.stringify(index),
                headers: {
                    "Content-Type": "application/json",
                },
                mode: 'cors',
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
        };

    return(
        <div>

            <h1 style={{color: "#279980"}}>Prodavci koji cekaju na verifikaciju naloga</h1>

            {loading?(
                <p>Učitavanje...</p>
            ) : prodavac.length===0 ? (
                <p>Trenutno nema korisnika koji cekaju na verifikaciju.</p>
            ) : (

            <table>

                <thead>
                    <tr>
                        <th>Slika</th>
                        <th>Korisnicko Ime</th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Email</th>
                        <th>Datum rodjenja</th>
                        <th>Adresa</th>
                        <th>Postarina</th>
                    </tr>
                </thead>
                <tbody>
                {prodavac.map((prodavac)=>(
                    <tr key={prodavac.id}>
                        <td>{prodavac.slikaKorisnika}</td>
                        <td>{prodavac.korisnickoIme}</td>
                        <td>{prodavac.ime}</td>
                        <td>{prodavac.prezime}</td>
                        <td>{prodavac.email}</td>
                        <td>{formatDate(prodavac.datumRodjenja)}</td>
                        <td>{prodavac.adresa}</td>
                        <td>{prodavac.postarina}</td>
                        <td>
                            <button onClick={() => handleVerifikacija(prodavac.id)}>Verifikuj</button>
                        </td>
                        <td>
                            <button onClick={() => handleOdbijVerifikaciju(prodavac.id)}>Odbij verifikaciju</button>
                        </td>
                    </tr>
                ))}
                    
                </tbody>

            </table>
            )}
        </div>
    );
};

export default Verifikacija;