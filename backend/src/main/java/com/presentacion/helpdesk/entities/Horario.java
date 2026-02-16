package com.presentacion.helpdesk.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Horario")
public class Horario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "atencion", nullable = false, length = 200)
    private String atencion;

    public Horario() {
    }

    public Horario(Long id, String atencion) {
        this.id = id;
        this.atencion = atencion;
    }

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
