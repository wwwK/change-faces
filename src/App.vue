<template>
  <div id="app" :style="{ display: appDisplay }">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <p>{{ foo }}</p> -->
    <vue-slider v-model="value" :min="0" :max="1" :interval="0.01" v-on:callback="handleChange"></vue-slider>
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

import vueSlider from 'vue-slider-component';

const App = {
  dblClickTime: 0,
  scaleFactor: 1,
  canvas: null,
  spinner: null,
  scene: null,
  sceneOpacity: 0.5,
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
      value: App.sceneOpacity,
      appDisplay: 'block',
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
      fabric.Image.fromURL('/static/400216478.png', (img) => {
        App.scene = {
          // $img: c,
          fabricImg: img,
        };
        img.set({
          originX: 'left',
          originY: 'top',
          opacity: App.sceneOpacity,
        });
        App.canvas.setWidth(img.width).setHeight(img.height);
        App.canvas.setOverlayImage(img, App.canvasScale);
      });

      // foregroud
      fabric.Image.fromURL('/static/3b2014dcefb972a6.png', (img) => {
        img.scale(0.6).setCoords();
        img.set({
          uid: 0,
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
    handleChange(value) {
      App.sceneOpacity = value;
      App.scene.fabricImg.set('opacity', App.sceneOpacity);
      App.canvas.renderAll();
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
