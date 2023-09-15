import React, { useRef, useState, useEffect } from "react";
import ImageUploader from "../services/ArtikalService";
import { json } from "react-router-dom";
import "../../src/Artikli.css";
import jwtDecode from "jwt-decode";
import PrikazArtikala from "./PrikazArtikala";
import DodavanjeArtiklaForm from "./DodavanjeArtiklaForm";
import AzuriranjeArtiklaForm from "./AzuriranjeArtiklaForm";

const DodavanjeArtikla = () => {
  const [artikli, setArtikli] = useState([]);
  const [trenutniArtikal, setTrenutniArtikal] = useState(null);

  const azurirajTrenutniArtikal = (artikal) => {
    setTrenutniArtikal(artikal);
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
        console.log("JESMO LI STIGLI OVDE");
        console.log(artikli);
      })
      .catch((error) => {
        console.error("Greška prilikom dohvatanja artikala:", error);
      });
  }, []);

  return (
    <div className="dodavanje-artikla-container">
      <h1 className="page-title">Prikaz artikala</h1>
      <PrikazArtikala artikli={artikli} azurirajTrenutniArtikal={azurirajTrenutniArtikal} />
      <h1 className="page-title">Dodavanje artikla</h1>
      <DodavanjeArtiklaForm />
      <h1 className="page-title">Azuriranje artikla</h1>
      <AzuriranjeArtiklaForm trenutniArtikal={trenutniArtikal} />
    </div>
  );
};

export default DodavanjeArtikla;
