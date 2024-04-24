# Mimir-API

This project is for a type of ERP, or resource management in computing specifically. The principal object is providing a tool that manage users, computers, monitors, and periodically changes of computers.

## env

```env
PORT=3000

MONGO_URL=mongodb://rendasluire:123456789@localhost:27017
MONGO_USER=rendasluire
MONGO_PASS=123456789
MONGO_DB_NAME=TI
```

## EndPoints

### Device

---

#### List all devices

**GET** /api/device?page=1&limit=10
This endpoint response an array with all devices on database.

##### Request

```JSON
headers: {
 "Authorization": "TOKEN"
}
```

##### Response <span style="color:green">200</span>

```JSON
{
 "data": [
  {
   "annexed": {
    "id": "Sin asignar",
   "number": "Sin asignar",
   "endDate": "2025-04-24T20:48:35.115Z"
   },
   "user": {
    "id": "Sin asignar",
   "name": "Sin asignar"
   },
   "departament": {
    "id": "Sin asignar",
   "name": "Sin asignar"
   },
   "monitor": {
    "id": "Sin asignar",
   "serialNumber": "Sin asignar"
   },
   "_id": "6629713918cc2d90bfa479d2",
   "brand": "HP",
   "model": "Cerebro de la nasa",
   "serialNumber": "0000000000",
   "hostname": "MV-0000000000",
   "details": "",
   "status": "Activo",
   "ubication": "",
   "type": "computer",
   "ip": "",
   "custom": false,
   "bussinesUnit": "",
   "headphones": false,
   "adaptVGA": false,
   "mouse": false,
   "__v": 0
   },
   {
   "annexed": {
    "id": "Sin asignar",
   "number": "Sin asignar",
   "endDate": "2025-04-24T20:59:30.193Z"
   },
   "user": {
    "id": "Sin asignar",
   "name": "Sin asignar"
   },
   "departament": {
    "id": "Sin asignar",
   "name": "Sin asignar"
   },
   "monitor": {
    "id": "Sin asignar",
   "serialNumber": "Sin asignar"
   },
   "_id": "662974c225b152bc07c43444",
   "brand": "HP",
   "model": "Cerebro de la nasa",
   "serialNumber": "0000000001",
   "hostname": "MV-0000000001",
   "details": "",
   "status": "Activo",
   "ubication": "",
   "type": "computer",
   "ip": "",
   "custom": false,
   "bussinesUnit": "",
   "headphones": false,
   "adaptVGA": false,
   "mouse": false,
   "__v": 0
   },
   {
   "annexed": {
    "id": "Sin asignar",
   "number": "Sin asignar",
   "endDate": "2025-04-24T21:09:10.149Z"
   },
   "user": {
    "id": "Sin asignar",
   "name": "Sin asignar"
   },
   "departament": {
    "id": "Sin asignar",
   "name": "Sin asignar"
   },
   "monitor": {
    "id": "Sin asignar",
   "serialNumber": "Sin asignar"
   },
   "_id": "662974fc89199ed62b53b4fc",
   "brand": "HP",
   "model": "Cerebro de la nasa",
   "serialNumber": "0000000002",
   "hostname": "MV-0000000002",
   "details": "",
   "status": "Activo",
   "ubication": "",
   "type": "computer",
   "ip": "",
   "custom": false,
   "bussinesUnit": "",
   "headphones": false,
   "adaptVGA": false,
   "mouse": false,
   "__v": 0
   }
	],
	"pagination": {
  "totalItems": 3,
 "totalPages": 1,
 "currentPage": 1
	},
	"message": "Lista de dispositivos registrados."
}
```

##### Response <span style="color:green">204</span>

```JSON
{
 "data": [],
 "message": "No hay dispositivos para mostrar."
}
```

---
#### Show a device

**GET** /api/device/:id
This endpoint response with only a object.

##### Request

```JSON
 headers: {
 "Authorization": "TOKEN"
}
```

##### Response <span style="color:green">200</span>

``` JSON

{
 "data": {},
 "message": ""
}
```

---

#### Register a device

**POST** /api/device
This endpoint add a device to database.

##### Request

```JSON
headers: {
 "Authorization": "TOKEN"
},
body: {
 "brand":"HP",
 "model":"Cerebro de la nasa",
 "serialNumber":"0000000000",
 "type": "computer",
 "userTI":"6628436c75c233c6c6408c88"
}
```

##### Response <span style="color:green">200</span>

```JSON
"data": {
 "brand": "HP",
"model": "Cerebro de la nasa",
"serialNumber": "0000000002",
"hostname": "MV-0000000002",
"details": "",
"status": "Activo",
"annexed": {
   "id": "Sin asignar",
  "number": "Sin asignar",
  "endDate": "2025-04-24T21:09:10.149Z"
  },
  "ubication": "",
  "type": "computer",
  "ip": "",
  "user": {
   "id": "Sin asignar",
  "name": "Sin asignar"
  },
  "custom": false,
  "bussinesUnit": "",
  "departament": {
   "id": "Sin asignar",
  "name": "Sin asignar"
  },
  "monitor": {
   "id": "Sin asignar",
  "serialNumber": "Sin asignar"
  },
  "headphones": false,
  "adaptVGA": false,
  "mouse": false,
  "_id": "662974fc89199ed62b53b4fc",
  "__v": 0
  },
  "message": "Equipo registrado con exito."
```

##### Response <span style="color:orange">400</span>

```JSON
{
 "message":"Los campos Marca, Modelo, Numero de Serie, usuario y tipo son obligatorios."
}
```

##### Response <span style="color:orange">409</span>

```JSON
"data":{},
"message": "Este usuario no existe."
```

##### Response <span style="color:orange">409</span>

```JSON
"data": {},
"message": "Este computer ya esta registrada."
```

##### Response <span style="color:red">500</span>

```JSON
data:{},
"message": error.message
```

---

### User

---

#### Register a user

**Post** /api/user

This endpoint add a device to database.

##### Request 

```JSON
headers: {
 "Authorization": "TOKEN"
},
body: {

}
```

##### Response <span style="color:green">201</span>

```JSON
{
 "data":{
  "name": "prueba",
  "nickname": "prueba",
  "profile": "Tecnico",
  "password": "$2b$10$UxBqgwa7aneJl7NKagow8eaDwb.wun8EDxU4TEmacu06O082MRRpC",
  "email": "prueba@maver.com.mx",
  "_id": "66296e30feb30140691dce3b",
  "__v": 0
 },
 "message":"Usuario creado con exito."
}
```

##### Response <span style="color:orange">409</span>

```JSON
{
 "data":{},
 "message":"El usuario ya existe."
}
```

##### Response <span style="color:orange">400</span>

```JSON
{
 "data":{},
 "message":"Los campos de usuario, nick, tipo, contraseña y correo son obligatorios."
}
```

---

#### Login user

**post** /api/user/login

##### Request

```JSON
{
 "nickname": "prueba",
 "password": "prueba"
}
```

##### Response <span style="color:green">200</span>

```JSON
{
 "data": {
  "user": {
   "_id": "66296e30feb30140691dce3b",
   "name": "prueba"
   }
   },
   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY2Mjk2ZTMwZmViMzAxNDA2OTFkY2UzYiIsIm5hbWUiOiJwcnVlYmEiLCJuaWNrbmFtZSI6InBydWViYSIsImlhdCI6MTcxMzk5MTczNH0.epKgEDKzsfiKYiTuy7_BqgqdeVFJz_esXUoMlhoEIiY",
   "message": "Login correcto."
}
```

##### Response <span style="color:orange">400</span>

```JSON
{
 "data": {},
   "message": "La contraseña es incorrecta."
}
```