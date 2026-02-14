package com.presentacion.helpdesk.repositories;

import com.presentacion.helpdesk.entities.Estado;
import com.presentacion.helpdesk.entities.Prioridad;
import com.presentacion.helpdesk.entities.SolicitudSoporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface ISolicitudRepository extends JpaRepository<SolicitudSoporte, Long> {
    @Query("""
  SELECT s
  FROM SolicitudSoporte s
  WHERE (:estado IS NULL OR s.estado = :estado)
    AND (:prioridad IS NULL OR s.prioridad = :prioridad)
    AND (:titulo IS NULL OR LOWER(s.titulo) LIKE LOWER(CONCAT('%', :titulo, '%')))
    AND (:desde IS NULL OR s.fechaActualizacion >= :desde)
    AND (:hasta IS NULL OR s.fechaCreacion <= :hasta)
  ORDER BY s.fechaCreacion DESC
""")
    List<SolicitudSoporte> search(
            @Param("estado") Estado estado,
            @Param("prioridad") Prioridad prioridad,
            @Param("titulo") String titulo,
            @Param("desde") OffsetDateTime desde,
            @Param("hasta") OffsetDateTime hasta
    );

}