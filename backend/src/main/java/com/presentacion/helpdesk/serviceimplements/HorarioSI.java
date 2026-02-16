package com.presentacion.helpdesk.serviceimplements;

import com.presentacion.helpdesk.entities.Horario;
import com.presentacion.helpdesk.repositories.IHorarioRepository;
import com.presentacion.helpdesk.serviceinterfaces.IHorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioSI implements IHorarioService {

    @Autowired
    private IHorarioRepository repo;

    @Override
    public List<Horario> findAll() {
        return repo.findAll();
    }
}
