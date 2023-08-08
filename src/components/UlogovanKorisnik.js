import { Link } from 'react-router-dom';
import React from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";


const UlogovanKorisnik = () => {
  return (
    <div>
        <h1 style={{ color: "#279980" }}>Pocetna stranica</h1>
        <Link to="/ulogovan-korisnik/profil">Profil</Link>
        <p></p>
        <Link to="/ulogovan-korisnik/pregled-artikala">Nova porudzbina</Link>
        <p></p>
        <Link to="/ulogovan-korisnik/prethodne-porudzbine">Prethodne porudzbine</Link>
        <p></p>
        <Link to="/ulogovan-korisnik/dodaj-artikal">Dodaj artikal</Link>
        <p></p>
        <Link to="/ulogovan-korisnik/moje-porudzbine">Moje porudzbine</Link>
        <p></p>
        <Link to="/ulogovan-korisnik/nove-porudzbine">Nove porudzbine</Link>
        <p></p>
        <Link to="/ulogovan-korisnik/verifikacija">Verifikacija</Link>
        <p></p>
        
        
        
    </div>
        
      
    
  );
};

export default UlogovanKorisnik;