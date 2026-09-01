/**
 * 复制校验和到剪贴板
 * @param {HTMLElement} el - 包含 .v 子元素的校验和标签
 */
function copyChecksum(el) {
    var value = el.querySelector('.v').textContent.trim();

    // 优先使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function() {
            showCopyHint(el);
        })['catch'](function() {
            fallbackCopy(value, el);
        });
    } else {
        fallbackCopy(value, el);
    }
}

/**
 * 显示复制成功的提示
 */
function showCopyHint(el) {
    var hint = el.querySelector('.copy-hint');
    hint.classList.add('show');
    setTimeout(function() {
        hint.classList.remove('show');
    }, 1800);
}

/**
 * 降级复制方案（使用 textarea）
 */
function fallbackCopy(value, el) {
    var ta = document.createElement('textarea');
    ta.value = value;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();

    try {
        document.execCommand('copy');
        showCopyHint(el);
    } catch (e) {
        // 静默失败
    }

    document.body.removeChild(ta);
}