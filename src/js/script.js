// DADOS DOS PRODUTOS

const produtos = [
  {
    id: 1,
    nome: "Spider-Man Superior Suit",
    categoria: "Marvel",
    descricao: "Action figure do Homem-Aranha com traje Superior e braços mecânicos articulados. Escala 1:6.",
    preco: 849.90,
    imagem: "src/img/spiderman.jpg"
  },
  {
    id: 2,
    nome: "Venom — Symbiote Rage",
    categoria: "Marvel",
    descricao: "Estátua premium do Venom em pose de ataque com tentáculos de simbionte. Base de pedra inclusa.",
    preco: 1249.00,
    imagem: "src/img/venom.jpg"
  },
  {
    id: 3,
    nome: "Miles Morales — Into the Spider-Verse",
    categoria: "Marvel",
    descricao: "Figure articulado do Miles com headphone, spray e tênis exclusivos. Estilo Spider-Verse.",
    preco: 620.00,
    imagem: "src/img/miles.jpg"
  },
  {
    id: 4,
    nome: "Carnificina — Lethal Protector",
    categoria: "Marvel",
    descricao: "Estátua do Carnage em pose dinâmica com filamentos de simbionte vermelho. Edição limitada.",
    preco: 1390.00,
    imagem: "src/img/carnificina.jpg"
  },
  {
    id: 5,
    nome: "Duende Verde — Pumpkin Bomb",
    categoria: "Marvel",
    descricao: "Figura do Duende Verde com abóboras iluminadas e base de rocha. Detalhes pintados à mão.",
    preco: 980.00,
    imagem: "src/img/duende.jpg"
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
  { nome: "Spider-Man Superior Suit",             qtd: 1, preco: 849.90,  imagem: "/src/img/spiderman.jpg" },
  { nome: "Venom — Symbiote Rage",                qtd: 2, preco: 1249.00, imagem: "/src/img/venom.jpg" },
  { nome: "Miles Morales — Into the Spider-Verse",qtd: 1, preco: 620.00,  imagem: "/src/img/miles.jpg" },
  { nome: "Carnificina — Lethal Protector",       qtd: 1, preco: 1390.00, imagem: "/src/img/carnificina.jpg" },
  { nome: "Duende Verde — Pumpkin Bomb",          qtd: 3, preco: 980.00,  imagem: "/src/img/duende.jpg" },
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