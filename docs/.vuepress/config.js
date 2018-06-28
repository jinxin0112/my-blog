// dcos/.vuepress/config.js
module.exports = {
    title: 'JIN XIN',  // 设置网站标题
    dest: './dist',    // 设置输出目录
    base: '', // 设置站点根路径
    repo: 'https://github.com/kingDuiDui/my-blog', // 添加 github 链接

    themeConfig: {
        // 添加导航栏
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Resume', link: '/my/' },
            { text: 'GitHub', link: 'https://github.com/kingDuiDui/my-blog' },
        ]
    }
}