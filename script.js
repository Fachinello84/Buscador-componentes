document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultsList = document.getElementById('resultsList');
  const siteList = document.getElementById('siteList');
  const siteName = document.getElementById('siteName');
  const siteUrl = document.getElementById('siteUrl');
  const addSiteBtn = document.getElementById('addSiteBtn');
  const statusMsg = document.getElementById('statusMsg');

  const defaultSites = [
    { name: "Mercado Livre", url: "https://www.mercadolivre.com.br/jms/mlb/ml.search?as_word=%s" },
    { name: "Mouser", url: "https://www.mouser.com/c/?q=%s" },
    { name: "DigiKey", url: "https://www.digikey.com/en/products/result?keywords=%s" },
    { name: "AliExpress", url: "https://www.aliexpress.com/wholesale?SearchText=%s" }
  ];

  function showMessage(text, isError = False) {
    statusMsg.textContent = text;
    statusMsg.style.color = isError ? 'red' : 'green';
    setTimeout(() => { statusMsg.textContent = ''; }, 3000);
  }

  function loadSites() {
    const saved = localStorage.getItem('sites');
    if (!saved) {
      localStorage.setItem('sites', JSON.stringify(defaultSites));
      return defaultSites;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return defaultSites;
    }
  }

  function saveSites(sites) {
    localStorage.setItem('sites', JSON.stringify(sites));
  }

  function renderSites() {
    const sites = loadSites();
    siteList.innerHTML = '';
    sites.forEach((site, index) => {
      const li = document.createElement('li');
      li.textContent = `${site.name} - ${site.url}`;
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remover';
      removeBtn.onclick = () => {
        sites.splice(index, 1);
        saveSites(sites);
        renderSites();
      };
      li.appendChild(removeBtn);
      siteList.appendChild(li);
    });
  }

  function renderResults(results) {
    resultsList.innerHTML = '';
    results.forEach(result => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = result.url;
      a.textContent = `${result.site} - Ver produto`;
      a.target = '_blank';
      li.appendChild(a);
      resultsList.appendChild(li);
    });
  }

  searchBtn.onclick = () => {
    const query = searchInput.value.trim();
    if (!query) return;
    const sites = loadSites();
    const results = sites.map(site => ({
      site: site.name,
      url: site.url.replace('%s', encodeURIComponent(query))
    }));
    renderResults(results);
  };

  addSiteBtn.onclick = () => {
    const name = siteName.value.trim();
    const url = siteUrl.value.trim();
    if (!name || !url || !url.includes('%s')) {
      showMessage('Preencha corretamente o nome e a URL (com %s)', true);
      return;
    }
    const sites = loadSites();
    sites.push({ name, url });
    saveSites(sites);
    siteName.value = '';
    siteUrl.value = '';
    renderSites();
    showMessage('Site adicionado com sucesso!');
  };

  renderSites();
});
