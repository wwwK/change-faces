<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <p>{{ foo }}</p> -->
    <canvas id="canvas3" />
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable no-console */

const App = {
  dblClickTime: 0,
  scaleFactor: 1,
  canvas: null,
  spinner: null,
  scene: null,
  sceneOpacity: 0.8,
  canvasScale() {

  },
};

export default {
  name: 'app',
  data() {
    return {
      foo: 'bar',
    };
  },
  mounted() {
    try {
      // create a wrapper around native canvas element (with id="c")
      App.canvas = new fabric.Canvas('canvas3', {
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

      fabric.Image.fromURL('/static/400216478.png', (img) => {
        // App.scene = {
        //   $img: c,
        //   fabricImg: img,
        // };
        img.set({
          originX: 'left',
          originY: 'top',
          opacity: App.sceneOpacity,
        });
        App.canvas.setWidth(img.width).setHeight(img.height);
        App.canvas.setOverlayImage(img, App.canvasScale);
      });
      fabric.Image.fromURL('/static/3b2014dcefb972a6.png', (img) => {
        img.scale(0.4).setCoords();
        img.set({
          uid: 0,
          left: 836,
          top: 195,
        });
        App.canvas.add(img);
        App.canvas.setActiveObject(img);
        // App.showObjProps(img);
      });
    } catch (error) {
      console.log('something is wrong with fabric init:', error);
    }
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
