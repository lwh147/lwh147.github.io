<template>
  <div>
    <div id="content-markdwon"></div>
  </div>
</template>

<script>
import showdown from 'showdown/dist/showdown.min'
import 'highlight.js/styles/darcula.css'
import hljs from 'highlight.js'
import request from "@/utils/request"

export default {
  name: 'show-down',
  props: {
    markdown: {
      type: String,
      default: '# 这是一个例子'
    },
    url: {
      type: String
    },
    highlight: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    markdown: function () {
      this.init()
    },
    url: function () {
      this.init()
    },
    highlight: function () {
      this.init()
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.init()
  },
  methods: {
    init: function () {
      if (!this.$props.url) {
        this.compileMarkDown(this.$props.markdown)
        if (this.$props.highlight) {
          hljs.highlightAll()
        }
      } else {
        this.getDocment(this.$props.url)
      }
    },
    /**
     * 转换markdown语法为html语法
     **/
    compileMarkDown: function (markdown) {
      let converter = new showdown.Converter()
      //表格显示
      converter.setOption("tables", true)
      document.getElementById('content-markdwon').innerHTML = converter.makeHtml(markdown)
    },
    /**
     * 请求md文件内容
     **/
    getDocment: function (url) {
      // 请求接口
      request(url).then(res => {
        this.compileMarkDown(res)
        if (this.$props.highlight) {
          hljs.highlightAll()
        }
      });
    }
  },
};
</script>

<style>
</style>