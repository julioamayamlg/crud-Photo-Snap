from fastapi import FastAPI, HTTPException

# Pydantic es una librería para validar los datos.
# BaseModel sirve para definir clases para crear los modelos de datos que se van a usar en la API.
from pydantic import BaseModel, Field
from bson import ObjectId                                   # Necesario para _id
from typing import Optional, List                           # Necesario para _id
from typing_extensions import Annotated                     # Necesario para _id
from pydantic.functional_validators import BeforeValidator  # Necesario para _id
# Motor es una versión asíncrona de PyMongo,
# la biblioteca estándar de Python para trabajar con MongoDB.
import motor.motor_asyncio

# Para aceptar peticiones de diferentes dominios.
from fastapi.middleware.cors import CORSMiddleware

# Define el modelo de datos para un usuario utilizando Pydantic.
# Esto ayuda a FastAPI a validar los tipos de datos entrantes.
PyObjectId = Annotated[str, BeforeValidator(str)]           # Necesario para _id
class Foto(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    urlFoto: str
    desFoto: str
    idAutor: str
    idAlbum: str

# Crea la instancia de la aplicación FastAPI
app = FastAPI()

# Lista de origenes permitidos.
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Método permitidos
    allow_headers=["*"], # Cabeceras permitidas
)

# Cadena de conexión a MongoDB con autenticación
MONGODB_URL = "mongodb://admin:123@mongodb:27017/?authSource=admin"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.fotos

# Endpoint para listar todos las fotos.
@app.get("/photos/", response_description="Lista todos las fotos", response_model=List[Foto])
async def list_photos():
    fotos = await db["foto"].find().to_list(1000)
    return fotos

# Endpoint para listar todos las fotos de un album.
@app.get("/album/{album}", response_description="Lista todos las fotos de un album", response_model=List[Foto])
async def list_album_photos(album: str):
    fotos = await db["foto"].find({"idAlbum": album}).to_list(1000)
    return fotos

# Endpoint para listar todos las fotos de un autor.
@app.get("/author/{author}", response_description="Lista todos las fotos de un autor", response_model=List[Foto])
async def list_author_photos(author: str):
    fotos = await db["foto"].find({"idAutor": author}).to_list(1000)
    return fotos

# Endpoint para crear un nuevo foto
@app.post("/photos/", response_description="Añade una nueva foto", response_model=Foto) 
async def create_photo(foto: Foto):
    foto_dict = foto.dict()
    await db["foto"].insert_one(foto_dict)
    return foto

# Endpoint para obtener una foto específica por ID.
@app.get("/photos/{id}", response_description="Obtiene una foto", response_model=Foto)
async def find_photo(id: str):
    user = await db["foto"].find_one({"_id": ObjectId(id)})
    if user is not None:
        return user
    raise HTTPException(status_code=404, detail=f"Foto con id {id} no encontrada.")

# Endpoint para borrar una foto especifica por ID.
@app.delete("/photos/{id}", response_description="Borra una foto", status_code=204)
async def delete_photo(id: str):
    delete_result = await db["foto"].delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Foto con id {id} no encontrada.")

# Endpoint para actualizar una foto especifico por ID.
@app.put("/photos/{id}", response_description="Actualiza una foto por ID", status_code=204)
async def update_photo(id: str, foto: Foto):
    foto_dict = foto.dict()
    await db["foto"].update_one({"_id": ObjectId(id)}, {"$set": foto_dict})
    return foto
