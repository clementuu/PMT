package com.pmt.store;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.Historique;

public interface HistoriqueStore extends CrudRepository<Historique, Long> {
    List<Historique> findAllByProjectId(Long projectId);
    List<Historique> findAllByTaskId(Long taskId);
}
