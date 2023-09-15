import React, { useEffect, useState } from "react";
import DetaljiArtikla from "./DetaljiArtikla";
import chartSlika from "../images/chart.png";
import Korpa from "./Korpa";
import jwtDecode from "jwt-decode";
import "../../src/Artikli.css";
import PayPalCheckoutButton from "./PaypalCheckoutButton";

const PregledArtikala = () => {
  const [artikli, setArtikli] = useState([]);
  const [selectedArtikal, setSelectedArtikal] = useState(null);

  const [adresa, setAdresa] = useState("");
  const [komentar, setKomentar] = useState("");
  const [cartItems, setCartItems] = useState([]);
  // Globalna promenljiva za ID-jeve artikala
  const [selectedArtikliIds, setSelectedArtikliIds] = useState([]);
  const [kolicina, setKolicina] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [payPal, setPayPal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [ukupanIznos, setUkupanIznos] = useState(0);
  const [temp, setTemp] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("naziv");
  const [sortOrder, setSortOrder] = useState("asc");
  const [korpa, setKorpa] = useState(0);
  const [showPregledPorudzbine, setShowPregledPorudzbine] = useState(false);
  const odabraniArtikli = cartItems.filter((item) => item.kolicina > 0);
  const [prodavci, setProdavci] = useState("");
  //const [ukupanIznosSaPostarinom, setUkupanIznosSaPostarinom] = useState(0);

  const formatiranoVremeIsporuke = (vremePorucivanja) => {
    console.log("VREME PORUCIVANJA: " + vremePorucivanja);
    if (vremePorucivanja) {
      const minutiZaDodati = Math.floor(Math.random() * 100) + 60;
      //console.log("Minuti za dodati: "+minutiZaDodati);
      const novoVreme = new Date(vremePorucivanja);
      novoVreme.setMinutes(vremePorucivanja.getMinutes() + minutiZaDodati);
      console.log("VREME ISPORUKE: " + novoVreme);
      return novoVreme;
    } else {
      return alert("VREME PORUCIVANJA NULL");
    }
  };

  const posaljiPorudzbinuNaServer = () => {
    // Prvo kreiramo objekat koji sadrži sve potrebne informacije za porudžbinu

    console.log("Cart items: " + JSON.stringify(cartItems));
    const newSelectedArtikliIds = [];
    cartItems.forEach((item) => {
      for (let i = 0; i < item.kolicina; i++) {
        newSelectedArtikliIds.push(item.artikal.id);
      }
    });
    setSelectedArtikliIds(newSelectedArtikliIds);

    console.log(newSelectedArtikliIds);
    console.log(artikli);

    const zaSlanje = newSelectedArtikliIds.reduce(
      (selectedArtikli, artikalId) => {
        const artikal = artikli.find((artikal) => artikal.id === artikalId);
        if (artikal) {
          selectedArtikli.push(artikal);
        }
        return selectedArtikli;
      },
      []
    );

    console.log(JSON.stringify(zaSlanje) + "+++++++++++++++++++++++++++++++");

    var token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    console.log(decodedToken["Id"]);
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

    const vremePorucivanja = new Date();
    const vremeIsporuke = formatiranoVremeIsporuke(vremePorucivanja);

    console.log("-----------------VREME PORUCIVANJA: " + vremePorucivanja);
    console.log("-----------------VREME ISPORUKE :" + vremeIsporuke);

    if (orderId != null) {
      console.log("JESMO LI DOBACILI OVDE?");
      setIsPaid(true);
      setPayPal(true);
    }

    const porudzbina = {
      artikli: zaSlanje,
      ukupanIznos: ukupanIznos,
      adresaDostave: adresa,
      komentar: komentar,
      korisnikId: decodedToken["Id"],
      vremePorucivanja: vremePorucivanja,
      vremeIsporuke: vremeIsporuke,
      otkazana: false,
      isPaid: orderId != null ? true : false, // Dodaj isPaid u porudžbinu
      payPal: orderId != null ? true : false, // Dodaj payPal u porudžbinu
      orderId: orderId || "0",
    };

    console.log(JSON.stringify(porudzbina));

    fetch("https://localhost:44388/Porudzbina", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(porudzbina),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        // uspesno poslato serveru
        console.log("Sta saljem:");
        console.log(data);
        alert("Porudžbina je uspešno poslata!");

        setCartItems([]); // Resetujemo korpu nakon što je porudžbina poslata
        setUkupanIznos(0); // Resetujemo ukupan iznos nakon što je porudžbina poslata
        setAdresa(""); // Resetujemo polje za adresu nakon što je porudžbina poslata
        setKomentar(""); // Resetujemo polje za komentar nakon što je porudžbina poslata
      })
      .catch((error) => {
        //greska prilikom slanja na server
        console.error("Greška prilikom slanja porudžbine:", error);
        alert("Došlo je do greške prilikom slanja porudžbine.");
      });

    // Zatim koristimo fetch funkciju za slanje POST zahteva na server
    setTimeout(() => {
      fetch("https://localhost:44388/Artikal/UpdateKolicinu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(zaSlanje),
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          // uspesno poslato serveru
          console.log("Artikli koje saljem za smanjenje kolicine:");

          alert("Uspesno je smanjena kolicina artikala.");
        })
        .catch((error) => {
          //greska prilikom slanja na server
          console.error("Greška prilikom smanjenja kolicine:", error);
        });
    }, 2000);
    //nakon sto sam poslala porudzbinu da smanjim broj artikala
  };

  const handlePayPalClick = () => {
    setIsPaid(true);
    setPayPal(true);
    console.log(
      "JEsmo li upali u ovaj gde gde smo postavili sat paid true i setpaypal true."
    );
  };

  useEffect(() => {
    var token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    //console.log(decodedToken["Id"]);

    fetch("https://localhost:44388/Artikal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((responce) => responce.json())
      .then((data) => {
        //obrada odgovora servera
        console.log(data); //ovde dobijem prodavac Id
        setArtikli(data);
      })
      .catch((error) => {
        //obrada greske
        console.error(
          "Greška prilikom dobavljanja podataka sa servera:",
          error
        );
      });

    //fetch sa dobavljanje svih prodavaca(da bi preko idProdavca dobili postarinu)
    fetch("https://localhost:44388/Prodavac/allProdavci", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("(GET) Svi prodavci:");
        console.log(data);
        setProdavci(data);
      })
      .catch((error) => {
        console.error("Greška prilikom dobavljanja prodavaca:", error);
        alert("Došlo je do greške prilikom dobavljanja prodavaca.");
      });
  }, []); //prazan dependency niz što znači da će se izvršiti samo prilikom prvog renderovanja komponente.

  useEffect(() => {
    if (cartItems.length === 0) {
      setShowPregledPorudzbine(false);
    } else {
      ukupnaPostarina(cartItems);
    }
  }, [cartItems]);

  const filteredArtikli = artikli.filter((artikal) => {
    return artikal.naziv.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const dodajUKorpu = (artikal) => {
    const existingItem = cartItems.find(
      (item) => item.artikal.id === artikal.id
    );
    //console.log("*******" + artikal.id + "**************");
    if (existingItem) {
      if (existingItem.kolicina >= artikal.kolicina) {
        alert("Dostignuta je maksimalna količina za ovaj artikal.");
        return;
      }

      setCartItems(
        cartItems.map((item) =>
          item.artikal.id === artikal.id
            ? { ...item, kolicina: item.kolicina + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { artikal, kolicina: 1, cena: 0 }]);
    }

    setUkupanIznos(ukupanIznos + artikal.cena);
  };

  const obrisiIzKorpe = (artikal) => {
    const existingItem = cartItems.find(
      (item) => item.artikal.id === artikal.id
    );
    if (existingItem) {
      if (existingItem.kolicina === 1) {
        setCartItems(
          cartItems.filter((item) => item.artikal.id !== artikal.id)
        );
      } else {
        setCartItems(
          cartItems.map((item) =>
            item.artikal.id === artikal.id
              ? { ...item, kolicina: item.kolicina - 1 }
              : item
          )
        );
      }

      setUkupanIznos(ukupanIznos - artikal.cena);
    }
  };

  const handlePoruci = () => {
    // Ovde možete implementirati logiku za slanje porudžbine na server, resetovanje korpe, ili nešto drugo što želite
    alert("Porudžbina je uspešno poslata!");
    setIsPaid(false);
    setPayPal(false);
    setCartItems([]);
    setUkupanIznos(0);
  };

  const sortedArtikli = [...filteredArtikli]; // Kreiramo kopiju niza kako bismo sačuvali originalni niz nepromenjen

  if (sortOption === "naziv") {
    // Sortiranje po nazivu (abecedno)
    sortedArtikli.sort((a, b) => a.naziv.localeCompare(b.naziv));
  } else if (sortOption === "cena") {
    // Sortiranje po ceni
    sortedArtikli.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.cena - b.cena; // Sortiranje od najjeftinijeg do najskupljeg
      } else {
        return b.cena - a.cena; // Sortiranje od najskupljeg do najjeftinijeg
      }
    });
  }

  const ukupnaPostarina = (cartItems) => {
    console.log(cartItems);
    //provera ako ima dva artikla od istog Pordavca
    const listaIdjevaProdavaca = [];

    cartItems.forEach((item) => {
      const idProdavca = item.artikal["prodavacID"];

      if (!listaIdjevaProdavaca.includes(idProdavca)) {
        listaIdjevaProdavaca.push(idProdavca);
      }
    });

    let ukupnaPostarina = 0;

    const filtriraniProdavci = prodavci.filter((prodavac) =>
      listaIdjevaProdavaca.includes(prodavac.id)
    );

    filtriraniProdavci.forEach((prodavac) => {
      ukupnaPostarina += prodavac.postarina;
    });

    setTemp(ukupnaPostarina);
  };

  const [hoveredArtikal, setHoveredArtikal] = useState(null);

  const product = {
    description: "nesto",
    price: ukupanIznos+temp,
  };

  return (
    <div>
      <div className="cart-icon">
        <img src={chartSlika} alt="Korpa" className="cart-icon-image" />
        <span className="cart-count">{korpa}</span>
      </div>

      <h1 className="page-title">Dostupni artikli</h1>
      <div className="search-and-sort">
        <input
          type="text"
          placeholder="Unesite naziv artikla za pretragu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="naziv">Sortiraj po nazivu</option>
          <option value="cena">Sortiraj po ceni</option>
        </select>
        <button
          className="sort-order-button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc"
            ? "Sortiraj po ceni (rastuce)"
            : "Sortiraj po ceni (opadajuce)"}
        </button>
      </div>

      <table className="artikli-table">
        <thead>
          <tr>
            <th className="table-header">Naziv</th>
            <th className="table-header">Slika</th>
            <th className="table-header">Količina</th>
            <th className="table-header">Cena</th>
          </tr>
        </thead>
        <tbody>
          {sortedArtikli.map((artikal) => (
            <tr
              key={artikal.id}
              className={`artikal-row ${
                hoveredArtikal === artikal.id ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredArtikal(artikal.id)}
              onMouseLeave={() => setHoveredArtikal(null)}
            >
              <td>{artikal.naziv}</td>
              <td>
                <img
                  src={artikal.slikaArtikla}
                  alt={artikal.naziv}
                  className="artikal-image"
                />
              </td>
              <td
                className={`kolicina-cell ${
                  artikal.kolicina > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                {artikal.kolicina > 0 ? "Na stanju" : "Nema na stanju"}
              </td>
              <td>
                {artikal.cena.toLocaleString("sr-RS", {
                  style: "currency",
                  currency: "RSD",
                })}
              </td>
              <td>
                <button
                  type="button"
                  className="detalji-button"
                  onClick={() => {
                    setSelectedArtikal(artikal);
                  }}
                >
                  Detalji
                </button>
              </td>
              <td>
                <button type="button" onClick={() => dodajUKorpu(artikal)}>
                  Dodaj u korpu
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedArtikal && <DetaljiArtikla artikal={selectedArtikal} />}
      <div className="cart-and-order">
        <Korpa cartItems={cartItems} obrisiIzKorpe={obrisiIzKorpe} />

        <div className="order-summary">
          {/* ...ostatak JSX koda... */}
          <div className="order-summary-section">
            <h2 className="order-summary-title">Iznos bez troskova dostave:</h2>{" "}
            <h2 className="order-summary-amount">
              {ukupanIznos.toLocaleString("sr-RS", {
                style: "currency",
                currency: "RSD",
              })}
            </h2>
            {cartItems.length > 0 && (
              <button
                className="pregled-porudzbine-button"
                onClick={() => setShowPregledPorudzbine(true)}
              >
                Pregled porudzbine
              </button>
            )}
          </div>
          {showPregledPorudzbine && cartItems.length > 0 && (
            <div className="order-details">
              <h2>Artikli u korpi:</h2>
              <ul className="order-details-list">
                {cartItems.map((item, index) => (
                  <li key={index}>
                    {item.artikal.naziv} (Količina: {item.kolicina})
                  </li>
                ))}
              </ul>

              <div className="order-details-inputs">
                <label htmlFor="adresa">Adresa:</label>
                <input
                  id="adresa"
                  value={adresa}
                  onChange={(e) => setAdresa(e.target.value)}
                />
              </div>
              <div className="order-details-inputs">
                <label htmlFor="komentar">Komentar:</label>
                <textarea
                  id="komentar"
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                />
                <br />
                <h2 style={{ color: "#279980" }}>
                  Ukupan iznos(sa postarinom):
                </h2>
                <h2>
                  {(ukupanIznos + temp).toLocaleString("sr-RS", {
                    style: "currency",
                    currency: "RSD",
                  })}
                </h2>
              </div>
              <br />

              <div className="paypal-button-container">
                <PayPalCheckoutButton
                  product={product}
                  setOrderId={setOrderId}
                />
              </div>

              <br />

              <br />

              <button
                className="poruci-button"
                onClick={() => posaljiPorudzbinuNaServer()}
              >
                Poruči
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PregledArtikala;
