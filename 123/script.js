document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');

    if (!gridContainer || !Array.isArray(navData)) {
        return;
    }

    // ---------------------------------------------------------
    // 渲染分类卡片
    // ---------------------------------------------------------
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
                icon.onerror = () => { icon.style.display = 'none'; };
                anchor.prepend(icon);
            }

            linkBlock.appendChild(anchor);
            linkContainer.appendChild(linkBlock);
        });

        gridItem.appendChild(title);
        gridItem.appendChild(linkContainer);
        fragment.appendChild(gridItem);
    });

    gridContainer.appendChild(fragment);

    // ---------------------------------------------------------
    // 页脚统计
    // ---------------------------------------------------------
    const categoryCount = navData.length;
    const linkCount = navData.reduce((sum, category) => sum + category.links.length, 0);

    const footerCatCount = document.getElementById('footer-cat-count');
    const footerLinkCount = document.getElementById('footer-link-count');
    if (footerCatCount) footerCatCount.textContent = categoryCount;
    if (footerLinkCount) footerLinkCount.textContent = linkCount;

    // ---------------------------------------------------------
    // 页脚分类索引
    // ---------------------------------------------------------
    const footerCategories = document.getElementById('footer-categories');
    if (footerCategories) {
        navData.slice(0, 8).forEach((category, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#category-${index}`;
            a.textContent = category.title;
            li.appendChild(a);
            footerCategories.appendChild(li);
        });
    }

    // ---------------------------------------------------------
    // 顶部分类快捷导航
    // ---------------------------------------------------------
    const headerNavInner = document.querySelector('.header-nav-inner');
    if (headerNavInner) {
        navData.forEach((category, index) => {
            const a = document.createElement('a');
            a.href = `#category-${index}`;
            a.className = 'header-nav-link';
            a.textContent = category.title;
            headerNavInner.appendChild(a);
        });
    }

    // ---------------------------------------------------------
    // 搜索框：仅做网页搜索，不再过滤本地网址
    // ---------------------------------------------------------
    const searchInput = document.getElementById('site-search');
    let currentEngine = 'google';

    // 搜索引擎切换
    const searchTabs = document.querySelectorAll('.search-tab');
    searchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            searchTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentEngine = tab.dataset.engine;
            searchInput.focus();
        });
    });

    if (searchInput) {
        // 回车进行网页搜索
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const query = searchInput.value.trim();
                if (!query) return;

                let searchUrl;
                switch (currentEngine) {
                    case 'baidu':
                        searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
                        break;
                    case 'bing':
                        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                        break;
                    case 'google':
                    default:
                        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                        break;
                }
                window.open(searchUrl, '_blank');
            }
        });

        // "/" 快速聚焦搜索框
        document.addEventListener('keydown', (event) => {
            if (event.key === '/' && document.activeElement !== searchInput) {
                event.preventDefault();
                searchInput.focus();
            }
        });
    }

    // ---------------------------------------------------------
    // 网络授时时钟（带秒）
    // ---------------------------------------------------------
    let timeOffset = 0;      // 网络时间与本地时间的毫秒差
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    async function syncNetworkTime() {
        try {
            const res = await fetch('https://worldtimeapi.org/api/ip');
            const data = await res.json();
            const serverTime = new Date(data.datetime);
            timeOffset = serverTime.getTime() - Date.now();
            if (data.timezone) timeZone = data.timezone;
        } catch (err) {
            console.warn('网络授时失败， fallback 到本地时间');
            timeOffset = 0;
        }
    }

    function getSyncedTime() {
        return new Date(Date.now() + timeOffset);
    }

    function updateClock() {
        const now = getSyncedTime();
        const timeEl = document.getElementById('clock-time');
        const dateEl = document.getElementById('clock-date');

        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: timeZone
            });
        }

        if (dateEl) {
            const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
            dateEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`;
        }
    }

    // 首次同步并启动
    syncNetworkTime().then(() => {
        updateClock();
        setInterval(updateClock, 1000);
    });
    // 每 10 分钟重新同步一次，防止本地时钟漂移
    setInterval(syncNetworkTime, 60000 * 10);

// ---------------------------------------------------------
// 运行时长（从 2025-01-11 开始计算）
// ---------------------------------------------------------
const uptimeEl = document.getElementById('footer-uptime');
if (uptimeEl) {
    const startDate = new Date('2025-01-11T00:00:00');
    
    const updateUptime = () => {
        const now = new Date();
        const diffMs = now - startDate;
        
        // 计算天、时、分、秒
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        // 格式化：补零显示（如 01 时 05 分 08 秒）
        const pad = (num) => String(num).padStart(2, '0');
        
        uptimeEl.textContent = `${days}天 ${pad(hours)}小时 ${pad(minutes)}分钟 ${pad(seconds)}秒`;
    };
    
    updateUptime();
    setInterval(updateUptime, 1000); // 每秒更新一次
}

    // ---------------------------------------------------------
    // 返回顶部
    // ---------------------------------------------------------
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 400);
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});