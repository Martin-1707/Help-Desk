Mesa de Ayuda Interna (Angular + Spring Boot + Azure SQL)

Aplicación web para registrar y gestionar solicitudes de soporte (Mesa de Ayuda Interna). Permite crear, listar, ver detalle, editar solicitudes y cambiar su estado (Nuevo, En Proceso, Resuelto, Cerrado). Incluye filtros por estado y prioridad, y reglas de negocio/validaciones. 

Funcionalidades

Crear solicitud: título, descripción, prioridad, solicitante (fecha automática). 

Listar solicitudes en tabla.

Ver detalle de una solicitud.

Editar solicitud.

Cambiar estado: Nuevo → En Proceso → Resuelto → Cerrado.

Regla: no se puede pasar de “Cerrado” a otro estado. 

Buscar/filtrar por estado y prioridad. 

Reglas y validaciones

Título obligatorio, mínimo 5 caracteres. 

Descripción obligatoria, mínimo 10 caracteres. 

Fecha de creación y actualización: automáticas. 

Tecnologías

Frontend: Angular 18 (+ Angular Material si aplica)

Backend: Java 17, Spring Boot 4, API REST

Base de datos: Microsoft SQL Server / Azure SQL

Despliegue: Azure Static Web Apps (front) + Azure App Service (API) + Azure SQL
