async function carregarAnimais() {
    const response = await fetch('/api/animals.php');
    const animais = await response.json();
  
    const container = document.getElementById('animais-lista') || document.getElementById('destaques');
  
    if (!container) return;
  
    container.innerHTML = animais.slice(0, 3).map(animal => `
      <div class="card-animal">
        <img src="${animal.foto_url || 'https://source.unsplash.com/random/600x400/?' + (animal.tipo === 'cachorro' ? 'dog' : animal.tipo === 'gato' ? 'cat' : 'pet')}" alt="${animal.nome}">
        <h3>${animal.nome}</h3>
        <p>${animal.idade} meses • ${animal.raca || 'Vira-lata'} • ${animal.porte}</p>
        <small>ONG: ${animal.ong_nome}</small>
        <button class="btn-secondary" onclick="abrirModal('${animal.id}', '${animal.nome}')">Tenho Interesse</button>
      </div>
    `).join('');
  }
  
  function abrirModal(animalId, animalNome) {
    document.getElementById('animal-id').value = animalId;
    document.getElementById('modal-interesse').style.display = 'block';
  }
  
//   document.querySelector('.close').addEventListener('click', () => {
//     document.getElementById('modal-interesse').style.display = 'none';
//   });
  
  window.addEventListener('click', (e) => {
    if (e.target.id === 'modal-interesse') {
      document.getElementById('modal-interesse').style.display = 'none';
    }
  });
  
  document.getElementById('form-interesse')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
  
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
  });
  
  document.getElementById('form-cadastro')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("DAdos do pet:", data);
  
    const res = await fetch('/api/cadastro.php', {
      method: 'POST',
      body: new URLSearchParams(data)
    });
  
    const result = await res.json();
    const msg = document.getElementById('mensagem-cadastro');
    if (result.error) {
      msg.innerHTML = `<p style="color:red;">❌ ${result.error}</p>`;
    } else {
      msg.innerHTML = `<p style="color:green;">✅ Animal cadastrado com sucesso!</p>`;
      e.target.reset();
    }
  });
  
  async function carregarOngs() {
    const response = await fetch('/api/orgs.php');
    const ongs = await response.json();
    const select = document.querySelector('select[name="ong_id"]');
    if (select) {
      ongs.forEach(ong => {
        const option = document.createElement('option');
        option.value = ong.id;
        option.textContent = ong.nome;
        select.appendChild(option);
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    carregarAnimais();
    carregarOngs();
  
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
          const response = await fetch(url);
          const animais = await response.json();
          const container = document.getElementById('animais-lista');
          container.innerHTML = animais.map(animal => `
            <div class="card-animal">
              <img src="${animal.foto_url || 'https://source.unsplash.com/random/600x400/?' + (animal.tipo === 'cachorro' ? 'dog' : animal.tipo === 'gato' ? 'cat' : 'pet')}" alt="${animal.nome}">
              <h3>${animal.nome}</h3>
              <p>${animal.idade} meses • ${animal.raca || 'Vira-lata'} • ${animal.porte}</p>
              <small>ONG: ${animal.ong_nome}</small>
              <button class="btn-secondary" onclick="abrirModal('${animal.id}', '${animal.nome}')">Tenho Interesse</button>
            </div>
          `).join('');
        });
      });
    }
  });