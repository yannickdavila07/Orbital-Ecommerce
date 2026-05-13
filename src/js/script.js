
// DADOS DOS PRODUTOS

const produtos = [
  {
    id: 1,
    nome: "Câmera Analógica Vintage",
    categoria: "Fotografia",
    descricao: "Capture momentos com a magia da película. Design clássico dos anos 80.",
    preco: 349.90,
    imagem: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    nome: "Fone Bluetooth Premium",
    categoria: "Áudio",
    descricao: "Som envolvente com cancelamento de ruído. Bateria de 40 horas.",
    preco: 589.00,
    imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    nome: "Relógio Minimalista",
    categoria: "Acessórios",
    descricao: "Design escandinavo com pulseira de couro genuíno. À prova d'água.",
    preco: 420.00,
    imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    nome: "Mochila Urban Explorer",
    categoria: "Bolsas",
    descricao: "Espaçosa e resistente. Compartimento para notebook de até 15 polegadas.",
    preco: 279.90,
    imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    nome: "Luminária de Mesa Arc",
    categoria: "Casa",
    descricao: "Iluminação LED ajustável com carregador wireless integrado.",
    preco: 198.00,
    imagem: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop"
  }
];


// FORMATAÇÃO DE MOEDA

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}


// INDEX.HTML — RENDERIZAR CARDS VIA DOM

function renderizarProdutos() {
  const grade = document.getElementById('grade-produtos');
  if (!grade) return;

  grade.innerHTML = '';

  produtos.forEach(produto => {
    const card = document.createElement('article');
    card.classList.add('card-produto');

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
      <div class="card-info">
        <p class="card-categoria">${produto.categoria}</p>
        <h2 class="card-nome">${produto.nome}</h2>
        <p class="card-descricao">${produto.descricao}</p>
        <div class="card-rodape">
          <span class="card-preco">${formatarMoeda(produto.preco)}</span>
          <button class="btn-comprar" onclick="mostrarNotificacao('${produto.nome}')">
            Comprar
          </button>
        </div>
      </div>
    `;

    grade.appendChild(card);
  });
}


// NOTIFICAÇÃO TOAST

function mostrarNotificacao(nome) {
  let notif = document.getElementById('notificacao');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notificacao';
    notif.classList.add('notificacao');
    document.body.appendChild(notif);
  }

  notif.textContent = `✓ "${nome}" adicionado ao carrinho!`;
  notif.classList.add('visivel');

  setTimeout(() => {
    notif.classList.remove('visivel');
  }, 2500);
}

// LOJA.HTML — CARRINHO COM REDUCE + DOM

const carrinho = [
  { nome: "Câmera Analógica Vintage",  qtd: 1, preco: 349.90, imagem: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120&h=80&fit=crop" },
  { nome: "Fone Bluetooth Premium",    qtd: 2, preco: 589.00, imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=80&fit=crop" },
  { nome: "Relógio Minimalista",        qtd: 1, preco: 420.00, imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=80&fit=crop" },
  { nome: "Mochila Urban Explorer",    qtd: 1, preco: 279.90, imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&h=80&fit=crop" },
  { nome: "Luminária de Mesa Arc",     qtd: 3, preco: 198.00, imagem: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=120&h=80&fit=crop" },
];

let totalAtual = 0;
let descontoAplicado = false;

// Calcula o total usando Array.reduce
function calcularTotal(itens) {
  return itens.reduce((acumulador, item) => {
    return acumulador + (item.preco * item.qtd);
  }, 0);
}

// Renderiza os itens do carrinho no DOM
function renderizarCarrinho() {
  const lista = document.getElementById('lista-carrinho');
  if (!lista) return;

  lista.innerHTML = '';

  carrinho.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('item-carrinho');

    li.innerHTML = `
      <img class="item-img" src="${item.imagem}" alt="${item.nome}" />
      <div>
        <p class="item-nome">${item.nome}</p>
        <p class="item-qtd">Qtd: ${item.qtd}</p>
      </div>
      <span class="item-preco">${formatarMoeda(item.preco * item.qtd)}</span>
    `;

    lista.appendChild(li);
  });

  // Atualiza o total no DOM usando Reduce
  totalAtual = calcularTotal(carrinho);
  atualizarExibicaoTotal(totalAtual);
}

// Atualiza o elemento <span> ou <h2> com o total formatado
function atualizarExibicaoTotal(valor) {
  const spanTotal = document.getElementById('total-compra');
  if (spanTotal) {
    spanTotal.textContent = formatarMoeda(valor);
  }

  const spanSubtotal = document.getElementById('subtotal');
  if (spanSubtotal) {
    spanSubtotal.textContent = formatarMoeda(calcularTotal(carrinho));
  }
}

// Aplica desconto de 10% usando Reduce ou manipulação do resultado anterior
function aplicarDesconto() {
  if (descontoAplicado) return;

  // Usando Reduce para calcular o total com desconto aplicado em cada item
  const totalComDesconto = carrinho.reduce((acumulador, item) => {
    const precoComDesconto = item.preco * item.qtd * 0.9; // 10% de desconto
    return acumulador + precoComDesconto;
  }, 0);

  totalAtual = totalComDesconto;
  descontoAplicado = true;

  // Atualiza o DOM
  atualizarExibicaoTotal(totalAtual);

  // Atualiza UI do botão
  const btn = document.getElementById('btn-desconto');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `✓ Desconto de 10% aplicado! <span class="badge-desconto">-10%</span>`;
  }

  // Exibe linha de desconto
  const linhaDesconto = document.getElementById('linha-desconto');
  if (linhaDesconto) {
    const valorDesconto = calcularTotal(carrinho) - totalAtual;
    linhaDesconto.style.display = 'flex';
    linhaDesconto.querySelector('span:last-child').textContent = `- ${formatarMoeda(valorDesconto)}`;
    linhaDesconto.querySelector('span:last-child').style.color = 'var(--cor-desconto)';
  }
}


// INICIALIZAÇÃO — detecta a página atual

document.addEventListener('DOMContentLoaded', () => {
  // Index — renderiza produtos
  renderizarProdutos();

  // Loja — renderiza carrinho
  renderizarCarrinho();

  // Botão de desconto
  const btnDesconto = document.getElementById('btn-desconto');
  if (btnDesconto) {
    btnDesconto.addEventListener('click', aplicarDesconto);
  }

  // Marca nav ativo
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('ativo');
    }
  });
});
