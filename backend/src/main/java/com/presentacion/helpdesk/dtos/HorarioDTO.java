package com.presentacion.helpdesk.dtos;

public class HorarioDTO {
    private Long id;
    private String atencion;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAtencion() {
        return atencion;
    }

    public void setAtencion(String atencion) {
        this.atencion = atencion;
    }
}
