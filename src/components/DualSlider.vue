<template>
  <div role="slider" class="double-slider">
    <input type="text" class="slider" name="slider" value="" />
    <button type="button" @click="play" :disabled="state === 'playing'"><i class="fas fa-play" ></i></button>
    <button type="button" @click="pause" :disabled="state === 'paused'"><i class="fas fa-pause" ></i></button>
    </span>
  </div>
</template>
<script src="./dual-slider.js"></script>
<style scoped>
[disabled] > .svg-inline--fa,
[disabled] > .fas {
  color: lightgrey;
  opacity: 0.5;
}
.irs-line-left,
.irs-line-mid,
.irs-line-right {
  height: 2px;
}

.irs-line {
  height: 2px;
  background: rgba(0, 0, 0, 0.26);
  border: none;
  border-color: none;
  border-image: none;
  border-style: none;

}
.irs-bar {
  height: 2px;
  background: #1976D2;
}
.irs-slider {
  border-radius: 50%;
  background: #1976D2;
  width: 16px;
  height: 16px;
  box-shadow: none;
  border: none;
}

.irs-slider:hover {
  transform: scale(1.2);
  background: #1976D2;
}
.irs-slider.state_hover {
  transform: scale(1.2);
  background: #1976D2;
  }
</style>
