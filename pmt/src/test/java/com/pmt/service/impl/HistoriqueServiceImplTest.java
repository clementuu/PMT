package com.pmt.service.impl;

import com.pmt.model.Historique;
import com.pmt.store.HistoriqueStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class HistoriqueServiceImplTest {

    @InjectMocks
    private HistoriqueServiceImpl historiqueService;

    @Mock
    private HistoriqueStore historiqueStore;

    private Historique historique;

    @BeforeEach
    void setUp() {
        historique = new Historique();
        historique.setId(1L);
        historique.setNewString("Test Modification");
        // Set other fields as necessary for more complex tests
    }

    @Test
    void testFindAllByProject_Success() {
        Long projectId = 10L;
        when(historiqueStore.findAllByProjectId(projectId)).thenReturn(Collections.singletonList(historique));

        List<Historique> result = historiqueService.findAllByProject(projectId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(historique, result.get(0));
        verify(historiqueStore).findAllByProjectId(projectId);
    }

    @Test
    void testFindAllByProject_NoResults() {
        Long projectId = 10L;
        when(historiqueStore.findAllByProjectId(projectId)).thenReturn(Collections.emptyList());

        List<Historique> result = historiqueService.findAllByProject(projectId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(historiqueStore).findAllByProjectId(projectId);
    }

    @Test
    void testFindAllByTask_Success() {
        Long taskId = 20L;
        when(historiqueStore.findAllByTaskId(taskId)).thenReturn(Collections.singletonList(historique));

        List<Historique> result = historiqueService.findAllByTask(taskId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(historique, result.get(0));
        verify(historiqueStore).findAllByTaskId(taskId);
    }

    @Test
    void testFindAllByTask_NoResults() {
        Long taskId = 20L;
        when(historiqueStore.findAllByTaskId(taskId)).thenReturn(Collections.emptyList());

        List<Historique> result = historiqueService.findAllByTask(taskId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(historiqueStore).findAllByTaskId(taskId);
    }
}
