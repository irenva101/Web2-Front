import React from "react";
import "../App.css"; // Uvezemo CSS fajl sa definisanim klasama
import "../../src/Artikli.css";

const DetaljiArtikla=({artikal})=>{

    const formatiranaKolicina = artikal.kolicina > 0 ? 'Na stanju' : 'Nema na stanju';
    const klasaZaKolicinu = artikal.kolicina > 0 ? 'na-stanju' : 'nema-na-stanju';

    return (
        <div className="detalji-artikla">
            <h2 className="artikal-naziv">{artikal.naziv}</h2>
            <img src={artikal.slika} alt={artikal.naziv} className="artikal-slika" />
            <p className={`artikal-kolicina ${klasaZaKolicinu}`}>{formatiranaKolicina}</p>
            <p className="artikal-cena">Cena: {artikal.cena.toLocaleString("sr-RS", { style: "currency", currency: "RSD" })}</p>
            <p className="artikal-opis">Opis: {artikal.opis}</p>
        </div>
    );
};

export default DetaljiArtikla;