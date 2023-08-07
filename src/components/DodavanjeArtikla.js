import React,{useRef, useState, useEffect} from "react";
import { getAllArtikle } from "../services/artikal.service"

const DodavanjeArtikla=()=>{

    const formRef=useRef(null);
    const [artikli, setArtikli] = useState([]);
    const [trenutniArtikal, setTrenutniArtikal] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    
    const azurirajArtikal=(artikal)=>{
        
        setTrenutniArtikal(artikal);
        setShowUpdateForm(true);
    };

    const handleUpdate=(e)=>{
        e.preventDefault();
    // Logika za slanje ažuriranih podataka na server
    const formDataToUpdate = {
        id: trenutniArtikal.id, // Pretpostavka da artikal ima svoj ID
        prodavacId: formRef.current.prodavacId.value,
        naziv: formRef.current.naziv.value,
        cena: formRef.current.cena.value,
        kolicina: formRef.current.kolicina.value,
        opis: formRef.current.opis.value,
        slika: formRef.current.slika.value,
    };

    console.log("Stigli smo do ovde ale");

    fetch(`https://localhost:44388/Artikal?idArtikla=${formDataToUpdate.id}`, {
        method: "PATCH",
        body: JSON.stringify(formDataToUpdate),
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Podaci su uspešno ažurirani na serveru:", data);
            // Nakon uspešnog ažuriranja podataka, sakrijemo formu za ažuriranje
            setShowUpdateForm(false);
            // Ažuriramo listu artikala da prikaže ažurirane podatke
            setArtikli((prevArtikli) =>
                prevArtikli.map((a) =>
                    a.id === formDataToUpdate.id ? formDataToUpdate : a
                )
            );
        })
        .catch((error) => {
            console.error("Greška prilikom slanja ažuriranih podataka na server:", error);
        });
    };

    useEffect(()=> {
        if(trenutniArtikal){
            setFormData({
                prodavacId: trenutniArtikal.prodavacId,
                naziv: trenutniArtikal.naziv,
                cena: trenutniArtikal.cena,
                kolicina: trenutniArtikal.kolicina,
                opis: trenutniArtikal.opis,
                slika: trenutniArtikal.slika,
            });
        }
    },[trenutniArtikal]);

    const [formData, setFormData]=useState({
        "prodavacId": 4, //zakucala na prodavac2
        "naziv": "string",
        "cena": 0,
        "kolicina": 0,
        "opis": "string",
        "slika": "string"
    });

    const obrisiArtikal=(artikal)=>{
        console.log("stigli smo dovde ale");
        const potvrdiBrisanje= window.confirm("Da li želite da obrišete ovaj artikal?");
        if(potvrdiBrisanje){
            fetch(`https://localhost:44388/Artikal?idArtikla=${artikal.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
            })
            .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                // Uklonite artikal iz liste nakon što ga uspešno obrišete
                setArtikli((prevArtikli) => prevArtikli.filter((a) => a.id !== artikal.id));
                console.log("Artikal uspešno obrisan.");
              })
              .catch((error) =>{
                console.error("Greška prilikom brisanja artikla:", error);
              });
        }
    };

    const handleChange=(e)=>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(()=> {
        fetch("https://localhost:44388/Artikal", {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            },
            mode: "cors",
        })
          // getAllArtikle()
            .then((response)=> response.json())
            .then((data)=> {
                setArtikli(data);
                console.log(data);
            })
            .catch((error)=>{
                console.error("Greška prilikom dohvatanja artikala:", error);
            });
        // setArtikli(getAllArtikle());
    }, []);

    const handleSubmit=(e)=>{
        e.preventDefault();
        //dalje ide lgika za slanje
        const formDataToSend={
            prodavacId: formRef.current.prodavacId.value,
            naziv: formRef.current.naziv.value,
            cena:formRef.current.cena.value,
            kolicina:formRef.current.kolicina.value,
            opis:formRef.current.opis.value,
            slika:formRef.current.slika.value,
        };

        fetch("https://localhost:44388/Artikal", {
            method: "POST",
            body: JSON.stringify(formDataToSend),
            headers:{
                "Content-Type": "application/json",
            },
            mode: "cors",
        })
            .then((response)=> response.json())
            .then((data)=> {
                console.log("Podaci su uspesno poslati na server:", data);
            })
            .catch((error)=> {
                console.error("Greska prilikom slanja na server:", error);
            });
    };

    return (
        <div>
          <h1>Dodavanje artikla</h1>
          {showUpdateForm ? (
            <form onSubmit={handleUpdate} ref={formRef}>
              <label hidden>
                ProdavacId:
                <input
                  type="number"
                  name="prodavacId"
                  value={formData.prodavacId}
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Naziv:
                <input
                  type="text"
                  name="naziv"
                  value={formData.naziv} // Dodali smo vrednost iz formData za polje "naziv"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Cena:
                <input
                  type="number"
                  name="cena"
                  value={formData.cena} // Dodali smo vrednost iz formData za polje "cena"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Kolicina:
                <input
                  type="number"
                  name="kolicina"
                  value={formData.kolicina} // Dodali smo vrednost iz formData za polje "kolicina"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Opis:
                <input
                  type="text"
                  name="opis"
                  value={formData.opis} // Dodali smo vrednost iz formData za polje "opis"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Slika:
                <input
                  type="text"
                  name="slika"
                  value={formData.slika} // Dodali smo vrednost iz formData za polje "slika"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <button type="submit">Sačuvaj ažuriranje</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} ref={formRef}>
              <label hidden>
                ProdavacId:
                <input
                  type="number"
                  name="prodavacId"
                  value={formData.prodavacId}
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Naziv:
                <input
                  type="text"
                  name="naziv"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Cena:
                <input
                  type="number"
                  name="cena"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Kolicina:
                <input
                  type="number"
                  name="kolicina"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Opis:
                <input
                  type="text"
                  name="opis"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <label>
                Slika:
                <input
                  type="text"
                  name="slika"
                  onChange={handleChange}
                />
                <p></p>
              </label>
              <button type="submit">Dodaj artikal</button>
            </form>
          )}
      
          <div>
            <h1>Prikaz svih artikala</h1>
            <table>
              <tr>
                <th style={{ color: "#279980" }}>Naziv</th>
                <th style={{ color: "#279980" }}>Cena</th>
                <th style={{ color: "#279980" }}>Kolicina</th>
                <th style={{ color: "#279980" }}>Opis</th>
                <th style={{ color: "#279980" }}>Slika</th>
              </tr>
              {artikli.map((artikal) => (
                <tr key={artikal.id}>
                  <td>{artikal.naziv}</td>
                  <td>
                    {artikal.cena.toLocaleString("sr-RS", {
                      style: "currency",
                      currency: "RSD",
                    })}
                  </td>
                  <td>{artikal.kolicina}</td>
                  <td>{artikal.opis}</td>
                  <td>
                    <img
                      src={artikal.slika}
                      alt={artikal.naziv}
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        azurirajArtikal(artikal);
                      }}
                    >
                      Azuriraj
                    </button>
                  </td>
                  <td>
                    <button type="button" onClick={() => obrisiArtikal(artikal)}>
                      Obrisi
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      );
};

export default DodavanjeArtikla;