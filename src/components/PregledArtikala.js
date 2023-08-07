import React,{useEffect, useState} from "react";
import DetaljiArtikla from "./DetaljiArtikla";
import chartSlika from "../images/chart.png";
import Korpa from "./Korpa";


const PregledArtikala=()=>{

    const [artikli, setArtikli]=useState([]);
    const[selectedArtikal, setSelectedArtikal]=useState(null);
    

    const [adresa, setAdresa] = useState("");
    const [komentar, setKomentar] = useState("");
    const [cartItems, setCartItems] = useState([]);
    // Globalna promenljiva za ID-jeve artikala
    const [selectedArtikliIds, setSelectedArtikliIds] = useState([]);

    const formatiranoTrenutnoVreme=()=>{
      const currentDate=new Date();
      const formattedDate=currentDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      
      const formattedTime=currentDate.toLocaleTimeString("en-US", {
        hour12: false, 
        hour:"2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      
      const stringovi =formattedDate.split("/");
      const datum =stringovi[2]+"-"+stringovi[1]+"-"+stringovi[0] +"T"+formattedTime+".196Z";
      return datum;
    }

    
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("naziv");
    const [sortOrder, setSortOrder] = useState("asc");
    const [korpa, setKorpa] = useState(0);
    const [ukupanIznos, setUkupanIznos] = useState(0);
    const [showPregledPorudzbine, setShowPregledPorudzbine] = useState(false);
    const odabraniArtikli = cartItems.filter((item) => item.kolicina > 0);
    

    
    
    const posaljiPorudzbinuNaServer = () => {
      // Prvo kreiramo objekat koji sadrži sve potrebne informacije za porudžbinu
      
      const newSelectedArtikliIds = cartItems.map((item) => item.artikal.id);
      setSelectedArtikliIds(newSelectedArtikliIds);
      
      console.log(newSelectedArtikliIds);
      console.log(artikli);

      const zaSlanje =artikli.filter((artikal)=>newSelectedArtikliIds.includes(artikal.id));

      console.log(zaSlanje);
      
      const porudzbina = {
        artikli: zaSlanje,
        ukupanIznos: ukupanIznos,
        adresaDostave: adresa,
        komentar: komentar,
        korisnikId: 4, //zakucali miru
        vremeIsporuke: formatiranoTrenutnoVreme(),
        
      };
      // Zatim koristimo fetch funkciju za slanje POST zahteva na server
      fetch("https://localhost:44388/Porudzbina", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": "Bearer " + localStorage.getItem("token")   DODAVANJE AUTHORIZATION HEADER-a
        },
        body: JSON.stringify(porudzbina),
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          // uspesno poslato serveru
          console.log("Sta saljem:");
          console.log(data);
          alert("Porudžbina je uspešno poslata!");
          setCartItems([]); // Resetujemo korpu nakon što je porudžbina poslata
          setUkupanIznos(0); // Resetujemo ukupan iznos nakon što je porudžbina poslata
          setAdresa(""); // Resetujemo polje za adresu nakon što je porudžbina poslata
          setKomentar(""); // Resetujemo polje za komentar nakon što je porudžbina poslata
        })
        .catch((error) => {
         //greska prilikom slanja na server
          console.error("Greška prilikom slanja porudžbine:", error);
          alert("Došlo je do greške prilikom slanja porudžbine.");
        });
    };
    
    useEffect(()=>{
      fetch('https://localhost:44388/Artikal', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
            mode: 'cors',
          })
          .then((responce)=>responce.json())
        .then((data)=> {
            //obrada odgovora servera
            console.log(data);
            setArtikli(data);
            
        })
        .catch((error)=>{
            //obrada greske
            console.error("Greška prilikom dobavljanja podataka sa servera:", error);
        });
    }, []); //prazan dependency niz što znači da će se izvršiti samo prilikom prvog renderovanja komponente.

    useEffect(()=>{
      if(cartItems.length ===0){
        setShowPregledPorudzbine(false);
      }
    },[cartItems]);

    const filteredArtikli = artikli.filter((artikal) => {
        return artikal.naziv.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const dodajUKorpu = (artikal) => {
      const existingItem = cartItems.find((item) => item.artikal.id === artikal.id);
      console.log("*******"+artikal.id+"**************");
      if (existingItem) {
        if (existingItem.kolicina >= artikal.kolicina) {
          alert("Dostignuta je maksimalna količina za ovaj artikal.");
          return;
        }
    
        setCartItems(
          cartItems.map((item) =>
            item.artikal.id === artikal.id
              ? { ...item, kolicina: item.kolicina + 1 }
              : item
          )
        );
      } else {
        setCartItems([...cartItems, { artikal, kolicina: 1, cena:0 }]);
      }
      setUkupanIznos(ukupanIznos + artikal.cena);
    };

    const obrisiIzKorpe = (artikal) => {
      const existingItem = cartItems.find((item) => item.artikal.id === artikal.id);
      if (existingItem) {
        if (existingItem.kolicina === 1) {
          setCartItems(cartItems.filter((item) => item.artikal.id !== artikal.id));
        } else {
          setCartItems(
            cartItems.map((item) =>
              item.artikal.id === artikal.id
                ? { ...item, kolicina: item.kolicina - 1 }
                : item
            )
          );
        }
        setUkupanIznos(ukupanIznos - artikal.cena);
      }
    };

    const handlePoruci = () => {
      // Ovde možete implementirati logiku za slanje porudžbine na server, resetovanje korpe, ili nešto drugo što želite
      alert("Porudžbina je uspešno poslata!");
      setCartItems([]);
      setUkupanIznos(0);
    };

    const sortedArtikli = [...filteredArtikli]; // Kreiramo kopiju niza kako bismo sačuvali originalni niz nepromenjen

    if (sortOption === "naziv") {
      // Sortiranje po nazivu (abecedno)
      sortedArtikli.sort((a, b) => a.naziv.localeCompare(b.naziv));
    } else if (sortOption === "cena") {
      // Sortiranje po ceni
      sortedArtikli.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.cena - b.cena; // Sortiranje od najjeftinijeg do najskupljeg
        } else {
          return b.cena - a.cena; // Sortiranje od najskupljeg do najjeftinijeg
        }
      });
    }

    return(
        <div>
            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
              <img src={chartSlika} alt="Korpa" style={{ width: "40px", height: "40px" }} />
              <span>{korpa}</span>
            </div>

            <h1 style={{color: "#279980"}}>Dostupni artikli</h1>
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
                <option value="cena">Sortiraj po ceni</option>
            </select>
            <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? "Sortiraj po ceni (rastuce)" : "Sortiraj po ceni (opadajuce)"}
            </button>
            <table>
        <thead>
          <tr>
            <th style={{color: "#279980"}}>Naziv</th>
            <th style={{color: "#279980"}}>Slika</th>
            <th style={{color: "#279980"}}>Količina</th>
            <th style={{color: "#279980"}}>Cena</th>
          </tr>
        </thead>
        <tbody>
        {sortedArtikli.map((artikal) => (

            <tr key={artikal.id}>
              <td>{artikal.naziv}</td>
              <td>
                <img src={artikal.slika} alt={artikal.naziv} style={{ width: "100px" }} />
              </td>
              <td style={{ color: artikal.kolicina > 0 ? 'green' : 'red' }}>
                {artikal.kolicina > 0 ? 'Na stanju' : 'Nema na stanju'}
              </td>
              <td>{artikal.cena.toLocaleString("sr-RS", { style: "currency", currency: "RSD" })}</td>
              <td>
              <button type="button" onClick={() => {
                setSelectedArtikal(artikal);
              }}>
                Detalji
                </button>
              </td>
              <td>
                <button type="button" onClick={()=> dodajUKorpu(artikal)}>Dodaj u korpu</button>
              </td>
            </tr>
            
          ))}
        </tbody>
      </table>
      {selectedArtikal && <DetaljiArtikla artikal={selectedArtikal} />}
      <Korpa cartItems={cartItems} obrisiIzKorpe={obrisiIzKorpe} />
      
      <div>
        {/* ...ostatak JSX koda... */}
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ color: "#279980" }}>Ukupan iznos:</h2>{" "}
          <h2>{ukupanIznos.toLocaleString("sr-RS", { style: "currency", currency: "RSD" })}</h2>
          {cartItems.length>0 &&(
            <button onClick={()=> setShowPregledPorudzbine(true)}>Pregled porudzbine</button>
          )}
        </div>
        {showPregledPorudzbine && cartItems.length > 0 && (
          <div>
            <h2>Artikli u korpi:</h2>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.artikal.naziv} (Količina: {item.kolicina})
              </li>
            ))}
          </ul>
            <br/>
          <div>
            <label htmlFor="adresa">Adresa:</label>
            <input
              id="adresa"
              value={adresa}
              onChange={(e) => setAdresa(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="komentar">Komentar:</label>
            <textarea
              id="komentar"
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
            />
          </div>
          <button onClick={posaljiPorudzbinuNaServer}>Poruči</button>
        </div>
        )}
        </div>
    </div>
    );
};

export default PregledArtikala;