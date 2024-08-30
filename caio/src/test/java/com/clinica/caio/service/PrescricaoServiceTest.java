package com.clinica.caio.service;

import com.clinica.caio.models.Doenca;
import com.clinica.caio.models.Paciente;
import com.clinica.caio.models.Prescricao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PrescricaoServiceTest {

    private final PrescricaoService prescricaoService;
    private Paciente paciente;
    private Doenca doenca;

    @Autowired
    public PrescricaoServiceTest(PrescricaoService prescricaoService) {
        this.prescricaoService = prescricaoService;
    }

    @BeforeEach
    public void setup() {
        paciente = new Paciente("123.456.789-00", "João", 25, "Rua A, 123", "99999-9999", Collections.emptyList());
        doenca = new Doenca("A00", "Cólera", "Infecção intestinal grave", Collections.emptyList());
    }

    @Test
    public void testCadastrarPrescricao() {
        Prescricao prescricao = new Prescricao(1, paciente, doenca, "Remédio X", LocalDate.now(), "2 vezes ao dia", LocalDate.now(), "Em andamento");
        Long id = prescricao.getNumero();
        Prescricao result = prescricaoService.concluirPrescricao(id);

        assertNotNull(result);
        assertEquals(1, result.getNumero());
        assertEquals("Remédio X", result.getNomeRemedio());
    }

    @Test
    public void testAtualizarPrescricao() {
        Prescricao prescricao = new Prescricao(1, paciente, doenca, "Remédio X", LocalDate.now(), "2 vezes ao dia", LocalDate.now(), "Em andamento");
        Long id = prescricao.getNumero();
        prescricaoService.concluirPrescricao(id);

        prescricao.setStatus("Concluída");
        Prescricao result = prescricaoService.atualizarPrescricao(id, prescricao);

        assertEquals("Concluída", result.getStatus());
    }

    // @Test
    // public void testGerarRelatorio() {
    //     Prescricao prescricao = new Prescricao(1, paciente, doenca, "Remédio X", LocalDate.now(), "2 vezes ao dia", "Concluída");
    //     Long id = prescricao.getNumero();
    //     prescricaoService.concluirPrescricao(id);

    //     String relatorio = prescricaoService.gerarRelatorio(1);

    //     assertNotNull(relatorio);
    //     assertTrue(relatorio.contains("Remédio X"));
    //     assertTrue(relatorio.contains("Concluída"));
    // }
}
