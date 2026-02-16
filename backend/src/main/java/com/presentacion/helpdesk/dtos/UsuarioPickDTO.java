package com.presentacion.helpdesk.dtos;

public class UsuarioPickDTO {
    private Long id;
    private String nombres;
    private String username;

    public UsuarioPickDTO() {}

    public UsuarioPickDTO(Long id, String nombres, String username) {
        this.id = id;
        this.nombres = nombres;
        this.username = username;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
