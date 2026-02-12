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
    @Query(value = """
   SELECT *
   FROM SolicitudSoporte
   WHERE (:estado IS NULL OR Estado = :estado)
     AND (:prioridad IS NULL OR Prioridad = :prioridad)
     AND (:titulo IS NULL OR LOWER(Titulo) LIKE LOWER(CONCAT('%', :titulo, '%')))
     AND (:desde IS NULL OR FechaCreacion >= :desde)
     AND (:hasta IS NULL OR FechaCreacion <= :hasta)
   ORDER BY FechaCreacion DESC
""", nativeQuery = true)
    List<SolicitudSoporte> search(
            @Param("estado") Estado estado,
            @Param("prioridad") Prioridad prioridad,
            @Param("titulo") String titulo,
            @Param("desde") OffsetDateTime desde,
            @Param("hasta") OffsetDateTime hasta
    );
}