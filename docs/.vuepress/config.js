const glob = require('glob');
const path = require('path');

function getChildren() {
    const cwd = path.join(__dirname, '../', 'Blog');
    const pattern = '**/*.md';
    const list = glob.sync(pattern, { cwd });
    const children = list.map(i => i.replace('.md', '')).map(i => (i === 'README' ? '' : i));
    children.sort();
    return children;
}

// dcos/.vuepress/config.js
module.exports = {
    title: 'Isabellae', // 设置网站标题
    dest: './dist', // 设置输出目录
    base: '', // 设置站点根路径
    repo: 'https://github.com/jinxin0112/my-blog', // 添加 github 链接
    head: [
        ['link', { rel: 'icon', href: '/timg.png' }],
        [
            'meta',
            { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }
        ]
    ],
    plugins: ['vuepress-plugin-cat', '@vuepress/medium-zoom', 'flowchart'],
    theme: 'reco',
    themeConfig: {
        author: 'JIN XIN',
        type: 'blog',
        sidebarDepth: 1,
        startYear: '2017',
        authorAvatar: '/timg.png',
        nav: [
            { text: 'GitHub', link: 'https://github.com/jinxin0112/my-blog', icon: 'reco-github' }
        ],
        vssueConfig: {
            platform: 'github',
            owner: 'jinxin0112',
            repo: 'my-blog',
            clientId: 'fadc75f7996bfcf8e2eb',
            clientSecret: '51293ed3b9d548d532577c0b9eb7b2148e26c2a0'
        },
        friendLink: [
            {
                title: 'LeonGravel',
                desc: '一个脱离了高级趣味的空栈工程师',
                logo: 'https://s.gravatar.com/avatar/fd0e02edb15e0dfd419fba201edebfeb?s=80',
                link: 'https://leongravel.com/'
            },
            {
                title: 'JordanZhang',
                desc: 'The only thing I can keep doing, just lazy coding!',
                logo: 'http://jordanzhang.xyz/assets/blogImg/lufei.jpg',
                link: 'http://jordanzhang.xyz/'
            }
        ]
    }
};
