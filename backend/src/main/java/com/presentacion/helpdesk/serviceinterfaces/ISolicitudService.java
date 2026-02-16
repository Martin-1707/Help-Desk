package com.presentacion.helpdesk.serviceinterfaces;

import com.presentacion.helpdesk.dtos.SolicitudCreateUpdateDTO;
import com.presentacion.helpdesk.entities.Estado;
import com.presentacion.helpdesk.entities.Prioridad;
import com.presentacion.helpdesk.entities.SolicitudSoporte;

import java.time.OffsetDateTime;
import java.util.List;

public interface ISolicitudService {
    // CRUD básico
    SolicitudSoporte create(SolicitudCreateUpdateDTO dto);
    SolicitudSoporte update(Long id, SolicitudCreateUpdateDTO dto);
    SolicitudSoporte changeEstado(Long id, Estado nuevoEstado);
    SolicitudSoporte delete(Long id);
    SolicitudSoporte getById(Long id);
    List<SolicitudSoporte> search(Estado estado, Prioridad prioridad, String titulo, OffsetDateTime desde, OffsetDateTime hasta);
}