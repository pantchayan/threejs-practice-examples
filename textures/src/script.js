//
// Imports
//
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

//
// Debug GUI
//
const gui = new GUI();
//
// Textures
//
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onLoad = () => {
  console.log("loading finished");
};
loadingManager.onProgress = () => {
  console.log("loading progressing");
};
loadingManager.onError = () => {
  console.log("loading error");
};

const textureLoader = new THREE.TextureLoader(loadingManager);

// EnvironmentMap
const backgroundImage = textureLoader.load("/jodhpurEnv.jpg");
backgroundImage.mapping = THREE.EquirectangularReflectionMapping;
// backgroundImage.encoding = THREE.sRGBEncoding;

const colorTexture = textureLoader.load(
  "/textures/Stylized_Grass_003_SD/Stylized_Grass_003_basecolor.jpg"
);
colorTexture.colorSpace = THREE.SRGBColorSpace;
colorTexture.repeat.x = 3;
colorTexture.repeat.y = 3;
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;

const heightTexture = textureLoader.load(
  "/textures/Stylized_Grass_003_SD/Stylized_Grass_003_height.png"
);
const normalTexture = textureLoader.load(
  "/textures/Stylized_Grass_003_SD/Stylized_Grass_003_normal.jpg"
);
const ambientOcclusionTexture = textureLoader.load(
  "/textures/Stylized_Grass_003_SD/Stylized_Grass_003_ambientOcclusion.jpg"
);
const roughnessTexture = textureLoader.load(
  "/textures/Stylized_Grass_003_SD/Stylized_Grass_003_roughness.jpg"
);

//
// Canvas
//
const canvas = document.querySelector("canvas.webgl");

//
// Scene
//
const scene = new THREE.Scene();
scene.background = backgroundImage;
scene.environment = backgroundImage;

/**
 * Objects
 */

// Geometry
const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
const sphereGeometry = new THREE.SphereGeometry(0.5, 200, 200);
const torusGeometry = new THREE.TorusGeometry(0.35, 0.15, 200, 200);

// Material
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 1;
material.roughness = 0.1;
// material.clearcoat = 0.5;
material.map = colorTexture;
// material.colorWrite = true;
// material.envMap = backgroundImage;
material.side = THREE.DoubleSide;
material.aoMap = ambientOcclusionTexture;
material.aoMapIntensity = 0.5;
material.displacementMap = heightTexture;
material.displacementScale = 0.01;
// material.roughnessMap = roughnessTexture;
material.normalMap = normalTexture;

// Meshes
const planeMesh = new THREE.Mesh(planeGeometry, material);
scene.add(planeMesh);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.x = -1.5;
scene.add(sphereMesh);

const torusMesh = new THREE.Mesh(torusGeometry, material);
torusMesh.position.x = 1.5;
scene.add(torusMesh);

//
// Lights
//
// const ambientLight = new THREE.AmbientLight("white", 2);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight("white", 5);
// pointLight.position.x = 1;
// pointLight.position.y = 2;
// pointLight.position.z = 3;
// scene.add(pointLight);

//
// Axes Helper
//
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Update on Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = -1.25;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//
// Controls
//
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//
// Debug GUI Tweaks
//
gui.add(sphereMesh, "visible");
gui.add(material, "wireframe").name("Wifreframe");
gui
  .add(material, 'aoMapIntensity')
  .min(0)
  .max(1)
  .step(0.01)
  .name("Ambient Occulance");

//
// Animate function
//
function animate() {
  requestAnimationFrame(animate);

  sphereMesh.rotation.x -= 0.003;
  torusMesh.rotation.x -= 0.003;
  planeMesh.rotation.x -= 0.003;

  // sphereMesh.rotation.y += 0.003;
  torusMesh.rotation.y += 0.003;
  planeMesh.rotation.y += 0.003;
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
}

animate();
