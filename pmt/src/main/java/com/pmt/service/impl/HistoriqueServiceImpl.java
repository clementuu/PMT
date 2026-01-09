package com.pmt.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.model.Historique;
import com.pmt.service.HistoriqueService;
import com.pmt.store.HistoriqueStore;

@Service
public class HistoriqueServiceImpl implements HistoriqueService {
    @Autowired
    private HistoriqueStore historiqueStore;


    @Override
    public List<Historique> findAllByProject(Long projectId) {
        return historiqueStore.findAllByProjectId(projectId);
    }

    @Override
    public List<Historique> findAllByTask(Long taskId) {
        return historiqueStore.findAllByTaskId(taskId);
    }
    
}
