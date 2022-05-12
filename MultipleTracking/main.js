import {GLTFLoader} from "../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js"
const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF} from "../libs/loader.js" // custom library to facilitate models import
import {mockWithVideo} from '../libs/camera-mock.js';

document.addEventListener('DOMContentLoaded',() => {
  const start = async () => {

// CODE FOR MOCK CAMERA - TO REMOVE BEFORE LAUNCH
    //mockWithVideo("../assets/mock-videos/musicband2.mp4");
// CODE FOR MOCK CAMERA ENDS HERE

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({

      container: document.body,
      imageTargetSrc: '../assets/targets/musicband.mind',
      maxTrack: 2,
    });

    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

// Simplified code possible due to "loadGLTF" library import
    const raccoon = await loadGLTF("../assets/models/musicband-raccoon/scene.gltf");
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);
    //raccoon.scene.rotation.set(Math.PI/2, 0, 0);

    const bear = await loadGLTF("../assets/models/musicband-bear/scene.gltf");
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);
    //bear.scene.rotation.set(Math.PI/2, 0, 0);

    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(bear.scene);

    //gltf animations
    const raccoonMixer = new THREE.AnimationMixer(raccoon.scene);
    const raccoonAction = raccoonMixer.clipAction(raccoon.animations[0]);
    raccoonAction.play();

    const bearMixer = new THREE.AnimationMixer(bear.scene);
    const bearAction = bearMixer.clipAction(bear.animations[0]);
    bearAction.play();

    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      raccoonMixer.update(delta);
      bearMixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});
