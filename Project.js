let scene, camera, renderer, model;

window.addEventListener('DOMContentLoaded', () => {
  // 🌌 Scene & caméra
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(0, 1.5, 5);

  // 🖥️ Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '-1';
  document.body.appendChild(renderer.domElement);

  // 💡 Lumière
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 2, 2);
  scene.add(directionalLight);

  // 📦 Chargement du modèle
  const loader = new THREE.GLTFLoader();
  loader.load(
    'Assets/maxwell_the_cat_dingus.glb',
    (gltf) => {
      model = gltf.scene;
      model.scale.set(1, 1, 1); // Agrandir si trop petit

      model.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.FrontSide;
          child.material.polygonOffset = true;
          child.material.polygonOffsetFactor = 5;
          child.material.polygonOffsetUnits = 5;
          child.material.needsUpdate = true;
        }
      });

      // Centrage du modèle
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const height = box.max.y - box.min.y;
      model.position.y += height / 2;

      scene.add(model);

      // 🎬 Animation setup
      const mixer = new THREE.AnimationMixer(model);
      const clock = new THREE.Clock();

      if (gltf.animations.length > 0) {
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }

      // 📷 Ajuste la caméra en fonction de la taille
      const size = box.getSize(new THREE.Vector3()).length();
      const distance = size * 2;
      camera.position.set(0, height * 0.6, distance);
      camera.lookAt(0, height * 1.2, 0);

      // 🔄 Animate
      function animate() {
        requestAnimationFrame(animate);

        // Rotation douce + rebond
        if (model) {
          model.rotation.y += 0.01;
          model.position.y = Math.sin(Date.now() * 0.002) * 2;
        }

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        renderer.render(scene, camera);
      }

      animate();
    },
    undefined,
    (error) => {
      console.error('Erreur lors du chargement du modèle :', error);
    }
  );

  // 📱 Resize
  window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});