package com.clinica.caio.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;

import com.clinica.caio.models.Doenca;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DoencaServiceTest {

    private final DoencaService doencaService;

    @Autowired
    public DoencaServiceTest(DoencaService doencaService) {
        this.doencaService = doencaService;
    }

    @Test
    public void testCadastrarDoenca() {
        Doenca doenca = new Doenca("A00", "Cólera", "Infecção intestinal grave", Collections.emptyList());
        Doenca result = doencaService.salvar(doenca);

        assertNotNull(result);
        assertEquals("A00", result.getCid());
        assertEquals("Cólera", result.getNome());
    }

    @Test
    public void testBuscarDoencaPorCid() {
        Doenca doenca = new Doenca("A00", "Cólera", "Infecção intestinal grave", Collections.emptyList());
        doencaService.salvar(doenca);

        Optional<Doenca> result = doencaService.buscarPorId("A00");

        assertTrue(result.isPresent());
        assertEquals("Cólera", result.get().getNome());
    }

    // @Test
    // public void testAtualizarDoenca() {
    //     Doenca doenca = new Doenca("A00", "Cólera", "Infecção intestinal grave");
    //     doencaService.salvar(doenca);

    //     Doenca atualizado = new Doenca("A00", "Cólera Grave", "Infecção mais grave");
    //     Doenca result = doencaService.atualizarDoenca(atualizado);

    //     assertEquals("Cólera Grave", result.getNome());
    //     assertEquals("Infecção mais grave", result.getDescricao());
    // }

    @Test
    public void testExcluirDoenca() {
        Doenca doenca = new Doenca("A00", "Cólera", "Infecção intestinal grave",Collections.emptyList());
        doencaService.salvar(doenca);

        boolean excluido = doencaService.deletar("A00");

        assertTrue(excluido);
        assertFalse(doencaService.buscarPorId("A00").isPresent());
    }
}
