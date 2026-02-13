package com.presentacion.helpdesk.dtos;

import com.presentacion.helpdesk.entities.Estado;
import com.presentacion.helpdesk.entities.Prioridad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SolicitudCreateUpdateDTO {
    @NotBlank(message = "El título es obligatorio.")
    @Size(min = 5, max = 200, message = "El título debe tener entre 5 y 200 caracteres.")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria.")
    @Size(min = 10, max = 2000, message = "La descripción debe tener entre 10 y 2000 caracteres.")
    private String descripcion;

    @NotNull(message = "La prioridad es obligatoria.")
    private Prioridad prioridad;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Prioridad getPrioridad() { return prioridad; }
    public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }

}