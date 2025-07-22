// ✅ Variables globales accessibles partout
let scene, camera, renderer, model;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const hoverMenu = document.getElementById('hoverMenu');
const hoverLine = document.querySelector('#hoverLine line');

const menuTitle = document.getElementById('menuTitle');
const menuDesc = document.getElementById('menuDesc');
const menuImage = document.getElementById('menuImage');

window.addEventListener('DOMContentLoaded', () => {
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '-1';
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 2, 2);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load(
    'Assets/model.glb',
    (gltf) => {
      model = gltf.scene;
      model.rotation.y = Math.PI;

      model.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.FrontSide;
          child.material.polygonOffset = true;
          child.material.polygonOffsetFactor = 5;
          child.material.polygonOffsetUnits = 5;
          child.material.needsUpdate = true;
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const height = box.max.y - box.min.y;
      model.position.y += height / 2;
      model.rotation.z += 1;
      model.rotation.x += 100;

      scene.add(model);

      const mixer = new THREE.AnimationMixer(model);
      if (gltf.animations.length > 0) {
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }

      const size = box.getSize(new THREE.Vector3()).length();
      const distance = size * 2;
      camera.position.set(0, height * 0.6, distance);
      camera.lookAt(0, height * 0.6, 0);

      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.01;
        model.rotation.x += 0.01;

        const delta = clock.getDelta();
        mixer.update(delta);
        renderer.render(scene, camera);
      }

      animate();
    },
    undefined,
    (error) => {
      console.error('Erreur lors du chargement du modèle :', error);
    }
  );

  window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

window.addEventListener('mousemove', (event) => {
  if (!camera || !scene) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const mesh = intersects[0].object;

    hoverMenu.style.display = 'block';
    hoverMenu.classList.add('show');

    menuImage.style.display = 'block';

    const pos = new THREE.Vector3();
    mesh.getWorldPosition(pos);
    pos.project(camera);

    const screenX = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const screenY = (-pos.y * 0.5 + 0.5) * window.innerHeight;

    hoverMenu.style.display = 'block';
    hoverMenu.style.left = `${event.clientX + 20}px`;
    hoverMenu.style.top = `${event.clientY - 20}px`;

    hoverLine.setAttribute('x1', screenX);
    hoverLine.setAttribute('y1', screenY);
    hoverLine.setAttribute('x2', event.clientX);
    hoverLine.setAttribute('y2', event.clientY);

  } else {
    hoverMenu.classList.remove('show');
    setTimeout(() => {
        hoverMenu.style.display = 'none';
    }, 300);
    hoverLine.setAttribute('x1', 0);
    hoverLine.setAttribute('y1', 0);
    hoverLine.setAttribute('x2', 0);
    hoverLine.setAttribute('y2', 0);
  }
});