<template>
  <div>
    <!-- spring-loader容器div -->
    <div id="spring-loader"></div>
  </div>
</template>

<script>
import springLoader from '@/utils/spring-loader';

export default {
  name: 'SpringLoader',
  props: {
    theme: {
      type: String,
      default: 'white'
    },
    show: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  watch: {
    /**
     * 当show发生变化时重新初始化
     **/
    show: function () {
      this.init();
    }
  },
  data() {
    let map = new Map();
    map.set('white', 0);
    map.set('black', 1);
    map.set('green', 2);
    map.set('purple', 3);
    map.set('yellow', 4);
    map.set('red', 5);
    return {
      constraints: {},
      map: map,
      settings: [
        {
          rebound: {
            tension: 16,
            friction: 5
          },
          spinner: {
            id: 'spinner',
            radius: 90,
            sides: 3,
            depth: 4,
            colors: {
              background: '#f0f0f0',
              stroke: '#272633',
              base: null,
              child: '#272633'
            },
            alwaysForward: true, // When false the spring will reverse normally.
            restAt: 0.5, // A number from 0.1 to 0.9 || null for full rotation
            renderBase: false
          }
        },
        {
          rebound: {
            tension: 10,
            friction: 7
          },
          spinner: {
            id: 'spinner',
            radius: 150,
            sides: 8,
            depth: 6,
            colors: {
              background: '#181818',
              stroke: '#D23232',
              base: null,
              child: '#181818'
            },
            alwaysForward: true, // When false the spring will reverse normally.
            restAt: null, // A number from 0.1 to 0.9 || null for full rotation
            renderBase: false
          }
        },
        {
          instances: {
            spring: null,
            spinner: null
          },
          rebound: {
            tension: 50,
            friction: 8
          },
          spinner: {
            radius: 80,
            sides: 4,
            depth: 3,
            colors: {
              background: '#58CA6B',
              stroke: '#000000',
              base: null,
              child: '#58CA6B'
            },
            alwaysForward: true, // When false the spring will reverse normally.
            restAt: 0.5, // A number from 0.1 to 0.9 || null for full rotation
            renderBase: false // Optionally render basePolygon
          }
        },
        {
          instances: {
            spring: null,
            spinner: null
          },
          rebound: {
            tension: 13,
            friction: 10
          },
          spinner: {
            radius: 80,
            sides: 4,
            depth: 3,
            colors: {
              background: '#673AB7',
              stroke: '#000',
              base: null,
              child: '#6F4DAB'
            },
            alwaysForward: false, // When false the spring will reverse normally.
            restAt: null, // A number from 0.1 to 0.9 || null for full rotation
            renderBase: false // Optionally render basePolygon
          }
        },
        {
          instances: {
            spring: null,
            spinner: null
          },
          rebound: {
            tension: 15,
            friction: 10
          },
          spinner: {
            radius: 80,
            sides: 6,
            depth: 5,
            colors: {
              background: '#FFC107',
              stroke: null,
              base: null,
              child: '#222'
            },
            alwaysForward: false, // When false the spring will reverse normally.
            restAt: 0.5, // A number from 0.1 to 0.9 || null for full rotation
            renderBase: false // Optionally render basePolygon
          }
        },
        {
          instances: {
            spring: null,
            spinner: null
          },
          rebound: {
            tension: 10,
            friction: 10
          },
          spinner: {
            radius: 70,
            sides: 4,
            depth: 8,
            colors: {
              background: '#EC4141',
              stroke: '#222',
              base: '#222',
              child: '#EC4141'
            },
            alwaysForward: true, // When false the spring will reverse normally.
            restAt: null, // A number from 0.1 to 0.9 || null for full rotation
            renderBase: true // Optionally render basePolygon
          }
        }
      ]
    };
  },
  mounted() {
    // 初始化
    springLoader.settings = this.settings[this.map.get(this.$props.theme)];
    this.init();
  },
  methods: {
    /**
     * 初始化组件
     **/
    init: function () {
      if (this.$props.show) {
        springLoader.init();
      } else {
        this.stop();
      }
    },
    /**
     * 停止动画
     **/
    stop: function () {
      let canvas = document.getElementsByTagName('canvas')[0];
      if (canvas) {
        canvas.remove();
      }
    }
  }
};
</script>

<style scoped>

</style>