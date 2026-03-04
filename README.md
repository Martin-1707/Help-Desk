## Help Desk – Mesa de Ayuda Interna


## 1. Descripción

## Help Desk es una aplicación web para registrar y gestionar solicitudes de

soporte (Mesa de Ayuda Interna). Permite crear, listar, ver detalle, editar

solicitudes y cambiar su estado (Nuevo, En Proceso, Resuelto, Cerrado). Incluye

autenticación con JWT, filtros por estado y prioridad, y validaciones.

## 2. Tecnologías


## Frontend


•   Angular 18.2.0

•   Angular Material 18.2.14

•   Auth0 Angular JWT 5.2.0


## Backend


•   Java 17

•   Spring Boot 4.0.2

•   Spring Security + JWT

•   Spring Data JPA

•   Spring Validation

•   Swagger UI (OpenAPI) para documentación de endpoints


## Base de datos


•   Microsoft SQL Server / Azure SQL

•   Persistencia con JPA (creación/actualización automática del esquema)

•   Se requiere inserción de datos iniciales (ejemplo: roles/usuarios/solicitudes)

•   Herramienta recomendada para gestión: Azure Data Studio


## 3. Estructura del repositorio


## Raíz del repositorio


•   README.md (este archivo)

•   catalog-info.yaml (descriptor para Backstage)

•   backend/

•   frontend/

•   database/


## Backend (Spring Boot)


•   backend/

    ▪ src/main/java/com/presentacion/helpdesk/

        ▪ controllers/

        ▪ dtos/

        ▪ entities/

        ▪ exceptions/

        ▪ repositories/

        ▪ securities/

        ▪ serviceimplements/

        ▪ serviceinterfaces/

        ▪ util/

        ▪ HelpDeskApplication.java

    ▪   src/main/resources/

        ▪ application.properties

    ▪  pom.xml

    ▪   mvnw, mvnw.cmd


## Frontend (Angular)


•   frontend/

    ▪ src/

        ▪ app/

            ▪ components/

                ▪ layout/

                ▪ login/

                ▪ solicitud/

                ▪ guard/

        ▪ models/

        ▪ services/

        ▪ app.component.*

        ▪ app.config.ts

        ▪ app.routes.ts

    ▪ environments/

        ▪ environment.exam.ts

    ▪ index.html

    ▪ main.ts

    ▪ styles.css

▪   angular.json

▪   package.json


## Base de datos (scripts)


•   database/

    ▪ scripts para inserción de datos iniciales (DML), según archivos del

    repositorio


## 4. Puertos por defecto


•   Backend: http://localhost:8081

•   Frontend: http://localhost:4200


Nota: El backend puede usar otro puerto mediante la variable de entorno PORT.


## 5. Requisitos previos

•    Java 17 instalado y configurado en PATH

•    Node.js 18+ recomendado y npm

•    SQL Server local o Azure SQL accesible

•    Azure Data Studio o DBeaver (recomendado para revisar e insertar datos)


## 6. Base de datos (SQL Server / Azure SQL)


## 6.1 Creación de estructura (automática)

## El esquema/tablas se crean automáticamente al levantar el backend, ya que está

configurado con JPA (ddl-auto=update).

Esto significa:


•    No es obligatorio ejecutar scripts DDL para crear tablas.

•    Solo necesitas tener creada la base de datos vacía (por ejemplo: HelpDesk) y

credenciales válidas.

•    Al iniciar el backend, se generarán/actualizarán las tablas necesarias.


## 6.2 Inserción de datos iniciales (manual)

## Aunque el backend crea la estructura, para usar el sistema se requiere ingresar datos

iniciales (por ejemplo):


•    Roles (ADMIN, USER u otros que maneje tu app)

•    Usuarios iniciales para login

•    (Opcional) Solicitudes de ejemplo para pruebas


## Dónde insertar datos


•    En la carpeta database/ deben estar los scripts DML (insert) con datos iniciales.

•    Ejecuta esos inserts con Azure Data Studio (recomendado) o DBeaver una vez

que el backend haya creado las tablas.


## Recomendación de flujo


1.   Crear base de datos vacía (HelpDesk).

2.   Levantar backend (esto crea tablas).

3.   Ejecutar inserts iniciales desde database/ (roles, usuarios, etc.).

## 4.   Backend (Spring Boot)


## 7.1 Variables de entorno requeridas

El backend usa variables de entorno para evitar credenciales en el código:


•    DB_URL

•    DB_USERNAME

•    DB_PASSWORD

•    JWT_SECRET

•    CORS_ALLOWED_ORIGINS (opcional; por defecto http://localhost:4200)

•    PORT (opcional; por defecto 8081)

Ejemplo recomendado de DB_URL para SQL Server local:

jdbc:sqlserver://localhost:1433;databaseName=HelpDesk;encrypt=true;trustServerCertif

icate=true


## 7.2 Configurar variables de entorno


## En Windows (PowerShell)


1. Abre PowerShell.

2. Ejecuta:


$env:DB_URL="jdbc:sqlserver://localhost:1433;databaseName=HelpDesk;encrypt=tru

e;trustServerCertificate=true"

$env:DB_USERNAME="sa"

$env:DB_PASSWORD="YourStrong!Passw0rd"

$env:JWT_SECRET="cambia-esto-por-un-secreto-largo"

$env:CORS_ALLOWED_ORIGINS="http://localhost:4200"

$env:PORT="8081"


## En Linux / macOS (bash/zsh)


1. Abre terminal.

2. Ejecuta:


export

## DB_URL="jdbc:sqlserver://localhost:1433;databaseName=HelpDesk;encrypt=true;trust

## ServerCertificate=true"

export DB_USERNAME="sa"

export DB_PASSWORD="YourStrong!Passw0rd"

export JWT_SECRET="cambia-esto-por-un-secreto-largo"

export CORS_ALLOWED_ORIGINS="http://localhost:4200"

export PORT="8081"


## 7.3 Ejecutar el backend


1. Ir a la carpeta backend:


cd backend


2. Ejecutar la aplicación:


./mvnw spring-boot:run


3. Verificar que la API responde:


•   API base: http://localhost:8081


## 8. Swagger (Documentación de API) Con el backend levantado, la documentación de endpoints está disponible en:

•   Swagger UI: http://localhost:8081/swagger-ui/index.html


Esto permite visualizar y probar endpoints desde el navegador.


## 9. Frontend (Angular)


## 9.1 Importante sobre environment.exam.ts

## Si el frontend apunta a una URL equivocada, la app no podrá consumir la API. Para ejecutar en local, el frontend debe apuntar al backend local.

Ubicación del archivo:

frontend/src/environments/environment.exam.ts

Configuración recomendada para local:

production: true

base: http://localhost:8081

dom: localhost:8081


Ejemplo:

export const environment = {

production: true,

base: 'http://localhost:8081',

dom: 'localhost:8081'

};


## 9.2 Ejecutar el frontend


1. Ir a la carpeta frontend:


cd frontend


2. Instalar dependencias:


npm install


3. Ejecutar:


npm start


4. Abrir en el navegador:


•   http://localhost:4200


## 10. Funcionalidades principales


•   Crear solicitud: título, descripción, prioridad, solicitante

•   Listar solicitudes en tabla

•   Ver detalle de una solicitud

•    Editar solicitud

•    Cambiar estado: Nuevo → En Proceso → Resuelto → Cerrado

•    Regla: no se puede pasar de “Cerrado” a otro estado

•    Buscar/filtrar por estado y prioridad

•    Seguridad: autenticación con JWT


## 11. Backstage (Software Catalog)


## Este repositorio incluye catalog-info.yaml para registrarlo como componente en Backstage.


Pasos para registrar en Backstage:


## 1.   Ir a Catalog

## 2.   Seleccionar Register Existing Component

## 3.   Pegar la URL del repositorio GitHub

## 4.   Seleccionar el archivo catalog-info.yaml en la raíz

## 5.   Confirmar para que aparezca en el catálogo


## 12. Notas técnicas


•    La estructura de tablas se crea automáticamente con JPA (ddl-auto=update) al

levantar el backend.

•    Los datos iniciales (roles/usuarios) deben insertarse manualmente (scripts DML

en database/).

•    Si el puerto 8081 está ocupado, se puede cambiar usando PORT (por ejemplo 8082) y actualizar el base URL del frontend.


## 13. Comandos rápidos (resumen)


## Backend


•    cd backend

•    (set env vars)

•    ./mvnw spring-boot:run


## Frontend


•    cd frontend

•    npm install

•    npm start


## Swagger


•    http://localhost:8081/swagger-ui/index.html

