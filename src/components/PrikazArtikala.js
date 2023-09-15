import React from "react";
import { useState } from "react";
import ImageUploader from "../services/ArtikalService";

const PrikazArtikala = ({ artikli, azurirajTrenutniArtikal }) => {

  const obrisiArtikal = (artikal) => {
    const potvrdiBrisanje = window.confirm(
      "Da li želite da obrišete ovaj artikal?"
    );
    console.log(artikal.id);
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
          } else {
            console.log("Artikal uspešno obrisan.");
          }
        })
        .catch((error) => {
          console.error("Greška prilikom brisanja artikla:", error);
        });
    }
  };
  return (
    <div className="prikaz-artikala-container">
      <table className="artikli-table">
        <thead>
          <tr>
            <th className="table-header">Naziv</th>
            <th className="table-header">Cena</th>
            <th className="table-header">Kolicina</th>
            <th className="table-header">Opis</th>
            <th className="table-header">Slika</th>
          </tr>
        </thead>
        <tbody>
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
                    console.log(artikal);
                    azurirajTrenutniArtikal(artikal);
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
        </tbody>
      </table>
    </div>
  );
};

export default PrikazArtikala;
