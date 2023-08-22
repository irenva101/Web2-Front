import React from "react";
import "../../src/Artikli.css";

const Korpa = ({ cartItems, obrisiIzKorpe }) => {
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-message">
        <br />
        <br />
        Korpa je trenutno prazna.
      </div>
    );
  }

  return (
    <div className="cart">
      <h2 className="cart-title">Artikli u korpi:</h2>
      <ul className="cart-items-list">
        {cartItems.map((item, index) => (
          <li key={index} className="cart-item">
            {item.artikal.naziv} (Količina: {item.kolicina}){" "}
            <button
              type="button"
              className="remove-item-button"
              onClick={() => obrisiIzKorpe(item.artikal)}
            >
              Obriši
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Korpa;
