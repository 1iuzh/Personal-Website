        // --- DOM 元素 ---
        const resultDiv = document.getElementById('result');                    // 获取显示结果的 div 元素
        const queryBtn = document.getElementById('query-btn');                  // 获取查询按钮元素
        const refreshBtn = document.getElementById('refresh-btn');              // 获取刷新按钮元素
        const stopBtn = document.getElementById('stop-btn');                    // 获取停止按钮元素
        const queryLoader = document.getElementById('query-loader');            // 获取查询加载指示器元素
        const queryIcon = document.getElementById('query-icon');                // 获取查询按钮图标元素
        const queryInput = document.getElementById('queryInput');               // 获取查询输入框元素
        const typeSelect = document.getElementById('type');                     // 获取记录类型选择框元素
        const providerSelect = document.getElementById('provider');             // 获取 DNS 服务商选择框元素
        const inputHint = document.getElementById('inputHint');                 // 获取输入提示元素
        const initialMessageDiv = document.getElementById('initial-message');   // 获取初始消息提示框元素
        const themeToggleBtn = document.getElementById('theme-toggle-btn');     // 获取主题切换按钮元素
        
        // --- 全局变量 & 常量 ---
        const cache = new Map();                                        // 前端缓存，存储查询结果
        let isQuerying = false;                                         // 标记当前是否正在进行查询
        let currentController = null;                                   // 当前查询的 AbortController，用于中断 fetch 请求
        let currentQueryValue = '';                                     // 当前查询输入框的值（用于刷新按钮判断）
        const LS_KEYS = {                                               // LocalStorage 键名常量
            THEME: 'dns_tool_theme',                                    // 主题设置键名
            TYPE: 'dns_tool_last_type',                                 // 上次选择的记录类型键名
            PROVIDER: 'dns_tool_last_provider'                          // 上次选择的服务商键名
        };
        // 主题切换按钮的 SVG 图标
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`; // 浅色模式图标 (太阳)
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`; // 深色模式图标 (月亮)
        
        // --- DNS 服务商配置 (图标已省略) ---
        const API_ENDPOINTS = {
            alidns: { url: 'https://dns.alidns.com/resolve', headers: { 'Accept': 'application/dns-json' }, name: 'Aliyun DNS', icon: `` }, // 阿里云 DNS 配置
            cloudflare: { url: 'https://cloudflare-dns.com/dns-query', headers: { 'Accept': 'application/dns-json' }, name: 'Cloudflare DNS', icon: `` }, // Cloudflare DNS 配置
            google: { url: 'https://dns.google/resolve', headers: { 'Accept': 'application/dns-json' }, name: 'Google Public DNS', icon: `` }  // Google DNS 配置
        };
        
        // --- DNS 状态码映射 ---
        const DNS_STATUS = {
            0: 'NOERROR',    // 成功
            1: 'FORMERR',    // 格式错误
            2: 'SERVFAIL',   // 服务器失败
            3: 'NXDOMAIN',   // 域名不存在
            4: 'NOTIMP',     // 未实现
            5: 'REFUSED',    // 拒绝
            // 根据需要添加更多状态码
        };
        
        // --- 主题管理 ---
        /**
         * 应用指定的主题（'light' 或 'dark'）
         * @param {string} theme - 要应用的主题 ('light' 或 'dark')
         */
        function applyTheme(theme) {
            document.body.dataset.theme = theme;                                        // 在 body 上设置 data-theme 属性
            themeToggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;           // 更新切换按钮的图标
            themeToggleBtn.title = theme === 'dark' ? '切换到浅色主题' : '切换到深色主题';   // 更新切换按钮的 title
            try {
                localStorage.setItem(LS_KEYS.THEME, theme);                             // 将主题保存到 localStorage
            } catch (e) {
                console.warn("LocalStorage 错误:", e);                                   // 处理 localStorage 异常
            }
        }
        
        /**
         * 切换当前主题（浅色/深色）
         */
        function toggleTheme() {
            const currentTheme = document.body.dataset.theme;                   // 获取当前主题
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';        // 计算新主题
            applyTheme(newTheme);                                               // 应用新主题
        }
        
        /**
         * 加载初始主题（优先从 localStorage 读取，其次根据系统偏好，默认为浅色）
         */
         function loadInitialTheme() {
                    let preferredTheme = 'light'; // Set default to light
                    try {
                        const savedTheme = localStorage.getItem(LS_KEYS.THEME);
                        // If a theme preference is saved in localStorage, use it
                        if (savedTheme === 'light' || savedTheme === 'dark') {
                            preferredTheme = savedTheme;
                        }
                        // Otherwise, the preferredTheme remains 'light'
                    } catch (e) {
                         console.warn("LS Error setting theme:", e);
                    }
                    applyTheme(preferredTheme); // Apply the determined theme
                }
        
        // --- 核心逻辑 ---
        /**
         * 执行 DNS 查询
         * @param {boolean} [forceRefresh=false] - 是否强制刷新（忽略缓存并添加时间戳）
         */
        async function lookup(forceRefresh = false) {
            if (isQuerying) return;                                           // 如果正在查询，则直接返回，防止重复触发
        
            const inputValue = queryInput.value.trim();                       // 获取并清理输入框的值
            const type = typeSelect.value;                                    // 获取选择的记录类型
            const provider = providerSelect.value;                            // 获取选择的 DNS 服务商
            const inputTypeResult = detectInputType(inputValue);              // 检测输入内容的类型（ipv4, ipv6, domain, invalid）
        
            // --- 输入验证 ---
            if (inputTypeResult === 'invalid' || !inputValue) {                 // 验证输入是否有效
                showMessage('请输入有效的域名或 IP 地址。', 'error');               // 显示错误消息
                queryInput.focus();                                             // 输入框获取焦点
                return;                                                         // 中断执行
            }
            if (type === 'PTR' && (inputTypeResult === 'domain' || inputTypeResult === 'invalid')) { // PTR 查询的特殊验证
                showMessage('PTR 查询需要输入有效的 IP 地址。', 'error');           // 显示 PTR 查询的错误消息
                queryInput.focus();                                             // 输入框获取焦点
                return;                                                         // 中断执行
            }
        
            // --- PTR 查询的特殊处理 ---
            let queryName = inputValue;                                       // 默认查询名称为输入值
            if (type === 'PTR') {                                             // 如果是 PTR 查询
                queryName = ipToArpa(inputValue);                             // 将 IP 地址转换为 .arpa 格式
                if (!queryName) {                                             // 如果转换失败
                    showMessage('无法格式化 IP 地址进行 PTR 查询。', 'error');    // 显示错误消息
                    return;                                                   // 中断执行
                }
            }
        
            // 开始查询时隐藏初始提示信息
            if (initialMessageDiv) initialMessageDiv.style.display = 'none';
        
            try {
                // --- 设置查询状态 ---
                isQuerying = true;                                                  // 标记为正在查询
                currentQueryValue = inputValue;                                     // 保存当前查询值（用于刷新按钮状态）
                currentController = new AbortController();                          // 创建 AbortController 以便中断请求
                const cacheKey = getCacheKey(queryName, type, provider);            // 生成缓存键
                updateButtonStates();                                               // 更新按钮状态（禁用查询/刷新，启用停止）
                showLoaderMessage(`正在查询 ${type} 记录 for "${inputValue}"...`);    // 在结果区域显示加载提示
        
                // --- 检查缓存 ---
                if (!forceRefresh && cache.has(cacheKey)) {                             // 如果不强制刷新且缓存中有数据
                    const cachedData = cache.get(cacheKey);                             // 从缓存获取数据
                    console.log(`使用缓存数据: ${cacheKey}`);                             // 打印日志
                    handleApiResponse(cachedData, provider, inputValue, type, true);    // 处理缓存数据（标记 fromCache=true）
                    saveSettings();                                                     // 即使是缓存命中，也保存当前选项
                    return;                                                             // 中断执行，不再发起网络请求
                }
        
                // --- 发起网络请求 ---
                console.log(`正在获取数据: ${cacheKey} (查询 ${queryName})`);                   // 打印日志
                const data = await lookupWithRetry(queryName, type, provider, forceRefresh); // 调用带重试逻辑的查询函数
        
                // --- 处理响应 ---
                if (data) {                                                     // 如果成功获取到数据
                    cache.set(cacheKey, data);                                  // 将数据存入缓存
                    handleApiResponse(data, provider, inputValue, type, false); // 处理 API 响应（标记 fromCache=false）
                } else {                                                        // 如果 lookupWithRetry 返回 null/undefined (理论上应该抛出错误)
                    showMessage('查询失败，无法从服务器获取数据。', 'error');        // 显示通用错误消息
                }
                saveSettings();                                                 // 查询成功后保存当前选项
        
            } catch (error) {
                // --- 错误处理 ---
                if (error.name === 'AbortError') {                            // 如果是用户手动中止查询
                    console.log('查询已被用户中止。');                           // 打印中止日志
                    if (resultDiv.querySelector('.message-info')) {           // 如果结果区显示的是加载信息
                        clearResults(true);                                   // 清空结果（silent=true，不显示初始信息）
                        if (initialMessageDiv) initialMessageDiv.style.display = 'flex'; // 重新显示初始提示信息
                    }
                // 如果不是加载信息（即已经显示了结果），则中止时不清除已有结果
                } else {                                                      // 其他类型的错误
                    console.error('查询错误:', error);                         // 打印详细错误日志
                    showMessage(`查询时发生错误：${error.message || '未知错误'}`, 'error'); // 在结果区域显示错误信息
                }
            } finally {
                // --- 清理状态 ---
                isQuerying = false;                                           // 标记查询结束
                currentController = null;                                     // 清除 AbortController
                updateButtonStates();                                         // 恢复按钮状态
            }
        }
        
        /**
         * 停止当前正在进行的查询
         */
        function stopQuery() {
            if (currentController && !currentController.signal.aborted) {     // 如果存在 AbortController 且请求未被中止
                currentController.abort();                                      // 调用 abort() 方法中止 fetch 请求
                // 可选：在这里显示一个“已停止”的消息，或者让 lookup 函数的 finally 块处理界面更新
            }
        }
        
        /**
         * 使用重试逻辑执行 fetch 查询
         * @param {string} queryName - 要查询的名称 (域名或 .arpa 格式的 IP)
         * @param {string} type - 记录类型
         * @param {string} provider - DNS 服务商标识符
         * @param {boolean} [forceRefresh=false] - 是否强制刷新
         * @param {number} [retries=2] - 剩余重试次数
         * @param {number} [delay=1000] - 重试延迟时间 (毫秒)
         * @returns {Promise<object|null>} 返回解析后的 JSON 数据或在最终失败时抛出错误
         */
        async function lookupWithRetry(queryName, type, provider, forceRefresh = false, retries = 2, delay = 1000) {
            const { url, headers } = API_ENDPOINTS[provider];                 // 获取服务商的 URL 和请求头
            // 构建 DoH API URL，包含查询名称、类型，以及强制刷新时的缓存破坏参数
            const apiUrl = `${url}?name=${encodeURIComponent(queryName)}&type=${type}${forceRefresh ? '&_=' + Date.now() : ''}`;
        
            try {
                const response = await fetch(apiUrl, {                        // 发起 fetch 请求
                    method: 'GET',                                            // 使用 GET 方法
                    headers: headers,                                         // 设置请求头 (主要是 Accept)
                    signal: currentController?.signal,                        // 关联 AbortController 的 signal 以便中止
                    mode: 'cors',                                             // 启用 CORS
                    cache: 'no-cache',                                        // 禁用浏览器 HTTP 缓存
                });
        
                // --- 检查响应状态 ---
                if (!response.ok) {                                           // 如果 HTTP 状态码不是 2xx
                    let errorBody = '';
                    try { errorBody = await response.text(); } catch (_) { }  // 尝试读取响应体以获取更多错误信息
                    throw new Error(`HTTP ${response.status} ${response.statusText}. ${errorBody}`); // 抛出 HTTP 错误
                }
        
                // --- 检查响应类型 ---
                const contentType = response.headers.get("content-type");     // 获取 Content-Type 响应头
                // 验证 Content-Type 是否为 'application/dns-json' 或 'application/json'
                if (!contentType || (!contentType.includes("application/dns-json") && !contentType.includes("application/json"))) {
                    let responseText = '';
                    try { responseText = await response.text(); } catch (_) { } // 尝试读取响应体
                    throw new Error(`服务器返回了非预期的格式: ${contentType || '未知'}. 内容: ${responseText.substring(0, 100)}`); // 抛出内容类型错误
                }
        
                // --- 检查空响应体 ---
                const responseClone = response.clone();                     // 克隆响应对象以安全地读取响应体
                const responseText = await responseClone.text();            // 读取响应体文本
                if (!responseText) {                                        // 如果响应体为空
                    throw new Error("服务器返回了空的响应体。");                // 抛出空响应体错误
                }
        
                // --- 解析 JSON ---
                return await response.json();                               // 解析原始响应的 JSON 数据并返回
        
            } catch (error) {
                if (error.name === 'AbortError') throw error;               // 如果是中止错误，直接向上抛出
        
                // --- 重试逻辑 ---
                console.warn(`尝试失败: ${queryName} (${type}) via ${provider}: ${error.message}. 剩余重试次数: ${retries}`); // 打印重试警告
                if (retries > 0) {                                              // 如果还有剩余重试次数
                    await new Promise(resolve => setTimeout(resolve, delay));   // 等待指定的延迟时间
                    // 在等待期间检查是否已被中止
                    if (currentController?.signal.aborted) throw new Error("重试等待期间查询被中止。");
                    // 递归调用自身，减少重试次数并增加延迟时间
                    return lookupWithRetry(queryName, type, provider, forceRefresh, retries - 1, delay * 1.5);
                } else {                                                      // 如果已无重试次数
                    console.error(`所有重试均失败: ${queryName} (${type}) via ${provider}. 最后错误: ${error.message}`); // 打印最终失败日志
                    throw error;                                              // 向上抛出最后的错误
                }
            }
        }
        
        /**
         * 处理从 API 获取或从缓存读取的 DNS 响应数据
         * @param {object} data - DNS 响应数据 (JSON 对象)
         * @param {string} provider - DNS 服务商标识符
         * @param {string} originalInput - 用户原始输入的值
         * @param {string} recordType - 查询的记录类型
         * @param {boolean} fromCache - 数据是否来自缓存
         */
        function handleApiResponse(data, provider, originalInput, recordType, fromCache) {
            const status = data?.Status ?? -1;                                // 获取 DNS 响应状态码，默认为 -1 (错误)
            const statusString = DNS_STATUS[status] || `Status ${status}`;    // 将状态码映射为字符串
            console.log(`响应状态: ${status} (${statusString})`);              // 打印响应状态日志
        
            if (status === 0) { // NOERROR - 查询成功
                const records = parseRecords(data);                           // 解析 Answer 部分的记录
                if (records.length > 0) {                                     // 如果有记录
                    showResults(records, provider, originalInput, recordType, fromCache, statusString);     // 显示结果列表
                } else {                                                                                    // 如果没有记录 (但状态是 NOERROR)
                    showEmptyState(originalInput, recordType, provider, '查询成功，但未返回任何记录。');         // 显示空状态提示
                }
            } else if (status === 3) { // NXDOMAIN - 域名或记录不存在
                showEmptyState(originalInput, recordType, provider, '域名或记录不存在 (NXDOMAIN)。');          // 显示 NXDOMAIN 的空状态提示
            } else { // 其他错误状态 (SERVFAIL, FORMERR, REFUSED, etc.)
                let extraInfo = '';
                // 尝试从 Authority 部分获取 SOA 记录信息，可能有助于诊断问题
                if (data?.Authority && data.Authority.length > 0 && data.Authority[0].type === 6 /*SOA*/) {
                    extraInfo = `权威服务器信息: ${data.Authority[0].data}`;
                }
                showMessage(`查询失败: ${statusString}. ${extraInfo}`, 'error'); // 显示包含状态码和其他信息的错误消息
            }
        }
        
        /**
         * 从 DNS JSON 响应中解析 Answer 记录
         * @param {object} data - DNS 响应数据
         * @returns {Array<object>} 解析后的记录数组，每个对象包含 name, type, data, TTL
         */
        function parseRecords(data) {
            let records = [];
            // 兼容不同 DoH 服务可能的大小写差异 ('Answer' vs 'answer')
            const answer = data?.Answer || data?.answer || [];              // 获取 Answer 部分，默认为空数组
            if (Array.isArray(answer)) {                                    // 确保 Answer 是一个数组
                records = answer.map(item => ({                             // 遍历 Answer 数组
                    name: item.name,                                        // 记录名称
                    type: mapTypeToString(item.type),                       // 将记录类型数字转换为字符串 (如 1 -> 'A')
                    data: item.data,                                        // 记录值
                    TTL: item.TTL,                                          // TTL (生存时间)
                }));
            }
            return records;                                                 // 返回解析后的记录数组
        }
        
        // --- 显示函数 ---
        /**
         * 在结果区域显示查询到的记录列表
         * @param {Array<object>} records - 解析后的记录数组
         * @param {string} provider - DNS 服务商标识符
         * @param {string} originalInput - 用户原始输入的值
         * @param {string} recordType - 查询的记录类型
         * @param {boolean} fromCache - 数据是否来自缓存
         * @param {string} statusString - DNS 状态码字符串
         */
        function showResults(records, provider, originalInput, recordType, fromCache, statusString) {
            const providerInfo = API_ENDPOINTS[provider];                 // 获取服务商信息 (名称, 图标等)
            resultDiv.innerHTML = `
                        <div class="result-header fade-in">
                            <span>查询 "${originalInput}" 的 ${recordType} 记录</span> <small>${fromCache ? '缓存' : '实时'} | ${statusString}</small> </div>
                        <div class="result-body fade-in">
                            <div class="record-grid">                             ${records.map((record, index) => `
                                    <div class="record-card">                     <span class="record-type">${record.type}</span> <div class="record-detail">
                                            <strong>名称:</strong> <span data-type="NAME">${record.name}</span> </div>
                                        <div class="record-detail">
                                            <strong>类型:</strong> <span data-type="TYPE">${record.type}</span> </div>
                                        <div class="record-detail">
                                            <strong>值:</strong>
                                            <span id="record-value-${index}" data-type="${record.type}">${formatRecordData(record.data, record.type)}</span>
                                            <button class="copy-btn" title="复制值" onclick="copyToClipboard('record-value-${index}')">
                                                ${copyIconSvg()}
                                            </button>
                                        </div>
                                        <div class="record-detail">
                                            <strong>TTL:</strong> <span data-type="TTL">${formatTTL(record.TTL)}</span> </div>
                                        <div class="provider-info">                 ${providerInfo.icon || ''} 数据来源: ${providerInfo.name}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
        }
        
        /**
         * 在结果区域显示空状态或特定消息（如 NXDOMAIN）
         * @param {string} originalInput - 用户原始输入的值
         * @param {string} recordType - 查询的记录类型
         * @param {string} provider - DNS 服务商标识符
         * @param {string} [message='未找到相关记录。'] - 要显示的主要消息文本
         */
        function showEmptyState(originalInput, recordType, provider, message = '未找到相关记录。') {
            const providerInfo = API_ENDPOINTS[provider];                 // 获取服务商信息
            // 获取记录类型的友好名称 (例如 'A (IPv4 Address)')
            const typeName = typeSelect.querySelector(`option[value="${recordType}"]`)?.textContent || recordType;
            resultDiv.innerHTML = `
                        <div class="empty-state fade-in">                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                             </svg>
                             <h3>未找到记录</h3>                                   <p>在 ${providerInfo.name} 上查询 "${originalInput}" 的 ${typeName} 记录时，${message}</p> <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">请检查输入或尝试其他选项。</p> </div>
                    `;
        }
        
        /**
         * 在结果区域显示通用消息（信息、错误、成功、警告）
         * @param {string} message - 要显示的消息文本
         * @param {'info' | 'error' | 'success' | 'warning'} [type='info'] - 消息类型，决定图标和样式
         */
        function showMessage(message, type = 'info') {
            let iconSvg = '';
            // 根据消息类型选择不同的 SVG 图标
            switch (type) {
                case 'error': iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`; break; // 错误图标
                case 'success': iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`; break; // 成功图标
                case 'warning': iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`; break; // 警告图标 (使用与错误相同的图标)
                case 'info': default: iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`; break; // 信息图标
            }
        
            resultDiv.innerHTML = `
                        <div class="message message-${type} fade-in">          ${iconSvg}                                         <div>${message}</div>                             </div>
                    `;
        }
        /**
         * 显示加载状态的消息（是对 showMessage 的封装）
         * @param {string} [message='正在查询...'] - 要显示的加载文本
         */
        function showLoaderMessage(message = '正在查询...') { showMessage(message, 'info'); }
        
        // --- 工具函数 ---
        /**
         * 清空结果区域
         * @param {boolean} [silent=false] - 如果为 true，则不重新显示初始消息
         */
        function clearResults(silent = false) {
            resultDiv.innerHTML = '';                                       // 清空结果 div 的内容
            if (!silent && initialMessageDiv) {                             // 如果不是静默清除且初始消息元素存在
                const clonedInitial = initialMessageDiv.cloneNode(true);    // 克隆初始消息元素
                clonedInitial.style.display = 'flex';                       // 确保克隆的元素是可见的
                resultDiv.appendChild(clonedInitial);                       // 将克隆的初始消息添加到结果区域
            }
            currentQueryValue = '';                                         // 清空当前查询值
            updateButtonStates();                                           // 更新按钮状态（例如禁用刷新按钮）
        }
        
        /**
         * 清空前端查询缓存
         */
        function clearCache() {
            const cacheSize = cache.size;                                 // 获取当前缓存大小
            cache.clear();                                                // 清空 Map 缓存
            console.log('前端缓存已清除。');                                 // 打印日志
            showMessage(`已清除 ${cacheSize} 条前端缓存记录。`, 'success');   // 显示成功清除的消息
        }
        
        /**
         * 将指定元素内容的文本复制到剪贴板
         * @param {string} elementId - 包含要复制文本的元素的 ID
         */
        function copyToClipboard(elementId) {
            const element = document.getElementById(elementId);           // 获取目标元素
            // 优先使用 innerText (考虑换行)，其次 textContent
            const textToCopy = element ? element.innerText || element.textContent : '';
            const button = element?.nextElementSibling;                   // 获取紧跟在文本元素后的兄弟元素（假定是复制按钮）
        
            if (!textToCopy) {                                             // 如果没有文本可复制
                console.warn("无法复制，元素内容为空:", elementId);            // 打印警告
                return;                                                    // 中断执行
            }
        
            // --- 优先使用现代 Clipboard API ---
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {      // 尝试写入剪贴板
                    console.log('已复制:', textToCopy);                      // 打印成功日志
                    if (button) {                                           // 如果找到了按钮
                        const originalContent = button.innerHTML;           // 保存按钮原始图标
                        button.innerHTML = checkIconSvg();                  // 显示“已复制”的勾号图标
                        button.disabled = true;                             // 短暂禁用按钮
                        setTimeout(() => {                                  // 设置延时恢复
                            button.innerHTML = originalContent;             // 恢复原始图标
                            button.disabled = false;                        // 重新启用按钮
                        }, 1500);                                           // 1.5 秒后恢复
                    }
                }).catch(err => {                                           // 如果 Clipboard API 失败
                    console.error('使用 navigator.clipboard 复制失败:', err); // 打印错误日志
                    fallbackCopyToClipboard(textToCopy, button);            // 调用旧版回退方法
                });
            } else {
                // --- 回退到旧版 document.execCommand ---
                fallbackCopyToClipboard(textToCopy, button);                // 调用旧版回退方法
            }
        }
        
        /**
         * 使用 document.execCommand 的回退方法复制文本
         * @param {string} text - 要复制的文本
         * @param {HTMLElement | null} button - 关联的复制按钮 (可选)
         */
        function fallbackCopyToClipboard(text, button) {
            const textArea = document.createElement("textarea");        // 创建一个临时的 textarea 元素
            textArea.value = text;                                      // 将文本放入 textarea
            textArea.style.position = "fixed";                          // 固定定位，防止页面滚动 (尤其在 Edge 中)
            textArea.style.opacity = "0";                               // 使其完全透明不可见
            document.body.appendChild(textArea);                        // 添加到页面中
            textArea.focus();                                           // 获取焦点
            textArea.select();                                          // 选择 textarea 中的文本
            try {
                const successful = document.execCommand('copy');        // 执行复制命令
                if (successful) {                                       // 如果复制成功
                    console.log('使用回退方法复制成功:', text);            // 打印成功日志
                    if (button) {                                       // 更新按钮状态（同上）
                        const originalContent = button.innerHTML;
                        button.innerHTML = checkIconSvg();
                        button.disabled = true;
                        setTimeout(() => {
                            button.innerHTML = originalContent;
                            button.disabled = false;
                        }, 1500);
                    }
                } else {
                    throw new Error('document.execCommand 返回 false');   // 如果命令返回 false，则抛出错误
                }
            } catch (err) {                                              // 如果执行命令时出错
                console.error('回退复制失败:', err);                       // 打印错误日志
                showMessage('复制失败: 浏览器不支持或权限不足。', 'error');   // 显示复制失败的消息
            }
            document.body.removeChild(textArea);                         // 从页面中移除临时 textarea
        }
        
        /**
         * 根据当前状态更新按钮（查询、刷新、停止）的启用/禁用状态和加载指示器
         */
        function updateButtonStates() {
            const hasInput = queryInput.value.trim().length > 0;        // 检查输入框是否有内容
            queryBtn.disabled = isQuerying || !hasInput;                // 查询按钮：正在查询或无输入时禁用
            // 刷新按钮：正在查询或从未成功查询过时禁用 (currentQueryValue 为空)
            refreshBtn.disabled = isQuerying || !currentQueryValue;
            stopBtn.disabled = !isQuerying;                             // 停止按钮：仅在正在查询时启用
        
            queryLoader.style.display = isQuerying ? 'inline-block' : 'none';   // 加载指示器：正在查询时显示
            queryIcon.style.display = isQuerying ? 'none' : 'inline-block';     // 查询图标：正在查询时隐藏
        }
        
        /**
         * 生成用于缓存的唯一键
         * @param {string} name - 查询名称 (域名或 .arpa IP)
         * @param {string} type - 记录类型
         * @param {string} provider - 服务商标识符
         * @returns {string} 缓存键
         */
        function getCacheKey(name, type, provider) { return `${name.toLowerCase().trim()}-${type.toUpperCase()}-${provider}`; }
        
        // --- 输入验证和辅助函数 ---
        // IPv4 地址的正则表达式
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        // 相对健壮的 IPv6 地址正则表达式 (可能未覆盖所有边缘情况)
        const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/i;
        // 域名正则表达式，允许国际化域名 (IDN)，但只做基本结构检查
        const domainRegex = /^(?:[a-zA-Z0-9\u00a1-\uffff](?:[a-zA-Z0-9\u00a1-\uffff-]{0,61}[a-zA-Z0-9\u00a1-\uffff])?\.)+[a-zA-Z\u00a1-\uffff]{2,}$/i;
        
        /**
         * 检测输入字符串的类型
         * @param {string} input - 输入字符串
         * @returns {'ipv4' | 'ipv6' | 'domain' | 'invalid'} 输入类型
         */
        function detectInputType(input) {
            if (!input) return 'invalid';                               // 空输入无效
            if (ipv4Regex.test(input)) return 'ipv4';                   // 匹配 IPv4
            if (ipv6Regex.test(input)) return 'ipv6';                   // 匹配 IPv6
            // 简单的预检查，排除明显不是域名的输入
            if (input.includes(' ') || input.startsWith('.') || input.endsWith('.')) return 'invalid';
            if (domainRegex.test(input)) return 'domain';                 // 匹配域名
            return 'invalid';                                             // 其他情况视为无效
        }
        
        /**
         * 将 IP 地址转换为用于 PTR 查询的 .arpa 格式域名
         * @param {string} ip - IPv4 或 IPv6 地址
         * @returns {string | null} 转换后的 .arpa 域名，如果输入无效则返回 null
         */
        function ipToArpa(ip) {
            const type = detectInputType(ip);                           // 检测 IP 类型
            if (type === 'ipv4') {
                // IPv4: 反转地址部分，加上 .in-addr.arpa. 后缀
                return ip.split('.').reverse().join('.') + '.in-addr.arpa.';
            } else if (type === 'ipv6') {
                // IPv6: 转换为完整 32 位十六进制表示，反转每个字符，用点分隔，加上 .ip6.arpa. 后缀
                // 注意：此处的 IPv6 扩展和格式化是简化的，可能需要更专业的库来处理所有情况
                try {
                    // 移除可能存在的范围 ID (如 %eth0)
                    let addr = ip.includes('%') ? ip.split('%')[0] : ip;
                    // 简化扩展 :: 的处理
                    let parts = addr.split('::');
                    let prefix = (parts[0] || '').split(':').filter(Boolean); // :: 前的部分
                    let suffix = (parts[1] || '').split(':').filter(Boolean); // :: 后的部分
                    let missing = 8 - prefix.length - suffix.length;          // 计算 :: 代表的 0 段数量
                    let zeros = Array(missing).fill('0000');                  // 创建 0 段数组
                    // 拼接成完整的 8 段
                    let fullParts = [...prefix, ...zeros, ...suffix];
                    // 将每段补全为 4 位十六进制，并连接成 32 位字符串
                    let hex = fullParts.map(part => part.padStart(4, '0')).join('');
                    if (hex.length !== 32) throw new Error("无效的扩展长度"); // 检查长度是否正确
                    // 反转每个字符，用点分隔，添加后缀
                    return hex.split('').reverse().join('.') + '.ip6.arpa.';
                } catch (e) {
                    console.error("格式化 IPv6 到 ARPA 时出错:", e);
                    return null;                                            // 格式化失败返回 null
                }
            }
            return null;                                                    // 非 IPv4 或 IPv6 返回 null
        }
        
        /**
         * 将 DNS 记录类型数值映射为字符串表示
         * @param {number} typeValue - DNS 记录类型数值 (例如 1, 28)
         * @returns {string} 字符串表示 (例如 'A', 'AAAA') 或 'TYPExx'
         */
        function mapTypeToString(typeValue) {
            // 常见的 DNS 记录类型映射
            const typeMap = { 1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR', 15: 'MX', 16: 'TXT', 28: 'AAAA', 33: 'SRV', 43: 'DS', 46: 'RRSIG', 47: 'NSEC', 48: 'DNSKEY', 255: 'ANY', 257: 'CAA' };
            return typeMap[typeValue] || `TYPE${typeValue}`;              // 返回映射值，或 'TYPExx' 作为回退
        }
        
        /**
         * 将 TTL 秒数格式化为更易读的字符串 (秒, 分钟, 小时, 天)
         * @param {number} ttlSeconds - TTL 值 (秒)
         * @returns {string} 格式化后的 TTL 字符串或 'N/A'
         */
        function formatTTL(ttlSeconds) {
            if (typeof ttlSeconds !== 'number' || ttlSeconds < 0) return 'N/A'; // 无效输入返回 N/A
            if (ttlSeconds < 60) return `${ttlSeconds} 秒`;                 // 小于 1 分钟，显示秒
            if (ttlSeconds < 3600) return `${Math.round(ttlSeconds / 60)} 分钟`; // 小于 1 小时，显示分钟
            if (ttlSeconds < 86400) return `${Math.round(ttlSeconds / 3600)} 小时`; // 小于 1 天，显示小时
            return `${Math.round(ttlSeconds / 86400)} 天`;                  // 大于等于 1 天，显示天
        }
        
        /**
         * 根据记录类型格式化记录数据 (data) 以提高可读性
         * @param {string | any} data - 原始记录数据
         * @param {string} type - 记录类型字符串 (例如 'SOA', 'MX')
         * @returns {string | any} 格式化后的数据 (通常是 HTML 字符串) 或原始数据
         */
        function formatRecordData(data, type) {
            // --- SOA 记录格式化 ---
            if (type === 'SOA' && typeof data === 'string') {
                const parts = data.split(/\s+/);                          // 按空格分割 SOA 数据
                if (parts.length >= 7) {                                  // 确保有足够的部分
                    // 返回包含 MNAME, RNAME, Serial 和各个计时器的 HTML 结构
                    return `<div style="line-height: 1.5;">MNAME: ${parts[0]}<br>RNAME: ${parts[1].replace('.', '@')}<br>Serial: ${parts[2]} Refresh: ${formatTTL(parseInt(parts[3]))} Retry: ${formatTTL(parseInt(parts[4]))} Expire: ${formatTTL(parseInt(parts[5]))} MinTTL: ${formatTTL(parseInt(parts[6]))}</div>`;
                }
            }
            // --- SRV 记录格式化 ---
            if (type === 'SRV' && typeof data === 'string') {
                const parts = data.split(/\s+/);                          // 按空格分割 SRV 数据
                if (parts.length >= 4) {                                  // 确保有优先级、权重、端口和目标
                    return `优先级: ${parts[0]} 权重: ${parts[1]} 端口: ${parts[2]} 目标: ${parts[3]}`;
                }
            }
            // --- CAA 记录格式化 ---
            if (type === 'CAA' && typeof data === 'string') {
                const parts = data.split(/\s+/);                          // 按空格分割 CAA 数据
                if (parts.length >= 3) {                                  // 确保有标志、标签和值
                    let value = parts.slice(2).join(' ');                 // 值部分可能包含空格
                    // 移除值部分可能存在的引号
                    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                    return `标志: ${parts[0]} 标签: ${parts[1]} 值: ${value}`;
                }
            }
            // --- TXT 记录格式化 ---
            if (type === 'TXT' && typeof data === 'string') {
                // 移除 TXT 记录值两端的引号（如果存在）
                return data.startsWith('"') && data.endsWith('"') ? data.slice(1, -1) : data;
            }
            // --- MX 记录格式化 ---
            if (type === 'MX' && typeof data === 'string') {
                const parts = data.split(/\s+/);                          // 按空格分割 MX 数据
                if (parts.length >= 2) {                                  // 确保有优先级和服务器名称
                    return `优先级 ${parts[0]}, 服务器 ${parts.slice(1).join(' ')}`; // 组合优先级和服务器名称
                }
            }
            // --- 默认返回原始数据 ---
            return data;
        }
        
        /**
         * 返回复制按钮的 SVG 图标 HTML
         * @returns {string} SVG HTML 字符串
         */
        function copyIconSvg() {
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>`;
        }
        /**
         * 返回表示“已复制”的勾号 SVG 图标 HTML
         * @returns {string} SVG HTML 字符串
         */
        function checkIconSvg() {
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="color: var(--accent-color);"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;
        }
        
        
        // --- localStorage 设置 ---
        /**
         * 将当前选择的记录类型和服务商保存到 localStorage
         */
        function saveSettings() {
            try {
                localStorage.setItem(LS_KEYS.TYPE, typeSelect.value);         // 保存记录类型
                localStorage.setItem(LS_KEYS.PROVIDER, providerSelect.value); // 保存服务商
            } catch (e) {
                console.warn("LocalStorage 错误:", e);                         // 处理 localStorage 异常
            }
        }
        
        /**
         * 从 localStorage 加载上次保存的记录类型和服务商设置
         */
        function loadSettings() {
            try {
                const lastType = localStorage.getItem(LS_KEYS.TYPE);            // 读取上次的类型
                const lastProvider = localStorage.getItem(LS_KEYS.PROVIDER);    // 读取上次的服务商
                // 如果读取到了值，并且下拉框中存在该选项，则设置下拉框的值
                if (lastType && typeSelect.querySelector(`option[value="${lastType}"]`)) {
                    typeSelect.value = lastType;
                }
                if (lastProvider && providerSelect.querySelector(`option[value="${lastProvider}"]`)) {
                    providerSelect.value = lastProvider;
                }
            } catch (e) {
                console.warn("LocalStorage 错误:", e);                       // 处理 localStorage 异常
            }
        }
        
        // --- 事件监听器 ---
        // 监听输入框的回车键事件
        queryInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {                                        // 如果按下的是回车键
                e.preventDefault();                                         // 阻止默认的回车行为（如表单提交）
                lookup(false);                                              // 执行查询（非强制刷新）
            }
        });
        // 监听输入框的输入事件
        queryInput.addEventListener('input', () => {
            const value = queryInput.value.trim();                          // 获取输入值
            const type = detectInputType(value);                            // 检测输入类型
            let hintText = ''; let hintClass = '';                          // 初始化提示文本和样式类
        
            // 根据输入类型和当前选择的记录类型，设置不同的提示
            if (type === 'ipv4' || type === 'ipv6') {                                   // 如果输入是 IP 地址
                hintText = '检测到 IP 地址，建议选择 PTR 查询。'; hintClass = 'warning';
            } else if (type === 'domain' && typeSelect.value === 'PTR') {               // 如果输入是域名但选择了 PTR 查询
                hintText = '检测到域名，PTR 查询需输入 IP 地址。'; hintClass = 'warning';
            } else if (value.length > 0 && type === 'invalid') {                        // 如果输入不为空但格式无效
                hintText = '输入格式似乎无效。'; hintClass = 'error';
            }
            inputHint.textContent = hintText;                               // 更新提示元素的文本
            inputHint.className = `input-hint ${hintClass}`;                // 更新提示元素的样式类
            updateButtonStates();                                           // 更新按钮状态（主要是查询按钮是否可用）
        });
        // 监听记录类型选择框的变化事件
        typeSelect.addEventListener('change', saveSettings);                // 变化时保存设置到 localStorage
        // 监听服务商选择框的变化事件
        providerSelect.addEventListener('change', saveSettings);            // 变化时保存设置到 localStorage
        // 监听主题切换按钮的点击事件
        themeToggleBtn.addEventListener('click', toggleTheme);              // 点击时切换主题
        
        // --- 初始化 ---
        loadInitialTheme();                                                 // 首先加载并应用主题
        typeSelect.value = 'A';
        providerSelect.value = 'alidns';
        
        updateButtonStates();                                               // 根据初始状态设置按钮状态
        
        // 如果页面加载时输入框已有内容（例如浏览器自动填充），则隐藏初始提示信息
        if (queryInput.value.trim() && initialMessageDiv) {
                    initialMessageDiv.style.display = 'none';
        }