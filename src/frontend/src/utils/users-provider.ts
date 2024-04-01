// Funciones de acceso a la API de usuarios.

import { Photo } from "~/models/photo"

// Obtiene todos las Fotos
export const getAllPhotos = async (): Promise<Photo[]>  => {
    try {
        const response = await fetch('http://localhost:8000/photos/')
        const photos = response.json()
        return photos
    } catch (error) {
        console.error(error)
    }

    return <Photo[]><unknown>null
}

// Añade una foto.
export const addPhoto = async (photo: Photo)  => {
    try {
        await fetch('http://localhost:8000/photos/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(photo),
        })
        
    } catch (error) {
        console.error(error)
    }
}

// Modifica una foto.
export const updatePhoto = async (id: string, photo: Photo)  => {
    try {
        await fetch(`http://localhost:8000/photos/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(photo),
        })
        
    } catch (error) {
        console.error(error)
    }
}


// Elimina un usuario.
export const deletePhotobyId = async (id: string)  => {
    try {
        await fetch(`http://localhost:8000/photos/${id}`,
        {
            method: 'DELETE',
        })
    } catch (error) {
        console.error(error)
    }
}

// Obtiene todos las Fotos de un album
export const getAlbumPhotos = async (album: string): Promise<Photo[]>  => {
    try {
        const response = await fetch(`http://localhost:8000/album/${album}`)
        const photos = response.json()
        return photos
    } catch (error) {
        console.error(error)
    }

    return <Photo[]><unknown>null
}

// Obtiene todos las Fotos de un autor
export const getAuthorPhotos = async (author: string): Promise<Photo[]>  => {
    try {
        const response = await fetch(`http://localhost:8000/author/${author}`)
        const photos = response.json()
        return photos
    } catch (error) {
        console.error(error)
    }

    return <Photo[]><unknown>null
}