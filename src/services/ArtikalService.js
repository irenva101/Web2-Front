import React,{useState} from "react";

function ImageUploader({ onImageUpload}){
    const [selectedImage, setSelectedImage]=useState(null);

    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(file){
            const reader=new FileReader();
            reader.onload=(event)=>{
                setSelectedImage(event.target.result);
                onImageUpload(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange}/>
            {selectedImage && <img src={selectedImage} alt="Uploaded"/>}
        </div>
    );
};

export default ImageUploader;