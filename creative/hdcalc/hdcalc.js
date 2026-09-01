        // 获取计算按钮
        const calculateBtn = document.getElementById("calculateBtn");
        const inputValueEl = document.getElementById("inputValue");

        // 绑定点击事件
        calculateBtn.addEventListener('click', function () {
            calculate();
        });

        // 绑定回车键事件
        inputValueEl.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                calculate();
            }
        });

        // 禁止输入负号、小数点、科学计数法等非整数字符
        inputValueEl.addEventListener('keydown', function (e) {
            if (['-', '+', '.', 'e', 'E'].includes(e.key)) {
                e.preventDefault();
            }
        });

        // 粘贴内容时同样过滤掉非数字字符
        inputValueEl.addEventListener('input', function () {
            const digitsOnly = this.value.replace(/[^0-9]/g, '');
            if (digitsOnly !== this.value) {
                this.value = digitsOnly;
            }
        });

        function calculate() {
            // 获取输入值
            const inputElement = document.getElementById("inputValue");
            const bytesPerUnit = parseInt(document.getElementById("unit").value);
            const inputValue = Number(inputElement.value);

            // 验证输入：必须是大于等于 0 的整数
            if (inputElement.value.trim() === "" || isNaN(inputValue) || !Number.isInteger(inputValue) || inputValue < 0) {
                alert("请输入大于等于 0 的整数");
                inputElement.focus();
                return;
            }

            // 计算总字节数
            const totalBytes = inputValue * bytesPerUnit;

            // 计算各单位的换算结果
            const resultMB = totalBytes / Math.pow(1024, 2);
            const resultGB = totalBytes / Math.pow(1024, 3);
            const resultTB = totalBytes / Math.pow(1024, 4);

            // 显示结果（保留2位小数，并添加单位）
            document.getElementById("resultMB").textContent = `${resultMB.toFixed(2)} MB`;
            document.getElementById("resultGB").textContent = `${resultGB.toFixed(2)} GB`;
            document.getElementById("resultTB").textContent = `${resultTB.toFixed(2)} TB`;
        }

        // 折叠面板逻辑
        function toggleExplanation(element) {
            const explanation = element.parentElement;
            explanation.classList.toggle("active");
        }