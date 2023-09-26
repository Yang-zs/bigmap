<template>
  <div class="login">
    <div id="Map3D"></div>
  </div>
</template>

<script setup>
import maps from "../map"
import { onMounted } from "vue"
let bmgl
let bigMap3D
let mapHttp = ""  // 地图服务地址

const initBigMap3D = () => {
  bmgl = window.bmgl;
  bmgl.Config.HTTP_URL = mapHttp;
  bigMap3D = new bmgl.Viewer("Map3D", {
    terrainId: "", //地形ID
    mapId: "", //底图ID
    requestRenderMode: false,
  });
  bigMap3D.scene.globe.depthTestAgainstTerrain = false;
  bigMap3D.screenSpaceEventHandler.removeInputAction(
    bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );
  var tilesets = new bmgl.BM3DTileset({
    url: "", // 模型地址
    preferLeaves: true,
    maximumMemoryUsage: 20000,// 内存分配变小有利于倾斜摄影数据回收，提升性能体验
    maximumScreenSpaceError: 1,
    dynamicScreenSpaceError: true,
    dynamicScreenSpaceErrorDensity: 100000000000,
    maximumNumberOfLoadedTiles: 100000000,  // 最大加载的 tile 数量
  });
  tilesets.readyPromise
    .then(function (tileset) {
      bigMap3D.scene.primitives.add(tileset);
      // bigMap3D.zoomTo(tileset, default_HeadingPitchRange);
      var default_HeadingPitchRange = new bmgl.HeadingPitchRange(
        0.0,
        -0.5,
        tileset.boundingSphere.radius * 2.0
      );
      bigMap3D.zoomTo(tileset, default_HeadingPitchRange);
      var cartographic = bmgl.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      );
      var delta_lng = 0,
        delta_lat = 0;
      var surface = bmgl.Cartesian3.fromRadians(
        cartographic.longitude + delta_lng,
        cartographic.latitude + delta_lat,
        0.0
      );
      var offset = bmgl.Cartesian3.fromRadians(
        cartographic.longitude + delta_lng,
        cartographic.latitude + delta_lat,
        470
      ); //上下偏移量
      var translation = bmgl.Cartesian3.subtract(
        offset,
        surface,
        new bmgl.Cartesian3()
      );
      tileset.modelMatrix = bmgl.Matrix4.fromTranslation(translation);
    })
    .otherwise(function (error) {
      console.log(error);
    });
}
onMounted(() => {
  maps.then(() => {
    initBigMap3D()
  })
})
</script>

<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
}
#Map3D {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
