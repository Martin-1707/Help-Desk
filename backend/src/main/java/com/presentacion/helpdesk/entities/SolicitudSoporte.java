package com.presentacion.helpdesk.entities;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "SolicitudSoporte")
public class SolicitudSoporte {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "Titulo", nullable = false, length = 200)
        private String titulo;

        @Column(name = "Descripcion", nullable = false, length = 2000)
        private String descripcion;

        @Enumerated(EnumType.STRING)
        @Column(name = "Prioridad", nullable = false, length = 20)
        private Prioridad prioridad;

        @Enumerated(EnumType.STRING)
        @Column(name = "Estado", nullable = false, length = 20)
        private Estado estado;

        @Column(name = "Solicitante", nullable = false, length = 120)
        private String solicitante;

        @Column(name = "FechaCreacion", nullable = false)
        private OffsetDateTime fechaCreacion;

        @Column(name = "FechaActualizacion", nullable = false)
        private OffsetDateTime fechaActualizacion;

        @PrePersist
        void onCreate() {
            OffsetDateTime now = OffsetDateTime.now();
            this.fechaCreacion = now;
            this.fechaActualizacion = now;
            if (this.estado == null) this.estado = Estado.NUEVO;
        }

        @PreUpdate
        void onUpdate() {
            this.fechaActualizacion = OffsetDateTime.now();
        }

        public SolicitudSoporte() {
        }

        public SolicitudSoporte(Long id, String titulo, String descripcion, Prioridad prioridad, Estado estado, String solicitante, OffsetDateTime fechaCreacion, OffsetDateTime fechaActualizacion) {
                this.id = id;
                this.titulo = titulo;
                this.descripcion = descripcion;
                this.prioridad = prioridad;
                this.estado = estado;
                this.solicitante = solicitante;
                this.fechaCreacion = fechaCreacion;
                this.fechaActualizacion = fechaActualizacion;
        }

        // Getters / Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitulo() { return titulo; }
        public void setTitulo(String titulo) { this.titulo = titulo; }

        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

        public Prioridad getPrioridad() { return prioridad; }
        public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }

        public Estado getEstado() { return estado; }
        public void setEstado(Estado estado) { this.estado = estado; }

        public String getSolicitante() { return solicitante; }
        public void setSolicitante(String solicitante) { this.solicitante = solicitante; }

        public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
        public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

        public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
        public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    }
