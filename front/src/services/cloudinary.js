import { useState } from 'react';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dkhznoxbv/image/upload';

//MANEJAR ESTADOS DESDE ACA

export const UploadImage = async (e) => {
    e.preventDefault();

    let file = null;

    try { file = e.dataTransfer.files?.[0]; }
    catch { file = e.target.files?.[0]; }

    if (!file) return;
    const formDataImg = new FormData();
    formDataImg.append('file', file);
    formDataImg.append('upload_preset', 'unsigned_preset');

    try {
        const res = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formDataImg,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Error upload');
        console.log('URL DE LA IMAGEN CARGADA:', data.secure_url);

        setFormData(prev => ({ ...prev, url_imagen: data.secure_url }));
        setImagePreview(data.secure_url);
    } catch (err) {
        console.error('Error uploading image', err);
    }
};

