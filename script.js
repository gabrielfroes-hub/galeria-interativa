const listaBotoes = document.querySelectorAll('.filtro');
const listaImagens = document.querySelectorAll('.miniatura');
const totalImagens = document.querySelector('#totalImagens');
const galeria = document.querySelector('.galeria');

const modal = document.querySelector('#modal');
const btnFechar = document.querySelector('#fechar');
const btnAnterior = document.querySelector('#anterior');
const btnProximo = document.querySelector('#proximo');

const imagemModal = document.querySelector('#imagemModal');
const contador = document.querySelector('#contador');
const nomeImagem = document.querySelector('#nomeImagem');
const descricaoImagem = document.querySelector('#descricaoImagem');
const categoriaImagem = document.querySelector('#categoriaImagem');
const localImagem = document.querySelector('#localImagem');

let imagensVisiveis = [];
let indiceAtual = 0;
let ultimoElementoFocado = null;

// Salva as classes originais do mosaico no HTML.
const classesOriginais = Array.from(listaImagens).map((imagem) => ({
    destaque: imagem.classList.contains('destaque'),
    horizontal: imagem.classList.contains('horizontal'),
    vertical: imagem.classList.contains('vertical')
}));

// Atualiza a lista de imagens visíveis.
function atualizarImagensVisiveis() {
    imagensVisiveis = Array.from(listaImagens).filter(
        (imagem) => !imagem.classList.contains('oculta')
    );

    totalImagens.textContent =
        `Exibindo ${imagensVisiveis.length} de ${listaImagens.length} imagens`;
}

// Restaura o mosaico original.
function restaurarMosaico() {
    listaImagens.forEach((imagem, indice) => {
        imagem.classList.add('miniatura');

        imagem.classList.remove(
            'destaque',
            'horizontal',
            'vertical'
        );

        if (classesOriginais[indice].destaque) {
            imagem.classList.add('destaque');
        }

        if (classesOriginais[indice].horizontal) {
            imagem.classList.add('horizontal');
        }

        if (classesOriginais[indice].vertical) {
            imagem.classList.add('vertical');
        }
    });
}

// Remove as classes especiais nos filtros de categoria.
function aplicarMiniaturasSimples() {
    listaImagens.forEach((imagem) => {
        imagem.classList.add('miniatura');

        imagem.classList.remove(
            'destaque',
            'horizontal',
            'vertical'
        );
    });
}

// Filtra as imagens e altera o layout.
function filtrarImagens(categoria) {
    fecharModal();

    if (categoria === 'todas') {
        // Todas: mantém o mosaico original.
        galeria.classList.remove('filtro-simples');
        restaurarMosaico();
    } else {
        // Natureza, Cidades e Carros: miniaturas uniformes.
        galeria.classList.add('filtro-simples');
        aplicarMiniaturasSimples();
    }

    listaImagens.forEach((imagem) => {
        const categoriaAtual =
            imagem.dataset.categoria.toLowerCase();

        if (
            categoria === 'todas' ||
            categoriaAtual === categoria
        ) {
            imagem.classList.remove('oculta');
            imagem.tabIndex = 0;
        } else {
            imagem.classList.add('oculta');
            imagem.tabIndex = -1;
        }
    });

    atualizarImagensVisiveis();
    indiceAtual = 0;
}

// Eventos dos botões de filtro.
listaBotoes.forEach((botao) => {
    botao.addEventListener('click', () => {
        const categoria = botao.dataset.filtro;

        listaBotoes.forEach((item) => {
            item.classList.remove('ativo');
        });

        botao.classList.add('ativo');

        filtrarImagens(categoria);
    });
});

// Atualiza o conteúdo do modal.
function mostrarImagem(indice) {
    if (imagensVisiveis.length === 0) {
        return;
    }

    indiceAtual =
        (indice + imagensVisiveis.length) %
        imagensVisiveis.length;

    const imagem = imagensVisiveis[indiceAtual];

    const titulo =
        imagem.dataset.titulo || imagem.alt || 'Imagem';

    const descricao =
        imagem.dataset.descricao || 'Sem descrição disponível.';

    const categoria =
        imagem.dataset.categoria || 'Sem categoria';

    const local =
        imagem.dataset.local || 'Sem local informado';

    imagemModal.src = imagem.src;
    imagemModal.alt = titulo;

    nomeImagem.textContent = titulo;
    descricaoImagem.textContent = descricao;

    categoriaImagem.textContent =
        categoria.charAt(0).toUpperCase() +
        categoria.slice(1);

    localImagem.textContent = local;

    contador.textContent =
        `${indiceAtual + 1} de ${imagensVisiveis.length}`;
}

// Abre o modal.
function abrirModal(imagem) {
    atualizarImagensVisiveis();

    indiceAtual = imagensVisiveis.indexOf(imagem);

    if (indiceAtual === -1) {
        return;
    }

    ultimoElementoFocado = imagem;

    mostrarImagem(indiceAtual);

    modal.classList.add('ativo');
    modal.setAttribute('aria-hidden', 'false');

    btnFechar.focus();
}

// Fecha o modal.
function fecharModal() {
    if (!modal.classList.contains('ativo')) {
        return;
    }

    modal.classList.remove('ativo');
    modal.setAttribute('aria-hidden', 'true');

    if (
        ultimoElementoFocado &&
        document.contains(ultimoElementoFocado) &&
        !ultimoElementoFocado.classList.contains('oculta')
    ) {
        ultimoElementoFocado.focus();
    }
}

// Clique e teclado nas imagens.
listaImagens.forEach((imagem) => {
    imagem.addEventListener('click', () => {
        abrirModal(imagem);
    });

    imagem.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            abrirModal(imagem);
        }
    });
});

// Fechar modal.
btnFechar.addEventListener('click', fecharModal);

// Próxima imagem.
btnProximo.addEventListener('click', () => {
    mostrarImagem(indiceAtual + 1);
});

// Imagem anterior.
btnAnterior.addEventListener('click', () => {
    mostrarImagem(indiceAtual - 1);
});

document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('ativo')) {
        return;
    }

    if (event.key === 'Escape') {
        fecharModal();
    }

    if (event.key === 'ArrowLeft') {
        mostrarImagem(indiceAtual - 1);
    }

    if (event.key === 'ArrowRight') {
        mostrarImagem(indiceAtual + 1);
    }
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        fecharModal();
    }
});
filtrarImagens('todas');

