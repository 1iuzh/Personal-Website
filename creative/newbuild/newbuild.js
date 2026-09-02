/* ---------------- Software Data ---------------- */
const softwareCategories = [
    {
        name: "安全",
        items: [
            ["火绒", "https://www.huorong.cn/"],
            ["360", "https://www.360.cn/"],
        ],
    },
    {
        name: "笔记软件",
        items: [
            ["OneNote", "https://www.microsoft.com/zh-cn/microsoft-365/onenote/digital-note-taking-app"],
            ["Obsidian", "https://obsidian.md/zh/download"],
            ["Notion", "https://www.notion.com/zh-cn/download"],
            ["有道云笔记", "https://note.youdao.com/"],
        ],
    },
    {
        name: "翻译词典",
        items: [
            ["有道词典", "https://fanyi.youdao.com/download-Windows/"],
            ["金山词霸", "https://cp.iciba.com/"],
        ],
    },
    {
        name: "格式转换",
        items: [["格式工厂", "https://www.pcfreetime.com/formatfactory/cn/index.html"]],
    },
    {
        name: "IM软件",
        items: [
            ["钉钉", "https://www.dingtalk.com/download"],
            ["飞书", "https://www.feishu.cn/download"],
            ["企业微信", "https://work.weixin.qq.com/#indexDownload"],
            ["QQ", "https://im.qq.com/"],
            ["微信", "https://weixin.qq.com/"],
        ],
    },
    {
        name: "截图",
        items: [
            ["Pixpin", "https://pixpin.cn/"],
            ["Snipaste", "https://zh.snipaste.com/"],
        ],
    },
    {
        name: "看图",
        items: [
            ["Honeyview", "https://www.bandisoft.com/honeyview/"],
            ["WPS", "https://www.wps.cn/"],
        ],
    },
    {
        name: "浏览器",
        items: [
            ["Google Chrome", "https://www.google.com/chrome/?system=true&standalone=1"],
            ["Mozilla Firefox", "https://www.firefox.com/zh-CN/"],
            ["Microsoft Edge", "https://www.microsoft.com/edge"],
            ["夸克浏览器", "https://www.quark.cn/"],
        ],
    },
    {
        name: "密码管理",
        items: [["Bitwarden", "https://bitwarden.com/download/"]],
    },
    {
        name: "Office",
        items: [
            ["Office Tool", "https://otp.landian.vip/zh-cn/download.html"],
            ["WPS", "https://www.wps.cn/"],
        ],
    },
    {
        name: "PDF查看编辑",
        items: [
            ["WPS", "https://www.wps.cn/"],
            ["迅捷PDF转换器", "https://www.xunjiepdf.com/"],
            [
                "Adobe Acrobat",
                "https://helpx.adobe.com/cn/download-install/apps/system-requirements/download-availability.html",
            ],
        ],
    },
    {
        name: "驱动",
        items: [
            ["AMD驱动", "https://www.amd.com/zh-cn/support/download/drivers.html"],
            ["NVIDIA驱动", "https://www.nvidia.cn/geforce/drivers/"],
            ["360驱动大师", "https://dm.weishi.360.cn/home.html"],
            ["驱动精灵", "https://www.drivergenius.com/"],
            ["驱动人生", "https://www.160.com/"],
        ],
    },
    {
        name: "视频播放",
        items: [
            ["VLC", "https://www.videolan.org/"],
            ["PotPlayer", "https://potplayer.tv/"],
            ["MPC-BE", "https://github.com/Aleksoid1978/MPC-BE/releases"],
        ],
    },
    {
        name: "视频会议",
        items: [
            ["腾讯会议", "https://meeting.tencent.com/download/"],
            ["Zoom", "https://zoom.us/zh-cn/download"],
        ],
    },
    {
        name: "视频剪辑",
        items: [["剪映", "https://www.capcut.cn/"]],
    },
    {
        name: "输入法",
        items: [
            ["微信输入法", "https://z.weixin.qq.com/"],
            ["豆包输入法", "https://shurufa.doubao.com/pc"],
            ["千问输入法", "https://ime.qianwen.com/"],
            ["搜狗输入法", "https://shurufa.sogou.com/"],
        ],
    },
    {
        name: "思维导图",
        items: [
            ["Xmind", "https://www.xmind.cn/"],
            ["WPS", "https://www.wps.cn/"],
        ],
    },
    {
        name: "图片处理",
        items: [["美图秀秀", "https://xiuxiu.meitu.com/"]],
    },
    {
        name: "网盘",
        items: [
            ["坚果云", "https://www.jianguoyun.com/"],
            ["百度网盘", "https://pan.baidu.com/"],
            ["夸克网盘", "https://pan.quark.cn/"],
            ["阿里云盘", "https://www.alipan.com/"],
            ["OneDrive", "https://www.microsoft.com/zh-cn/microsoft-365/onedrive/online-cloud-storage"],
        ],
    },
    {
        name: "文档扫描",
        items: [["扫描全能王", "https://www.intsig.com/personal-camscanner"]],
    },
    {
        name: "文件检索",
        items: [["Everything", "https://www.voidtools.com/zh-cn/downloads/"]],
    },
    {
        name: "文件压缩",
        items: [
            ["7-Zip", "https://www.7-zip.org/"],
            ["WinRAR", "https://www.rarlab.com/"],
        ],
    },
    {
        name: "Windows系统下载",
        items: [["ITELLYOU", "https://next.itellyou.cn/"]],
    },
    {
        name: "效率待办",
        items: [
            ["滴答清单", "https://www.dida365.com/"],
            ["Microsoft To Do", "https://to-do.office.com/tasks/"],
        ],
    },
    {
        name: "下载工具",
        items: [
            ["迅雷", "https://www.xunlei.com/"],
            ["IDM", "https://www.internetdownloadmanager.com/"],
        ],
    },
    {
        name: "协作文档",
        items: [
            ["腾讯文档", "https://docs.qq.com/"],
            ["金山文档", "https://www.kdocs.cn/"],
            ["石墨文档", "https://shimo.im/"],
        ],
    },
    {
        name: "系统维护",
        items: [
            ["Dism++", "https://github.com/Chuyu-Team/Dism-Multi-language/releases"],
            ["CCleaner", "https://www.ccleaner.com/"],
            ["IObit", "https://www.iobit.com/"],
            ["鲁大师", "https://www.ludashi.com/"],
        ],
    },
    {
        name: "音乐播放",
        items: [
            ["QQ音乐", "https://y.qq.com/"],
            ["网易云音乐", "https://music.163.com/"],
        ],
    },
    {
        name: "游戏",
        items: [
            ["Steam", "https://store.steampowered.com/about/"],
            ["WeGame", "https://www.wegame.com.cn/home/"],
        ],
    },
    {
        name: "邮箱客户端",
        items: [
            ["Foxmail", "https://www.foxmail.com/"],
            [
                "Outlook",
                "https://www.microsoft.com/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook",
            ],
            ["网易邮箱大师", "https://dashi.163.com/"],
        ],
    },
    {
        name: "远程控制",
        items: [
            ["AnyDesk", "https://anydesk.com/zhs/downloads/windows"],
            ["ToDesk", "https://www.todesk.com/download.html"],
            ["向日葵", "https://sunlogin.oray.com/download/"],
        ],
    },
    {
        name: "待定",
        items: [["GitHub", "https://github.com/"]],
    },
];

/* ---------------- DOM ---------------- */
const categoryContainer = document.getElementById("softwareCategories");
const searchInput = document.getElementById("searchInput");
const softwareCount = document.getElementById("softwareCount");
const emptyState = document.getElementById("emptyState");

/* ---------------- Category Icon ---------------- */
const categoryIcons = {
    IM软件: "IM",
    Office: "OF",
    PDF查看编辑: "PDF",
    翻译词典: "译",
    截图: "截",
    看图: "图",
    浏览器: "网",
    视频播放: "▶",
    视频会议: "会",
    输入法: "文",
    思维导图: "思",
    网盘: "盘",
    文件检索: "搜",
    文件压缩: "压",
    安全: "安",
    系统维护: "维",
    驱动: "驱",
    邮箱客户端: "邮",
    协作文档: "协",
    游戏: "游",
    Windows系统下载: "系",
    密码管理: "密",
    笔记软件: "笔",
    下载工具: "载",
    远程控制: "远",
    音乐播放: "乐",
    格式转换: "换",
    视频剪辑: "剪",
    效率待办: "办",
    图片处理: "片",
    文档扫描: "扫",
    其他: "…",
};

/* ---------------- Create Category ---------------- */
function createCategory(category, visibleItems = category.items) {
    const section = document.createElement("section");
    section.className = "category";

    const header = document.createElement("div");
    header.className = "category-header";

    const name = document.createElement("h2");
    name.className = "category-name";

    const icon = document.createElement("span");
    icon.className = "category-icon";
    icon.textContent = categoryIcons[category.name] || "•";

    const title = document.createElement("span");
    title.textContent = category.name;

    name.appendChild(icon);
    name.appendChild(title);

    const count = document.createElement("span");
    count.className = "category-count";
    count.textContent = `${visibleItems.length}`;

    header.appendChild(name);
    header.appendChild(count);

    const list = document.createElement("ul");
    list.className = "software-list";

    visibleItems.forEach(([softwareName, url]) => {
        const item = document.createElement("li");
        item.className = "software-item";

        const link = document.createElement("a");
        link.className = "software-link";
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = softwareName;

        item.appendChild(link);
        list.appendChild(item);
    });

    section.appendChild(header);
    section.appendChild(list);

    return section;
}

/* ---------------- Render ---------------- */
function renderCategories(keyword = "") {
    const query = keyword.trim().toLowerCase();

    categoryContainer.innerHTML = "";

    let total = 0;
    let visibleCategories = 0;

    softwareCategories.forEach((category) => {
        const items = category.items.filter(([name]) => {
            if (!query) return true;
            return name.toLowerCase().includes(query) || category.name.toLowerCase().includes(query);
        });

        if (items.length === 0) return;

        visibleCategories++;
        total += items.length;

        categoryContainer.appendChild(createCategory(category, items));
    });

    if (query) {
        softwareCount.textContent = `找到 ${total} 个软件`;
    } else {
        const totalSoftware = softwareCategories.reduce((sum, category) => sum + category.items.length, 0);
        softwareCount.textContent = `${softwareCategories.length} 个分类 · ${totalSoftware} 个软件`;
    }

    emptyState.classList.toggle("show", visibleCategories === 0);
}

/* ---------------- Search ---------------- */
searchInput.addEventListener("input", (event) => {
    renderCategories(event.target.value);
});

/* ---------------- Initialize ---------------- */
renderCategories();