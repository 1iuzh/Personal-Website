// 获取页面元素
const lengthInput             = document.getElementById("length");             // 获取密码长度输入元素
const decreaseLengthBtn       = document.getElementById("decrease-length");    // 获取减少长度按钮元素
const increaseLengthBtn       = document.getElementById("increase-length");    // 获取增加长度按钮元素
const containsDigitCheckbox   = document.getElementById("containsDigit");      // 获取包含数字复选框元素
const containsSymbolCheckbox  = document.getElementById("containsSymbol");     // 获取包含符号复选框元素
const containsLowercaseCheckbox = document.getElementById("containsLowercase"); // 获取包含小写字母复选框元素
const containsUppercaseCheckbox = document.getElementById("containsUppercase"); // 获取包含大写字母复选框元素
const pinModeCheckbox         = document.getElementById("pinMode");            // 获取启用 PIN 模式复选框元素
const withNoSymbolAtEdgeCheckbox = document.getElementById("withNoSymbolAtEdge"); // 获取首尾非符号复选框元素
const avoidAmbiguityCheckbox  = document.getElementById("avoidAmbiguity");     // 获取避免易混淆字符复选框元素
const enhanceReadabilityCheckbox = document.getElementById("enhanceReadability"); // 获取增强可读性复选框元素
const generateBtn             = document.getElementById("generate-btn");       // 获取生成密码按钮元素
const passwordOutputDiv       = document.getElementById("password");           // 获取显示密码的 div 元素
const copyBtn                 = document.getElementById("copy-btn");           // 获取复制密码按钮元素
const lengthErrorSpan         = document.getElementById("lengthError");        // 获取密码长度错误提示 span 元素
const generateErrorSpan       = document.getElementById("generateError");      // 获取密码生成错误提示 span 元素
const copyMessageSpan         = document.getElementById("copyMessage");        // 获取复制操作结果提示 span 元素

// 定义不同类型的字符集
const charSets = {
  digit:            "0123456789",             // 标准数字字符集
  digitNoAmbiguity: "123456789",              // 移除易混淆数字（如 0）后的字符集
  digitEnhanced:    "2345678",                // 增强可读性的数字字符集（移除 0, 1, 9）
  symbol:           "!@#$%&.-",               // 标准符号字符集
  lowercase:        "abcdefghijklmnopqrstuvwxyz", // 标准小写字母字符集
  lowercaseNoAmbiguity: "abcdefghijkmnpqrstuvwxyz", // 移除易混淆小写字母（如 l, o）后的字符集
  lowercaseEnhanced: "abdefghijmnrty",        // 增强可读性的小写字母字符集
  uppercase:        "ABCDEFGHIJKLMNOPQRSTUVWXYZ", // 标准大写字母字符集
  uppercaseNoAmbiguity: "ABCDEFGHJKLMNPQRSTUVWXYZ", // 移除易混淆大写字母（如 I, O）后的字符集
  uppercaseEnhanced: "ABDEFGHJLMNQRTY",       // 增强可读性的大写字母字符集
};

// 获取一个安全的随机整数索引 (0 <= index < max)
function getSecureRandomIndex(max) {
  if (max <= 0) return 0;                     // 若 max 无效，返回 0
  const array = new Uint32Array(1);           // 创建一个 32 位无符号整数数组
  window.crypto.getRandomValues(array);       // 使用加密安全的随机数填充数组
  return array[0] % max;                      // 返回 [0, max) 区间的随机数
}

// 使用安全的 Fisher - Yates 算法打乱数组（原地修改）
function secureShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1);    // 获取 [0, i] 范围内的安全随机索引 j
    [array[i], array[j]] = [array[j], array[i]]; // 交换元素 array[i] 和 array[j]
  }
  return array;                               // 返回打乱后的数组
}

// 工具函数：过滤字符串中的非数字字符
const filterNumbers = (str) => str.replace(/[^0-9]/g, '');

// 处理密码长度输入框的 'input' 事件
const handleInput = (event) => {
  const value = event.target.value;           // 获取输入框当前值
  const filtered = filterNumbers(value);      // 过滤非数字字符
  if (filtered !== value) {                   // 如果值被修改过（即包含非数字）
    event.target.value = filtered;            // 更新输入框值为过滤后的纯数字
  }
};

// 处理密码长度输入框的 'paste' 事件
const handlePaste = async (event) => {
  event.preventDefault();                     // 阻止默认的粘贴行为
  try {
    const pasteText = await navigator.clipboard.readText(); // 优先使用现代异步剪贴板 API 读取文本
    event.target.value = filterNumbers(pasteText); // 将过滤后的纯数字设置到输入框
  } catch (err) {                             // 若现代 API 失败
    console.warn("无法使用 navigator.clipboard.readText，尝试旧方法:", err); // 打印警告
    const pasteText = (event.clipboardData || window.clipboardData).getData('text'); // 使用旧方法获取剪贴板文本
    document.execCommand('insertText', false, filterNumbers(pasteText)); // 使用（不推荐的）execCommand 插入过滤后的文本
  }
};

// 更新密码长度输入框的值，限制在 [4, 2048]
const updateLength = (change) => {
  let current = parseInt(lengthInput.value, 10); // 获取当前长度整数值
  const newValue = Math.max(4, Math.min(current + change, 2048)); // 计算新值，并限制在 [4, 2048] 范围内
  generatePassword();                             // 边界位置点击 +/- 也触发生成

  if (newValue !== current) {                     // 如果值发生了改变
    lengthInput.value = newValue;                 // 更新输入框显示的值
    generatePassword();                           // 重新生成密码
  }
};

// 验证密码长度输入是否有效 [4, 2048]
function validateLengthInput() {
  lengthErrorSpan.textContent = "";               // 清空错误提示
  lengthErrorSpan.style.display = "none";         // 隐藏错误提示区域

  let length = parseInt(lengthInput.value, 10);   // 获取并解析输入框的长度值

  if (isNaN(length) || length < 4 || length > 2048) { // 检查是否为 NaN 或超出范围
    lengthErrorSpan.textContent = `长度必须是 4 至 2048 之间的整数`; // 设置错误提示文本
    lengthErrorSpan.style.display = "block";      // 显示错误提示
    return false;                                 // 返回验证失败
  }
  return true;                                    // 返回验证成功
}

// 将所有选项重置为默认状态
function resetToDefaults() {
  lengthInput.value = 12;                         // 默认长度 12
  containsDigitCheckbox.checked = true;           // 默认包含数字
  containsSymbolCheckbox.checked = true;          // 默认包含符号
  containsLowercaseCheckbox.checked = true;       // 默认包含小写字母
  containsUppercaseCheckbox.checked = true;       // 默认包含大写字母
  pinModeCheckbox.checked = false;                // 默认不启用 PIN 模式
  withNoSymbolAtEdgeCheckbox.checked = false;     // 默认不启用首尾非符号
  avoidAmbiguityCheckbox.checked = false;         // 默认不启用避免易混淆
  enhanceReadabilityCheckbox.checked = false;     // 默认不启用增强可读性
}

// 根据当前选项更新其他复选框的禁用/启用状态和样式
function updateCheckboxStates() {
  const isPinMode = pinModeCheckbox.checked;      // 是否选中 PIN 模式
  const isAvoidAmbiguity = avoidAmbiguityCheckbox.checked; // 是否选中避免易混淆
  const isEnhanceReadability = enhanceReadabilityCheckbox.checked; // 是否选中增强可读性

  // 辅助函数：设置元素禁用状态并更新标签样式
  const setDisabled = (element, disabled) => {
    element.disabled = disabled;                  // 设置元素禁用属性
    const label = element.closest("label");       // 获取最近的 label 元素
    if (label) {                                  // 如果找到 label
      label.classList.toggle("disabled-label", disabled); // 根据禁用状态切换 'disabled-label' 类
    }
  };

  setDisabled(containsDigitCheckbox, isPinMode);      // PIN 模式下禁用数字选项（但强制为 true）
  setDisabled(containsSymbolCheckbox, isPinMode);     // PIN 模式下禁用符号选项
  setDisabled(containsLowercaseCheckbox, isPinMode);  // PIN 模式下禁用小写字母选项
  setDisabled(containsUppercaseCheckbox, isPinMode);  // PIN 模式下禁用大写字母选项
  setDisabled(withNoSymbolAtEdgeCheckbox, isPinMode); // PIN 模式下禁用首尾非符号选项
  setDisabled(avoidAmbiguityCheckbox, isPinMode);     // PIN 模式下禁用避免易混淆选项
  setDisabled(enhanceReadabilityCheckbox, isPinMode); // PIN 模式下禁用增强可读性选项

  if (isPinMode) {                                // 如果启用了 PIN 模式
    lengthInput.value = 6;                        // 强制长度为 6
    containsDigitCheckbox.checked = true;         // 强制勾选包含数字
    containsSymbolCheckbox.checked = false;       // 取消勾选符号
    containsLowercaseCheckbox.checked = false;    // 取消勾选小写字母
    containsUppercaseCheckbox.checked = false;    // 取消勾选大写字母
    withNoSymbolAtEdgeCheckbox.checked = false;   // 取消勾选首尾非符号
    avoidAmbiguityCheckbox.checked = false;       // 取消勾选避免易混淆
    enhanceReadabilityCheckbox.checked = false;   // 取消勾选增强可读性
  } else {                                        // 如果不是 PIN 模式
    if (!containsSymbolCheckbox.checked) {        // 如果未选中符号选项
      withNoSymbolAtEdgeCheckbox.checked = false; // 取消勾选首尾非符号
      setDisabled(withNoSymbolAtEdgeCheckbox, true);  // 禁用首尾非符号选项
    } else {
      setDisabled(withNoSymbolAtEdgeCheckbox, false); // 否则启用首尾非符号选项
    }

    if (isAvoidAmbiguity) {                       // 如果选中了避免易混淆
      enhanceReadabilityCheckbox.checked = false; // 取消勾选增强可读性
      setDisabled(enhanceReadabilityCheckbox, true); // 禁用增强可读性
    } else {
      setDisabled(enhanceReadabilityCheckbox, false); // 否则启用增强可读性（除非 PIN 模式）
    }

    if (isEnhanceReadability) {                   // 如果选中了增强可读性
      avoidAmbiguityCheckbox.checked = false;     // 取消勾选避免易混淆
      setDisabled(avoidAmbiguityCheckbox, true);  // 禁用避免易混淆
    } else {
      setDisabled(avoidAmbiguityCheckbox, false); // 否则启用避免易混淆（除非 PIN 模式）
    }
  }
}

// 根据用户选项生成密码
function generatePassword() {
  lengthErrorSpan.textContent = "";               // 清空长度错误提示
  lengthErrorSpan.style.display = "none";         // 隐藏长度错误提示区域
  generateErrorSpan.textContent = "";             // 清空生成错误提示
  generateErrorSpan.style.display = "none";       // 隐藏生成错误提示区域
  copyMessageSpan.textContent = "";               // 清空复制消息
  copyMessageSpan.style.display = "none";         // 隐藏复制消息区域
  copyBtn.textContent = "复制密码";                // 恢复复制按钮文本

  if (!validateLengthInput()) {                   // 验证密码长度
    passwordOutputDiv.textContent = "";           // 长度无效则清空密码输出
    return;                                       // 终止生成
  }

  const isPinMode = pinModeCheckbox.checked;      // 获取 PIN 模式状态
  const length = parseInt(lengthInput.value, 10); // 获取密码长度

  // 收集所有配置选项
  const options = {
    length: length,                               // 密码长度
    containsDigit: isPinMode || containsDigitCheckbox.checked, // 是否包含数字（PIN 模式强制为 true）
    containsSymbol: !isPinMode && containsSymbolCheckbox.checked, // 是否包含符号（非 PIN 模式）
    containsLowercase: !isPinMode && containsLowercaseCheckbox.checked, // 是否包含小写字母（非 PIN 模式）
    containsUppercase: !isPinMode && containsUppercaseCheckbox.checked, // 是否包含大写字母（非 PIN 模式）
    pinMode: isPinMode,                           // PIN 模式状态
    withNoSymbolAtEdge: !isPinMode && withNoSymbolAtEdgeCheckbox.checked, // 是否首尾非符号（非 PIN 模式）
    avoidAmbiguity: !isPinMode && avoidAmbiguityCheckbox.checked, // 是否避免易混淆（非 PIN 模式）
    enhanceReadability: !isPinMode && enhanceReadabilityCheckbox.checked, // 是否增强可读性（非 PIN 模式）
  };

  let activeDigitSet = charSets.digit;            // 默认使用标准数字集
  let activeLowercaseSet = charSets.lowercase;    // 默认使用标准小写字母集
  let activeUppercaseSet = charSets.uppercase;    // 默认使用标准大写字母集
  const activeSymbolSet = charSets.symbol;        // 符号集当前无变种

  if (!options.pinMode) {                         // 如果不是 PIN 模式
    if (options.enhanceReadability) {             // 如果启用增强可读性
      activeDigitSet = charSets.digitEnhanced;    // 使用增强数字集
      activeLowercaseSet = charSets.lowercaseEnhanced; // 使用增强小写字母集
      activeUppercaseSet = charSets.uppercaseEnhanced; // 使用增强大写字母集
    } else if (options.avoidAmbiguity) {          // 如果启用避免易混淆
      activeDigitSet = charSets.digitNoAmbiguity; // 使用无歧义数字集
      activeLowercaseSet = charSets.lowercaseNoAmbiguity; // 使用无歧义小写字母集
      activeUppercaseSet = charSets.uppercaseNoAmbiguity; // 使用无歧义大写字母集
    }
  }

  let availableChars = "";                        // 初始化可用字符池
  if (options.containsDigit && activeDigitSet.length > 0) availableChars += activeDigitSet; // 加入数字集
  if (options.containsSymbol && activeSymbolSet.length > 0) availableChars += activeSymbolSet; // 加入符号集
  if (options.containsLowercase && activeLowercaseSet.length > 0) availableChars += activeLowercaseSet; // 加入小写字母集
  if (options.containsUppercase && activeUppercaseSet.length > 0) availableChars += activeUppercaseSet; // 加入大写字母集

  if (availableChars.length === 0) {              // 如果可用字符池为空
    generateErrorSpan.textContent = "可用字符集为空，无法生成密码。请至少选择一种字符类型。"; // 设置错误消息
    generateErrorSpan.style.display = "block";    // 显示错误消息
    passwordOutputDiv.textContent = "";           // 清空密码输出
    return;                                       // 终止生成
  }

  if (                                          // 检查特殊情况：只选符号且要求首尾非符号
    !options.pinMode &&                          // 非 PIN 模式
    options.containsSymbol &&                   // 选了符号
    !options.containsDigit &&                    // 没选数字
    !options.containsLowercase &&                // 没选小写
    !options.containsUppercase &&                // 没选大写
    options.withNoSymbolAtEdge                   // 要求首尾非符号
  ) {
    generateErrorSpan.textContent = "无法满足“首尾非符号”，请至少再选择一种字符类型。"; // 设置错误消息
    generateErrorSpan.style.display = "block";    // 显示错误消息
    passwordOutputDiv.textContent = "";           // 清空密码输出
    return;                                       // 终止生成
  }

  let attempts = 0;                               // 初始化尝试次数
  const MAX_ATTEMPTS = 100;                       // 设置最大尝试次数
  let finalPasswordArray = [];                    // 存储最终生成的密码字符数组
  const constraintsActive = !options.pinMode;     // 约束条件是否激活（非 PIN 模式）

  while (attempts < MAX_ATTEMPTS) {               // 循环尝试生成，直到成功或达到最大次数
    attempts++;                                   // 增加尝试次数

    let requiredChars = [];                       // 存储必需的字符（每种选定类型至少一个）
    if (!options.pinMode) {                       // 非 PIN 模式下才强制包含
      if (options.containsDigit && activeDigitSet.length > 0) requiredChars.push(activeDigitSet[getSecureRandomIndex(activeDigitSet.length)]); // 添加一个随机数字
      if (options.containsSymbol && activeSymbolSet.length > 0) requiredChars.push(activeSymbolSet[getSecureRandomIndex(activeSymbolSet.length)]); // 添加一个随机符号
      if (options.containsLowercase && activeLowercaseSet.length > 0) requiredChars.push(activeLowercaseSet[getSecureRandomIndex(activeLowercaseSet.length)]); // 添加一个随机小写字母
      if (options.containsUppercase && activeUppercaseSet.length > 0) requiredChars.push(activeUppercaseSet[getSecureRandomIndex(activeUppercaseSet.length)]); // 添加一个随机大写字母
    }

    let passwordBaseArray = options.pinMode ? [] : [...requiredChars]; // 初始化密码基础数组 (PIN 模式为空，否则从必需字符开始)

    const targetLength = options.length;          // 目标总长度
    const requiredCount = passwordBaseArray.length; // 已有必需字符数量
    const remainingLength = targetLength - requiredCount; // 还需填充的字符数量

    let fillError = false;                        // 标记填充过程是否出错
    for (let i = 0; i < remainingLength; i++) {   // 填充剩余字符
      const sourceSet = options.pinMode ? activeDigitSet : availableChars; // 确定填充源 (PIN用数字，否则用可用池)
      if (sourceSet.length > 0) {                 // 确保源不为空
        passwordBaseArray.push(sourceSet[getSecureRandomIndex(sourceSet.length)]); // 从源中随机选一个加入
      } else {
        console.error("填充随机字符时出错: 源字符集为空。这不应该发生。"); // 打印错误
        fillError = true;                         // 标记错误
        break;                                    // 停止填充
      }
    }
    if (fillError) continue;                      // 若填充出错，进行下一次尝试

    passwordBaseArray = passwordBaseArray.slice(0, targetLength); // 确保长度正确（截断以防万一）

    let shuffledArray = secureShuffle([...passwordBaseArray]);    // 安全地打乱当前生成的数组（复制一份再打乱）

    if (constraintsActive && options.withNoSymbolAtEdge) {      // 如果激活约束且要求首尾非符号
      let currentAttemptIsValidForEdges = true;                 // 标记当前尝试是否满足边缘条件

      if (activeSymbolSet.includes(shuffledArray[0])) {         // 如果首位是符号
        let firstNonSymbolIndex = -1;                           // 查找第一个非符号字符的索引
        for (let i = 1; i < shuffledArray.length; i++) {
          if (!activeSymbolSet.includes(shuffledArray[i])) {
            firstNonSymbolIndex = i;                            // 找到索引
            break;                                              // 停止查找
          }
        }
        if (firstNonSymbolIndex !== -1) {                       // 如果找到了
          [shuffledArray[0], shuffledArray[firstNonSymbolIndex]] = [shuffledArray[firstNonSymbolIndex], shuffledArray[0]]; // 交换首位和找到的非符号字符
        } else {                                                // 如果除了首位全是符号
          currentAttemptIsValidForEdges = false;                // 标记尝试失败
        }
      }

      if (                                          // 如果首位检查通过且末位是符号
        currentAttemptIsValidForEdges &&
        activeSymbolSet.includes(shuffledArray[shuffledArray.length - 1])
      ) {
        let lastNonSymbolIndex = -1;                             // 查找最后一个非符号字符的索引
        for (let i = shuffledArray.length - 2; i >= 0; i--) {    // 从倒数第二个向前查找
          if (!activeSymbolSet.includes(shuffledArray[i])) {
            lastNonSymbolIndex = i;                              // 找到索引
            break;                                               // 停止查找
          }
        }
        if (lastNonSymbolIndex !== -1) {              // 如果找到了
          const lastIndex = shuffledArray.length - 1; // 末位索引
          [shuffledArray[lastIndex], shuffledArray[lastNonSymbolIndex]] = [shuffledArray[lastNonSymbolIndex], shuffledArray[lastIndex]]; // 交换末位和找到的非符号字符
        } else {                                      // 如果除了末位全是符号
          currentAttemptIsValidForEdges = false;      // 标记尝试失败
        }
      }

      if (                                            // 再次检查首位（因为末位交换可能影响首位）
        currentAttemptIsValidForEdges &&
        activeSymbolSet.includes(shuffledArray[0])
      ) {
        currentAttemptIsValidForEdges = false;        // 标记尝试失败
      }

      if (!currentAttemptIsValidForEdges) {           // 如果边缘检查失败
        console.warn(`尝试 ${attempts}: 边缘符号约束检查失败，重新生成。`); // 输出警告
        continue;                                     // 进行下一次尝试
      }
    }

    finalPasswordArray = shuffledArray;             // 找到满足条件的密码，保存
    console.log(`成功找到满足条件的密码，尝试次数: ${attempts}`); // 输出成功信息
    break;                                          // 跳出 while 循环
  }

  if (finalPasswordArray.length === 0) {            // 如果达到最大尝试次数仍未生成
    generateErrorSpan.textContent = `无法在 ${MAX_ATTEMPTS} 次尝试内生成满足所有条件的密码。请尝试放宽选项或稍后重试。`; // 设置错误消息
    generateErrorSpan.style.display = "block";      // 显示错误消息
    passwordOutputDiv.textContent = "";             // 清空密码输出
    return;                                         // 结束函数
  }

  passwordOutputDiv.innerHTML = finalPasswordArray  // 显示生成的密码（带颜色区分）
    .map((char) => {
      if (charSets.digit.includes(char)) return `<span class="numbers">${char}</span>`;   // 数字用 'numbers' 类
      if (charSets.uppercase.includes(char)) return `<span class="upper">${char}</span>`; // 大写字母用 'upper' 类
      if (charSets.lowercase.includes(char)) return `<span class="lower">${char}</span>`; // 小写字母用 'lower' 类
      if (charSets.symbol.includes(char)) return `<span class="symbols">${char}</span>`;  // 符号用 'symbols' 类
      return char;                                  // 其他字符（理论上不应出现）
    })
    .join("");
}

// 点击生成按钮时，调用函数 generatePassword()
generateBtn.addEventListener("click", generatePassword);
// 点击减少长度按钮，长度减 1
decreaseLengthBtn.addEventListener("click", () => updateLength(-1));
// 点击增加长度按钮，长度加 1
increaseLengthBtn.addEventListener("click", () => updateLength(1));
// 长度输入框内容变化时，实时验证
lengthInput.addEventListener("input", validateLengthInput);
// 长度输入框内容变化时，过滤非数字
lengthInput.addEventListener('input', handleInput);
// 向长度输入框粘贴时，过滤非数字
lengthInput.addEventListener('paste', handlePaste);
// 监听长度输入框的键盘按下事件
lengthInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {                      // 如果按下的是 Enter 键
    event.preventDefault();                         // 阻止默认行为（如表单提交）
    generatePassword();                             // 触发密码生成
  }
});

// 获取所有选项相关的复选框元素
const optionCheckboxes = [
  containsDigitCheckbox,
  containsSymbolCheckbox,
  containsLowercaseCheckbox,
  containsUppercaseCheckbox,
  pinModeCheckbox,
  withNoSymbolAtEdgeCheckbox,
  avoidAmbiguityCheckbox,
  enhanceReadabilityCheckbox,
];

// 遍历所有选项复选框
optionCheckboxes.forEach((checkbox) => {
  // 为每个复选框添加 'change' 事件监听器
  checkbox.addEventListener("change", () => {
    if (checkbox === pinModeCheckbox && !pinModeCheckbox.checked) { // 特殊情况：如果取消选中 PIN 模式
      resetToDefaults();                            // 重置所有选项为默认值
    }
    updateCheckboxStates();                         // 更新所有复选框的状态和样式
    generatePassword();                             // 选项改变后，重新生成密码
  });
});

// 点击复制按钮时执行
copyBtn.addEventListener("click", () => {
  const passwordToCopy = passwordOutputDiv.textContent?.trim(); // 获取密码区域纯文本内容（去除首尾空格）
  const originalBtnText = "复制密码";               // 存储原始按钮文本

  copyMessageSpan.textContent = "";               // 清空可能存在的旧消息
  copyMessageSpan.style.display = "none";         // 隐藏消息区域
  copyBtn.textContent = originalBtnText;          // 确保按钮文本是初始状态

  if (!passwordToCopy) {                          // 如果没有密码可复制
    copyBtn.textContent = "无密码!";               // 短暂提示无密码
    setTimeout(() => { copyBtn.textContent = originalBtnText; }, 1000); // 1 秒后恢复按钮文本
    return;                                       // 结束执行
  }

  if (navigator.clipboard && window.isSecureContext) { // 优先尝试现代、安全的剪贴板 API
    navigator.clipboard
     .writeText(passwordToCopy)                      // 尝试写入剪贴板
     .then(() => {                                   // 写入成功
        copyBtn.textContent = "已复制!";              // 提示已复制
        setTimeout(() => { copyBtn.textContent = originalBtnText; }, 1000); // 1 秒后恢复
      })
     .catch((err) => {                               // 写入失败
        console.error("使用 Clipboard API 复制失败:", err); // 打印错误
        tryCopyUsingExecCommand(passwordToCopy, originalBtnText); // 尝试使用旧方法
      });
  } else {                                          // 如果不支持现代 API 或非安全上下文
    console.warn("当前环境不支持 Navigator Clipboard API 或非安全上下文，尝试使用后备方法。"); // 打印警告
    tryCopyUsingExecCommand(passwordToCopy, originalBtnText); // 直接使用旧方法
  }
});

// 使用旧的 document.execCommand('copy') 尝试复制
function tryCopyUsingExecCommand(textToCopy, originalBtnText) {
  const textArea = document.createElement("textarea"); // 创建一个临时 textarea
  textArea.value = textToCopy;                        // 设置其值为要复制的文本
  textArea.style.position = "fixed";                  // 设置样式使其不可见
  textArea.style.top = "-9999px";                     // 移出屏幕顶部
  textArea.style.left = "-9999px";                    // 移出屏幕左侧
  textArea.style.opacity = "0";                       // 完全透明
  document.body.appendChild(textArea);                // 添加到 body
  textArea.focus();                                   // 获取焦点
  textArea.select();                                  // 选择文本

  let success = false;                                // 标记是否成功
  try {
    success = document.execCommand("copy");           // 执行复制命令
    if (success) {                                    // 如果成功
      copyBtn.textContent = "已复制!";                 // 提示已复制
      setTimeout(() => { copyBtn.textContent = originalBtnText; }, 1000); // 1 秒后恢复
    } else {                                          // 如果 execCommand 返回 false
      throw new Error("document.execCommand('copy') 返回 false"); // 抛出错误
    }
  } catch (err) {                                     // 如果捕获到错误
    console.error("使用 execCommand 复制失败:", err);   // 打印错误
    copyMessageSpan.textContent = "复制失败，请手动复制。"; // 显示复制失败消息
    copyMessageSpan.style.display = "block";          // 显示消息区域
    copyBtn.textContent = originalBtnText;            // 保持按钮原始文本
    setTimeout(() => { copyMessageSpan.style.display = "none"; }, 3500); // 3.5 秒后隐藏失败消息
  } finally {
    document.body.removeChild(textArea);              // 无论成功与否，都移除临时 textarea
  }
}

// 页面加载时，根据默认值更新复选框状态
updateCheckboxStates();
// 页面加载时，验证初始长度
validateLengthInput();
// 页面加载时，生成初始密码
generatePassword();

// 切换使用说明的显示/隐藏
function toggleInstructions() {
  const content = document.getElementById("instructionsContent"); // 获取说明内容元素
  const header = document.querySelector(".instructions-header");  // 获取说明头部元素
  content.classList.toggle("show");                               // 切换内容元素的 'show' 类
  header.classList.toggle("collapsed");                           // 切换头部元素的 'collapsed' 类
}