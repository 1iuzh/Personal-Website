document.addEventListener('DOMContentLoaded', () => {
    if (!Array.isArray(navData)) {
        return;
    }

    renderCategories(navData);
    renderFooterStats(navData);
    renderHeaderNav(navData);
    bindSearchToggle();
    bindSearchTabs();
    bindSearchInput();
    bindUptimeCounter();
    bindBackToTop();
});

function renderCategories(navData) {
    const gridContainer = document.querySelector('.grid-container');
    if (!gridContainer) return;

    const fragment = document.createDocumentFragment();

    navData.forEach((category, index) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.id = `category-${index}`;

        const title = document.createElement('h2');
        title.textContent = category.title;

        const linkContainer = document.createElement('div');
        linkContainer.className = 'link-container';

        category.links.forEach(link => {
            linkContainer.appendChild(createLinkBlock(link));
        });

        gridItem.appendChild(title);
        gridItem.appendChild(linkContainer);
        fragment.appendChild(gridItem);
    });

    gridContainer.appendChild(fragment);
}

function createLinkBlock(link) {
    const linkBlock = document.createElement('div');
    linkBlock.className = 'link-block';

    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.name;

    if (link.icon) {
        const icon = document.createElement('img');
        icon.src = link.icon;
        icon.alt = `${link.name}图标`;
        icon.loading = 'lazy';
        icon.referrerPolicy = 'no-referrer';
        icon.onerror = () => { icon.style.display = 'none'; };
        anchor.prepend(icon);
    }

    linkBlock.appendChild(anchor);
    return linkBlock;
}

function renderFooterStats(navData) {
    const categoryCount = navData.length;
    const linkCount = navData.reduce((sum, category) => sum + category.links.length, 0);

    const footerCatCount = document.getElementById('footer-cat-count');
    const footerLinkCount = document.getElementById('footer-link-count');
    if (footerCatCount) footerCatCount.textContent = categoryCount;
    if (footerLinkCount) footerLinkCount.textContent = linkCount;
}

function renderHeaderNav(navData) {
    const headerNavInner = document.querySelector('.header-nav-inner');
    if (!headerNavInner) return;

    navData.forEach((category, index) => {
        const a = document.createElement('a');
        a.href = `#category-${index}`;
        a.className = 'header-nav-link';
        a.textContent = category.title;
        headerNavInner.appendChild(a);
    });
}

function bindSearchToggle() {
    const toggleBtn = document.getElementById('search-toggle');
    const closeBtn = document.getElementById('search-close');
    const panel = document.getElementById('search-panel');
    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
        if (panel.hidden) {
            openSearchPanel();
        } else {
            closeSearchPanel();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSearchPanel);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !panel.hidden) {
            closeSearchPanel();
        }
    });

    document.addEventListener('click', (event) => {
        if (panel.hidden) return;
        const clickedInsidePanel = panel.contains(event.target);
        const clickedToggle = toggleBtn.contains(event.target);
        if (!clickedInsidePanel && !clickedToggle) {
            closeSearchPanel();
        }
    });
}

function openSearchPanel() {
    const toggleBtn = document.getElementById('search-toggle');
    const panel = document.getElementById('search-panel');
    const searchInput = document.getElementById('site-search');
    if (!panel) return;

    panel.hidden = false;
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    if (searchInput) searchInput.focus();
}

function closeSearchPanel() {
    const toggleBtn = document.getElementById('search-toggle');
    const panel = document.getElementById('search-panel');
    if (!panel) return;

    panel.hidden = true;
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
    }
}

function bindSearchTabs() {
    const tabs = Array.from(document.querySelectorAll('.search-tab'));
    if (tabs.length === 0) return;

    const searchInput = document.getElementById('site-search');

    const selectTab = (tab, { focus = false } = {}) => {
        tabs.forEach(t => {
            const isSelected = t === tab;
            t.classList.toggle('active', isSelected);
            t.setAttribute('aria-checked', String(isSelected));
            t.tabIndex = isSelected ? 0 : -1;
        });
        currentEngine = tab.dataset.engine;
        if (focus) tab.focus();
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            selectTab(tab);
            if (searchInput) searchInput.focus();
        });

        tab.addEventListener('keydown', (event) => {
            let targetIndex = null;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                targetIndex = (index + 1) % tabs.length;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                targetIndex = (index - 1 + tabs.length) % tabs.length;
            }
            if (targetIndex !== null) {
                event.preventDefault();
                selectTab(tabs[targetIndex], { focus: true });
            }
        });
    });
}

let currentEngine = 'google';

function bindSearchInput() {
    const searchInput = document.getElementById('site-search');
    if (!searchInput) return;

    const engineUrlBuilders = {
        google: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
        bing: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
        baidu: (q) => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`
    };

    searchInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;

        const query = searchInput.value.trim();
        if (!query) return;

        const buildUrl = engineUrlBuilders[currentEngine] || engineUrlBuilders.google;
        window.open(buildUrl(query), '_blank');
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === '/' && document.activeElement !== searchInput) {
            event.preventDefault();
            openSearchPanel();
        }
    });
}

function bindUptimeCounter() {
    const uptimeEl = document.getElementById('footer-uptime');
    if (!uptimeEl) return;

    const startDate = new Date('2025-01-11T00:00:00');
    const pad = (num) => String(num).padStart(2, '0');

    const updateUptime = () => {
        const diffMs = Date.now() - startDate.getTime();

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        uptimeEl.textContent = `${days}天 ${pad(hours)}小时 ${pad(minutes)}分钟 ${pad(seconds)}秒`;
    };

    updateUptime();
    setInterval(updateUptime, 1000);
}

function bindBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    let ticking = false;

    const updateVisibility = () => {
        backToTop.classList.toggle('show', window.scrollY > 400);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateVisibility);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
