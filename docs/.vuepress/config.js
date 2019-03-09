// dcos/.vuepress/config.js
module.exports = {
    title: 'JIN XIN',  // 设置网站标题
    dest: './dist',    // 设置输出目录
    base: '', // 设置站点根路径
    repo: 'https://github.com/kingDuiDui/my-blog', // 添加 github 链接

    themeConfig: {
        nav: [
            { text: 'GitHub', link: 'https://github.com/kingDuiDui/my-blog' }
        ],
        sidebar: {
            '/Blog/javascript/': [{
                title: 'my blog',
                collapsable: false,
                children: [
                    '',
                    'stream',
                    'prototype',
                    'eventLoop',
                    'promise',
                    'morethancode',
                    'zoom',
                    'jyzhp'
                ]
            }],
        }
    }
}