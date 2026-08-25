/**
 * 网址导航 · 页面交互脚本
 * ---------------------------------------------------------
 * 各功能模块拆成独立函数，DOMContentLoaded 里只负责按顺序调用它们，
 * 方便以后单独修改某一块而不用通读整个文件。
 */
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

/**
 * 渲染主体的分类卡片网格。
 * 每个分类生成一个 .grid-item，内部再逐条渲染网址链接。
 */
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

/**
 * 根据单条网址数据，生成一个 .link-block（图标 + 链接文字）。
 */
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
        // 图标来自第三方接口：不带 referrer，避免把本站地址和访问者信息
        // 一并发给对方服务器；同时不影响图标本身的正常加载。
        icon.referrerPolicy = 'no-referrer';
        icon.onerror = () => { icon.style.display = 'none'; };
        anchor.prepend(icon);
    }

    linkBlock.appendChild(anchor);
    return linkBlock;
}

/**
 * 更新页脚的“分类总数 / 收录网站”统计数字。
 */
function renderFooterStats(navData) {
    const categoryCount = navData.length;
    const linkCount = navData.reduce((sum, category) => sum + category.links.length, 0);

    const footerCatCount = document.getElementById('footer-cat-count');
    const footerLinkCount = document.getElementById('footer-link-count');
    if (footerCatCount) footerCatCount.textContent = categoryCount;
    if (footerLinkCount) footerLinkCount.textContent = linkCount;
}

/**
 * 页首的分类快捷导航条：为每个分类生成一个跳转链接。
 */
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

/**
 * 搜索面板展开/收起：点击页首的放大镜图标，从顶部滑出搜索框
 * （仿 Apple 官网的搜索交互）。点击关闭按钮、按 Esc、或点击面板
 * 外部区域，都会收起面板。
 */
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

    // 点击面板和搜索图标以外的区域时自动收起
    document.addEventListener('click', (event) => {
        if (panel.hidden) return;
        const clickedInsidePanel = panel.contains(event.target);
        const clickedToggle = toggleBtn.contains(event.target);
        if (!clickedInsidePanel && !clickedToggle) {
            closeSearchPanel();
        }
    });
}

/**
 * 展开搜索面板，并把焦点移到搜索输入框。
 * 单独抽成函数，方便 "/" 快捷键（见 bindSearchInput）复用。
 */
function openSearchPanel() {
    const toggleBtn = document.getElementById('search-toggle');
    const panel = document.getElementById('search-panel');
    const searchInput = document.getElementById('site-search');
    if (!panel) return;

    panel.hidden = false;
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    if (searchInput) searchInput.focus();
}

/**
 * 收起搜索面板，焦点还给放大镜按钮，方便继续用键盘操作。
 */
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

/**
 * 搜索引擎切换（Google / Bing / 百度）。
 * 这组按钮语义上是“单选一个选项”，所以用 role="radio" 而不是
 * role="tab"（tab 通常对应会切换内容面板的场景，这里并没有面板切换）。
 * 除了点击，还支持左右方向键在选项之间移动，符合 WAI-ARIA 的
 * radiogroup 键盘交互规范（俗称 roving tabindex）。
 */
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

// 当前选中的搜索引擎，供 bindSearchInput() 读取。
let currentEngine = 'google';

/**
 * 搜索框：只做“跳转到对应搜索引擎的结果页”，不过滤本地网址。
 */
function bindSearchInput() {
    const searchInput = document.getElementById('site-search');
    if (!searchInput) return;

    const engineUrlBuilders = {
        google: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
        bing: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
        baidu: (q) => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`
    };

    // 回车触发搜索
    searchInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;

        const query = searchInput.value.trim();
        if (!query) return;

        const buildUrl = engineUrlBuilders[currentEngine] || engineUrlBuilders.google;
        window.open(buildUrl(query), '_blank');
    });

    // "/" 快速打开并聚焦搜索面板（输入框本身获得焦点时不重复触发）
    document.addEventListener('keydown', (event) => {
        if (event.key === '/' && document.activeElement !== searchInput) {
            event.preventDefault();
            openSearchPanel();
        }
    });
}

/**
 * 页脚“运行时长”计数器：从固定的起始时间累计到现在，每秒刷新一次。
 * 这里用的是访问者本地系统时间（new Date()），不依赖任何网络时间接口，
 * 所以没有额外的网络请求或跨域问题。
 */
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

/**
 * “返回顶部”悬浮按钮：滚动超过 400px 时显示，点击平滑滚动回顶部。
 * scroll 事件触发频率很高，这里用 requestAnimationFrame 做一次节流——
 * 同一帧内无论 scroll 事件触发多少次，只在下一帧真正执行一次判断，
 * 避免不必要的重复计算。
 *
 * 另外，页首左上角的站点 logo（brand-link）现在 href="#"，配合
 * html { scroll-behavior: smooth; } 天然就是一个“随时可点、无需等
 * 滚动 400px 才出现”的快速回顶部入口，不需要额外写 JS。
 */
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
