package com.clinica.caio.dtos;

import com.clinica.caio.models.Doenca;

import java.io.Serializable;

public record DoencaDTO(
        String cid,
        String nome,
        String descricao
) implements Serializable {
    public DoencaDTO(Doenca doenca){
        this(
                doenca.getCid(),
                doenca.getNome(),
                doenca.getDescricao()
        );
    }

}
