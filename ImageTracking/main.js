import {GLTFLoader} from "../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js"
const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF} from "../libs/loader.js" // custom library to facilitate models import
//import {mockWithVideo} from '../libs/camera-mock.js';

document.addEventListener('DOMContentLoaded',() => {
  const start = async () => {

// CODE FOR MOCK CAMERA - TO REMOVE BEFORE LAUNCH
    //mockWithVideo("../assets/mock-videos/course-banner1.mp4");
// CODE FOR MOCK CAMERA ENDS HERE

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({

      container: document.body,
      imageTargetSrc: '../assets/targets/trifon.mind'
      //imageTargetSrc: '../assets/targets/course-banner.mind'
    });

    const {renderer, scene, camera} = mindarThree;

    const geometry = new THREE.SphereGeometry(.3, 32, 16);
    const material = new THREE.MeshBasicMaterial( { color: 0x00aaff, wireframe: true } );
    const plane = new THREE.Mesh(geometry, material);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const anchor = mindarThree.addAnchor(0);

// Simplified code possible due to "loadGLTF" library import
    const gltf = await loadGLTF("../assets/models/extrusions/8800opti_anim.gltf");
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, -1, 0);
    gltf.scene.rotation.set(0, Math.PI/2, 0);
    anchor.group.add(gltf.scene); //THREE.Group

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
