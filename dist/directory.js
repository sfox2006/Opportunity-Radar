// Organisation profiles and links are distinct from live program verification.
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
  function matchingPrograms(org, records = opportunities) {
    const names = new Set([org.name, ...org.aliases].map(nameKey));
    return records.filter(item => {
      const name = item.organisation || '';
      return [name, ...name.split(' / ')].some(part => names.has(nameKey(part)));
    });
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
          const count = matchingPrograms(org).length;
          const url = safeUrl(org.website?.url);
          const label = org.website?.type === 'about' ? 'About us' : 'Homepage';
          return `<article class="organisation-card"><h4>${escape(org.name)}</h4>
            ${org.location ? `<p>${escape(org.location)}</p>` : ''}
            ${org.profile?.description ? `<p class="organisation-description">${escape(org.profile.description)}</p>` : '<p class="missing-source">Organisation profile awaiting verification.</p>'}
            <p>${count} ${count === 1 ? 'open opportunity' : 'open opportunities'}</p>
            <div class="organisation-actions">
            ${count ? `<a class="organisation-program-link" href="#programs" data-organisation-programs="${escape(org.id)}" aria-label="View ${count} open ${count === 1 ? 'opportunity' : 'opportunities'} at ${escape(org.name)}">View open opportunities ↑</a>` : ''}
            ${url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(org.website.label || label)} ↗</a>`
              : '<span class="missing-source">Official website unavailable</span>'}</div></article>`;
        }).join('')}</div></details>`;
    }).join('');
    document.getElementById('directory-count').textContent = `${shown} of ${radarRegistry.organisations.length} directory entries`;
    if (!shown) directory.innerHTML = '<p class="empty-state">No organisations match that search.</p>';
  }
  directory.addEventListener('click', event => {
    const link = event.target.closest('[data-organisation-programs]');
    if (!link) return;
    const org = radarRegistry.organisations.find(entry => entry.id === link.dataset.organisationPrograms);
    if (!org) return;
    const future = typeof openingSoon === 'undefined' ? [] : openingSoon;
    const records = matchingPrograms(org, [...opportunities, ...future]);
    if (!matchingPrograms(org).length) { event.preventDefault(); renderDirectory(); return; }
    event.preventDefault();
    showOrganisationPrograms(org.name, records.map(item => item.id));
  });
  queryInput.addEventListener('input', renderDirectory);
  document.getElementById('organisation-count').textContent = radarRegistry.organisations.length;
  document.getElementById('organisation-region-count').textContent = radarRegistry.groups.length;
  renderDirectory();
})();
