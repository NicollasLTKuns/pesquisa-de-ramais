document.addEventListener("DOMContentLoaded", () => {
  fetch("ramal (2).csv")
    .then(res => res.text())
    .then(texto => {
      montarTabela(texto);
    });
});

function montarTabela(texto) {

  texto = texto.replace(/\uFEFF/g, ""); // remove BOM invisível

  const linhas = texto.trim().split(/\r?\n/);

  const thead = document.getElementById("cabecalho");
  const tbody = document.getElementById("corpo");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  // ===== CABEÇALHO =====
  const colunas = linhas[0].split(";");

  const trHead = document.createElement("tr");

  colunas.forEach(coluna => {
    const th = document.createElement("th");
    th.textContent = coluna.trim();
    trHead.appendChild(th);
  });

  thead.appendChild(trHead);

  // ===== CORPO =====
  for (let i = 1; i < linhas.length; i++) {

    if (!linhas[i].trim()) continue; // ignora linhas vazias

    const valores = linhas[i].split(";");

    const tr = document.createElement("tr");

    valores.forEach(valor => {
      const td = document.createElement("td");
      td.textContent = valor.trim();
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }
}


(function() {
  const q = document.getElementById('pesquisa');
  const hideInactive = document.getElementById('inativos');
  const tbody = document.querySelector('#t tbody');

  function norm(s) {
    return (s || '').toString().toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu,'');
  }

  function applyFilters() {
    const needle = norm(q.value);
    const hide = hideInactive.checked;

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.forEach(tr => {
      const text = norm(tr.innerText);

      const status = tr.children[3]?.innerText.trim().toUpperCase();
      const inactive = status === 'INATIVO';

      const okSearch = !needle || text.includes(needle);
      const okStatus = !hide || !inactive;

      tr.style.display = (okSearch && okStatus) ? '' : 'none';
    });
  }

  function sortRows() {
    const selected = document.querySelector('input[name="opcoes"]:checked');
    const key = selected ? selected.value : 'RAMAL';

    const colIndex = {'RAMAL':0,'NOME':1,'SETOR':2,'STATUS':3}[key] ?? 0;

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a,b) => {
      const av = (a.children[colIndex]?.innerText || '').trim();
      const bv = (b.children[colIndex]?.innerText || '').trim();

      if (key === 'RAMAL') {
        const an = parseInt(av.replace(/\D/g,''), 10);
        const bn = parseInt(bv.replace(/\D/g,''), 10);
        if (!isNaN(an) && !isNaN(bn)) return an - bn;
      }

      return av.localeCompare(bv, 'pt-BR', { sensitivity: 'base' });
    });

    rows.forEach(r => tbody.appendChild(r));
    applyFilters();
  }

  q.addEventListener('input', applyFilters);
  hideInactive.addEventListener('change', applyFilters);
  document.querySelectorAll('input[name="opcoes"]').forEach(r =>
    r.addEventListener('change', sortRows)
  );

  sortRows();
  applyFilters();
})();