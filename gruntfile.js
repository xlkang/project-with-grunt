// 实现这个项目的构建任务
// "clean": "grunt clean",       -> 清除temp和dist目录文件
// "lint": "grunt eslint",         -> lint scipts
// "serve": "grunt serve",       -> 开发模式启动app并启动一个自动更新的web服务
// "build": "grunt build",       -> 生产模式构建项目并且输出到dist目录
// "start": "grunt start --production",       -> 生产模式启动项目
const sass = require('sass');
const isProd = process.argv.includes('--production')
console.log('isProd', isProd)
console.log("process.argv====", process.argv)
const data = {
    menus: [{
        name: '主页',
        link: '/'
    },{
        name: '关于',
        link: '/about.html'
    }],
    title: 'grunt样板',
    pkg: require('./package.json'),
    dete: new Date()
}

module.exports = grunt => {
    require('load-grunt-tasks')(grunt);
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
                    sourceMap: !isProd,
                    presets: ['@babel/preset-env']
                },
                files: {
                    'temp/assets/scripts/main.js':'src/assets/scripts/*.js'
                }
            }
        },
        // grunt-eslint
        eslint: {
            target: ['src/assets/scripts/*.js']
        },
        // grunt-contrib-sass编译sass
        sass: {
            options: {
                implementation: {
                    sass
                },
                sourceMap: !isProd
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/styles',
                    src: ['*.scss'],
                    dest: 'temp/assets/styles',
                    ext: '.css'
                }]
            }
        },
        // 静态服务器
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'temp/assets/styles/*.css',
                        'temp/assets/scripts/*.js',
                        'temp/**/*.html',
                    ]
                },
                options: {
                    watchTask: true,
                    notify: false,
                    port: 3003,
                    server: {
                        baseDir: ['temp', 'src', 'public'],
                        routes: {
                            '/node_modules': 'node_modules'
                        }
                    }
                }
            },
            prod: {
                options: {
                    notify: false,
                    port: 3004,
                    server: {
                        baseDir: ['dist'],
                    }
                }
            }
        },
        useref: {
            // specify which files contain the build blocks
            html: 'temp/**/*.html',
            // explicitly specify the temp directory you are working in
            // this is the the base of your links ( "/" )
            temp: 'temp',
        },
        copy: {
            main: {
                files: [
                    // includes files within path and its sub-directories
                    {
                        expand: true,
                        cwd: 'public',
                        src: ['**'],
                        dest: 'dist'
                    },
                ],
            },
            mins: {
                files: [
                    // includes files within path and its sub-directories
                    {
                        expand: true,
                        cwd: 'temp/assets/',
                        src: [
                            'styles/**',
                            'scripts/**',
                        ],
                        dest: 'dist/assets/'
                    },
                ],
            },
        },
        htmlmin: {
            options: {
                removeComments: true, //移除注释
                removeCommentsFromCDATA: true,//移除来自字符数据的注释
                collapseWhitespace: true,//无用空格
                collapseBooleanAttributes: true,//失败的布尔属性
                removeAttributeQuotes: true,//移除属性引号      有些属性不可移走引号
                removeRedundantAttributes: true,//移除多余的属性
                useShortDoctype: true,//使用短的跟元素
                removeEmptyAttributes: true,//移除空的属性
                removeOptionalTags: true//移除可选附加标签
            },
            main: {
                expand: true,
                cwd: './temp/',
                src: ['**/*.html'],
                dest: 'dist/'
            }
        },
        imagemin: {
            images: {
                options: {
                    optimizationLevel: 1 //定义优化水平
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/images/',   // 图片目录
                    src: ['**'], // 优化 imagemin 目录下所有 png/jpg/jpeg 图片
                    dest: 'dist/assets/images/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            },
            fonts: {
                options: {
                    optimizationLevel: 1 //定义优化水平
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/fonts/',   // 图片目录
                    src: ['**'], // 优化 imagemin 目录下所有 png/jpg/jpeg 图片
                    dest: 'dist/assets/fonts' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
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
                files: ['src/**/*.html'],
                tasks: ['swigtemplates']
            }
        }
    })

    // 编译js文件
    grunt.registerTask('script', ['eslint', 'babel']);
    // 编译样式文件
    grunt.registerTask('style', ['sass'])
    // 编译html模板
    grunt.registerTask('page', ['swigtemplates'])
    // 编译文件
    grunt.registerTask('compile', ['script', 'style', 'page']);
    // 复制public目录文件
    grunt.registerTask('extra', ['copy']);

    // 开发模式启动app并启动一个自动更新的web服务
    grunt.registerTask('serve', [
        'clean',
        'compile',
        'browserSync:dev',
        'watch',
    ]);

    // 生产模式构建项目并且输出到dist目录
    grunt.registerTask('build', [
        'clean',
        'compile',
        'useref',
        'concat',
        'uglify',
        'cssmin',
        'htmlmin',
        'imagemin',
        'extra'
    ]);
    // 生产模式启动项目
    grunt.registerTask('start', ['build', 'browserSync:prod'])
}
