package com.presentacion.helpdesk.controllers;

import com.presentacion.helpdesk.dtos.UsuarioPickDTO;
import com.presentacion.helpdesk.repositories.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private IUsuarioRepository usuarioRepo;

    @GetMapping
    public List<UsuarioPickDTO> listByRol(@RequestParam String rol) {
        return usuarioRepo.findByRol_NombreIgnoreCase(rol).stream()
                .map(u -> new UsuarioPickDTO(u.getId(), u.getNombres(), u.getUsername()))
                .toList();
    }
}