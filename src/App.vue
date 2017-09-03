<template>
  <div id="app" class="container-fluid" :style="{ display: appDisplay }">

    <!-- 更换背景和头像 -->
    <b-card class="cf-tabs-card" no-block style="margin-bottom: 20px;">
      <b-tabs small card ref="tabs" v-model="tabIndex">
        <b-tab title="更换背景" class="scroller" id="scenes">
          <div class="scene" v-for="scene in scenes">
            <img
              @click="handleChangeScene"
              :src="'../static/scenes/' + scene.imgSrc"
              :data-src="'./static/scenes/' + scene.dataSrc"
              :data-size="scene.dataSize"
              :data-holes="scene.dataHoles"
            >
          </div>
        </b-tab>
        <b-tab title="更换头像" class="scroller" id="mugshots">
          <div class="mugshot" v-for="mugshot in mugshots">
            <img
              @click="handleChangeMugshot"
              :src="`../static/mugshots/${mugshot.imgSrc}`"
              :data-uid="mugshot.dataUId"
              :data-size="mugshot.dataSize"
            >
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
        <div id="objProps" style="display: block;"></div>
        <canvas id="canvas" />
      </div>
    </div>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
/* global $ */
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
    const canvasRowWidth = $('#canvasRow').width(); // 200 : number
    const canvasContainerWidth = Math.min(canvasRowWidth, canvasWidth);
    const canvasContainerHeight = Math.round(canvasContainerWidth / ratio);
    $('#canvasContainer').css({
      width: `${canvasContainerWidth + 4}px`,
      height: `${canvasContainerHeight + 4}px`,
    });
    $('canvas,.canvas-container').css({
      width: '100%',
      height: '100%',
    });
    App.scaleFactor = canvasWidth / canvasContainerWidth;
    console.log('scale factor:', App.scaleFactor);
    App.canvas.renderAll();
    // (canvasWidth = App.canvas.getActiveObject()) && App.repositionContextMenu(canvasWidth);
  },
  showObjProps(d) {
    let c = Math.round(d.angle);
    // c >= 360 && (c -= 360);
    if (c >= 360) {
      c -= 360;
    }
    $('#objProps').show().html(`${Math.round(d.left)},${Math.round(d.top)} | ${Math.round(d.width * d.scaleX)}x${Math.round(d.height * d.scaleY)} | ${c}&deg;`);
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
      scenes: [
        {
          imgSrc: '400216478_thumb.jpg',
          dataSrc: '400216478.png',
          dataSize: '1280x960',
          dataHoles: '["596,353 689x410 0"]',
        },
        {
          imgSrc: '989357250_thumb.jpg',
          dataSrc: '989357250.png',
          dataSize: '1280x960',
          dataHoles: '["596,353 689x410 0"]',
        },
        {
          imgSrc: '1912408125_thumb.jpg',
          dataSrc: '1912408125.png',
          dataSize: '1280x960',
          dataHoles: '["596,353 689x410 0"]',
        },
        {
          imgSrc: '1960232057_thumb.jpg',
          dataSrc: '1960232057.png',
          dataSize: '1280x960',
          dataHoles: '["596,353 689x410 0"]',
        },
      ],
      mugshots: [
        {
          imgSrc: '3b2014dcefb972a6.png',
          dataUId: 0,
          dataSize: '159x190',
        },
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

      // 加载列表中第一个背景
      fabric.Image.fromURL(`./static/scenes/${this.scenes[0].dataSrc}`, (img) => {
        if (img.getElement() === undefined) {
          console.log('背景图片加载失败！');
          return;
        }
        App.scene = {
          // $img: c, // $('#scenes img:first')
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

      // 脸
      const firstUid = 0;
      fabric.Image.fromURL(`./static/mugshots/${this.mugshots.find(ms => ms.dataUId === firstUid).imgSrc}`, (img) => {
        if (img.getElement() === undefined) {
          console.log('脸图片加载失败！');
          return;
        }
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
      // window.addEventListener('resize', App.canvasScale);
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
        const ddd = $(`#mugshots img[data-uid="${m}"]`);
        const n = ddd.attr('src');
        const d = ddd.data('size').split('x');
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
          App.canvas.add(img);
          if (c === 0) {
            App.showObjProps(img);
            App.canvas.setActiveObject(img);
          }
          $(`#mugshots img[data-uid="${m}"]`).addClass('oncanvas');
          if (c < h.length - 1 && c < g.length - 1) {
            b(g, h, c + 1);
          } else {
            App.canvas.renderAll();
          }
        });
      }
      const $thumbImage = $(event.target);
      const dddd = $thumbImage.data('size').split('x');
      const g = $thumbImage.data('holes'); // 可能不止一个hole
      const l = dddd[0];
      const d = dddd[1];
      const h = [];
      App.canvas.forEachObject((obj) => {
        if (obj.type === 'image') {
          h.push(obj.uid);
          $(`#mugshots img[data-uid="${obj.uid}"]`).removeClass('oncanvas');
          obj.remove();
        }
      });
      App.canvas.setWidth(l).setHeight(d);
      App.canvasScale();
      // fabric.Image.fromURL(`./static/scenes/${$thumbImage.data('src')}`, (img) => {
      fabric.Image.fromURL(`./${$thumbImage.data('src')}`, (img) => {
        App.scene = {
          // $img: $thumbImage,
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
    margin-right: 4px;
    cursor: pointer;
  }
}

/* 画布 */
#canvasRow {
    background: #ccc;
    position: relative
}
#canvasContainer {
    background: url(./assets/canvas.gif);
    border: 1px solid #cfcfcf;
    position: relative;
    width: 100%;
    height: 100%
}
#objProps {
  top: 0;
  right: 0;
  padding: 3px;
  background: rgba(255,255,255,.8);
  font-size: 11px;
  z-index: 10;
  display: none;
}
#contextMenu, #objProps {
  position: absolute;
}
</style>
