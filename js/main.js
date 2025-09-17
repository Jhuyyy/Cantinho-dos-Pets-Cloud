// === MODALIDADE ESCURO/CLARO ===
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
  body.className = theme;
  const icon = themeToggle.querySelector('.theme-icon');
  if (theme === 'dark') {
    icon.textContent = '🌙';
    themeToggle.classList.add('dark');
  } else {
    icon.textContent = '☀️';
    themeToggle.classList.remove('dark');
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}

function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  if (body.classList.contains('dark')) {
    applyTheme('light');
    saveTheme('light');
  } else {
    applyTheme('dark');
    saveTheme('dark');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
});

// === CARREGAR ANIMAIS ===
async function carregarAnimais() {
    const container = document.getElementById('animais-lista') || document.getElementById('destaques');
    if (!container) return;

    try {
        const response = await fetch('/api/animals.php');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const animais = await response.json();

        if (animais.length > 0) {
            container.innerHTML = animais.map(animal => `
                <div class="card-animal">
                    <img src="${animal.foto_url || 'https://virapet.ong.br/wp-content/uploads/2025/05/o-que-e-um-cachorro-vira-lata-1024x585.webp' + (animal.tipo === 'cachorro' ? 'dog' : animal.tipo === 'gato' ? 'cat' : 'pet')}" alt="${animal.nome}">
                    <h3>${animal.nome}</h3>
                    <p>${animal.idade} meses • ${animal.raca || 'Vira-lata'} • ${animal.porte}</p>
                    <small>ONG: ${animal.ongNome}</small>
                    <button class="btn-secondary" onclick="abrirModal('${animal.id}', '${animal.nome}')">Tenho Interesse</button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>Nenhum animal disponível para adoção.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar animais:', error);
        container.innerHTML = '<p>Erro ao carregar animais. Tente novamente.</p>';
    }
}

function abrirModal(animalId, animalNome) {
    document.getElementById('animal-id').value = animalId;
    document.getElementById('modal-interesse').style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal-interesse').style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target.id === 'modal-interesse') {
        document.getElementById('modal-interesse').style.display = 'none';
    }
});

document.getElementById('form-interesse')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const res = await fetch('/api/interests.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (result.success) {
            alert('Interesse enviado! A ONG entrará em contato em breve.');
            document.getElementById('modal-interesse').style.display = 'none';
            e.target.reset();
        } else {
            alert('Erro ao enviar interesse. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao enviar interesse:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
});

const filtroTipo = document.getElementById('filtro-tipo');
const filtroPorte = document.getElementById('filtro-porte');

if (filtroTipo && filtroPorte) {
    [filtroTipo, filtroPorte].forEach(el => {
        el.addEventListener('change', async () => {
            let url = '/api/animals.php';
            const tipo = filtroTipo.value;
            const porte = filtroPorte.value;

            if (tipo || porte) {
                url += '?' + new URLSearchParams({ tipo, porte }).toString();
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const animais = await response.json();
                const container = document.getElementById('animais-lista');

                if (container) {
                    container.innerHTML = animais.length > 0 
                        ? animais.map(animal => `
                            <div class="card-animal">
                                <img src="${animal.foto_url || 'https://source.unsplash.com/random/600x400/?' + (animal.tipo === 'cachorro' ? 'dog' : animal.tipo === 'gato' ? 'cat' : 'pet')}" alt="${animal.nome}">
                                <h3>${animal.nome}</h3>
                                <p>${animal.idade} meses • ${animal.raca || 'Vira-lata'} • ${animal.porte}</p>
                                <small>ONG: ${animal.ongNome}</small>
                                <button class="btn-secondary" onclick="abrirModal('${animal.id}', '${animal.nome}')">Tenho Interesse</button>
                            </div>
                        `).join('')
                        : '<p>Nenhum animal encontrado com esses filtros.</p>';
                }
            } catch (error) {
                console.error('Erro ao filtrar animais:', error);
                const container = document.getElementById('animais-lista');
                if (container) {
                    container.innerHTML = '<p>Erro ao carregar animais filtrados.</p>';
                }
            }
        });
    });
}

async function carregarOngs() {
    const select = document.querySelector('select[name="ong_id"]');
    if (!select) return;

    select.innerHTML = '<option value="">Carregando ONGs...</option>';

    try {
        const response = await fetch('/api/orgs.php');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const ongs = await response.json();

        if (Array.isArray(ongs) && ongs.length > 0) {
            select.innerHTML = '';
            ongs.forEach(ong => {
                const option = document.createElement('option');
                option.value = ong.id;
                option.textContent = ong.nome;
                select.appendChild(option);
            });
        } else {
            select.innerHTML = '<option value="">Nenhuma ONG cadastrada</option>';
        }
    } catch (error) {
        console.error('Erro ao carregar ONGs:', error);
        select.innerHTML = '<option value="">Erro ao carregar ONGs</option>';
    }
}

document.getElementById('form-cadastro')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const res = await fetch('/api/cadastro.php', {
            method: 'POST',
            body: new URLSearchParams(data)
        });

        const result = await res.json();
        const msg = document.getElementById('mensagem-cadastro');

        if (result.success) {
            msg.innerHTML = `<p style="color:green;">✅ ${result.message}</p>`;
            e.target.reset();
        } else {
            msg.innerHTML = `<p style="color:red;">❌ ${result.error}</p>`;
            if (result.hint) {
                msg.innerHTML += `<p style="color:#6A5ACD; font-size:0.9rem;">Dica: ${result.hint}</p>`;
            }
        }
    } catch (error) {
        console.error('Erro ao cadastrar animal:', error);
        const msg = document.getElementById('mensagem-cadastro');
        msg.innerHTML = `<p style="color:red;">❌ Erro de conexão. Tente novamente.</p>`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    carregarAnimais();
    // carregarOngs(); // Removido porque não usamos mais seleção de ONG
});