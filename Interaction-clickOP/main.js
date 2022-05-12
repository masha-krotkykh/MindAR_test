import {GLTFLoader} from "../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js"
const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF} from "../libs/loader.js" // custom library to facilitate models import
import {mockWithVideo} from '../libs/camera-mock.js';

document.addEventListener('DOMContentLoaded',() => {
  const start = async () => {

// CODE FOR MOCK CAMERA - TO REMOVE BEFORE LAUNCH
    mockWithVideo("../assets/mock-videos/musicband2.mp4");
// CODE FOR MOCK CAMERA ENDS HERE

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({

      container: document.body,
      //imageTargetSrc: '../assets/targets/trifon.mind'
      imageTargetSrc: '../assets/targets/musicband.mind',
      maxTrack: 1, // Markers tracked simultaniously
    });

    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const anchor8800 = mindarThree.addAnchor(0);

// Simplified code possible due to "loadGLTF" library import
const model = await loadGLTF("../assets/models/extrusions/8800opti_anim.gltf");
model.scene.scale.set(0.1, 0.1, 0.1);
model.scene.position.set(0, -0.4, 0);
model.scene.rotation.set(0, Math.PI/2, 0);
model.scene.userData.clickable = true;
let modelClicked = false;

const anchor = mindarThree.addAnchor(0);
anchor.group.add(model.scene);

//gltf animations
const mixer = new THREE.AnimationMixer(model.scene);
const action = mixer.clipAction(model.animations[0]);
action.setLoop( THREE.LoopOnce );


document.body.addEventListener("click", (e) => {
  const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -1 * ((e.clientY / window.innerHeight) * 2 - 1);
  const mouse = new THREE.Vector2(mouseX, mouseY);


  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    let o = intersects[0].object;

    while (o.parent && !o.userData.clickable) {
      o = o.parent
    }

    if (o.userData.clickable) {
      if (o === model.scene) {
        console.log("you clicked me!");
        modelClicked = !modelClicked;
        if (modelClicked) {
          action.play(); // Animation is supposed to start when clicked
        }
        else if (!modelClicked) {
          action.stop();
        }
      }
    }
  }

});




anchor.onTargetFound = () => {
  console.log("TARGET FOUND!!!");
}

anchor.onTargetLost = () => {
  console.log("TARGET LOST :'(");
}

const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  }

  start();
});
