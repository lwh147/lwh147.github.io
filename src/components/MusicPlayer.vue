<template>
  <div>
    <!-- aplayer容器div -->
    <div id="aplayer"></div>
  </div>
</template>

<script>
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer/dist/APlayer.min.js';

export default {
  name: 'MusicPlayer',
  props: {
    //------------- 指定自定义的托管api进行播放 -------------//
    server: {
      type: String
    },
    type: {
      type: String
    },
    id: {
      type: String
    },
    api: {
      type: String
    },
    auth: {
      type: String
    },
    //------------- 根据歌单链接自动识别获取api相关参数 -------------//
    auto: {
      type: String
    },
    //------------- 其他aplayer设置需要做处理 -------------//
    // 通过该属性播放需要单独处理
    audio: {
      type: Array
    },
    // 不能与fixed属性同时指定，需要单独处理
    mini: {
      type: Boolean,
      default: false
    },
    //------------- 其他aplayer设置 -------------//
    fixed: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: '#b7daff'
    },
    loop: {
      type: String,
      default: 'all'
    },
    order: {
      type: String,
      default: 'list'
    },
    preload: {
      type: String,
      default: 'auto'
    },
    volume: {
      type: Number,
      default: 0.7
    },
    mutex: {
      type: Boolean,
      default: true
    },
    lrcType: {
      type: Number,
      default: 3
    },
    listFolded: {
      type: Boolean,
      default: false
    },
    listMaxHeight: {
      type: String,
      default: '200px'
    },
    storageName: {
      type: String,
      default: 'music-player-setting'
    }
  },
  data() {
    return {
      // 常量
      constraints: {
        // 支持播放的音乐平台
        musicPlatform: ['netease', 'tencent', 'xiami', 'kugou', 'baidu'],
        // 支持识别的auto  url类别
        supportedMusicLink: ['netease', 'tencent', 'xiami'],
        // 自动识别的规则，正则表达式
        autoParseRules: [
          ['music.163.com.*song.*id=(\\d+)', 'netease', 'song'],
          ['music.163.com.*album.*id=(\\d+)', 'netease', 'album'],
          ['music.163.com.*artist.*id=(\\d+)', 'netease', 'artist'],
          ['music.163.com.*playlist.*id=(\\d+)', 'netease', 'playlist'],
          ['music.163.com.*discover/toplist.*id=(\\d+)', 'netease', 'playlist'],
          ['y.qq.com.*song/(\\w+).html', 'tencent', 'song'],
          ['y.qq.com.*album/(\\w+).html', 'tencent', 'album'],
          ['y.qq.com.*singer/(\\w+).html', 'tencent', 'artist'],
          ['y.qq.com.*playsquare/(\\w+).html', 'tencent', 'playlist'],
          ['y.qq.com.*playlist/(\\w+).html', 'tencent', 'playlist'],
          ['xiami.com.*song/(\\w+)', 'xiami', 'song'],
          ['xiami.com.*album/(\\w+)', 'xiami', 'album'],
          ['xiami.com.*artist/(\\w+)', 'xiami', 'artist'],
          ['xiami.com.*collect/(\\w+)', 'xiami', 'playlist'],
        ],
        // type属性取值列表
        type: ['song', 'playlist', 'album', 'search', 'artist'],
        // 自定义设置列表
        keys: [
          'server', 'type', 'id', 'api', 'auth',
          'auto',
          'audio'
        ],
        // 默认的托管api
        defaultApi: 'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r',
        // 控制台输出信息前缀
        logPrefix: 'MusicPlayer - '
      },
      // 获取歌单信息使用的自定义托管api
      finalApi: {},
      // 其他继承自aplayer的设置
      config: {},
      // 自定义设置
      meta: {},
      // 最终生成的aplayer设置
      options: {},
      // 最终生成的aplayer实例
      aplayer: null
    };
  },
  /**
   * dom实例挂载之后
   **/
  mounted() {
    // 初始化播放器
    this.init();
  },
  methods: {
    /**
     * 初始化播放器
     **/
    init: function () {
      // 提取所有设置项
      this.config = {...this.$props};

      // 吸底模式和mini模式只能二选一，设置时不能同时设置(即使两者都为false)，否则样式会出问题
      if (this.config['fixed']) {
        if (this.config.mini) {
          throw new Error(this.constraints.logPrefix + '吸底模式和mini模式只能二选一 ！');
        } else {
          delete this.config['mini'];
        }
      } else {
        if (this.config.mini) {
          delete this.config['fixed'];
        } else {
          delete this.config.mini;
          delete this.config['fixed'];
        }
      }

      // 提取自定义的设置项
      this.constraints.keys.forEach(key => {
        this.meta[key] = this.config[key];
        // 删除自定义设置，剩下的设置项即为继承自aplayer的设置项
        delete this.config[key];
      });

      // 是否直接设置了音源列表进行播放
      if (this.meta.audio) {
        this.options = {
          audio: this.meta.audio,
          ...this.config
        };
        this.loadAPlayer();
        return;
      }

      // 获取自定义音源api
      this.finalApi = this.meta.api || this.constraints.defaultApi;

      // 是否指定了自动识别获取api参数
      if (this.meta.auto) {
        this.parseCustomizedLink();
      }

      // 替换api中的参数信息
      this.parse();
    },
    /**
     * 自动解析地址获取api参数
     **/
    parseCustomizedLink: function () {
      // 遍历支持的地址正则表达式列表进行匹配
      for (let rule of this.constraints.autoParseRules) {
        let patt = new RegExp(rule[0]);
        let res = patt.exec(this.meta.auto);
        if (res !== null) {
          // 匹配，保存参数信息
          this.meta.server = rule[1];
          this.meta.type = rule[2];
          this.meta.id = res[1];
          // 匹配一个就结束整个循环
          return;
        }
      }
      // 一个都不匹配，抛出错误
      throw new Error(this.constraints.logPrefix + '目前支持歌单url识别的平台：'
          + this.constraints.supportedMusicLink.toString() + ' !');
    },
    /**
     * 替换api中的参数信息并获取歌单数据
     **/
    parse: function () {
      // 使用者手动配置参数时检验参数是否合法
      if (!this.meta.server || !this.meta.type || !this.meta.id) {
        throw new Error(this.constraints.logPrefix + '请按规则填写组件属性参数 !');
      }
      // 替换参数值，生成最终请求url
      let url = this.finalApi
          .replace(':server', this.meta.server)
          .replace(':type', this.meta.type)
          .replace(':id', this.meta.id)
          .replace(':auth', this.meta.auth || '')
          .replace(':r', Math.random());
      // 发送请求获取歌单数据
      fetch(url)
          .then(response => response.json())
          .then(result => {
            // 更新配置中的歌单信息
            this.options = {
              audio: result,
              ...this.config
            };
            // 配置并生成aplayer实例
            this.loadAPlayer();
          });
    },
    /**
     * 配置并生成aplayer实例
     **/
    loadAPlayer: function () {
      // 指定aplayer容器div
      this.options.container = document.getElementById('aplayer');
      this.aplayer = new APlayer(this.options);
    }
  }
};
</script>

<style lang="scss" scoped>
// 常量
$lrc-background-color: rgba(0, 0, 0, 0.05);
$lrc-background-color-dark: rgba(255, 255, 255, 0.05);
$lrc-font-color-dark: white;

.aplayer.aplayer-fixed ::v-deep .aplayer-lrc {
  bottom: 0;
  height: 26px;
  padding: 20px;
  background-color: $lrc-background-color;

  p {
    text-shadow: none;
  }
}
</style>