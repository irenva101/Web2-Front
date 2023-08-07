import React from "react";

const Korpa = ({ cartItems, obrisiIzKorpe }) => {
    if (cartItems.length === 0) {
      return <div style={{color: "#279980"}}><br/><br/>Korpa je trenutno prazna.</div>;
    }
  
    return (
        <div>
          <h2 style={{color: "#279980"}}>Artikli u korpi:</h2>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.artikal.naziv} (Količina: {item.kolicina}){" "}
                <button type="button" onClick={() => obrisiIzKorpe(item.artikal)}>
                  Obriši
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    };
   

export default Korpa;