package com.presentacion.helpdesk.dtos;

import com.presentacion.helpdesk.entities.Estado;
import jakarta.validation.constraints.NotNull;

public class CambiarEstadoDTO {
    @NotNull(message = "El estado es obligatorio.")
    private Estado estado;

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }
}