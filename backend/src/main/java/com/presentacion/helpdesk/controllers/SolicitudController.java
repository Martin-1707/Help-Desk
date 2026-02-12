package com.presentacion.helpdesk.controllers;

import com.presentacion.helpdesk.dtos.CambiarEstadoDTO;
import com.presentacion.helpdesk.dtos.SolicitudCreateUpdateDTO;
import com.presentacion.helpdesk.entities.Estado;
import com.presentacion.helpdesk.entities.Prioridad;
import com.presentacion.helpdesk.entities.SolicitudSoporte;
import com.presentacion.helpdesk.serviceinterfaces.ISolicitudService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/solicitudes")
public class SolicitudController {
    @Autowired
    private ISolicitudService solicitudService;

    // LISTAR + FILTRAR (si no envías params, trae todo)
    @GetMapping
    public ResponseEntity<List<SolicitudSoporte>> list(
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) Prioridad prioridad,
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime desde,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime hasta
    ) {
        List<SolicitudSoporte> result = solicitudService.search(estado, prioridad, titulo, desde, hasta);
        return ResponseEntity.ok(result);
    }

    // DETALLE
    @GetMapping("/{id}")
    public ResponseEntity<SolicitudSoporte> getById(@PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.getById(id));
    }

    // CREAR
    @PostMapping
    public ResponseEntity<SolicitudSoporte> create(@Valid @RequestBody SolicitudCreateUpdateDTO dto) {
        SolicitudSoporte created = solicitudService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // EDITAR (no cambia estado)
    @PutMapping("/{id}")
    public ResponseEntity<SolicitudSoporte> update(
            @PathVariable Long id,
            @Valid @RequestBody SolicitudCreateUpdateDTO dto
    ) {
        return ResponseEntity.ok(solicitudService.update(id, dto));
    }

    // CAMBIAR ESTADO
    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudSoporte> changeEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoDTO dto
    ) {
        return ResponseEntity.ok(solicitudService.changeEstado(id, dto.getEstado()));
    }
}