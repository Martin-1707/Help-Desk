package com.presentacion.helpdesk.serviceimplements;

import com.presentacion.helpdesk.dtos.SolicitudCreateUpdateDTO;
import com.presentacion.helpdesk.entities.Estado;
import com.presentacion.helpdesk.entities.Prioridad;
import com.presentacion.helpdesk.entities.SolicitudSoporte;
import com.presentacion.helpdesk.repositories.ISolicitudRepository;
import com.presentacion.helpdesk.serviceinterfaces.ISolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class SolicitudServiceImplement implements ISolicitudService {
    @Autowired
    private ISolicitudRepository soliRepo;

    @Override
    public List<SolicitudSoporte> search(Estado estado, Prioridad prioridad, String titulo, OffsetDateTime desde, OffsetDateTime hasta) {
        return List.of();
    }

    @Override
    public SolicitudSoporte getById(Long id) {
        return null;
    }

    @Override
    public SolicitudSoporte create(SolicitudCreateUpdateDTO dto) {
        return null;
    }

    @Override
    public SolicitudSoporte update(Long id, SolicitudCreateUpdateDTO dto) {
        return null;
    }

    @Override
    public SolicitudSoporte changeEstado(Long id, Estado nuevoEstado) {
        return null;
    }
}