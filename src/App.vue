<template>
  <div id="app">
    <div id="page-body">
      <!--<show-down url="md/hello.md" highlight-style="arta"/>-->
      <show-down url="README.md" highlight-style="arta"/>
    </div>
    <music-player :fixed="true" server="netease" type="playlist" id="905974655"/>
    <spring-loader id="loader" theme="white" :show="springLoaderShow"/>
  </div>
</template>

<script>
import ShowDown from '@/components/ShowMarkDown.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';
import SpringLoader from '@/components/SpringLoader.vue';

export default {
  name: 'App',
  components: {
    SpringLoader,
    MusicPlayer,
    ShowDown
  },
  data() {
    return {
      springLoaderShow: true
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      // 初始化结束
      setTimeout(() => {
            this.springLoaderShow = false;
          },
          300);
    }
  }
};
</script>

<style lang="scss">
#app {
  margin: 0;
  padding: 0;

  #page-body {
    width: 70%;
    margin: 0 auto;
  }
}
</style>
