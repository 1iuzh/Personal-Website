const navData = [
  {
    title: "AI应用",
    links: [
      { name: "ChatGPT", url: "https://chatgpt.com/", icon: "https://api.xinac.net/icon/?url=https://chatgpt.com/" },
      { name: "Claude", url: "https://claude.ai/", icon: "https://api.xinac.net/icon/?url=https://claude.ai/" },
      { name: "Gemini", url: "https://gemini.google.com/", icon: "https://api.xinac.net/icon/?url=https://gemini.google.com/" },
      { name: "Grok", url: "https://grok.com/", icon: "https://api.xinac.net/icon/?url=https://grok.com/" },
      { name: "Kimi", url: "https://kimi.moonshot.cn/", icon: "https://api.xinac.net/icon/?url=https://kimi.moonshot.cn/" },
      { name: "Deepseek", url: "https://chat.deepseek.com/", icon: "https://api.xinac.net/icon/?url=https://chat.deepseek.com/" },
      { name: "千问", url: "https://www.qianwen.com/", icon: "https://api.xinac.net/icon/?url=https://www.qianwen.com/" },
      { name: "Qwen.ai", url: "https://chat.qwen.ai/", icon: "https://api.xinac.net/icon/?url=https://chat.qwen.ai/" },
      { name: "豆包", url: "https://www.doubao.com/chat/", icon: "https://api.xinac.net/icon/?url=https://www.doubao.com/chat/" },
      { name: "智谱清言", url: "https://chatglm.cn/", icon: "https://api.xinac.net/icon/?url=https://chatglm.cn/" },
      { name: "腾讯元宝", url: "https://yuanbao.tencent.com/chat/", icon: "https://api.xinac.net/icon/?url=https://yuanbao.tencent.com/chat/" }
    ]
  },
  {
    title: "检索",
    links: [
      { name: "Google", url: "https://www.google.com/ncr", icon: "https://api.xinac.net/icon/?url=https://www.google.com/" },
      { name: "百度一下", url: "https://www.baidu.com/", icon: "https://api.xinac.net/icon/?url=https://www.baidu.com/" },
      { name: "Bing", url: "https://www.bing.com/", icon: "https://api.xinac.net/icon/?url=https://www.bing.com/" },
      { name: "龙轩导航", url: "http://ilxdh.com/", icon: "https://api.xinac.net/icon/?url=http://ilxdh.com/" },
      { name: "硬核指南", url: "https://yinghezhinan.com/", icon: "https://api.xinac.net/icon/?url=https://yinghezhinan.com/" },
      { name: "迷鹿导航", url: "https://www.plnav.com/", icon: "https://api.xinac.net/icon/?url=https://www.plnav.com/" },
      { name: "ITEM", url: "https://item-typecho.item.ink/", icon: "https://api.xinac.net/icon/?url=https://item.ink/" },
      { name: "速达猫", url: "https://www.sudamao.com/", icon: "https://api.xinac.net/icon/?url=https://www.sudamao.com/" }
    ]
  },
  {
    title: "社交媒体",
    links: [
      { name: "抖音", url: "https://www.douyin.com/", icon: "https://api.xinac.net/icon/?url=https://www.douyin.com/" },
      { name: "小红书", url: "https://www.xiaohongshu.com/", icon: "https://api.xinac.net/icon/?url=https://www.xiaohongshu.com/" },
      { name: "微博", url: "https://weibo.com/", icon: "https://api.xinac.net/icon/?url=https://weibo.com/" },
      { name: "快手", url: "https://www.kuaishou.com/", icon: "https://api.xinac.net/icon/?url=https://www.kuaishou.com/" },
      { name: "虎扑", url: "https://bbs.hupu.com/all-gambia", icon: "https://api.xinac.net/icon/?url=https://www.hupu.com/" },
      { name: "知乎", url: "https://www.zhihu.com/", icon: "https://api.xinac.net/icon/?url=https://www.zhihu.com/" },
      { name: "百度贴吧", url: "https://tieba.baidu.com/", icon: "https://api.xinac.net/icon/?url=https://tieba.baidu.com/" },
      { name: "chiphell", url: "https://www.chiphell.com/", icon: "https://api.xinac.net/icon/?url=https://www.chiphell.com/" },
      { name: "V2EX", url: "https://www.v2ex.com/", icon: "https://api.xinac.net/icon/?url=https://www.v2ex.com/" },
      { name: "哔哩哔哩", url: "https://www.bilibili.com/", icon: "https://api.xinac.net/icon/?url=https://www.bilibili.com/" },
      { name: "B站动态", url: "https://t.bilibili.com/", icon: "https://api.xinac.net/icon/?url=https://www.bilibili.com/" },
      { name: "B站热门", url: "https://www.bilibili.com/v/popular/all/", icon: "https://api.xinac.net/icon/?url=https://www.bilibili.com/" },
      { name: "豆瓣", url: "https://www.douban.com/", icon: "https://api.xinac.net/icon/?url=https://www.douban.com/" },
      { name: "豆瓣电影", url: "https://movie.douban.com/", icon: "https://api.xinac.net/icon/?url=https://movie.douban.com/" },
      { name: "豆瓣读书", url: "https://book.douban.com/", icon: "https://api.xinac.net/icon/?url=https://book.douban.com/" }
    ]
  },
  {
    title: "购物平台",
    links: [
      { name: "淘宝", url: "https://www.taobao.com/", icon: "https://api.xinac.net/icon/?url=https://www.taobao.com/" },
      { name: "京东", url: "https://www.jd.com/", icon: "https://api.xinac.net/icon/?url=https://www.jd.com/" },
      { name: "天猫", url: "https://www.tmall.com/", icon: "https://api.xinac.net/icon/?url=https://www.tmall.com/" },
      { name: "什么值得买", url: "https://www.smzdm.com/jingxuan/", icon: "https://api.xinac.net/icon/?url=https://www.smzdm.com/" },
      { name: "小米商城", url: "https://www.mi.com/shop", icon: "https://api.xinac.net/icon/?url=https://www.mi.com/" },
      { name: "天猫超市", url: "https://chaoshi.tmall.com/", icon: "https://api.xinac.net/icon/?url=https://chaoshi.tmall.com/" },
      { name: "迪卡侬", url: "https://www.decathlon.com.cn/", icon: "https://api.xinac.net/icon/?url=https://www.decathlon.com/" },
      { name: "优衣库", url: "https://www.uniqlo.cn/", icon: "https://api.xinac.net/icon/?url=https://www.uniqlo.cn/" },
      { name: "无印良品", url: "https://www.muji.com.cn/cn/store/", icon: "https://api.xinac.net/icon/?url=https://www.muji.com.cn/" },
      { name: "苹果中国", url: "https://www.apple.com.cn/", icon: "https://api.xinac.net/icon/?url=https://www.apple.com.cn/" },
      { name: "大疆商城", url: "https://store.dji.com/cn", icon: "https://api.xinac.net/icon/?url=https://store.dji.com/" },
      { name: "亚马逊", url: "https://www.amazon.com/", icon: "https://api.xinac.net/icon/?url=https://www.amazon.com/" },
      { name: "eBay", url: "https://www.ebay.com/", icon: "https://api.xinac.net/icon/?url=https://www.ebay.com/" },
      { name: "新蛋", url: "https://www.newegg.com/", icon: "https://api.xinac.net/icon/?url=https://www.newegg.com/" }
    ]
  },
  {
    title: "资讯",
    links: [
      { name: "快豹速览", url: "https://kuaibao.me/", icon: "https://api.xinac.net/icon/?url=https://kuaibao.me/" },
      { name: "Readhub", url: "https://readhub.cn/", icon: "https://api.xinac.net/icon/?url=https://readhub.cn/" },
      { name: "少数派", url: "https://sspai.com/", icon: "https://api.xinac.net/icon/?url=https://sspai.com/" },
      { name: "数字尾巴", url: "https://www.dgtle.com/", icon: "https://api.xinac.net/icon/?url=https://www.dgtle.com/" },
      { name: "IT之家", url: "https://www.ithome.com/", icon: "https://api.xinac.net/icon/?url=https://www.ithome.com/" },
      { name: "36氪", url: "https://36kr.com/", icon: "https://api.xinac.net/icon/?url=https://36kr.com/" },
      { name: "虎嗅", url: "https://www.huxiu.com/", icon: "https://api.xinac.net/icon/?url=https://www.huxiu.com/" },
      { name: "联合早报", url: "https://www.zaobao.com/", icon: "https://api.xinac.net/icon/?url=https://www.zaobao.com/" },
      { name: "腾讯新闻", url: "https://news.qq.com/", icon: "https://api.xinac.net/icon/?url=https://news.qq.com/" },
      { name: "果壳网", url: "https://www.guokr.com/", icon: "https://api.xinac.net/icon/?url=https://www.guokr.com/" },
      { name: "今日头条", url: "https://www.toutiao.com/", icon: "https://api.xinac.net/icon/?url=https://www.toutiao.com/" },
      { name: "快科技", url: "https://www.mydrivers.com/", icon: "https://api.xinac.net/icon/?url=https://www.mydrivers.com/" },
      { name: "煎蛋网", url: "https://jandan.net/", icon: "https://api.xinac.net/icon/?url=https://jandan.net/" },
      { name: "抽屉网", url: "https://dig.ichouti.cn/", icon: "https://api.xinac.net/icon/?url=https://dig.ichouti.cn/" }
    ]
  },
  {
    title: "境外势力",
    links: [
      { name: "GitHub", url: "https://github.com/", icon: "https://api.xinac.net/icon/?url=https://github.com/" },
      { name: "Youtube", url: "https://www.youtube.com/", icon: "https://api.xinac.net/icon/?url=https://www.youtube.com/" },
      { name: "X", url: "https://x.com/", icon: "https://api.xinac.net/icon/?url=https://x.com/" },
      { name: "梯子", url: "https://www.xlinkworld.io/", icon: "https://api.xinac.net/icon/?url=https://www.xlinkworld.io/" },
      { name: "Twitch", url: "https://www.twitch.tv/", icon: "https://api.xinac.net/icon/?url=https://www.twitch.tv/" },
      { name: "Facebook", url: "https://www.facebook.com/", icon: "https://api.xinac.net/icon/?url=https://www.facebook.com/" }
    ]
  },
  {
    title: "邮箱",
    links: [
      { name: "QQ邮箱", url: "https://mail.qq.com/", icon: "https://api.xinac.net/icon/?url=https://mail.qq.com/" },
      { name: "腾讯企业邮", url: "https://exmail.qq.com/", icon: "https://api.xinac.net/icon/?url=https://exmail.qq.com/" },
      { name: "网易邮箱", url: "https://email.163.com/", icon: "https://api.xinac.net/icon/?url=https://email.163.com/" },
      { name: "Gmail", url: "https://mail.google.com/", icon: "https://api.xinac.net/icon/?url=https://mail.google.com/" },
      { name: "Outlook", url: "https://outlook.live.com/", icon: "https://api.xinac.net/icon/?url=https://outlook.live.com/" },
      { name: "新浪邮箱", url: "https://mail.sina.com.cn/", icon: "https://api.xinac.net/icon/?url=https://mail.sina.com.cn/" }
    ]
  },
  {
    title: "汉语词典",
    links: [
      { name: "汉典", url: "https://www.zdic.net/", icon: "https://api.xinac.net/icon/?url=https://www.zdic.net/" },
      { name: "北师大字典", url: "https://qxk.bnu.edu.cn/", icon: "https://api.xinac.net/icon/?url=https://qxk.bnu.edu.cn/" },
      { name: "字统网", url: "https://zi.tools/", icon: "https://api.xinac.net/icon/?url=https://zi.tools/" },
      { name: "澳典", url: "https://zidian.odict.net/", icon: "https://api.xinac.net/icon/?url=https://zidian.odict.net/" },
      { name: "汉文学网", url: "https://zd.hwxnet.com/", icon: "https://api.xinac.net/icon/?url=https://zd.hwxnet.com/" },
      { name: "国语辞典", url: "https://dict.revised.moe.edu.tw/search.jsp?md=1", icon: "https://api.xinac.net/icon/?url=https://dict.revised.moe.edu.tw/" }
    ]
  },
  {
    title: "外语",
    links: [
      { name: "有道词典", url: "https://www.youdao.com/", icon: "https://api.xinac.net/icon/?url=https://www.youdao.com/" },
      { name: "金山词霸", url: "https://www.iciba.com/", icon: "https://api.xinac.net/icon/?url=https://www.iciba.com/" }
    ]
  },
  {
    title: "影视",
    links: [
      { name: "爱奇艺", url: "https://www.iqiyi.com/", icon: "https://api.xinac.net/icon/?url=https://www.iqiyi.com/" },
      { name: "优酷", url: "https://www.youku.com/", icon: "https://api.xinac.net/icon/?url=https://www.youku.com/" },
      { name: "腾讯视频", url: "https://v.qq.com/", icon: "https://api.xinac.net/icon/?url=https://v.qq.com/" },
      { name: "芒果TV", url: "https://www.mgtv.com/", icon: "https://api.xinac.net/icon/?url=https://www.mgtv.com/" },
      { name: "注视影视", url: "https://gaze.run/", icon: "https://api.xinac.net/icon/?url=https://gaze.run/" },
      { name: "音范丝", url: "https://www.yinfans.me/", icon: "https://api.xinac.net/icon/?url=https://www.yinfans.me/" },
      { name: "厂长资源", url: "https://www.czzymovie.com/", icon: "https://api.xinac.net/icon/?url=https://www.czzymovie.com/" },
      { name: "低端影视", url: "https://ddys.pro/", icon: "https://api.xinac.net/icon/?url=https://ddys.pro/" },
      { name: "高清族", url: "https://www.hdzu.cc/", icon: "https://api.xinac.net/icon/?url=https://www.hdzu.cc/" },
      { name: "布谷TV", url: "https://www.bugutv.vip/", icon: "https://api.xinac.net/icon/?url=https://www.bugutv.vip/" }
    ]
  },
  {
    title: "网络工具",
    links: [
      { name: "Speedtest", url: "https://www.speedtest.net/", icon: "https://api.xinac.net/icon/?url=https://www.speedtest.net/" },
      { name: "中科大测速", url: "https://test.ustc.edu.cn/", icon: "https://api.xinac.net/icon/?url=https://test.ustc.edu.cn/" },
      { name: "测速网", url: "https://www.speedtest.cn/", icon: "https://api.xinac.net/icon/?url=https://www.speedtest.cn/" },
      { name: "ip.im", url: "https://ip.im/", icon: "https://api.xinac.net/icon/?url=https://ip.im/" },
      { name: "Nslookup", url: "https://helohub.com/mx", icon: "https://api.xinac.net/icon/?url=https://helohub.com/mx" },
      { name: "拨测", url: "https://www.boce.com/", icon: "https://api.xinac.net/icon/?url=https://www.boce.com/" },
      { name: "ICANN", url: "https://lookup.icann.org/zh", icon: "https://api.xinac.net/icon/?url=https://lookup.icann.org/zh" },
      { name: "站长工具", url: "https://tool.chinaz.com/", icon: "https://api.xinac.net/icon/?url=https://tool.chinaz.com/" },
      { name: "IP查询", url: "https://ip.tool.chinaz.com/", icon: "https://api.xinac.net/icon/?url=https://ip.tool.chinaz.com/" },
      { name: "端口扫描", url: "https://tool.chinaz.com/port", icon: "https://api.xinac.net/icon/?url=https://tool.chinaz.com/port" },
      { name: "Whois查询", url: "https://whois.chinaz.com/", icon: "https://api.xinac.net/icon/?url=https://whois.chinaz.com/" },
      { name: "Nslookup", url: "https://tool.chinaz.com/nslookup", icon: "https://api.xinac.net/icon/?url=https://tool.chinaz.com/nslookup" }
    ]
  },
  {
    title: "临时邮箱",
    links: [
      { name: "linshi-email", url: "https://www.linshi-email.com/", icon: "https://api.xinac.net/icon/?url=https://www.linshi-email.com/" },
      { name: "snapmail.cc", url: "https://www.snapmail.cc/", icon: "https://api.xinac.net/icon/?url=https://www.snapmail.cc/" },
      { name: "linshiyou", url: "https://linshiyou.com/", icon: "https://api.xinac.net/icon/?url=https://linshiyou.com/" },
      { name: "mail.tm", url: "https://mail.tm/zh/", icon: "https://api.xinac.net/icon/?url=https://mail.tm/zh/" },
      { name: "22.do", url: "https://22.do/", icon: "https://api.xinac.net/icon/?url=https://22.do/" },
      { name: "Tempmailpro", url: "https://tempmailpro.org/zh", icon: "https://api.xinac.net/icon/?url=https://tempmailpro.org/zh" }
    ]
  },
  {
    title: "在线工具",
    links: [
      { name: "在线工具箱", url: "https://tool.lu/", icon: "https://api.xinac.net/icon/?url=https://tool.lu/" },
      { name: "30 工具网", url: "https://www.30aitool.com/", icon: "https://api.xinac.net/icon/?url=https://www.30aitool.com/" },
      { name: "在线抠图", url: "https://www.remove.bg/zh", icon: "https://api.xinac.net/icon/?url=https://www.remove.bg/zh" },
      { name: "Favicon生成", url: "https://www.logosc.cn/favicon-generator", icon: "https://api.xinac.net/icon/?url=https://www.logosc.cn/favicon-generator" },
      { name: "密码生成器", url: "https://1password.com/zh-cn/password-generator", icon: "https://1password.com/favicon.ico" },
      { name: "在线工具", url: "https://d1tools.com/", icon: "https://api.xinac.net/icon/?url=https://d1tools.com/" }
    ]
  },
  {
    title: "资源",
    links: [
      { name: "不死鸟分享", url: "https://iui.su/", icon: "https://api.xinac.net/icon/?url=https://iui.su/" },
      { name: "iOS ICON", url: "https://www.iosicongallery.com/", icon: "https://api.xinac.net/icon/?url=https://www.iosicongallery.com/" },
      { name: "阿里素材", url: "https://www.iconfont.cn/", icon: "https://api.xinac.net/icon/?url=https://www.iconfont.cn/" },
      { name: "ICONS8", url: "https://igoutu.cn/", icon: "https://api.xinac.net/icon/?url=https://igoutu.cn/" },
      { name: "菜鸟图标", url: "https://icon.sucai999.com/", icon: "https://api.xinac.net/icon/?url=https://icon.sucai999.com/" },
      { name: "金山云视觉", url: "http://vision.ksyun.com/#/icon-reposition", icon: "https://api.xinac.net/icon/?url=http://vision.ksyun.com/#/icon-reposition" }
    ]
  },
  {
    title: "字体",
    links: [
      { name: "更纱黑体", url: "https://github.com/be5invis/Sarasa-Gothic", icon: "https://api.xinac.net/icon/?url=https://github.com/be5invis/Sarasa-Gothic" },
      { name: "霞鹜文楷", url: "https://github.com/lxgw/LxgwWenKai", icon: "https://api.xinac.net/icon/?url=https://github.com/lxgw/LxgwWenKai" },
      { name: "思源黑体", url: "https://github.com/adobe-fonts/source-han-sans/tree/release/", icon: "https://api.xinac.net/icon/?url=https://github.com/adobe-fonts/source-han-sans/tree/release/" },
      { name: "思源宋体", url: "https://github.com/adobe-fonts/source-han-serif/tree/release/", icon: "https://api.xinac.net/icon/?url=https://github.com/adobe-fonts/source-han-serif/tree/release/" },
      { name: "小米字体", url: "https://hyperos.mi.com/font/zh/", icon: "https://api.xinac.net/icon/?url=https://hyperos.mi.com/font/zh/" },
      { name: "OPPO Sans", url: "https://www.coloros.com/article/A00000074/", icon: "https://api.xinac.net/icon/?url=https://www.coloros.com/article/A00000074/" },
      { name: "100font", url: "https://www.100font.com/", icon: "https://api.xinac.net/icon/?url=https://www.100font.com/" },
      { name: "字体天下", url: "https://www.fonts.net.cn/", icon: "https://api.xinac.net/icon/?url=https://www.fonts.net.cn/" },
      { name: "苍耳字体", url: "https://tsanger.cn/", icon: "https://api.xinac.net/icon/?url=https://tsanger.cn/" }
    ]
  },
  {
    title: "学习",
    links: [
      { name: "极客时间", url: "https://time.geekbang.org/", icon: "https://api.xinac.net/icon/?url=https://time.geekbang.org/" },
      { name: "慕课网", url: "https://www.imooc.com/", icon: "https://api.xinac.net/icon/?url=https://www.imooc.com/" },
      { name: "51CTO学堂", url: "https://edu.51cto.com/", icon: "https://api.xinac.net/icon/?url=https://edu.51cto.com/" },
      { name: "网易云课堂", url: "https://study.163.com/", icon: "https://api.xinac.net/icon/?url=https://study.163.com/" },
      { name: "多邻国", url: "https://www.duolingo.cn/", icon: "https://api.xinac.net/icon/?url=https://www.duolingo.cn/" }
    ]
  },
  {
    title: "软件资源",
    links: [
      { name: "果核剥壳", url: "https://www.ghxi.com/", icon: "https://api.xinac.net/icon/?url=https://www.ghxi.com/" },
      { name: "423Down", url: "https://www.423down.com/", icon: "https://api.xinac.net/icon/?url=https://www.423down.com/" },
      { name: "大眼仔旭", url: "https://www.dayanzai.me/", icon: "https://api.xinac.net/icon/?url=https://www.dayanzai.me/" },
      { name: "异次元软件", url: "https://www.iplaysoft.com/", icon: "https://api.xinac.net/icon/?url=https://www.iplaysoft.com/" },
      { name: "殁漂遥", url: "https://www.mpyit.com/", icon: "https://api.xinac.net/icon/?url=https://www.mpyit.com/" },
      { name: "独孤求软", url: "https://www.dugubest.com/", icon: "https://api.xinac.net/icon/?url=https://www.dugubest.com/" },
      { name: "I Tell You", url: "https://next.itellyou.cn/", icon: "https://api.xinac.net/icon/?url=https://next.itellyou.cn/" },
      { name: "Office Tool", url: "https://otp.landian.vip/zh-cn/", icon: "https://api.xinac.net/icon/?url=https://otp.landian.vip/" }
    ]
  },
  {
    title: "在线测试",
    links: [
      { name: "在线屏幕检测", url: "https://screen.bmcx.com/#welcome", icon: "https://api.xinac.net/icon/?url=https://screen.bmcx.com/" },
      { name: "屏幕UFO测试", url: "https://www.testufo.com/", icon: "https://api.xinac.net/icon/?url=https://www.testufo.com/" },
      { name: "鼠标连击测试", url: "https://cps-check.com/cn/double-click-test", icon: "https://api.xinac.net/icon/?url=https://cps-check.com/" }
    ]
  },
  {
    title: "工具",
    links: [
      { name: "Ventoy", url: "https://www.ventoy.net/", icon: "https://api.xinac.net/icon/?url=https://www.ventoy.net/" },
      { name: "rufus", url: "https://rufus.ie/zh/", icon: "https://api.xinac.net/icon/?url=https://rufus.ie/" },
      { name: "Wireshark", url: "https://www.wireshark.org/", icon: "https://api.xinac.net/icon/?url=https://www.wireshark.org/" },
      { name: "HotPE", url: "https://www.hotpe.top/", icon: "https://api.xinac.net/icon/?url=https://www.hotpe.top/" },
      { name: "微PE", url: "https://www.wepe.com.cn/", icon: "https://api.xinac.net/icon/?url=https://www.wepe.com.cn/" },
      { name: "Intel ARK", url: "https://www.intel.cn/content/www/cn/zh/ark.html", icon: "https://api.xinac.net/icon/?url=https://www.intel.cn/" }
    ]
  },
  {
    title: "车",
    links: [
      { name: "懂车帝", url: "https://www.dongchedi.com/", icon: "https://api.xinac.net/icon/?url=https://www.dongchedi.com/" },
      { name: "易车网", url: "https://www.yiche.com/", icon: "https://api.xinac.net/icon/?url=https://www.yiche.com/" },
      { name: "汽车之家", url: "https://www.autohome.com.cn/", icon: "https://api.xinac.net/icon/?url=https://www.autohome.com.cn/" },
      { name: "摩托范", url: "https://www.58moto.com/", icon: "https://api.xinac.net/icon/?url=https://www.58moto.com/" },
      { name: "卡车之家", url: "https://www.360che.com/", icon: "https://api.xinac.net/icon/?url=https://www.360che.com/" }
    ]
  },
  {
    title: "基准测试",
    links: [
      { name: "CPU-Monkey", url: "https://www.cpu-monkey.com/en/", icon: "https://api.xinac.net/icon/?url=https://www.cpu-monkey.com/en/" },
      { name: "CPU-Z", url: "https://www.cpuid.com/softwares/cpu-z.html", icon: "https://api.xinac.net/icon/?url=https://www.cpuid.com/softwares/cpu-z.html" },
      { name: "GPU-Z", url: "https://www.techpowerup.com/gpuz/", icon: "https://api.xinac.net/icon/?url=https://www.techpowerup.com/gpuz/" },
      { name: "Cinebench R23", url: "https://www.maxon.net/en/downloads", icon: "https://api.xinac.net/icon/?url=https://www.maxon.net/en/downloads" },
      { name: "HWiNFO", url: "https://www.hwinfo.com/download/", icon: "https://api.xinac.net/icon/?url=https://www.hwinfo.com/download/" },
      { name: "AIDA64", url: "https://www.aida64.com/downloads", icon: "https://api.xinac.net/icon/?url=https://www.aida64.com/downloads" },
      { name: "CrystalDiskInfo", url: "https://crystalmark.info/en/download/#CrystalDiskInfo", icon: "https://api.xinac.net/icon/?url=https://crystalmark.info/en/download/" },
      { name: "CrystalDiskMark", url: "https://crystalmark.info/en/download/#CrystalDiskMark", icon: "https://api.xinac.net/icon/?url=https://crystalmark.info/en/download/" }
    ]
  },
  {
    title: "待定",
    links: [
      { name: "苏州贝壳网", url: "https://su.ke.com/", icon: "https://api.xinac.net/icon/?url=https://su.ke.com/" },
      { name: "医保政策导航", url: "https://yibao.233h.com/", icon: "https://api.xinac.net/icon/?url=https://yibao.233h.com/" },
      { name: "永久基本农田信息查询", url: "https://yncx.mnr.gov.cn/yn/#/home", icon: "https://api.xinac.net/icon/?url=https://yncx.mnr.gov.cn/" }
    ]
  }
];