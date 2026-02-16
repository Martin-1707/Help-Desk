package com.presentacion.helpdesk.controllers;

import com.presentacion.helpdesk.serviceinterfaces.IHorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/horarios")
public class HorarioController {
    @Autowired
    private IHorarioService horarioService;

    @GetMapping()
    public List<String> list(){
        return horarioService.findAll().stream().map(horario -> horario.getAtencion()).toList();
    }
}
