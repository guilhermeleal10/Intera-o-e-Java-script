const produtos = [
    {
        id: 1,
        nome: "Smartwatch Pulse Fit",
        categoria: "tecnologia",
        preco: 249.9,
        avaliacao: 4.8,
        imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        nome: "Fone Aura Bass",
        categoria: "tecnologia",
        preco: 179.9,
        avaliacao: 4.7,
        imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        nome: "Mochila Urbana Flex",
        categoria: "moda",
        preco: 139.9,
        avaliacao: 4.5,
        imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        nome: "Tenis Runner Street",
        categoria: "esporte",
        preco: 299.9,
        avaliacao: 4.9,
        imagem: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        nome: "Garrafa Termica Move",
        categoria: "esporte",
        preco: 89.9,
        avaliacao: 4.6,
        imagem: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        nome: "Teclado Compact Pro",
        categoria: "tecnologia",
        preco: 219.9,
        avaliacao: 4.4,
        imagem: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        nome: "Luminaria Focus Desk",
        categoria: "casa",
        preco: 119.9,
        avaliacao: 4.3,
        imagem: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        nome: "Camisa Essential",
        categoria: "moda",
        preco: 79.9,
        avaliacao: 4.2,
        imagem: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
    }
];

const listaProdutos = document.getElementById("listaProdutos");
const totalProdutos = document.getElementById("totalProdutos");
const campoBusca = document.getElementById("campoBusca");
const botaoBusca = document.getElementById("botaoBusca");
const ordenarProdutos = document.getElementById("ordenarProdutos");
const botoesCategoria = document.querySelectorAll("[data-categoria]");
const botaoTema = document.getElementById("botaoTema");
const abrirCarrinho = document.getElementById("abrirCarrinho");
const fecharCarrinho = document.getElementById("fecharCarrinho");
const carrinho = document.getElementById("carrinho");
const overlay = document.getElementById("overlay");
const itensCarrinho = document.getElementById("itensCarrinho");
const contadorCarrinho = document.getElementById("contadorCarrinho");
const subtotalCarrinho = document.getElementById("subtotalCarrinho");
const freteCarrinho = document.getElementById("freteCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const finalizarCompra = document.getElementById("finalizarCompra");
const mensagemCompra = document.getElementById("mensagemCompra");

let categoriaAtual = "todos";
let termoBusca = "";
let carrinhoCompras = [];

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function renderizarProdutos() {
    let produtosFiltrados = produtos.filter((produto) => {
        const combinaCategoria = categoriaAtual === "todos" || produto.categoria === categoriaAtual;
        const combinaBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase());

        return combinaCategoria && combinaBusca;
    });

    produtosFiltrados = ordenarLista(produtosFiltrados);
    totalProdutos.textContent = `${produtosFiltrados.length} produto(s)`;

    if (produtosFiltrados.length === 0) {
        listaProdutos.innerHTML = '<p class="carrinho-vazio">Nenhum produto encontrado.</p>';
        return;
    }

    listaProdutos.innerHTML = produtosFiltrados.map((produto) => `
        <article class="produto">
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="produto-conteudo">
                <span class="produto-categoria">${produto.categoria}</span>
                <h3>${produto.nome}</h3>
                <span class="avaliacao">Nota ${produto.avaliacao}</span>
                <strong class="preco">${formatarMoeda(produto.preco)}</strong>
                <button type="button" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao carrinho</button>
            </div>
        </article>
    `).join("");
}

function ordenarLista(lista) {
    const ordenacao = ordenarProdutos.value;
    const copia = [...lista];

    if (ordenacao === "menor-preco") {
        return copia.sort((a, b) => a.preco - b.preco);
    }

    if (ordenacao === "maior-preco") {
        return copia.sort((a, b) => b.preco - a.preco);
    }

    if (ordenacao === "avaliacao") {
        return copia.sort((a, b) => b.avaliacao - a.avaliacao);
    }

    return copia;
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find((item) => item.id === id);
    const itemCarrinho = carrinhoCompras.find((item) => item.id === id);

    if (itemCarrinho) {
        itemCarrinho.quantidade++;
    } else {
        carrinhoCompras.push({ ...produto, quantidade: 1 });
    }

    atualizarCarrinho();
    abrirPainelCarrinho();
}

function alterarQuantidade(id, mudanca) {
    const itemCarrinho = carrinhoCompras.find((item) => item.id === id);

    if (!itemCarrinho) {
        return;
    }

    itemCarrinho.quantidade += mudanca;

    if (itemCarrinho.quantidade <= 0) {
        carrinhoCompras = carrinhoCompras.filter((item) => item.id !== id);
    }

    atualizarCarrinho();
}

function removerDoCarrinho(id) {
    carrinhoCompras = carrinhoCompras.filter((item) => item.id !== id);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const quantidadeTotal = carrinhoCompras.reduce((total, item) => total + item.quantidade, 0);
    const subtotal = carrinhoCompras.reduce((total, item) => total + item.preco * item.quantidade, 0);
    const frete = subtotal === 0 || subtotal >= 299 ? 0 : 19.9;
    const total = subtotal + frete;

    contadorCarrinho.textContent = quantidadeTotal;
    subtotalCarrinho.textContent = formatarMoeda(subtotal);
    freteCarrinho.textContent = formatarMoeda(frete);
    totalCarrinho.textContent = formatarMoeda(total);

    if (carrinhoCompras.length === 0) {
        itensCarrinho.innerHTML = '<p class="carrinho-vazio">Seu carrinho esta vazio.</p>';
        finalizarCompra.disabled = true;
        return;
    }

    finalizarCompra.disabled = false;
    itensCarrinho.innerHTML = carrinhoCompras.map((item) => `
        <div class="item-carrinho">
            <img src="${item.imagem}" alt="${item.nome}">
            <div>
                <h3>${item.nome}</h3>
                <div class="linha-item">
                    <strong>${formatarMoeda(item.preco)}</strong>
                    <button class="remover" type="button" onclick="removerDoCarrinho(${item.id})">Remover</button>
                </div>
                <div class="linha-item">
                    <div class="controle-quantidade">
                        <button type="button" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                        <span>${item.quantidade}</span>
                        <button type="button" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                    </div>
                    <span>${formatarMoeda(item.preco * item.quantidade)}</span>
                </div>
            </div>
        </div>
    `).join("");
}

function abrirPainelCarrinho() {
    carrinho.classList.add("aberto");
    overlay.classList.add("visivel");
}

function fecharPainelCarrinho() {
    carrinho.classList.remove("aberto");
    overlay.classList.remove("visivel");
}

function finalizarPedido() {
    if (carrinhoCompras.length === 0) {
        return;
    }

    carrinhoCompras = [];
    atualizarCarrinho();
    fecharPainelCarrinho();
    mensagemCompra.classList.add("visivel");

    setTimeout(() => {
        mensagemCompra.classList.remove("visivel");
    }, 2500);
}

botoesCategoria.forEach((botao) => {
    botao.addEventListener("click", () => {
        botoesCategoria.forEach((item) => item.classList.remove("ativo"));
        botao.classList.add("ativo");
        categoriaAtual = botao.dataset.categoria;
        renderizarProdutos();
    });
});

botaoBusca.addEventListener("click", () => {
    termoBusca = campoBusca.value.trim();
    renderizarProdutos();
});

campoBusca.addEventListener("input", () => {
    termoBusca = campoBusca.value.trim();
    renderizarProdutos();
});

ordenarProdutos.addEventListener("change", renderizarProdutos);
botaoTema.addEventListener("click", () => document.body.classList.toggle("tema-escuro"));
abrirCarrinho.addEventListener("click", abrirPainelCarrinho);
fecharCarrinho.addEventListener("click", fecharPainelCarrinho);
overlay.addEventListener("click", fecharPainelCarrinho);
finalizarCompra.addEventListener("click", finalizarPedido);

renderizarProdutos();
atualizarCarrinho();
