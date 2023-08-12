import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../services/ArtikalService";
import jwtDecode from "jwt-decode";

const Registracija = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [email, setEmail] = useState("");

  //slika
  const [UploadedImage, setUploadedImage] = useState(null);
  const [slikaKorisnika,setSlikaKorisnika]=useState("");
  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setSlikaKorisnika(imageData);
  };

  const [formData, setFormData] = useState({
    KorisnickoIme: "",
    Email: "",
    Lozinka: "",
    Ime: "",
    Prezime: "",
    DatumRodjenja: "2000-01-01",
    Adresa: "",
    TipKorisnika: 0,
    SlikaKorisnika: "",
    Verifikovan: false,
    Postarina: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value); // Ažuriramo email stanje
    }

    const newValue = name === "datumRodjenja" ? new Date(value) : value;
    const newTipKorisnika =
      name === "tipKorisnika" && value === "Prodavac"
        ? 1
        : formData.tipKorisnika;

    setFormData({
      ...formData,
      [name]: newValue,
      tipKorisnika: newTipKorisnika,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      slika: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailData = {
      Receiver: email,
      Subject: "Registracija(WEB2)",
      Body: "Postovani, uskoro cete primiti jos jedan mejl da Vas obavestimo o verifikaciji vaseg naloga.",
    };

    var token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    console.log(decodedToken["Id"]);
    // Ovde možete implementirati logiku za slanje podataka na server ili ih spremanje u lokalno skladište.
    fetch("https://localhost:44388/Korisnik", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        slikaKorisnika: slikaKorisnika,
      }),
      headers: {
        "Content-Type": "application/json",
        
      },
      mode: "cors",
    })
      .then((Response) => Response.json())
      .then((data) => {
        //obrada odgovora servera

        console.log(formData.tipKorisnika);
        if (formData.tipKorisnika === 1) {
          setNotificationMessage(
            "Registracija je uspešno zabeležena. Sačekajte da se obradi. O uspesnoj registraciji bicete obavesteni putem e-mail adrese..."
          );
          setShowNotification(true);

          console.log(emailData);
          //slanje mejla
          fetch("https://localhost:44388/Email/emailService", {
            method: "POST",
            body: JSON.stringify(emailData),
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
          })
            .then((Response) => Response.json())
            .then((data) => {
              console.log("POGODILI BEK.");
            })
            .catch((error) => {
              //obrada greske
              console.log("PUKLI");
              console.log(error);
            });

          // Postavljanje tajmera za skrivanje notifikacije i navigaciju nakon 5 sekundi
          setNotificationVisible(true);
          setTimeout(() => {
            setNotificationVisible(false);
            navigate("/logovanje");
          }, 5000); // 5000 milisekundi = 5 sekundi
        } else {
          navigate("/logovanje");
        }
      })
      .catch((error) => {
        //obrada greske
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Registracija</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="korisnickoIme">Korisničko ime:</label>
        <input
          type="text"
          id="korisnickoIme"
          name="korisnickoIme"
          value={formData.korisnickoIme}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="email">E-mail adresa:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="lozinka">Lozinka:</label>
        <input
          type="password"
          id="lozinka"
          name="lozinka"
          value={formData.lozinka}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="ime">Ime:</label>
        <input
          type="text"
          id="ime"
          name="ime"
          value={formData.ime}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="prezime">Prezime:</label>
        <input
          type="text"
          id="prezime"
          name="prezime"
          value={formData.prezime}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="datumRodjenja">Datum rođenja:</label>
        <input
          type="date"
          id="datumRodjenja"
          name="datumRodjenja"
          value={
            formData.datumRodjenja
              ? formData.datumRodjenja.toISOString().split("T")[0]
              : ""
          }
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="adresa">Adresa:</label>
        <input
          type="text"
          id="adresa"
          name="adresa"
          value={formData.adresa}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="tipKorisnika">Tip korisnika:</label>
        <select
          id="tipKorisnika"
          name="tipKorisnika"
          value={formData.tipKorisnika}
          onChange={handleChange}
          required
        >
          <option value="Kupac">Kupac</option>
          <option value="Prodavac">Prodavac</option>
        </select>
        <br />

        {formData.tipKorisnika === "Prodavac" && (
          <div>
            <label htmlFor="postarina">Postarina:</label>
            <input
              type="number"
              id="postarina"
              name="postarina"
              value={formData.postarina}
              onChange={handleChange}
              required
            />
            <br />
          </div>
        )}

        <label htmlFor="slika">Slika profila:</label>
        <ImageUploader onImageUpload={handleImageUpload} />
        <br />

        <button type="submit">Registruj se</button>
      </form>

      {showNotification && (
        <div className="notification">{notificationMessage}</div>
      )}
    </div>
  );
};

export default Registracija;
