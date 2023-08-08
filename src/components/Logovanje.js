import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const Logovanje =()=>{
    const navigate=useNavigate();

    const [isLoginFailed, setIsLoginFailed]=useState(false);
    


    const [formData, setFormData] = useState({
        "Username" : "",
        "Lozinka" : ""
    });

    const handleChange = (e) => {
        const { name, value}=e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        fetch('https://localhost:44388/Korisnik/logovanje', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type':'application/json',
            },
            mode:'cors',
        })
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            console.log('Response from server:', data);
            navigate('/ulogovan-korisnik');
            localStorage.setItem("token",data); //pravljenje nove varijable u localStorage-u koja ce da cuva token i zvace se 'token'
        })
        .catch((error)=> {
              console.error("Error occurred:",error);   
        })
    };


    return(
        <div>
            <h1>Logovanje</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="text">Username:</label>
                <input
                    type="username"
                    id="username"
                    name="Username"
                    value={formData.Username}
                    onChange={handleChange}
                    required
                /><br/>

                <label htmlFor="lozinka">Lozinka:</label>
                <input
                    type="password"
                    id="lozinka1"
                    name="Lozinka"
                    value={formData.Lozinka}
                    onChange={handleChange}
                    required
                /><br/>

                <button type="submit">Uloguj se</button>
            </form>
            {isLoginFailed && <p>Neuspesno logovanje. Proverite vase podatke i pokusajte ponovo.</p>}
        </div>
    );
};

export default Logovanje;