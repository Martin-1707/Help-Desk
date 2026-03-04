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
        FROM solicitud_soporte s
        WHERE (:estado IS NULL OR s.estado = :estado)
          AND (:prioridad IS NULL OR s.prioridad = :prioridad)
          AND (:titulo IS NULL OR s.titulo ILIKE CONCAT('%', :titulo, '%'))
          AND s.fecha_actualizacion >= COALESCE(CAST(:desde AS timestamptz), s.fecha_actualizacion)
          AND s.fecha_creacion      <= COALESCE(CAST(:hasta AS timestamptz), s.fecha_creacion)
        ORDER BY s.fecha_creacion DESC
        """, nativeQuery = true)
    List<SolicitudSoporte> search(
            @Param("estado") String estado,
            @Param("prioridad") String prioridad,
            @Param("titulo") String titulo,
            @Param("desde") OffsetDateTime desde,
            @Param("hasta") OffsetDateTime hasta
    );
}