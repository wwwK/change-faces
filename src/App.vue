<template>
  <div id="app" class="container-fluid" :style="{ display: appDisplay }">

    <!-- 更换背景和头像 -->
    <b-card class="cf-tabs-card" no-block style="margin-bottom: 20px;">
      <b-tabs small card ref="tabs" v-model="tabIndex">
        <b-tab title="更换背景" class="scroller">
          <div class="scene">
            <img
              @click="handleChangeScene"
              src="../static/thumb_400216478-A.png"
              data-src="400216478-A.png"
              data-size="1280x960"
              data-holes="596,353 689x410 0"
            >
          </div>
          <div class="scene">
            <img
              @click="handleChangeScene"
              src="../static/thumb_400216478-B.png"
              data-src="400216478-B.png"
              data-size="1280x960"
              data-holes="596,353 689x410 0"
            >
          </div>
          <div class="scene">
            <img
              @click="handleChangeScene"
              src="../static/thumb_400216478-C.png"
              data-src="400216478-C.png"
              data-size="1280x960"
              data-holes="596,353 689x410 0"
            >
          </div>
          <div class="scene">
            <img src="../static/thumb_400216478.png">
          </div>
          <div class="scene">
            <img src="../static/thumb_400216478.png">
          </div>
          <div class="scene">
            <img src="../static/thumb_400216478.png">
          </div>
          <div class="scene">
            <img src="../static/thumb_400216478.png">
          </div>
        </b-tab>
        <b-tab title="更换头像">
          <div class="scene">
            <img v-model="mugshots[0]" @click="handleChangeMugshot" src="../static/3b2014dcefb972a6.png">
          </div>
        </b-tab>
      </b-tabs>
    </b-card>

    <b-card
      tag="article"
      style="width: 100%;"
      class="mb-2"
    >
      <vue-slider
        v-model="sceneOpacity"
        :min="0"
        :max="1"
        :interval="0.01"
      ></vue-slider>
    </b-card>
    <div id="canvasRow">
      <div id="canvasContainer">
        <canvas id="canvas" />
      </div>
    </div>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
/* eslint-disable no-console */

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import vueSlider from 'vue-slider-component';

import 'bootstrap/dist/css/bootstrap.css'; // eslint-disable-line import/no-extraneous-dependencies
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

const defaultSceneOpacity = 0.5;

const App = {
  dblClickTime: 0,
  scaleFactor: 1,
  canvas: null,
  spinner: null,
  scene: null,
  canvasScale() {
    const canvasWidth = App.canvas.getWidth();
    const canvasHeight = App.canvas.getHeight();
    const ratio = canvasWidth / canvasHeight;
    // let canvasRowWidth = document.getElementById('canvasRow').style.width; // 200px : string
    const canvasRowWidth = document.getElementById('canvasRow').clientWidth; // 200 : number
    const canvasContainerWidth = Math.min(canvasRowWidth, canvasWidth);
    const canvasContainerHeight = Math.round(canvasContainerWidth / ratio);
    // $("#canvasContainer").css({
    //     width: canvasContainerWidth + 4 + "px",
    //     height: canvasContainerHeight + 4 + "px"
    // });
    document.getElementById('canvasContainer').style.width = `${canvasContainerWidth}px`;
    document.getElementById('canvasContainer').style.height = `${canvasContainerHeight}px`;
    document.getElementsByClassName('canvas-container')[0].style.width = '100%';
    document.getElementsByClassName('canvas-container')[0].style.height = '100%';
    const canvasList = document.getElementsByTagName('canvas');
    for (let i = 0; i < canvasList.length; i += 1) {
      canvasList.item(i).style.width = '100%';
      canvasList.item(i).style.height = '100%';
    }
    App.scaleFactor = canvasWidth / canvasContainerWidth;
    console.log('scale factor:', App.scaleFactor);
    App.canvas.renderAll();
    // (canvasWidth = App.canvas.getActiveObject()) && App.repositionContextMenu(canvasWidth);
  },
};

export default {
  name: 'app',
  components: {
    vueSlider,
  },
  data() {
    return {
      foo: 'bar',
      sceneOpacity: defaultSceneOpacity,
      appDisplay: 'block',
      tabIndex: null,
      mugshots: [
        { uid: 0, src: '3b2014dcefb972a6.png' },
      ],
    };
  },
  mounted() {
    try {
      // create a wrapper around native canvas element (with id="c")
      App.canvas = new fabric.Canvas('canvas', {
        preserveObjectStacking: !0,
        enableRetinaScaling: !1,
        stopContextMenu: !0,
      });

      // create a rectangle object
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
      });

      // "add" rectangle onto canvas
      App.canvas.add(rect);

      // backgroud
      fabric.Image.fromURL('./static/400216478-A.png', (img) => {
        App.scene = {
          // $img: c,
          fabricImg: img,
        };
        img.set({
          originX: 'left',
          originY: 'top',
          opacity: this.sceneOpacity,
        });
        App.canvas.setWidth(img.width).setHeight(img.height);
        App.canvas.setOverlayImage(img, App.canvasScale);
      });

      // foregroud
      const firstUid = 0;
      fabric.Image.fromURL(`./static/${this.mugshots.find(ms => ms.uid === firstUid).src}`, (img) => {
        img.scale(0.6).setCoords();
        img.set({
          uid: firstUid,
          left: 606,
          top: 355,
        });
        App.canvas.add(img);
        App.canvas.setActiveObject(img);
        // App.showObjProps(img);
      });

      App.canvasScale();
      window.addEventListener('resize', App.canvasScale);
    } catch (error) {
      console.log('something is wrong with fabric init:', error);
    }
  },
  methods: {
    handleChangeScene(event) {
      function b(g, h, c) {
        const dd = g[c].split(' ');
        const ee = dd[0].split(',');
        const f = +ee[0];
        const k = +ee[1];
        const e = dd[1].split('x');
        const l = +e[0];
        const q = +e[1];
        const r = +dd[2];
        const m = h[c];
        // const ddd = $('#mugshots img[data-uid="' + m + '"]');
        let ddd = null;
        const imgs = document.getElementById('mugshots').querySelectorAll('img');
        for (let index = 0; index < imgs.length; index += 1) {
          if (imgs.item(index).getAttribute('data-uid') === m) {
            ddd = imgs.item(index);
          }
        }
        const n = ddd.getAttribute('src');
        const d = ddd.getAttribute('data-size').split('x');
        const t = +d[0];
        const u = +d[1];
        fabric.Image.fromURL(n, (img) => {
          img.set({
            url: n,
            uid: m,
            left: f,
            top: k,
            angle: r,
            originX: 'center',
            originY: 'center',
            scaleX: l / t,
            scaleY: q / u,
          }).setCoords();
          App.canvas.add(d);
          if (c === 0) {
            App.showObjProps(img);
            App.canvas.setActiveObject(img);
          }
          // $('#mugshots img[data-uid="' + m + '"]').addClass("oncanvas");
          ddd.className += ' oncanvas';
          if (c < h.length - 1 && c < g.length - 1) {
            b(g, h, c + 1);
          } else {
            App.canvas.renderAll();
          }
        });
      }
      const thumbImageElement = event.target;
      const dddd = thumbImageElement.getAttribute('data-size').split('x');
      const g = thumbImageElement.getAttribute('data-holes'); // 可能不止一个hole
      const l = dddd[0];
      const d = dddd[1];
      const h = [];
      App.canvas.forEachObject((obj) => {
        if (obj.type === 'image') {
          h.push(obj.uid);
          // $('#mugshots img[data-uid="' + obj.uid + '"]').removeClass("oncanvas");
          obj.remove();
        }
      });
      App.canvas.setWidth(l).setHeight(d);
      App.canvasScale();
      fabric.Image.fromURL(`./static/${thumbImageElement.getAttribute('data-src')}`, (img) => {
        App.scene = {
          $img: thumbImageElement,
          fabricImg: img,
        };
        img.set({
          originX: 'left',
          originY: 'top',
          opacity: this.sceneOpacity,
        });
        App.canvas.setOverlayImage(img, () => {
          if (h.length > 0) {
            b(g, h, 0);
          } else {
            App.canvas.renderAll();
          }
        });
      });
    },
    handleChangeMugshot() {

    },
  },
  watch: {
    sceneOpacity(newValue) {
      App.scene.fabricImg.set('opacity', newValue);
      App.canvas.renderAll();
    },
  },
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 60px;
}

/* 换背景和换头像 */
.cf-tabs-card {
  /* 标签页下的内容页 */
  .tab-content {
    padding: 10px;
  }

  /* 横向滚动 */
  div.scroller {
      overflow: auto;
      white-space: nowrap;
  }

  /* 每个图片 */
  div.mugshot, div.scene {
    display: inline-block;
    cursor: pointer;
  }
}
</style>
