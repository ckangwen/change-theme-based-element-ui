<template>
<div id="app">
  <el-container class="wrapper">
    <el-header
      class="global-header"
      height="80px"
    >
    <div class="inline-block">
      <a target="_blank" href="https://element.eleme.cn/#/zh-CN/theme/preview" style="color: inherit;">ElemetUI主题生成器</a>
      <i class="el-icon-link"></i>
    </div>
      <div class="header-operations">
        <div class="inline-block" @click="themeDialogVisible = true" style="padding-right: 20px;">
          自定义主题颜色
        </div>
        <el-dropdown class="inline-block" trigger="click" @command="changeTheme">
          <span class="el-dropdown-link">
            切换主题<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="classic">默认主题</el-dropdown-item>
            <el-dropdown-item command="dark">黑色主题</el-dropdown-item>
            <el-dropdown-item command="light">亮色主题</el-dropdown-item>
            <el-dropdown-item command="purple">紫色主题</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside class="menu">
        <el-menu default-active="1">
          <el-menu-item index="1">页面1</el-menu-item>
          <el-menu-item index="2">页面2</el-menu-item>
          <el-menu-item index="3">页面3</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="content">
        <component-preview />
      </el-main>
    </el-container>
    <el-dialog
      center
      :visible.sync="themeDialogVisible"
      width="400px">
        <div>选择主题</div>
        <el-color-picker v-model="color"></el-color-picker>
    </el-dialog>
  </el-container>
</div>
</template>

<script>
import { getStyleTemplate, getFile, getColorClusterMap } from './utils/theme'
import ComponentPreview from '@/components/ComponentPreview'
const defaultColor = '#409eff'
export default {
  name: 'app',
  components: {
    ComponentPreview
  },
  data () {
    return {
      color: defaultColor,
      styleId: 'el-chalk-style',
      originalStylesheetCount: -1,
      originalStyle: '',
      styleTemplate: '',
      colorMap: {},
      themeDialogVisible: false
    }
  },
  methods: {
    showThemeDialog () {
      this.themeDialogVisible = true
    },

    changeTheme (theme) {
      const app = document.getElementById('app')
      app.className.split(' ').forEach(name => {
        if (/^theme-\w/.test(name)) {
          app.classList.remove(name)
        }
      })
      app.classList.add(`theme-${theme}`)
    },

    writeNewStyle () {
      let cssText = this.styleTemplate
      if (!cssText) return
      Object.keys(this.colorMap).forEach(key => {
        cssText = cssText.replace(new RegExp('(:|\\s+)' + this.colorMap[key], 'g'), '$1' + key)
      })

      let styleTag = document.getElementById(this.styleId)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', this.styleId)
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = cssText
    },

    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.themeDialogVisible = false
          this.primaryColor = this.color
          this.writeNewStyle()
        } else {
          return false
        }
      })
    },

    resetForm () {
      this.$refs.form.resetFields()
    },
    getIndexStyle () {
      getFile('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
        .then(({ data }) => {
          this.originalStyle = data
          this.styleTemplate = getStyleTemplate(this.color, data)
        })
    }
  },

  watch: {
    color: {
      handler: async function (val, oldVal) {
        if (val === oldVal) return
        this.colorMap = getColorClusterMap(val)
        if (val !== defaultColor) {
          // console.log(this.styleTemplate)
          this.writeNewStyle()
        }
      },
      immediate: true
    }
  },
  created () {
    this.colorMap = getColorClusterMap(this.color)
    this.getIndexStyle()
  }
}
</script>
<style lang="scss">
.inline-block {
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
}
@import './assets/style/index.scss';
</style>
