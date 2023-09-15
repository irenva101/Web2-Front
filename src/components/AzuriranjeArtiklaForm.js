import React from "react";
import { useState, useRef } from "react";
import ImageUploader from "../services/ArtikalService";

const AzuriranjeArtiklaForm = ({ trenutniArtikal }) => {
  const formRef = useRef(null);
  const [slikaArtikla, setSlikaArtikla] = useState("");
  const [UploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    prodavacId: 4, //zakucala na prodavac2
    naziv: "",
    cena: 0,
    kolicina: 0,
    opis: "",
    slika: "",
  });
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
    console.log(formDataToUpdate);

    fetch(`https://localhost:44388/Artikal?idArtikla=${formDataToUpdate.id}`,{
        method:"PATCH",
        body: JSON.stringify(formDataToUpdate),
        headers:{
            "Content-Type": "application/json",
        },
        mode:"cors"
    })
    .then((response)=>response.json())
    .then((data)=>{
        console.log("Podaci su uspešno ažurirani na serveru:", data);
    })
    .catch((error) => {
        console.error(
          "Greška prilikom slanja ažuriranih podataka na server:",
          error
        );
    });
  };

  return (
    <div>
      {trenutniArtikal ? (
        <div>
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
        </div>
      ) : (
        <p>Nema trenutnog artikla za ažuriranje.</p>
      )}
    </div>
  );
};
export default AzuriranjeArtiklaForm;
