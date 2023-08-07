
import React ,{useEffect, useState, useRef} from "react";


const Profil =()=>{
    const [formData, setFormData]=useState({
        "korisnickoIme": "",
        "email": "",
        "lozinka": "",
        "ime": "",
        "prezime": "",
        "datumRodjenja": "2000-01-01",
        "adresa": "",
        "tipKorisnika": 0,
        "slikaKorisnika": "",
        "verifikovan": true,
        "postarina": 0
    });

    

    //state za cuvanje podatka sa server
    const [korisnikPodaci, setKorisnikPodaci]=useState(null);

    //state za cuvanje tipaKorisnika
    const tipRef = useRef(0);
    const postarinaRef=useRef(0);


    const formRef=useRef(null);

    useEffect(()=>{
        fetch('https://localhost:44388/Korisnik?idKorisnika=4', {//zakucala jednog korisnika
            method: 'GET',
            // body: JSON.stringify(formData), //ne mogu slati body u get zahtevu
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        }) 
        .then((Response)=> Response.json())
        .then((data)=>{
            //obrada odgovora servera
            console.log(data);
            tipRef.current=data.tipKorisnika;
            postarinaRef.current=data.postarinaRef;
            //foramtiranje datuma
            const datumRodjenja=data.datumRodjenja; //2023-07-25T00:00:00
            const formattedDateString=datumRodjenja.split("T")[0];
            data.datumRodjenja=formattedDateString;    
            //console.log(formattedDateString+" ******db->forma");
            setKorisnikPodaci(data);
            setFormData(data);
            
        })
        .catch((error) => {
            //obrada greske
            console.error("Greška prilikom dobavljanja podataka sa servera:", error);
        }); 
    }, []);

    const handleChange=(e)=>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit =(e)=>{
        e.preventDefault();
        // Fetch zahtev za slanje izmenjenih podataka na server
        //formatiranje datuma za slanje nazad serveru
        const zaKonvertovanje = formData.datumRodjenja; //"28-7-2023"
        const formattedDateString=zaKonvertovanje+"T23:00:00.000Z";
        //console.log(formData);
        console.log(zaKonvertovanje  + "irenaaaaaaaaaaaaaaaaaaaaaaa22222222");
        console.log(formattedDateString+"ZA BAZU");
        
        

        const formDataToSend ={
            korisnickoIme: formRef.current.korisnickoIme.value,
            email: formRef.current.email.value,
            lozinka: formRef.current.lozinka.value,
            ime: formRef.current.ime.value,
            prezime: formRef.current.prezime.value,
            datumRodjenja: formattedDateString,
            adresa: formRef.current.adresa.value,
            tipKorisnika: tipRef.current.value,
            slikaKorisnika: formRef.current.slikaKorisnika.value,
            postarina: postarinaRef.current,
        };

        fetch("https://localhost:44388/Korisnik?idKorisnika=4", {
            method: "PUT",
            body: JSON.stringify(formDataToSend),
            headers:{
                "Content-Type": "application/json",
            },
            mode: "cors",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Podaci su uspešno poslati na server:", data);
            })
            .catch((error) => {
                // Obrada greške
      console.error("Greška prilikom slanja podataka na server:", error);
      
            });
    
    };

    return(
        <div>
            <h2>Profil</h2>
            {korisnikPodaci ? (
                <form onSubmit={handleSubmit} ref={formRef} >
                    <label>
                        Korisnicko ime:
                        <input
                            type="text"
                            name="korisnickoIme"
                            value={formData.korisnickoIme}
                            onChange={handleChange}
                        />
                        <p></p>
                    </label>
                    <label>
                        E-mail:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <p></p>
                    </label>
                    <label>
                        Lozinka:
                        <input
                            type="password"
                            name="lozinka"
                            value={formData.lozinka}
                            onChange={handleChange}
                        />
                        <p></p>
                    </label>
                    <label>
                        Ime:
                        <input
                            type="text"
                            name="ime"
                            value={formData.ime}
                            onChange={handleChange}
                        />
                        <p></p>
                    </label>
                    <label>
                        Prezime:
                        <input
                            type="text"
                            name="prezime"
                            value={formData.prezime}
                            onChange={handleChange}
                        />
                        <p></p>
                    </label>
                    <label>
                        Datum rodjenja:
                        <input
                            type="date"
                            name="datumRodjenja"
                            value={formData.datumRodjenja}
                            onChange={handleChange}
                        />
                        <p></p>
                    </label>
                    <label>
                        Adresa:
                        <input
                            type="text"
                            name="adresa"
                            value={formData.adresa}
                            onChange={handleChange}
                        />
                        <p></p>
                    </label>
                    <label>
                        Slika:
                        <input
                            type="text"
                            name="slikaKorisnika"
                            value={formData.slikaKorisnika}
                            onChange={handleChange}
                        />
                        <p></p>
                    </label>
                    {formData.tipKorisnika === 'Prodavac' && (
                        <div>
                            <label htmlFor="postarina">Postarina:</label>
                                <input
                                    type="number"
                                    id="postarina"
                                    name="postarina"
                                    value={formData.postarina}
                                    onChange={handleChange}
                                    required
                                />
                                <br/>
                        </div>
                        
                    )}
                    <button type="submit">Sacuvaj izmene</button>
                </form>
            ) : (
                <p>Ucitavanje podataka...</p>
            )}
        </div>
    );
};

export default Profil;