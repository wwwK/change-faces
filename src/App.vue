<template>
  <div id="app" class="container-fluid" :style="{ display: appDisplay }">

    <!-- 更换背景和头像 -->
    <b-card class="cf-tabs-card" no-block style="margin-bottom: 20px;">
      <b-tabs small card ref="tabs" v-model="tabIndex">
        <b-tab title="更换背景" class="scroller" id="scenes">
          <div class="scene" v-for="scene in scenes">
            <img
              @click="handleChangeScene"
              :src="`./static/scenes/${scene.imgSrc}`"
              :data-src="`./static/scenes/${scene.dataSrc}`"
              :data-size="scene.dataSize"
              :data-holes="scene.dataHoles"
            >
          </div>
        </b-tab>
        <b-tab title="更换头像" class="scroller" id="mugshots">
          <div class="mugshot" v-for="mugshot in mugshots">
            <img
              @click="handleChangeMugshot"
              :src="`./static/mugshots/${mugshot.imgSrc}`"
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

// mock object
const bootbox = {};
const lib = {};

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
  getActive() {
    const d = App.canvas.getActiveObject();
    const c = App.canvas.getActiveGroup();
    return d || c
      ? {
        obj: c || d,
        type: c ? 'group' : 'object',
      }
      : null;
  },
  objRemove(d) {
    function c(bb) {
      const cc = bb.uid;
      App.canvas.remove(bb);
      $(`#mugshots img[data-uid="${cc}"]`).removeClass('oncanvas');
    }
    function b(e) {
      if (e.type === 'group') {
        App.canvas.discardActiveGroup();
        e.obj.forEachObject((bb) => {
          c(bb);
        });
      } else {
        c(e.obj);
      }
      App.canvas.deactivateAll().renderAll();
      // App.contextMenu.hide();
    }
    const e = App.getActive();
    if (e !== null) {
      if (d) {
        b(e);
      } else {
        $('#canvasPopover').popover('destroy');
        bootbox.confirm({
          message: lib.word(e.type === 'group' ? 4141 : 4140),
          buttons: {
            cancel: {
              label: lib.word(4E3),
            },
            confirm: {
              label: lib.word(4001),
            },
          },
          callback(cc) {
            if (cc) {
              b(e);
            }
          },
        });
      }
    }
  },
  showObjProps(d) {
    let c = Math.round(d.angle);
    // c >= 360 && (c -= 360);
    if (c >= 360) {
      c -= 360;
    }
    $('#objProps').show().html(`${Math.round(d.left)},${Math.round(d.top)}
      | ${Math.round(d.width * d.scaleX)}x${Math.round(d.height * d.scaleY)}
      | ${c}&deg;`);
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
        {
          imgSrc: '0FleDCyukv.png',
          dataUId: 0,
          dataSize: '151x221',
        },
        {
          imgSrc: '01100000000000144728618086243_s.png',
          dataUId: 0,
          dataSize: '92x110',
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
        fabric.Object.prototype.cornerColor = 'red'; // 'yellow';
        fabric.Object.prototype.borderColor = 'red';
        fabric.Object.prototype.cornerSize = 16;

        // create a wrapper around native canvas element (with id="c")
        App.canvas = new fabric.Canvas('canvas', {
          preserveObjectStacking: !0,
          enableRetinaScaling: !1,
          stopContextMenu: !0,
        });

        // // create a rectangle object
        // const rect = new fabric.Rect({
        //   left: 100,
        //   top: 100,
        //   fill: 'red',
        //   width: 20,
        //   height: 20,
        // });
        // // "add" rectangle onto canvas
        // App.canvas.add(rect);

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
        const mugshot = `./static/mugshots/${this.mugshots.find(ms => ms.dataUId === firstUid).imgSrc}`;
        fabric.Image.fromURL(mugshot, (img) => {
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
          //   let c = App.getActive(),
          //     d = (new Date()).getTime();
          //   if (c !== null) {
          //     return d - App.dblClickTime < 400 ? (b.e.preventDefault(),
          //               b.e.stopPropagation(),
          //               c.obj.type == 'bubblytext'
          //                 ? App.bubble()
          //                 : c.obj.type == 'text' && App.text()) : App.showContextMenu(c.obj),
          //               App.dblClickTime = d,
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
    // 换头像
    handleChangeMugshot(event) {
      const c = [];
      const bbb = App.scene.$img.data('holes');
      const d = [];
      let gg = App.getActive();
      if (gg !== null && gg.type === 'object' && gg.obj.type === 'image') {
        App.objRemove(!0);
        gg = null;
      }
      App.canvas.forEachObject((bb) => {
        if (bb.type === 'image') {
          c.push({
            uid: bb.uid,
            left: bb.left,
            top: bb.top,
            width: bb.width * bb.scaleX,
            height: bb.height * bb.scaleY,
            angle: bb.angle,
          });
        }
      });
      if (gg === null && c.length >= App.scene.$img.data('holes').length) {
        bootbox.alert(lib.word(3510));
      } else {
        for (let ii = 0; ii < bbb.length; ii += 1) {
          const ll = bbb[ii].split(' ');
          const hhh = ll[0].split(',');
          const k = +hhh[0];
          const v = +hhh[1];
          const hh = ll[1].split('x');
          const w = +hh[0];
          const h = +hh[1];
          const l = +ll[2];
          let y = 0;
          let x = 0;
          for (; x < c.length; x += 1) {
            const p = c[x];
// p.left >= k - w / 2 && p.left <= k + w / 2 && p.top >= v - h / 2 && p.top <= v + h / 2 || y++;
            if (p.left >= k - (w / 2)
              && p.left <= k + (w / 2)
              && p.top >= v - (h / 2)
              && p.top <= v + (h / 2)) {
              console.log('xxdebug');
            } else {
              y += 1;
            }
          }
          if (y === c.length) {
            d.push({
              left: k,
              top: v,
              width: w,
              height: h,
              angle: l,
            });
          }
        }
        const q = $(/* this */event.target).data('uid');
        const b = $(/* this */event.target).attr('src');
        const kk = $(/* this */event.target).data('size').split('x');
        const ggg = +kk[0];
        const k = +kk[1];
        let r = App.canvas.getWidth() / 2;
        let m = App.canvas.getHeight() / 2;
        let n = 0;
        let t = 1;
        let u = 1;
        if (d.length > 0) {
          r = d[0].left;
          m = d[0].top;
          t = d[0].width / ggg;
          u = d[0].height / k;
          n = d[0].angle;
        }
        fabric.Image.fromURL(b, (bb) => {
          bb.set({
            uid: q,
            left: r,
            top: m,
            angle: n,
            originX: 'center',
            originY: 'center',
            scaleX: t,
            scaleY: u,
          });
          if (d.length === 0) {
            bb.scaleToHeight(200);
          }
          App.canvas.add(bb).setActiveObject(bb).renderAll();
          $(`#mugshots img[data-uid="${q}"]`).addClass('oncanvas');
        });
      }
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
  margin-top: 15px; /* 60px; */
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
    img {
      height: 100px;
    }
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
