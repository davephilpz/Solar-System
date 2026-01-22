import * as THREE from "./modules/three.module.js";
import { GLTFLoader } from "./modules/GLTFLoader.js";
import { OrbitControls } from "./modules/OrbitControls.js";

var camera, scene, renderer, mesh, autoRotate;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
// camera.up(0, 0, 1);
camera.position.set(35, 50, -150);
// camera.lookAt(new THREE.Vector3(5000, 5000, 5000));

// Renderer
renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#bg"),
});
// renderer.setClearColor("#e5e5e5");
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const textureLoader = new THREE.TextureLoader();

document.body.appendChild(renderer.domElement);

//GLTF Loader
let loadGLTF = new GLTFLoader();

const xCenterTexture = new THREE.TextureLoader().load("./Pics/sun.jpg");
const xCenter = new THREE.Mesh(
  new THREE.SphereGeometry(0, 30, 30),
  new THREE.MeshStandardMaterial({
    map: xCenterTexture,
  })
);
scene.add(xCenter);

let xWing, xWing1, xWing2;
loadGLTF.load("scene.gltf", function (gltf) {
  xWing = gltf.scene;
  xWing.scale.set(1, 1, 1);
  xWing.position.set(-110, 20, 20);
  xWing.rotateY(-0.15);
  xWing.rotateZ(-1.5);

  xCenter.add(gltf.scene);
});
loadGLTF.load("scene.gltf", function (gltf) {
  xWing1 = gltf.scene;
  xWing1.scale.set(1, 1, 1);
  xWing1.position.set(-120, 30, 10);
  xWing1.rotateY(-0.15);
  xWing1.rotateZ(-1.5);

  xCenter.add(gltf.scene);
});
loadGLTF.load("scene.gltf", function (gltf) {
  xWing2 = gltf.scene;
  xWing2.scale.set(1, 1, 1);
  xWing2.position.set(-120, 10, 10);
  xWing2.rotateY(-0.15);
  xWing2.rotateZ(-1.5);

  xCenter.add(gltf.scene);
});

// Orbiter
///render orbit controls
// controls = new THREE.OrbitControls(camera, renderer.domElement);
let controls = new OrbitControls(camera, renderer.domElement);

controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;
controls.enableDamping = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.03;
// controls.target.set(4.5, 0, 4.5);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background
const spaceTexture = new THREE.TextureLoader().load("./Pics/space 1.jpg");
scene.background = spaceTexture;

/// Sun
const sunTexture = new THREE.TextureLoader().load("./Pics/sun.jpg");
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(16, 30, 30),
  new THREE.MeshStandardMaterial({
    map: sunTexture,
  })
);
scene.add(sun);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(700));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(7000).fill().forEach(addStar);

// Planets

const mercuryTexture = new THREE.TextureLoader().load("./Pics/mercury.jpg");
const venusTexture = new THREE.TextureLoader().load("./Pics/venus.jpg");
const earthTexture = new THREE.TextureLoader().load("./Pics/earth.jpg");
const marsTexture = new THREE.TextureLoader().load("./Pics/mars.jpg");
const marsNormalTexture = new THREE.TextureLoader().load("./Pics/normal.jpg");
const jupiterTexture = new THREE.TextureLoader().load("./Pics/jupiter.jpg");
const saturnTexture = new THREE.TextureLoader().load("./Pics/saturn.jpg");
const saturnRingTexture = new THREE.TextureLoader().load(
  "./Pics/saturn ring.png"
);
const uranusTexture = new THREE.TextureLoader().load("./Pics/uranus.jpg");
const uranusRingTexture = new THREE.TextureLoader().load(
  "./Pics/uranus ring.png"
);
const neptuneTexture = new THREE.TextureLoader().load("./Pics/neptune.png");
const neptuneRingTexture = new THREE.TextureLoader().load(
  "./Pics/neptune ring.png"
);
const plutoTexture = new THREE.TextureLoader().load("./Pics/pluto.jpg");

function planetConstructor(texture, size, position, ring) {
  const geo = new THREE.SphereGeometry(size, 50, 50);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.texture,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}
const mercury = planetConstructor(mercuryTexture, 3.2, -20);
const venus = planetConstructor(venusTexture, 5.6, -50);
const earth = planetConstructor(earthTexture, 6, -90);
const mars = planetConstructor(marsTexture, 4.7, -135);
const jupiter = planetConstructor(jupiterTexture, 14, -250);
// jupiter.mesh.position.y = -50;
const saturn = planetConstructor(saturnTexture, 10, -330, {
  innerRadius: 12,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = planetConstructor(uranusTexture, 7.5, -350, {
  innerRadius: 8,
  outerRadius: 13,
  texture: uranusRingTexture,
});
const neptune = planetConstructor(neptuneTexture, 6.5, -390, {
  innerRadius: 6,
  outerRadius: 9,
  texture: neptuneRingTexture,
});
const pluto = planetConstructor(plutoTexture, 4, -420);

// import mercuryTexture from "./Pics/mercury.jpg";
// const mercuryTexture = new THREE.TextureLoader().load("./Pics/mercury.jpg");
// const mercuryMesh = new THREE.Mesh(
//   new THREE.SphereGeometry(3.2, 50, 50),
//   new THREE.MeshStandardMaterial({
//     map: mercuryTexture,
//   })
// );

// mercuryMesh.position.set(0, 0, 20);
// mercuryMesh.position.setX(-15);
// sun.add(mercuryObj);

// const venusTexture = new THREE.TextureLoader().load("./Pics/venus.jpg");

// const venus = new THREE.Mesh(
//   new THREE.SphereGeometry(5.8, 50, 50),
//   new THREE.MeshStandardMaterial({
//     map: venusTexture,
//   })
// );

// venus.position.set(-50, 0, 0);
// // venus.position.setX(-10);
// venus.rotation.set(0, 0, 0);
// venus.scale.set(1.2, 1, 1);

sun.add(venus);

// const earthTexture = new THREE.TextureLoader().load("./Pics/earth.jpg");
// const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
// const earth = new THREE.Mesh(
//   new THREE.SphereGeometry(6, 30, 30),
//   new THREE.MeshStandardMaterial({
//     map: earthTexture,
//   })
// );

// earth.position.set(-100, 0, 0);
// // earth.position.setX(-60);
// earth.rotation.set(0, 0, 0);
// // earth.scale.set(1.2, 1, 1);

// sun.add(earth);

const earthMoonTexture = new THREE.TextureLoader().load("./Pics/earthMoon.jpg");
const earthMoonNormalTexture = new THREE.TextureLoader().load(
  "./Pics/normal.jpg"
);

const earthMoon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 50, 50),
  new THREE.MeshStandardMaterial({
    map: earthMoonTexture,
    normalMap: earthMoonNormalTexture,
  })
);

// earthMoon.position.set(-115, 0, 0);
earthMoon.position.setX(15);
// earthMoon.rotation.set(0, 0, 0);
// earthMoon.scale.set(1.2, 1, 1);

earth.mesh.add(earthMoon);

// const marsTexture = new THREE.TextureLoader().load("./Pics/mars.jpg");
// const marsNormalTexture = new THREE.TextureLoader().load("normal.jpg");

// const mars = new THREE.Mesh(
//   new THREE.SphereGeometry(4.7, 50, 50),
//   new THREE.MeshStandardMaterial({
//     map: marsTexture,
//     normalMap: marsNormalTexture,
//   })
// );

// mars.position.set(-135, 0, 0);
// // earthMoon.position.setX(-70);
// mars.rotation.set(0, 0, 0);
// // earthMoon.scale.set(1.2, 1, 1);

// sun.add(mars);

// const jupiterTexture = new THREE.TextureLoader().load("./Pics/jupiter.jpg");

// const jupiter = new THREE.Mesh(
//   new THREE.SphereGeometry(14, 50, 50),
//   new THREE.MeshStandardMaterial({
//     map: jupiterTexture,
//   })
// );

// jupiter.position.set(-200, 0, -50);
// jupiter.rotation.set(0, 0, 0);

// sun.add(jupiter);

const jupiterMoonCallistoTexture = new THREE.TextureLoader().load(
  "./Pics/jupiterMoonCallisto.jpg"
);

const jupiterMoonCallisto = new THREE.Mesh(
  new THREE.SphereGeometry(4, 50, 50),
  new THREE.MeshStandardMaterial({
    map: jupiterMoonCallistoTexture,
  })
);
// jupiterMoonCallisto.position.set(-200, 0, -50);
jupiterMoonCallisto.position.x = 28;

// jupiterMoonCallisto.rotation.set(0, 0, 0);

jupiter.mesh.add(jupiterMoonCallisto);

const jupiterMoonEuropaTexture = new THREE.TextureLoader().load(
  "./Pics/jupiterMoonEuropa.jpg"
);

const jupiterMoonEuropa = new THREE.Mesh(
  new THREE.SphereGeometry(3.6, 50, 50),
  new THREE.MeshStandardMaterial({
    map: jupiterMoonEuropaTexture,
  })
);
jupiterMoonEuropa.position.x = 15;
jupiterMoonEuropa.position.y = -15;
jupiterMoonEuropa.position.z = -15;

jupiter.mesh.add(jupiterMoonEuropa);

// const saturnTexture = new THREE.TextureLoader().load("./Pics/saturn.jpg");
// const saturn = new THREE.Mesh(
//   new THREE.SphereGeometry(10, 50, 50),
//   new THREE.MeshStandardMaterial({
//     map: saturnTexture,
//   })
// );
// saturn.position.set(-200, 0, 170);
// saturn.rotation.set(-3, 4, 0);
// sun.add(saturn);

// const saturnRingTexture = new THREE.TextureLoader().load(
//   "./Pics/saturn ring.png"
// );
// const saturnRing = new THREE.Mesh(
//   new THREE.RingGeometry(12, 20, 50),
//   new THREE.MeshBasicMaterial({
//     map: saturnRingTexture,
//     side: THREE.DoubleSide,
//   })
// );
// // saturnRing.position.set(-200, 0, 170);
// saturnRing.rotation.x = -0.5 * Math.PI;
// saturn.add(saturnRing);

// const uranusTexture = new THREE.TextureLoader().load("./Pics/uranus.jpg");
// const uranus = new THREE.Mesh(
//   new THREE.SphereGeometry(7.5, 50, 50),
//   new THREE.MeshStandardMaterial({
//     map: uranusTexture,
//   })
// );
// uranus.position.set(-260, 0, 170);
// sun.add(uranus);

// const uranusRingTexture = new THREE.TextureLoader().load(
//   "./Pics/uranus ring.png"
// );
// const uranusRing = new THREE.Mesh(
//   new THREE.RingGeometry(8, 13, 50),
//   new THREE.MeshBasicMaterial({
//     map: uranusRingTexture,
//     side: THREE.DoubleSide,
//   })
// );
// uranusRing.rotation.x = -0.5 * Math.PI;
// uranus.add(uranusRing);

// const neptuneTexture = new THREE.TextureLoader().load("./Pics/neptune.png");
// const neptune = new THREE.Mesh(
//   new THREE.SphereGeometry(6.5, 50, 50),
//   new THREE.MeshStandardMaterial({
//     map: neptuneTexture,
//   })
// );
// neptune.position.set(-290, 0, 170);
// sun.add(neptune);

// const neptuneRingTexture = new THREE.TextureLoader().load(
//   "./Pics/neptune ring.png"
// );
// const neptuneRing = new THREE.Mesh(
//   new THREE.RingGeometry(6, 9, 50),
//   new THREE.MeshBasicMaterial({
//     map: neptuneRingTexture,
//     side: THREE.DoubleSide,
//   })
// );
// neptuneRing.rotation.x = -0.5 * Math.PI;
// neptune.add(neptuneRing);

// const plutoTexture = new THREE.TextureLoader().load("./Pics/pluto.jpg");
// const pluto = new THREE.Mesh(
//   new THREE.SphereGeometry(4, 50, 50),
//   new THREE.MeshStandardMaterial({
//     map: plutoTexture,
//   })
// );
// pluto.position.set(-330, 0, 100);
// sun.add(pluto);

function moveCamera(ev) {
  window.ev.preventDefault();
  const t = document.body.getBoundingClientRect().top;
  // earth.rotation.x += 0.05;
  // earth.rotation.y += 0.075;
  // earth.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * 0.05;
  camera.rotation.y = t * -0.002;
}

window.addEventListener("scroll", moveCamera);
// document.body.onscroll = moveCamera;

function animate() {
  // Rotations
  xCenter.rotateY(0.004);
  sun.rotateY(0.001);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.01);
  mars.mesh.rotateY(0.012);
  jupiter.mesh.rotateY(0.004);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  // sun.rotateY(0.001);
  // mercury.mesh.rotateY(0.01);
  // venus.rotateY(0.01);
  // earth.rotation.y += 0.01;
  earthMoon.rotation.y += 0.01;
  // mars.rotation.y += 0.01;
  // jupiter.rotation.y += 0.01;
  jupiterMoonCallisto.rotation.y += 0.01;
  jupiterMoonEuropa.rotation.y += 0.01;
  // saturn.rotation.y += 0.01;
  // uranus.rotation.y += 0.01;
  // neptune.rotation.y += 0.01;
  // pluto.mesh.rotation.y += 0.01;

  // Orbit speeds around sound
  mercury.obj.rotation.y += 0.01;
  venus.obj.rotateY(0.003);
  earth.obj.rotateY(0.001);
  mars.obj.rotateY(0.001);
  jupiter.obj.rotateY(0.0008);
  saturn.obj.rotateY(0.0006);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0003);
  pluto.obj.rotateY(0.0002);
  // xWing.xCenter.rotateY(0.01);

  // autoRotate.update();
  // controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Dynamic viewport adjustment
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
