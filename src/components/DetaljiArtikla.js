import React from "react";
import "../App.css"; // Uvezemo CSS fajl sa definisanim klasama

const DetaljiArtikla=({artikal})=>{

    const formatiranaKolicina = artikal.kolicina > 0 ? 'Na stanju' : 'Nema na stanju';
    const klasaZaKolicinu = artikal.kolicina > 0 ? 'na-stanju' : 'nema-na-stanju';

    return (
        <div>
            <h2>{artikal.naziv}</h2>
            <img src={artikal.slika} alt={artikal.naziv} style={{ width: "100px" }} />
            <p className={klasaZaKolicinu}>{formatiranaKolicina}</p>
            <p>Cena: {artikal.cena.toLocaleString("sr-RS", { style: "currency", currency: "RSD" })}</p>
            <p>Opis: {artikal.opis}</p>
        </div>
    );
};

export default DetaljiArtikla;