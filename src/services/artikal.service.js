//import API from "../../src/environment.env" 


export function getAllArtikle() {
    // return fetch("http://localhost:44388/Artikal", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type":"application/json",
    //         },
    //         mode: "cors",
    //     })

    fetch("https://localhost:44388/Artikal", {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            },
            mode: "cors",
        })
          // getAllArtikle()
            .then((response)=> response.json())
            .then((data)=> {
                // setArtikli(data);
                console.log(data);
                return data;
            })
            .catch((error)=>{
                console.error("Greška prilikom dohvatanja artikala:", error);
            });
}

const getArtikl=(id) => {
    
}
