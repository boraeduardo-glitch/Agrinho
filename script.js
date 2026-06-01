const grid =
document.getElementById("grid");

const energiaTexto =
document.getElementById("energia");

const pontosTexto =
document.getElementById("pontos");

let energia = 200;
let pontos = 0;

let plantaSelecionada = null;

const plantas = {
  solar: {
    emoji: "☀️",
    custo: 50,
    dano: 1,
    classe: "solar"
  },

  vento: {
    emoji: "🌬️",
    custo: 75,
    dano: 2,
    classe: "vento"
  },

  agua: {
    emoji: "💧",
    custo: 100,
    dano: 3,
    classe: "agua"
  }
};

const celulas = [];

/* CRIAR GRID */

for (let linha = 0; linha < 5; linha++) {

  for (let coluna = 0; coluna < 9; coluna++) {

    const celula =
    document.createElement("div");

    celula.classList.add("celula");

    celula.dataset.linha = linha;
    celula.dataset.coluna = coluna;

    grid.appendChild(celula);

    celulas.push(celula);

    celula.addEventListener(
      "click",
      () => colocarPlanta(celula)
    );

  }

}

/* ESCOLHER PLANTA */

function selecionarPlanta(tipo) {

  plantaSelecionada = tipo;

}

/* COLOCAR PLANTA */

function colocarPlanta(celula) {

  if (!plantaSelecionada) return;

  if (celula.querySelector(".planta")) return;

  const dados =
  plantas[plantaSelecionada];

  if (energia < dados.custo) {

    alert("Energia insuficiente!");
    return;

  }

  energia -= dados.custo;

  atualizarHUD();

  const planta =
  document.createElement("div");

  planta.classList.add(
    "planta",
    dados.classe
  );

  planta.innerHTML = dados.emoji;

  celula.appendChild(planta);

  atacar(
    planta,
    parseInt(celula.dataset.linha),
    dados
  );

}

/* ATAQUE */

function atacar(planta, linha, dados) {

  setInterval(() => {

    const tiro =
    document.createElement("div");

    tiro.classList.add(
      "tiro",
      `tiro-${dados.classe}`
    );

    tiro.style.left = "80px";
    tiro.style.top = "50px";

    planta.appendChild(tiro);

    let posicao = 80;

    const mover =
    setInterval(() => {

      posicao += 12;

      tiro.style.left =
      posicao + "px";

      const inimigos =
      document.querySelectorAll(
        `.inimigo[data-linha="${linha}"]`
      );

      inimigos.forEach(inimigo => {

        const tiroRect =
        tiro.getBoundingClientRect();

        const inimigoRect =
        inimigo.getBoundingClientRect();

        if (

          tiroRect.left <
          inimigoRect.right &&

          tiroRect.right >
          inimigoRect.left

        ) {

          inimigo.vida -= dados.dano;

          tiro.remove();

          if (inimigo.vida <= 0) {

            inimigo.remove();

            energia += 25;
            pontos += 10;

            atualizarHUD();

          }

        }

      });

      if (posicao > 1200) {

        tiro.remove();
        clearInterval(mover);

      }

    }, 30);

  }, 1200);

}

/* INIMIGOS */

function criarInimigo() {

  const linha =
  Math.floor(Math.random() * 5);

  const inimigo =
  document.createElement("div");

  inimigo.classList.add("inimigo");

  const tipos = [
    "🏭",
    "🚗",
    "☢️",
    "🛢️"
  ];

  inimigo.innerHTML =
  tipos[Math.floor(Math.random() * tipos.length)];

  inimigo.dataset.linha = linha;

  inimigo.vida = 5;

  grid.appendChild(inimigo);

  let posicao = 1100;

  inimigo.style.top =
  (linha * 120 + 20) + "px";

  const mover =
  setInterval(() => {

    posicao -= 1.2;

    inimigo.style.left =
    posicao + "px";

    if (posicao <= 0) {

      alert(
        "A poluição destruiu a natureza 😢"
      );

      location.reload();

    }

  }, 20);

}

/* HUD */

function atualizarHUD() {

  energiaTexto.textContent =
  energia;

  pontosTexto.textContent =
  pontos;

}

/* SPAWN */

setInterval(() => {

  criarInimigo();

}, 2500);