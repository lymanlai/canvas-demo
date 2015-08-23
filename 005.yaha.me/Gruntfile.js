'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var modRewrite = require('connect-modrewrite');
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    watch: {
      compass: {
        files: ['<%= pkg.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= pkg.app %>/{,*/}*.html',
          '<%= pkg.app %>/i18n/*.json',
          '{.tmp,<%= pkg.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= pkg.app %>}/scripts/{,*/}*.js',
          '{.tmp,<%= pkg.app %>}/scripts/{,*/}*.html',
          '{.tmp,<%= pkg.app %>}/scripts/{,*/}/views/*.html',
          '<%= pkg.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, pkg.dist)
            ];
          }
        }
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              modRewrite([
                '!\\.?(js|css|html|eot|svg|ttf|woff|otf|css|png|jpg|gif|ico) / [L]'
              ]),
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, pkg.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= pkg.dist %>/*',
            '!<%= pkg.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= pkg.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    compass: {
      options: {
        sassDir: '<%= pkg.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= pkg.app %>/images',
        javascriptsDir: '<%= pkg.app %>/scripts',
        // fontsDir: ['<%= pkg.app %>/components/flat-ui-official/fonts/lato', '<%= pkg.app %>/components/flat-ui-official/fonts', '<%= pkg.app %>/components/Font-Awesome/fonts'],
        importPath: '<%= pkg.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: false
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= pkg.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= pkg.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= pkg.dist %>/styles/main.css': [
            '.tmp/styles/share.css',
            '.tmp/styles/animate.css',
            '.tmp/styles/app.css'
          ]
        }
      }
    },
    // cdnify: {
    //   dist: {
    //     html: ['<%= pkg.dist %>/*.html']
    //   }
    // },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= pkg.dist %>/scripts',
          src: '*.js',
          dest: '<%= pkg.dist %>/scripts'
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= pkg.dist %>/scripts/{,*/}*.js',
            '<%= pkg.dist %>/styles/{,*/}*.css',
            '<%= pkg.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= pkg.dist %>/fonts/{,*/}*.*'
            // '<%= pkg.dist %>/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= pkg.app %>/index.html',
      options: {
        dest: '<%= pkg.dist %>'
      }
    },
    usemin: {
      html: ['<%= pkg.dist %>/{,*/}*.html'],
      css: ['<%= pkg.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= pkg.dist %>']
      }
    },
    'ftp-deploy': {
      yaha: {
        auth: {
          host: 's220.sureserver.com',
          port: 21,
          authKey: 'yaaaaaaa_hk'
        },
        src: '<%= pkg.dist %>',
        dest: '005',
        exclusions: ['<%= pkg.dist %>/**/.DS_Store', '<%= pkg.dist %>/**/Thumbs.db']
      }
    },
    copy: {
      dist: {
        files: [
            {
              expand: true,
              dot: true,
              cwd: '<%= pkg.app %>',
              dest: '<%= pkg.dist %>',
              src: [
                '*.html',
                '*.{ico,txt,png}',
                '.htaccess',
                'template/*/*.html',
                'redirect/**',
                'i18n/*.json',
                'scripts/{,*/}{,views/}*.html',
                './tmp/scripts/{,*/}{,views/}*.html',
                'images/{,*/}*.{gif,webp}'
              ]
            }
            , {
              expand: true,
              dot: true,
              cwd: '<%= pkg.app %>/components/bootstrap/dist/fonts/',
              dest: '<%= pkg.dist %>/fonts/',
              src: ['*','*/*']
            }
            , {
              expand: true,
              dot: true,
              cwd: '<%= pkg.app %>/components/Font-Awesome/fonts/',
              dest: '<%= pkg.dist %>/fonts/',
              src: ['*','*/*']
            }
            , {
              expand: true,
              dot: true,
              cwd: '<%= pkg.app %>/components/flat-ui-official/fonts/',
              dest: '<%= pkg.dist %>/fonts/',
              src: ['*','*/*']
            }
        ]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('dist', [
    'livereload-start',
    'connect:dist',
    'open',
    'watch'
  ]);

  //run server and open url in browser
  grunt.registerTask('so', [
    'clean:server',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  //just run server
  grunt.registerTask('s', [
    'clean:server',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'compass:dist',
    'copy',
    'useminPrepare',
    'imagemin',
    'ngmin',
    'concat',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'dist'
  ]);

  grunt.registerTask('deploy', ['ftp-deploy']);

  grunt.registerTask('default', ['build']);
};
