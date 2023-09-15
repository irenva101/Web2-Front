import React from "react";
import { useState, useRef } from "react";
import ImageUploader from "../services/ArtikalService";
import "../../src/Artikli.css";
import jwtDecode from "jwt-decode";

const DodavanjeArtiklaForm = () => {
  const formRef = useRef(null);
  const [slikaArtikla, setSlikaArtikla] = useState("");
  const [UploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    prodavacId: 4, //zakucala na prodavac2
    naziv: "string",
    cena: 0,
    kolicina: 0,
    opis: "string",
    slika: "string",
  });

  const handleSubmit = (e) => {
    //post zahtev na bek
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
    const decodedToken = jwtDecode(token);
    console.log(decodedToken["Id"]);
    //dalje ide lgika za slanje
    const formDataToSend = {
      prodavacId: decodedToken["Id"],//zapravo salje IdKorisnika
      naziv: formRef.current.naziv.value,
      cena: formRef.current.cena.value,
      kolicina: formRef.current.kolicina.value,
      opis: formRef.current.opis.value,
      slika: slikaArtikla,
    };

    console.log(JSON.stringify(formDataToSend));

    fetch("https://localhost:44388/Artikal", {
      method: "POST",
      body: JSON.stringify(formDataToSend),
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setSlikaArtikla(imageData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} ref={formRef}>
        <label hidden>
          ProdavacId:
          <input
            type="number"
            name="prodavacId"
            value={formData.prodavacId}
            onChange={handleChange}
          />
          <br />
        </label>

        <label>Naziv:</label>
        <input type="text" name="naziv" onChange={handleChange} />
        <br />

        <label>Cena:</label>
        <input type="number" name="cena" onChange={handleChange} />
        <br />

        <label>Kolicina:</label>
        <input type="number" name="kolicina" onChange={handleChange} />
        <br />

        <label>Opis:</label>
        <input type="text" name="opis" onChange={handleChange} />
        <br />

        <label htmlFor="slika">Slika:</label>
        <ImageUploader onImageUpload={handleImageUpload} />
        <br />
        <button type="submit">Dodaj artikal</button>
      </form>
    </div>
  );
};
export default DodavanjeArtiklaForm;
