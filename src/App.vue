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
          dataHoles: '["656,424 116x132 330"]',
        },
        {
          imgSrc: '989357250_thumb.jpg',
          dataSrc: '989357250.png',
          dataSize: '1280x960',
          dataHoles: '["842,464 146x171 0"]',
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
    $(() => {
      try {
        // override default setting
        fabric.Object.prototype.originX = 'center';
        fabric.Object.prototype.originY = 'center';
        fabric.Object.prototype.cornerColor = 'yellow';
        fabric.Object.prototype.borderColor = 'red';
        fabric.Object.prototype.cornerSize = 16;

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

        const $firstScene = $('#scenes img:first');

        // 加载列表中第一个背景
        fabric.Image.fromURL(`./static/scenes/${this.scenes[0].dataSrc}`, (img) => {
          if (img.getElement() === undefined) {
            console.log('背景图片加载失败！');
            return;
          }
          App.scene = {
            $img: $firstScene,
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
          img.scale(1).setCoords();
          img.set({
            uid: firstUid,
            left: this.parseHoles($firstScene.data('holes'))[0].left, // 606,
            top: this.parseHoles($firstScene.data('holes'))[0].top, // 355,
          });
          App.canvas.add(img);
          App.canvas.setActiveObject(img);
          App.showObjProps(img);
        });

        App.canvasScale();

        App.canvas.on({
          'selection:cleared': () => {
            // $('#canvasPopover').popover('destroy');
            // App.contextMenu.hide();
          },
          'selection:created': () => {
            // d();
          },
          'object:moving': (b) => {
            App.showObjProps(b.target);
            // d();
          },
          'object:scaling': (b) => {
            App.showObjProps(b.target);
            // d();
          },
          'object:selected': (bb) => {
            const b = bb.target;
            // App.showContextMenu(b, !0);
            App.showObjProps(b);
          },
          'object:rotating': (b) => {
            App.showObjProps(b.target);
          },
          'object:removed': () => {
            $('#objProps').hide();
          },
          // 'mouse:down': (b) => {
          //   let c = ZM.getActive(),
          //     d = (new Date()).getTime();
          //   if (c !== null) {
          //     return d - ZM.dblClickTime < 400 ? (b.e.preventDefault(),
          //               b.e.stopPropagation(),
          //               c.obj.type == 'bubblytext'
          //                 ? ZM.bubble()
          //                 : c.obj.type == 'text' && ZM.text()) : ZM.showContextMenu(c.obj),
          //               ZM.dblClickTime = d,
          //               !1;
          //   }
          // },
        });

        // window.addEventListener('resize', App.canvasScale);
      } catch (error) {
        console.log('something is wrong with fabric init:', error);
      }
    });
  },
  methods: {
    /**
     * @param {Array} holes 背景上抠出的洞（用于放脸），比如['596,353 689x410 0']
     */
    parseHoles(holes) {
      return holes.map((hole) => {
        const part = hole.split(' ');
        const offset = part[0].split(',');
        const dimension = part[1].split('x');
        return {
          left: parseInt(offset[0], 10),
          top: parseInt(offset[1], 10),
          width: parseInt(dimension[0], 10),
          height: parseInt(dimension[1], 10),
          angle: parseInt(part[2], 10),
        };
      });
    },
    handleChangeScene(event) {
      /**
       * @param {Array} g 比如['596,353 689x410 0']
       * @param {Array} h
       * @param {number} c
       */
      function b(g, h, c) {
        // g[c] = '596,353 689x410 0'
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
        // 脸
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
      // 场景
      fabric.Image.fromURL($thumbImage.data('src'), (img) => {
        App.scene = {
          $img: $thumbImage,
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
