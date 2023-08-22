import React, { useRef, useState, useEffect } from "react";
import ImageUploader from "../services/ArtikalService";
import { json } from "react-router-dom";
import "../../src/Artikli.css";
import jwtDecode from "jwt-decode";

const DodavanjeArtikla = () => {
  const formRef = useRef(null);
  const [artikli, setArtikli] = useState([]);
  const [trenutniArtikal, setTrenutniArtikal] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [slikaArtikla, setSlikaArtikla] = useState("");
  const [UploadedImage, setUploadedImage] = useState(null);

  const azurirajArtikal = (artikal) => {
    setTrenutniArtikal(artikal);
    setShowUpdateForm(true);
  };

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setSlikaArtikla(imageData);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Logika za slanje ažuriranih podataka na server
    const formDataToUpdate = {
      id: trenutniArtikal.id, // Pretpostavka da artikal ima svoj ID
      prodavacId: formRef.current.prodavacId.value,
      naziv: formRef.current.naziv.value,
      cena: formRef.current.cena.value,
      kolicina: formRef.current.kolicina.value,
      opis: formRef.current.opis.value,
      slika: slikaArtikla,
    };

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
        console.error(
          "Greška prilikom slanja ažuriranih podataka na server:",
          error
        );
      });
  };

  useEffect(() => {
    if (trenutniArtikal) {
      setFormData({
        prodavacId: trenutniArtikal.prodavacId,
        naziv: trenutniArtikal.naziv,
        cena: trenutniArtikal.cena,
        kolicina: trenutniArtikal.kolicina,
        opis: trenutniArtikal.opis,
        slika: trenutniArtikal.slika,
      });
    }
  }, [trenutniArtikal]);

  const [formData, setFormData] = useState({
    prodavacId: 4, //zakucala na prodavac2
    naziv: "string",
    cena: 0,
    kolicina: 0,
    opis: "string",
    slika: "string",
  });

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      slika: e.target.files[0],
    });
  };

  const obrisiArtikal = (artikal) => {
    console.log("stigli smo dovde ale");
    const potvrdiBrisanje = window.confirm(
      "Da li želite da obrišete ovaj artikal?"
    );
    if (potvrdiBrisanje) {
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
          setArtikli((prevArtikli) =>
            prevArtikli.filter((a) => a.id !== artikal.id)
          );
          console.log("Artikal uspešno obrisan.");
        })
        .catch((error) => {
          console.error("Greška prilikom brisanja artikla:", error);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    var token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    console.log(decodedToken["Id"]);

    fetch(
      `https://localhost:44388/Artikal/idKorisnika?idKorisnika=${decodedToken["Id"]}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setArtikli(data);
        console.log(JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Greška prilikom dohvatanja artikala:", error);
      });
    // setArtikli(getAllArtikle());
  }, []);

  const handleSubmit = (e) => {
    var token = localStorage.getItem("token");

    if (!token) {
      console.error("Token nije prisutan u localStorage-u.");
      return; // Ovde možete izvršiti odgovarajuće akcije ukoliko token nije prisutan.
    }

    // Pretpostavićemo da se JWT token sastoji iz tri dela (header, payload, signature) razdvojenih tačkom.
    var tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.error("Neispravan format tokena.");

      return; // Ovde možete izvršiti odgovarajuće akcije ukoliko format nije ispravan.
    }

    e.preventDefault();
    //dalje ide lgika za slanje
    const formDataToSend = {
      prodavacId: formRef.current.prodavacId.value,
      naziv: formRef.current.naziv.value,
      cena: formRef.current.cena.value,
      kolicina: formRef.current.kolicina.value,
      opis: formRef.current.opis.value,
      slika: slikaArtikla,
    };

    fetch("https://localhost:44388/Artikal", {
      method: "POST",
      body: JSON.stringify(formDataToSend),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Podaci su uspesno poslati na server:", data);
      })
      .catch((error) => {
        console.error("Greska prilikom slanja na server:", error);
      });
  };

  return (
    <div className="dodavanje-artikla-container">
      <h1 className="page-title">Dodavanje artikla</h1>
      {showUpdateForm ? (
        <form onSubmit={handleUpdate} ref={formRef} className="artikal-form">
          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
            <label htmlFor="slika">Slika:</label>
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>

          <button type="submit" className="submit-button">
            Sačuvaj ažuriranje
          </button>
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
            <input type="text" name="naziv" onChange={handleChange} />
            <p></p>
          </label>
          <label>
            Cena:
            <input type="number" name="cena" onChange={handleChange} />
            <p></p>
          </label>
          <label>
            Kolicina:
            <input type="number" name="kolicina" onChange={handleChange} />
            <p></p>
          </label>
          <label>
            Opis:
            <input type="text" name="opis" onChange={handleChange} />
            <p></p>
          </label>
          <label htmlFor="slika">Slika:</label>
          <ImageUploader onImageUpload={handleImageUpload} />
          <button type="submit">Dodaj artikal</button>
        </form>
      )}

      <div className="prikaz-artikala-container">
        <h1 className="page-title">Prikaz svih artikala</h1>
        <table className="artikli-table">
          <tr>
            <th className="table-header">Naziv</th>
            <th className="table-header">Cena</th>
            <th className="table-header">Kolicina</th>
            <th className="table-header">Opis</th>
            <th className="table-header">Slika</th>
          </tr>
          {artikli.map((artikal) => (
            <tr key={artikal.id} className="artikal-row">
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
                  alt="Uploaded"
                  className="artikal-image"
                />
              </td>
              <td>
                <button
                  type="button"
                  className="detalji-button"
                  onClick={() => {
                    azurirajArtikal(artikal);
                  }}
                >
                  Azuriraj
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="detalji-button obrisi-button"
                  onClick={() => obrisiArtikal(artikal)}
                >
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
