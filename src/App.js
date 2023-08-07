import React from 'react';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import PocetnaStranica from './components/PocetnaStranica';
import Registracija from './components/Registracija';
import Logovanje from './components/Logovanje';
import UlogovanKorisnik from './components/UlogovanKorisnik';
import Profil from './components/Profil';
import PregledArtikala from './components/PregledArtikala';
import PrethodnePorudzbine from './components/PrethodnePorudzbine';
import DodavanjeArtikla from './components/DodavanjeArtikla';
import StarePorudzbine from './components/StarePorudzbine';
import NovePorudzbine from './components/NovePorudzbine';
import Verifikacija from './components/Verifikacija';


const App=()=>{
  return (
    <div>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<PocetnaStranica />} />
          <Route exact path='/pocetna-stranica'  element={<PocetnaStranica/>}/>
          <Route path='/registracija' element={<Registracija/>}/>
          <Route path='/logovanje' element={<Logovanje/>}/>
          <Route path='ulogovan-korisnik' element={<UlogovanKorisnik/>}/>
          <Route path='/ulogovan-korisnik/profil' element={<Profil/>}/>
          <Route path='/ulogovan-korisnik/pregled-artikala' element ={<PregledArtikala/>}/>
          <Route path='/ulogovan-korisnik/prethodne-porudzbine' element={<PrethodnePorudzbine/>}/>
          <Route path='/ulogovan-korisnik/dodaj-artikal' element={<DodavanjeArtikla/>}/>
          <Route path='/ulogovan-korisnik/moje-porudzbine' element={<StarePorudzbine/>}/>
          <Route path='/ulogovan-korisnik/nove-porudzbine' element={<NovePorudzbine/>}/>
          <Route path='/ulogovan-korisnik/verifikacija' element={<Verifikacija/>}/>
          
          
          {/* <PrivateRoute path="/svi-proizvodi" component={SviProizvodi}/> */}
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;
