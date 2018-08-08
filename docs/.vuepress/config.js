// dcos/.vuepress/config.js
module.exports = {
    title: 'JIN XIN',  // 设置网站标题
    dest: './dist',    // 设置输出目录
    base: '', // 设置站点根路径
    repo: 'https://github.com/kingDuiDui/my-blog', // 添加 github 链接

    themeConfig: {
        nav: [
            {
                text: 'Blog',
                items: [
                    { text: 'JavaScript', link: '/Blog/javascript/' },
                    { text: 'CSS', link: '/Blog/css/' },
                    { text: 'Life', link: '/Blog/life/' },
                    { text: 'Orther', link: '/Blog/orther/' }
                ]
            },
            { text: 'Project', link: '/Project/' },
            { text: 'Resume', link: '/Resume/' },
            { text: 'Interview', link: '/Interview/' },
            { text: 'GitHub', link: 'https://github.com/kingDuiDui/my-blog' }
        ],
        sidebar: {
            '/Blog/javascript/': [{
                title: 'JavaScript',
                collapsable: false,
                children: [
                    '',
                    'prototype',
                    'eventLoop',
                    'promise'
                ]
            }],
            '/Blog/css/': [{
                title: 'CSS',
                collapsable: false,
                children: ['/']
            }],
            '/Blog/orther/': [{
                title: 'Orther',
                collapsable: false,
                children: [
                    '',
                    'sql'
                ]
            }],
            '/Project/': [{
                title: 'Project',
                collapsable: false,
                children: [
                    '',
                    'search'
                ]
            }],
            '/Interview/': [{
                title: 'Interview',
                collapsable: false,
                children: [
                    '',
                    'Interview',
                    'flex',
                    'mvvm',
                    'color',
                    'router',
                    'debounce',
                    'shareCookie',
                    'xss',
                    'maxArr',
                ]
            }]
        }
    }
}