import {loadGLTF, loadVideo} from "../libs/loader.js"; // custom library to facilitate models import
import {createChromaMaterial} from "../libs/chroma-video.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded',() => {

  let video = null;
  const init = async() => {
    video = await loadVideo("../assets/videos/dance.mp4");
    video.play();
    video.pause();
  }

  const start = async () => {

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({

      container: document.body,
      imageTargetSrc: '../assets/targets/bc.mind',
    });

    const {renderer, scene, camera} = mindarThree;

    const video = await loadVideo("../assets/videos/dance.mp4");
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 360/640);
    //const material = new THREE.MeshBasicMaterial({map: texture});
    const material = createChromaMaterial(texture, 0x00ff00);
    const plane = new THREE.Mesh(geometry, material);

    plane.rotation.x = Math.PI/2;
    plane.position.y = -0.5;
    plane.scale.multiplyScalar(4);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      video.play();
    }
    anchor.onTargetLost = () => {
      video.pause();
    }

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    button.remove();
  }
  //start();

  const button = document.createElement("button");
  button.textContent = "START";
  button.addEventListener("click", start);

  document.body.appendChild(button);
});
