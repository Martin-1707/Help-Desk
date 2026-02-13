package com.presentacion.helpdesk.serviceimplements;

import com.presentacion.helpdesk.dtos.SolicitudCreateUpdateDTO;
import com.presentacion.helpdesk.entities.Estado;
import com.presentacion.helpdesk.entities.Prioridad;
import com.presentacion.helpdesk.entities.SolicitudSoporte;
import com.presentacion.helpdesk.entities.Usuario;
import com.presentacion.helpdesk.repositories.ISolicitudRepository;
import com.presentacion.helpdesk.repositories.IUsuarioRepository;
import com.presentacion.helpdesk.serviceinterfaces.ISolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class SolicitudServiceImplement implements ISolicitudService {
    @Autowired
    private ISolicitudRepository soliRepo;

    @Autowired
    private IUsuarioRepository usuarioRepo;

    @Override
    public SolicitudSoporte create(SolicitudCreateUpdateDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Usuario u = usuarioRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

        SolicitudSoporte s = new SolicitudSoporte();
        s.setTitulo(dto.getTitulo());
        s.setDescripcion(dto.getDescripcion());
        s.setPrioridad(dto.getPrioridad());
        s.setSolicitanteUser(u);
        s.setEstado(Estado.NUEVO);

        return soliRepo.save(s);
    }

    @Override
    public SolicitudSoporte update(Long id, SolicitudCreateUpdateDTO dto) {
        SolicitudSoporte s = soliRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con id: " + id));

        if (s.getEstado() == Estado.CERRADO) {
            throw new RuntimeException("No se puede editar una solicitud en estado CERRADO.");
        }

        s.setTitulo(dto.getTitulo());
        s.setDescripcion(dto.getDescripcion());
        s.setPrioridad(dto.getPrioridad());

        return soliRepo.save(s);
    }

    @Override
    public SolicitudSoporte changeEstado(Long id, Estado nuevoEstado) {
        SolicitudSoporte s = soliRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con id: " + id));

        // Regla: CERRADO no puede volver a otro estado
        if (s.getEstado() == Estado.CERRADO && nuevoEstado != Estado.CERRADO) {
            throw new RuntimeException("No se puede pasar de estado CERRADO a otro estado.");
        }

        s.setEstado(nuevoEstado);
        return soliRepo.save(s);
    }

    @Override
    public SolicitudSoporte getById(Long id) {
        return soliRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con id: " + id));
    }

    @Override
    public List<SolicitudSoporte> search(Estado estado, Prioridad prioridad, String titulo, OffsetDateTime desde, OffsetDateTime hasta) {
        if (titulo != null && titulo.isBlank()) titulo = null;

        return soliRepo.search(estado, prioridad, titulo, desde, hasta);
    }

}