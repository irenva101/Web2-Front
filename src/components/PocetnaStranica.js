import React from "react";
import {Link} from 'react-router-dom';

function PocetnaStranica(){
    return (
        <div>
            <h1>Dobrodosli u online prodavnicu</h1>
            <Link to="/registracija">Registracija</Link>
            <p></p>
            <Link to="/logovanje">Login</Link>
        </div>
    )
}

export default PocetnaStranica;