# change-theme-based-element-ui

一、使用全局的样式覆盖

单独写一份符合该主题的css文件，然后通过动态地修改body或html上的class来切换样式

![](https://static01.imgkr.com/temp/135e8dcc12ac4bcb860b35dce9e242c1.gif)

<br/>

二、ElementUI自定义主题

利用ElementUI提供的[主题生成器](https://element.eleme.cn/#/zh-CN/theme/preview)定制主题，这种办法相对于第一种方案的优点是能够定制组件的样式，而不单单是html的样式。

但是如果只是引入定制好的样式表是无法达到换肤的目的，我们希望可以切换颜色。

所以这就需要在生成的css文件中的每个选择器前添加命名前缀，例如`.el-table`转换为`.theme-dark .el-table`，这需要借助`gulp`来实现。

```js
const path = require('path')
const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const cssWrap = require('gulp-css-wrap')

const prefix = '.theme-purple'

function css (done) {
  gulp.src(path.resolve('../theme/index.css'))
    .pipe(cssWrap({ selector: prefix }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'))
  done()
}

exports.default = gulp.series(css)

```

> 这里使用的gulp版本是4.0.2，api与3.x不一致，需要注意

![](https://static01.imgkr.com/temp/a54df3c9588c44a3b57556c254a91070.gif)

<br/>

三、实时更换主题颜色

前面已经介绍了几种方法可以做到换肤，但都是在我们的限定提供的几个皮肤范围内换肤，如果要求根据用户选择的颜色改变应用的主题，那么就有点捉襟见肘。

实现该需求的方法就是获取到element-ui最新的css样式表，通过直接修改其中的颜色，然后把修改后的样式表插入到页面中。

具体的实现步骤如下

- 访问`unpkg.com`获取当前版本的 `Element-UI` 的样式文件(如果是本地项目需要跨域)
- 把样式表中的一些颜色值替换为一些关键字，例如`#409EF`替换为`color-primary`，`#67C23A`替换为`color-success`
- 根据用户的选择，将关键字替换为指定的颜色值
- 将最终的css样式填入新建的`style`标签中

![](https://static01.imgkr.com/temp/d78fe8b151314eeab428285dc32f5863.gif)



<br/>

> 参考链接：[基于Vue、ElementUI的换肤解决方案](<https://neveryu.github.io/2019/07/01/vue-element-change-theme/>)