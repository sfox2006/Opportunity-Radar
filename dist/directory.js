// The directory is independent of program filters and does not claim current availability.
(() => {
  const directory = document.getElementById('organisation-directory');
  const queryInput = document.getElementById('organisation-query');
  const escape = value => String(value ?? '').replace(/[&<>"']/g,
    char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const searchKey = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const nameKey = value => searchKey(String(value).replace(/\s*\([A-Z0-9.& -]{2,}\)/g, '')).replace(/^the\s+/, '')
    .replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
  const safeUrl = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
    } catch { return ''; }
  };
  function programCount(org) {
    const names = new Set([org.name, ...org.aliases].map(nameKey));
    return opportunities.filter(item => {
      const name = item.organisation || '';
      return [name, ...name.split(' / ')].some(part => names.has(nameKey(part)));
    }).length;
  }
  function renderDirectory() {
    const query = searchKey(queryInput.value.trim());
    let shown = 0;
    directory.innerHTML = radarRegistry.groups.map(group => {
      const orgs = radarRegistry.organisations.filter(org => org.group === group.id &&
        searchKey([org.name, ...org.aliases, org.location, group.label].join(' ')).includes(query));
      shown += orgs.length;
      if (!orgs.length) return '';
      return `<details class="sector-directory"${query ? ' open' : ''}>
        <summary><h3>${escape(group.label)}</h3><span>${orgs.length} ${orgs.length === 1 ? 'entry' : 'entries'}</span></summary>
        <div class="organisation-grid">${orgs.map(org => {
          const count = programCount(org);
          const links = org.referenceUrls.map(safeUrl).filter(Boolean);
          return `<article class="organisation-card"><h4>${escape(org.name)}</h4>
            ${org.location ? `<p>${escape(org.location)}</p>` : ''}
            <p>${count} ${count === 1 ? 'program' : 'programs'} on this site</p>
            ${links.length ? `<div class="organisation-links">${links.map((url, index) =>
              `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">Reference page${links.length > 1 ? ` ${index + 1}` : ''} ↗</a>`).join('')}</div>`
              : '<span class="missing-source">Reference URL not supplied</span>'}
            <small>Newsletter reference · availability not checked here</small></article>`;
        }).join('')}</div></details>`;
    }).join('');
    document.getElementById('directory-count').textContent = `${shown} of ${radarRegistry.organisations.length} directory entries`;
    if (!shown) directory.innerHTML = '<p class="empty-state">No organisations match that search.</p>';
  }
  queryInput.addEventListener('input', renderDirectory);
  document.getElementById('organisation-count').textContent = radarRegistry.organisations.length;
  document.getElementById('organisation-region-count').textContent = radarRegistry.groups.length;
  renderDirectory();
})();
