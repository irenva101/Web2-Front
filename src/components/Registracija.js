import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../services/ArtikalService";
import jwtDecode from "jwt-decode";
import { isPast, differenceInYears } from "date-fns";

const Registracija = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isTypingDate, setIsTypingDate] = useState(false);

  //slika
  const [UploadedImage, setUploadedImage] = useState(null);
  const [slikaKorisnika, setSlikaKorisnika] = useState("");
  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setSlikaKorisnika(imageData);
  };

  const handleDateChange = (e) => {
    handleChange(e); // Prvo pozivamo handleChange funkciju da se ažurira formData
    setIsTypingDate(true);
  };

  const handleBlurDate = () => {
    setIsTypingDate(false);
    if (
      formData.datumRodjenja instanceof Date && // Provjerava da li je formData.datumRodjenja instanca Date objekta
      (!isPast(formData.datumRodjenja) || differenceInYears(new Date(), formData.datumRodjenja) < 18)
    ) {
      setIsValid(false);
      setNotificationMessage("Uneli ste neispravan datum rođenja. Morate biti punoletni da biste se registrovali.");
      setShowNotification(true);
    } else {
      setIsValid(true);
    }
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
  
    if (name === "Email") {
      setEmail(value); // Ažuriramo email stanje
    }
  
    let newFormData = { ...formData };
  
    if (name === "TipKorisnika") {
      if (value === "Prodavac") {
        newFormData.TipKorisnika = 1;
      } else if (value === "Kupac") {
        newFormData.TipKorisnika = 0;
        newFormData.Postarina = 0; // Resetujete postarinu kada se promeni tip korisnika
      }
    } else {
      newFormData[name] = name === "datumRodjenja" ? new Date(value) : value;
    }
  
    setFormData(newFormData);
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      SlikaKorisnika: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    const selectedDate = new Date(formData.datumRodjenja);
    const age = differenceInYears(today, selectedDate);

    if (isPast(selectedDate) && age >= 18) {
      // Vaša postojeća logika za slanje forme na server
      setIsValid(true);
    } else {
      setIsValid(false);
      setNotificationMessage(
        "Uneli ste neispravan datum rođenja. Morate biti punoletni da bi mogli da se registrujete."
      );
      setShowNotification(true);
    }

    const emailData = {
      Receiver: email,
      Subject: "Registracija(WEB2)",
      Body: "Postovani, uskoro cete primiti jos jedan mejl da Vas obavestimo o verifikaciji vaseg naloga.",
    };

    if (isValid) {
      console.log(formData);
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

          console.log(formData.TipKorisnika);
          if (formData.TipKorisnika === 1) {
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
    }
  };

  return (
    <div>
      <h1>Registracija</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="korisnickoIme">Korisničko ime:</label>
        <input
          type="text"
          id="korisnickoIme"
          name="KorisnickoIme"
          value={formData.KorisnickoIme}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="email">E-mail adresa:</label>
        <input
          type="email"
          id="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="lozinka">Lozinka:</label>
        <input
          type="password"
          id="lozinka"
          name="Lozinka"
          value={formData.Lozinka}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="ime">Ime:</label>
        <input
          type="text"
          id="ime"
          name="Ime"
          value={formData.Ime}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="prezime">Prezime:</label>
        <input
          type="text"
          id="prezime"
          name="Prezime"
          value={formData.Prezime}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="datumRodjenja">Datum rođenja:</label>
        <input
          type="date"
          id="datumRodjenja"
          name="DatumRodjenja"
          value={
            isTypingDate
              ? formData.DatumRodjenja
              : formData.DatumRodjenja instanceof Date // Provjerava da li je formData.datumRodjenja instanca Date objekta
              ? formData.DatumRodjenja.toISOString().split("T")[0]
              : "2000-01-01" // Defaultni datum ako formData.datumRodjenja nije instanca Date objekta
          }
          onChange={handleDateChange}
          onBlur={handleBlurDate}
          required
        />
        <br />

        <label htmlFor="adresa">Adresa:</label>
        <input
          type="text"
          id="adresa"
          name="Adresa"
          value={formData.Adresa}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="TipKorisnika">Tip korisnika:</label>
        <select
          id="tipKorisnika"
          name="TipKorisnika"
          value={formData.TipKorisnika}
          onChange={handleChange}
          required
        >
          <option value="Kupac">Kupac</option>
          <option value="Prodavac">Prodavac</option>
        </select>
        <br />

        {formData.TipKorisnika === "Prodavac" && (
          <div>
            <label htmlFor="postarina">Postarina:</label>
            <input
              type="number"
              id="postarina"
              name="Postarina"
              value={formData.Postarina}
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
