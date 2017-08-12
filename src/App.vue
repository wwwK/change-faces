<template>
  <div id="app">
    <img src="./assets/logo.png">
    <p>{{ foo }}</p>
    <canvas id="canvas3" />
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable no-console */

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
      const canvas = new fabric.Canvas('canvas3');

      // create a rectangle object
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
      });

      // "add" rectangle onto canvas
      canvas.add(rect);
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
