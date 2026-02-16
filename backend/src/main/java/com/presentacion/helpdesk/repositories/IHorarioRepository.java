package com.presentacion.helpdesk.repositories;

import com.presentacion.helpdesk.entities.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IHorarioRepository  extends JpaRepository<Horario, Long> {
}
