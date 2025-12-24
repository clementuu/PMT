package com.pmt.store;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.Historique;

public interface HistoriqueStore extends CrudRepository<Historique, Long> {
    
}
