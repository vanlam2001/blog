---
title: Thiên Hà Andromeda Javascript
date: 30/5/2021
layout: single

--- 
---
[![Language](https://img.shields.io/badge/Lang-javascript-blue.svg)](https://www.javascript.com/)
# Gif
![demo](https://media.giphy.com/media/FGrIUgt76qrCqUNFZc/giphy.gif)


--- 

# Mã
## HTML
---
```html
 <title>Andromeda galaxy </title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
<link rel="stylesheet" href="./style.css">

</head>
<body>
<!-- partial:index.partial.html -->

<!-- partial -->
  <script src='https://unpkg.co/gsap@3/dist/gsap.min.js'></script><script type="module" src="./script.js"></script>

</body>
</html>
```
---
---
## Javascript

```js
import * as $ from '//unpkg.com/three@0.123.0/build/three.module.js'
import { OrbitControls } from '//unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js'

// ----
// Boot
// ----

const renderer = new $.WebGLRenderer({ antialias: true });
const scene = new $.Scene();
const camera = new $.PerspectiveCamera(75, 2, .1, 1000);
const cubeRT = new $.WebGLCubeRenderTarget(128);
const cubeCamera = new $.CubeCamera(.1, 1000, cubeRT);
const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener('resize', () => {
    const { clientWidth, clientHeight } = renderer.domElement;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
});
document.body.prepend(renderer.domElement);
window.dispatchEvent(new Event('resize'));

// ----
// Main
// ---- 

const IMGURL = 'https://media3.s-nbcnews.com/j/newscms/2015_04/857886/150121-andromeda2_980b3f9858070febcb92cdc2c41ac965.nbcnews-fp-1200-630.jpg';
const IMGURL2 = 'https://pbs.twimg.com/media/DON8Y_eUMAAV4pi.jpg';

$.ShaderChunk.my_map_fragment = `
#ifdef USE_MAP
    float t = t * 0.0001;
    vec2 uv = vUv * vec2(2.0, 10.0) + vec2(0.5, 0.5);
    vec4 o = texture2D(map, uv);
    vec4 nu = 
          0.3 * (texture2D(map, uv * vec2(2.0, 2.0) + vec2(0, t + o.b))) // water
        + 0.1 * (texture2D(map, uv * vec2(1.0, 1.0) + vec2(t))) // cyclone
        + 0.6 * (texture2D(map, uv * vec2(1.0, 1.0) + vec2(0.0, t)) + 0.5); // closest 
    vec4 C = pow(nu + 0.1, vec4(4.0));
    C = mapTexelToLinear(C);
    diffuseColor *= C;
#endif
`;

controls.target.set(-1, 4, 0);
camera.position.set(-1, -4, 1);

const geom = new $.SphereBufferGeometry(4, 32, 32);
const mat = new $.ShaderMaterial({
    uniforms: $.UniformsUtils.merge([$.ShaderLib.basic.uniforms, { t: { value: 0 } }]),
    vertexShader: $.ShaderLib.basic.vertexShader,
    fragmentShader: `uniform float t;\n` + $.ShaderLib.basic.fragmentShader.replace('<map_fragment>', '<my_map_fragment>'),
    side: $.BackSide
});
const tex = new $.TextureLoader().load(IMGURL);
tex.wrapS = tex.wrapT = $.MirroredRepeatWrapping;
mat.map = mat.uniforms.map.value = tex;
const tmpMesh = new $.Mesh(geom, mat);
tmpMesh.scale.set(1, 20, 1);
scene.add(tmpMesh);

const mesh = new $.Mesh(
    new $.SphereBufferGeometry(1, 32, 64),
    new $.MeshStandardMaterial({
        emissive: 'white', emissiveIntensity: 0.12,
        metalness: 1, roughness: 0, envMap: cubeRT.texture, envMapIntensity: 1,
        map: new $.TextureLoader().load(IMGURL2)
    })
);
scene.add(mesh);

//// Render & Anim

renderer.setAnimationLoop((t) => {
    mesh.visible = false; // 1. hide 
    cubeCamera.position.copy(mesh.position); // 2. move cam to mesh pos 
    cubeCamera.update(renderer, scene); // 3. upd cube cam's rt
    mesh.visible = true; // 4. unhide
    renderer.render(scene, camera);
    controls.update();
    mat.uniforms.t.value = t;
});

gsap.to(mesh.rotation, { x: -Math.PI * 2, duration: 10, repeat: -1, ease: 'none' });

```
---
## CSS
```css
 canvas {
    width: 100%; height: 100vh; display: block;
}
```

## Mô Tả 

+ [https://blogth3pr0.github.io/galaxy/](https://blogth3pr0.github.io/galaxy/) 


## Chúc May Mắn :D
