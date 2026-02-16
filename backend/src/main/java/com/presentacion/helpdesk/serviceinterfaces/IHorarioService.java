package com.presentacion.helpdesk.serviceinterfaces;

import com.presentacion.helpdesk.entities.Horario;

import java.util.List;

public interface IHorarioService {
    List<Horario> findAll();
}
