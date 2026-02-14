package com.presentacion.helpdesk.repositories;

import com.presentacion.helpdesk.entities.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);

    @EntityGraph(attributePaths = "rol")
    Optional<Usuario> findWithRolByUsername(String username);
}