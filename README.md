# Consultorio Gloria Videla — Instrucciones de despliegue

## Estructura del proyecto
```
consultorio-gv/
├── index.html
├── package.json
├── vite.config.js
├── firestore.rules
└── src/
    ├── main.jsx
    ├── App.jsx
    └── firebase.js
```

## Paso 1 — Subir a GitHub

1. Entrá a github.com y creá una cuenta si no tenés
2. Click en "+" arriba a la derecha → "New repository"
3. Nombre: `consultorio-gv` → "Create repository"
4. En la página siguiente click en "uploading an existing file"
5. Arrastrá TODOS los archivos de esta carpeta (respetando la estructura de carpetas)
6. Click "Commit changes"

## Paso 2 — Publicar en Vercel

1. Entrá a vercel.com
2. Click "Sign up" → "Continue with GitHub"
3. Click "Add New Project"
4. Seleccioná el repositorio `consultorio-gv`
5. Vercel detecta automáticamente que es Vite → click "Deploy"
6. En 2 minutos tenés tu link: algo como `consultorio-gv.vercel.app`

## Paso 3 — Reglas de Firestore

1. Volvé a Firebase → Firestore Database → "Reglas"
2. Reemplazá todo el contenido con el contenido del archivo `firestore.rules`
3. Click "Publicar"

## Accesos
- Admin: usuario `admin` / contraseña `admin123`
- Psicólogas: su nombre / la contraseña que vos les asignes desde Gestión
