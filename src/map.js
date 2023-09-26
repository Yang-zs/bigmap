//map.js
// 换成本地的服务器js文件即可
let script = [
  "http://www.bigemap.com:9000/bigemap.js/v2.1.0/bigemap.js",
  "http://bigemap.com:9000/bigemap-gl.js/v1.1.0/bigemap-gl.js",
  //如果有更多的JS要引用 ，也一起放到这个数组中
];
export default new Promise((resolve) => {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.async = false;
  // 换成本地的服务器css文件即可
  link.href = "http://www.bigemap.com:9000/bigemap.js/v2.1.0/bigemap.css";
  document.head.appendChild(link);
  let loads = script.map((v) => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.async = false;
    script.src = v;
    document.head.appendChild(script);
    return script;
  });
  let end = loads.pop();
  end.onload = resolve;
});
