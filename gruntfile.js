// 实现这个项目的构建任务
// "clean": "grunt clean",       -> 清除temp和dist目录文件
// "lint": "grunt lint",         -> lint scipts
// "serve": "grunt serve",       -> 开发模式启动app并启动一个自动更新的web服务
// "build": "grunt build",       -> 生产模式构建项目并且输出到dist目录
// "start": "grunt start",       -> 生产模式启动项目
const loadGruntTasks = require('load-grunt-tasks');
const sass = require('sass');
const data = {
    menus: [{
        name: '主页',
        link: '/'
    },{
        name: '关于',
        link: '/about.html'
    }],
    title: 'gulp样板页面',
    pkg: require('./package.json'),
    dete: new Date()
}

module.exports = grunt => {
    grunt.initConfig({
        // 清除temp和dist目录文件
        clean: {
            temp: 'temp/**',
            dist: 'dist/**'
        },
        // 编译swig模板
        swigtemplates: {
            options: {
              defaultContext: data,
              templatesDir: 'src'
            },
            page: {
                dest: 'temp',
                src: ['src/**/*.html']
            },
        },
        // 转换并移动js
        babel: {
            main: {
                options: {
                    sourceMap: true,
                    presets: ['@babel/preset-env']
                },
                files: {
                    'temp/assets/scripts/main.js':'src/assets/scripts/*.js'
                }
            }
        },
        // 
        eslint: {
            target: ['src/assets/scripts/*.js']
        },
        sass: {
            options: {
                implementation: {
                    sass
                },
                sourceMap: true
            },
            main: {
                files: {
                    // 输出路径： 源路径
                    'temp/assets/styles/main.css':'src/assets/styles/*.scss'
                }
            }
        },
        watch: {
            js: {
                files: ['src/assets/scripts/*.js'],
                tasks: ['lint', 'babel']
            },
            css: {
                files: ['src/assets/styles/*.scss'],
                tasks: ['sass']
            },
            html: {
                files: ['src/assets/**/*.html'],
                tasks: ['swigtemplates']
            }
        }
    })
    
    // lint scipts
    grunt.registerTask('lint', ()=> {
        console.log('hello grunt~')
    })
    // 开发模式启动app并启动一个自动更新的web服务
    grunt.registerTask('serve', ()=> {
        console.log('hello grunt~')
    })
    // 生产模式构建项目并且输出到dist目录
    grunt.registerTask('build', ()=> {
        console.log('hello grunt~')
    })
    // 生产模式启动项目
    grunt.registerTask('start', ()=> {
        console.log('hello grunt~')
    })

    loadGruntTasks(grunt);
}
