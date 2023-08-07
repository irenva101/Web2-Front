import React, { useEffect, useState } from "react";


const PrethodnePorudzbine=()=>{

    const [porudzbine, setPorudzbine]=useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("naziv");
    const [sortOrder, setSortOrder] = useState("asc");

    const[formData, setFormData]=useState({
        
        "korisnikId": 0,
        "adresaDostave": "string",
        "komentar": "string",
        "artikli":[
            {
                "prodavacId":0,
                "naziv": "string",
                "cena": 0,
                "kolicina": 0,
                "opis":"string",
                "slika": "string"
            }
        ],
        "vremeIsporuke":"2000-18-06T18:48:23.437Z"
        
      
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
    
    useEffect(()=> {
        fetch('https://localhost:44388/Porudzbina/allPorudzbineKorisnika?idKorisnika=4', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode:'cors',
        })
        .then((responce)=>responce.json())
        .then((data)=>{
            //obrada odgovora servera 
            setPorudzbine(data);
            console.log(data);
            console.log(data[0]['vremeIsporuke']);
        })
        .catch((error)=>{
            console.error("Greška prilikom dobavljanja podataka sa servera:", error);
        });
    }, []);

    const filteredPorudzbine=porudzbine.filter((porudzbine) => {
        
        return porudzbine.artikli.some((artikal) => artikal.naziv.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const sortedPorudzbine=[...filteredPorudzbine];

    if (sortOption === "naziv") {
        sortedPorudzbine.sort((a, b) => a.artikli[0].naziv.localeCompare(b.artikli[0].naziv));
    } else if (sortOption === "datum") {
        sortedPorudzbine.sort((a, b) => {
            console.log(JSON.stringify(sortedPorudzbine));
            if (sortOrder === "asc") {
                return new Date(a.vremeIsporuke) - new Date(b.vremeIsporuke);
            } else {
                return new Date(b.vremeIsporuke) - new Date(a.vremeIsporuke);
            }
        });
    }
    //u principu bih trebala da sortiram po datumu, to ima najvise smisla

    return(
        <div>
            <h1>Prethodne porudzbine</h1>
            <input
                type="text"
                placeholder="Unesite naziv artikla za pretragu"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
            >
                <option value="naziv">Sortiraj po nazivu</option>
                <option value="datum">Sortiraj po datumu</option>
            </select>
            <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? "Sortiraj po datumu (rastuce)" : "Sortiraj po datumu (opadajuce)"}
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Vreme isporuke</th>
                        <th>Adresa dostave</th>
                        <th>Artikli</th>
                        <th>Komentar</th>
                    </tr>
                </thead>
                <tbody>
                {sortedPorudzbine.map((porudzbina) => (
                    <tr key={porudzbina.vremeIsporuke}>
                        <td>{formatDate(porudzbina.vremeIsporuke)}</td>
                        <td>{porudzbina.adresaDostave}</td>
                        <td>
                            {porudzbina.artikli.map((artikal) => (
                                <div key={artikal.prodavacId}>
                                    <p>Naziv: {artikal.naziv}</p>
                                    <p>Cena: {artikal.cena}</p>
                                    <p>Kolicina: {artikal.kolicina}</p>
                                    <p>Opis: {artikal.opis}</p>
                                    <p>Slika: {artikal.slika}</p>
                                </div>
                            ))}
                        </td>
                        <td>{porudzbina.komentar}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PrethodnePorudzbine;