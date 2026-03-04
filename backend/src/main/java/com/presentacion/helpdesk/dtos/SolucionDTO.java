package com.presentacion.helpdesk.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SolucionDTO {

    @NotBlank(message = "La solución es obligatoria.")
    @Size(min = 5, max = 2000, message = "La solución debe tener entre 5 y 2000 caracteres.")
    private String solucion;

    public String getSolucion() { return solucion; }
    public void setSolucion(String solucion) { this.solucion = solucion; }
}