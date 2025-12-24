package com.pmt.service;

import java.util.List;

import com.pmt.model.Historique;

public interface HistoriqueService {
    List<Historique> findAllByProject(Long project_id);
    List<Historique> findAllByTask(Long task_id);
}
