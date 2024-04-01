import { component$, useStore, useTask$, useVisibleTask$, $, useSignal } from '@builder.io/qwik';
import { Photo } from '~/models/photo';
import { getAllPhotos, addPhoto, updatePhoto, deletePhotobyId, getAlbumPhotos, getAuthorPhotos } from '~/utils/users-provider';

export const UsersList = component$(() => {

    const store = useStore<{ photos: Photo[]}>({
        photos: []
    })

    const form = useStore({
        id: '',
        urlFoto: '',
        desFoto: '',
        idAutor: '',
        idAlbum: ''
    })

    const addOrModify = useSignal("Añadir")

    const oldId = useSignal("")

    const filtering = useSignal("All")

    useTask$(async () =>{
        console.log("Desde useTask")
        
    })

    useVisibleTask$(async () => {
        console.log("Desde useVisibleTask")
        store.photos = await getAllPhotos()
    })

    const handleSubmit = $(async (event) => {
        event.preventDefault() // evita el comportamiento por defecto
        if (addOrModify.value === 'Añadir') {
            await addPhoto(form)
        } else {
            await updatePhoto(oldId.value, form)
            addOrModify.value = "Añadir"
        }
        
    })

    const handleInputChange = $((event: any) => {
        const target = event.target as HTMLInputElement
        form[target.name] = target.value
    })

    const copyForm = $((photo: Photo) => {
        form.id = photo._id
        form.urlFoto = photo.urlFoto
        form.desFoto = photo.desFoto
        form.idAutor = photo.idAutor
        form.idAlbum = photo.idAlbum
    })

    const cleanForm = $(() => {
        form.id = ""
        form.urlFoto = ""
        form.desFoto = ""
        form.idAutor = ""
        form.idAlbum = ""
    })

    const changeBG = $((url: string) => {
        const bg = document.getElementById("background");
        bg.style.backgroundImage='url('+url+')';
    })
    const resetBG = $(() => {
        const bg = document.getElementById("background");
        bg.style.backgroundImage='url(/img/background.jpg)';
    })
    const deletePhoto = $(async (id: string) => {
        await deletePhotobyId(id)
        store.photos = await getAllPhotos()
    })

    return (
        <div class="flex w-full justify-center">
        <div>
        <div class="px-6 py-4 bg-alanturing-100 rounded-xl" style="opacity:0.8;">
            <table class="border-separate border-spacing-2">
                <thead>
                    <tr>
                        <th class="title">Id</th>
                        <th class="title">Url</th>
                        <th class="title">Descripción</th>
                        <th class="title">Autor</th>
                        <th class="title">Album</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    
                    {store.photos.map((photo) => (
                    <tr key={photo._id}>
                        <td>{photo._id}</td>
                        <td style="cursor:pointer;" onClick$={() => changeBG(photo.urlFoto)}>{photo.urlFoto}</td>
                        <td>{photo.desFoto}</td>
                        <td>{photo.idAutor}</td>
                        <td>{photo.idAlbum}</td>
                        <td>
                            <button
                                class="bg-red-600"
                                onClick$={() => deletePhoto(photo._id)}>
                                <i class="fa-solid fa-trash"></i>
                                Borrar
                            </button>
                        </td>
                        <td>
                            <button
                                class="bg-orange-600"
                                onClick$={() => {
                                    addOrModify.value = 'Modificar';
                                    oldId.value = photo._id;
                                    copyForm(photo);
                            }}>
                                <i class="fa-solid fa-pencil"></i>
                                Modificar
                            </button>
                        </td>
                    </tr>
                    ))}
                    <tr></tr>
                    <tr>
                        <form onSubmit$={handleSubmit}>
                            <td>
                                <input 
                                name='id' 
                                type="text" 
                                value={form.id} 
                                onInput$={handleInputChange}/>
                            </td>
                            <td>
                                <input 
                                name='urlFoto' 
                                type="text"
                                size="32" 
                                value={form.urlFoto} 
                                onInput$={handleInputChange}/>
                            </td>
                            <td>
                                <input
                                name='desFoto' 
                                type="text" 
                                value={form.desFoto} 
                                onInput$={handleInputChange}/>
                            </td>
                            <td>
                                <input 
                                name='idAutor' 
                                type="text" 
                                value={form.idAutor} 
                                onInput$={handleInputChange}/>
                            </td>
                            <td>
                                <input 
                                name='idAlbum' 
                                type="text" 
                                value={form.idAlbum} 
                                onInput$={handleInputChange}/>
                            </td>
                            <td>
                                <button
                                    class="bg-green-600"
                                    type='submit'>
                                    <i class="fa-solid fa-check"></i>
                                    Aceptar
                                </button>
                            </td>
                            <td>
                                <span
                                    class="button bg-red-600"
                                    style={`visibility: ${addOrModify.value === 'Añadir' ? 'hidden' : 'visible'}`}
                                    onClick$={() => {addOrModify.value = "Añadir"; cleanForm();}}>
                                    <i class="fa-solid fa-x"></i>
                                    Cancelar
                                </span>
                            </td>
                        </form>
                    </tr>
                </tbody>
            </table>
        </div>

        <button
          class={filtering.value === 'All' ? 'buttonHL' : 'button'}
          onClick$={
            async () => { filtering.value = 'All'; resetBG(); store.photos = await getAllPhotos()}
          }>
          <i class="fa-regular fa-images"></i>
          Todas las Fotos
        </button>
        <label for="album" style="color:white;"><b>Elige un album:</b></label>
        <select name="album" id="album">
            <option value="Objetos de la oficina">Objetos de la oficina</option>
            <option value="Personas posando en la foto">Personas posando en la foto</option>
            <option value="Objetos comunes">Objetos comunes</option>
            <option value="Paisajes naturales">Paisajes naturales</option>
        </select>
        <button
          class={filtering.value === 'Album' ? 'buttonHL' : 'button'}
          onClick$={
            async () => { const queAlbum = document.getElementById("album");filtering.value = 'Album'; store.photos = await getAlbumPhotos(queAlbum.value)}
          }>
          <i class="fa-regular fa-image"></i>
          Album
        </button>
        <label for="author" style="color:white;"><b>Elige un autor:</b></label>
        <select name="author" id="author">
            <option value="Alejandro Escamilla">Alejandro Escamilla</option>
            <option value="Paul Jarvis">Paul Jarvis</option>
            <option value="Jerry Adney">Jerry Adney</option>
            <option value="Go Wild">Go Wild</option>
            <option value="Vadim Sherbakov">Vadim Sherbakov</option>
            <option value="Shyamanta Baruah">Shyamanta Baruah</option>
            <option value="Yoni Kaplan-Nadel">Yoni Kaplan-Nadel</option>
            <option value="Alexander Shustov">Alexander Shustov</option>
            <option value="How-Soon Ngu">How-Soon Ngu</option>
        </select>
        <button
          class={filtering.value === 'Author' ? 'buttonHL' : 'button'}
          onClick$={
            async () => { const queAutor = document.getElementById("author");filtering.value = 'Author'; store.photos = await getAuthorPhotos(queAutor.value)}
          }>
          <i class="fa-regular fa-user"></i>
          Autor
        </button>
        </div>
      </div>)
});