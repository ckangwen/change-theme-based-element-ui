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
      title="切换主题"
      width="400px">
      <el-form
        :model="colors"
        ref="form"
        class="theme-form"
        label-position="top"
        label-width="70px">
        <el-form-item label="选择主题" prop="primary">
          <el-color-picker v-model="colors.primary" ></el-color-picker>
        </el-form-item>
        <el-form-item class="color-buttons">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</div>
</template>

<script>
import generateColors from './utils/color'
import ComponentPreview from '@/components/ComponentPreview'
export default {
  name: 'app',
  components: {
    ComponentPreview
  },
  data () {
    return {
      colors: {
        primary: '#409eff'
      },
      originalStylesheetCount: -1,
      originalStyle: '',
      primaryColor: '#409eff',
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
      let cssText = this.originalStyle
      Object.keys(this.colors).forEach(key => {
        cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key])
      })

      if (this.originalStylesheetCount === document.styleSheets.length) {
        const style = document.createElement('style')
        style.innerText = cssText
        document.head.appendChild(style)
      } else {
        document.head.lastChild.innerText = cssText
      }
    },

    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.themeDialogVisible = false
          this.primaryColor = this.colors.primary
          this.colors = Object.assign({}, this.colors, generateColors(this.colors.primary))
          this.writeNewStyle()
        } else {
          return false
        }
      })
    },

    resetForm () {
      this.$refs.form.resetFields()
    },

    getStyleTemplate (data) {
      const colorMap = {
        '#3a8ee6': 'shade-1',
        '#409eff': 'primary',
        '#53a8ff': 'light-1',
        '#66b1ff': 'light-2',
        '#79bbff': 'light-3',
        '#8cc5ff': 'light-4',
        '#a0cfff': 'light-5',
        '#b3d8ff': 'light-6',
        '#c6e2ff': 'light-7',
        '#d9ecff': 'light-8',
        '#ecf5ff': 'light-9'
      }
      Object.keys(colorMap).forEach(key => {
        const value = colorMap[key]
        data = data.replace(new RegExp(key, 'ig'), value)
      })
      return data
    },

    getFile (url, isBlob = false) {
      return new Promise((resolve, reject) => {
        const client = new XMLHttpRequest()
        client.responseType = isBlob ? 'blob' : ''
        client.onreadystatechange = () => {
          if (client.readyState !== 4) {
            return
          }
          if (client.status === 200) {
            const urlArr = client.responseURL.split('/')
            resolve({
              data: client.responseText.replace(/@font-face{[^}]+}/, ''),
              url: urlArr[urlArr.length - 1]
            })
          } else {
            reject(new Error(client.statusText))
          }
        }
        client.open('GET', url)
        client.send()
      })
    },

    getIndexStyle () {
      this.getFile('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
        .then(({ data }) => {
          this.originalStyle = this.getStyleTemplate(data)
        })
    }
  },

  created () {
    this.getIndexStyle()
  },

  mounted () {
    this.$nextTick(() => {
      this.originalStylesheetCount = document.styleSheets.length
    })
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
