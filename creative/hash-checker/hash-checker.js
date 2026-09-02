// 点击 MD5 校验值胶囊：复制到剪贴板，并显示"已复制"提示
function copyChecksum(el) {
    var value = el.querySelector('.v').textContent.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
        // 优先使用现代 Clipboard API
        navigator.clipboard.writeText(value).then(function() {
            showCopyHint(el);
        })['catch'](function() {
            fallbackCopy(value, el);
        });
    } else {
        // 不支持 Clipboard API（如旧浏览器/非安全上下文）时走兼容方案
        fallbackCopy(value, el);
    }
}

// 显示复制成功提示气泡，1.8 秒后自动消失
function showCopyHint(el) {
    var hint = el.querySelector('.copy-hint');
    hint.classList.add('show');
    setTimeout(function() {
        hint.classList.remove('show');
    }, 1800);
}

// 兼容方案：借助隐藏 textarea + document.execCommand('copy') 完成复制
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
        // 复制失败时静默处理，不影响页面其他功能
    }

    document.body.removeChild(ta);
}
