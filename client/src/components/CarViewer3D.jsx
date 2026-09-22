import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, ZoomIn, Palette, X, Sparkles } from 'lucide-react';

export default function CarViewer3D({ carColor = '#e50914', onExit }) {
  const containerRef = useRef(null);
  const [activeColor, setActiveColor] = useState(carColor);
  const [autoRotate, setAutoRotate] = useState(true);
  const bodyMaterialRef = useRef(null);

  const colors = [
    { name: 'Apex Crimson', hex: '#e50914' },
    { name: 'Onyx Shadow', hex: '#111317' },
    { name: 'Monaco Blue', hex: '#0f3875' },
    { name: 'Cyber Gold', hex: '#d4af37' },
    { name: 'Titanium Silver', hex: '#94a3b8' },
    { name: 'Emerald Vault', hex: '#04432c' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07070a');
    scene.fog = new THREE.FogExp2('#07070a', 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(5.5, 2.2, 5.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    containerRef.current.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above showroom floor
    controls.minDistance = 3.5;
    controls.maxDistance = 11;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 0.4, 0);

    // 5. Studio Showroom Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffffff, 80);
    mainSpot.position.set(8, 12, 8);
    mainSpot.angle = Math.PI / 5;
    mainSpot.penumbra = 0.8;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 2048;
    mainSpot.shadow.mapSize.height = 2048;
    mainSpot.shadow.bias = -0.0001;
    scene.add(mainSpot);

    const fillSpot = new THREE.SpotLight(0x7090ff, 40);
    fillSpot.position.set(-8, 8, -6);
    fillSpot.angle = Math.PI / 4;
    fillSpot.penumbra = 0.9;
    scene.add(fillSpot);

    const rimLight = new THREE.DirectionalLight(0xff3344, 1.5);
    rimLight.position.set(0, 4, -8);
    scene.add(rimLight);

    // 6. Showroom Floor with reflective grid
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a10,
      roughness: 0.15,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Circular Showroom Turntable
    const stageGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.1, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x141420,
      roughness: 0.25,
      metalness: 0.9,
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.y = -0.05;
    stageMesh.receiveShadow = true;
    scene.add(stageMesh);

    // LED Turntable Ring
    const ringGeo = new THREE.RingGeometry(3.5, 3.58, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe50914, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // 7. BUILD HIGH-TECH SUPERCAR MODEL
    const carGroup = new THREE.Group();

    // Body Material (dynamic paint)
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeColor),
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });
    bodyMaterialRef.current = bodyMat;

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x18181f,
      roughness: 0.4,
      metalness: 0.6,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111625,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.9,
    });

    const glowHeadlightMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
    const glowTaillightMat = new THREE.MeshBasicMaterial({ color: 0xff1020 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.95, roughness: 0.1 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.85, metalness: 0.1 });

    // Lower Chassis
    const chassisGeo = new THREE.BoxGeometry(1.9, 0.28, 4.3);
    const chassis = new THREE.Mesh(chassisGeo, bodyMat);
    chassis.position.y = 0.36;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    carGroup.add(chassis);

    // Front Sloped Nose / Hood
    const noseGeo = new THREE.BoxGeometry(1.82, 0.22, 1.4);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.position.set(0, 0.35, 1.4);
    nose.rotation.x = 0.08;
    nose.castShadow = true;
    carGroup.add(nose);

    // Front Splitter / Carbon Aero
    const splitterGeo = new THREE.BoxGeometry(1.94, 0.06, 0.6);
    const splitter = new THREE.Mesh(splitterGeo, carbonMat);
    splitter.position.set(0, 0.18, 2.2);
    splitter.castShadow = true;
    carGroup.add(splitter);

    // Cockpit / Glass Canopy
    const cabinGeo = new THREE.BoxGeometry(1.35, 0.45, 1.8);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 0.72, -0.15);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Roof Carbon Arch
    const roofGeo = new THREE.BoxGeometry(1.28, 0.08, 1.4);
    const roof = new THREE.Mesh(roofGeo, carbonMat);
    roof.position.set(0, 0.95, -0.2);
    roof.castShadow = true;
    carGroup.add(roof);

    // Rear Engine Cover & Aerodynamic Deck
    const rearDeckGeo = new THREE.BoxGeometry(1.78, 0.34, 1.5);
    const rearDeck = new THREE.Mesh(rearDeckGeo, bodyMat);
    rearDeck.position.set(0, 0.46, -1.35);
    rearDeck.rotation.x = -0.06;
    rearDeck.castShadow = true;
    carGroup.add(rearDeck);

    // Rear GT Wing / Spoiler
    const wingGeo = new THREE.BoxGeometry(1.95, 0.05, 0.42);
    const wing = new THREE.Mesh(wingGeo, carbonMat);
    wing.position.set(0, 0.88, -2.05);
    wing.castShadow = true;
    carGroup.add(wing);

    // Wing Struts
    [-0.55, 0.55].forEach(x => {
      const strutGeo = new THREE.BoxGeometry(0.04, 0.35, 0.12);
      const strut = new THREE.Mesh(strutGeo, carbonMat);
      strut.position.set(x, 0.7, -2.0);
      carGroup.add(strut);
    });

    // Rear Carbon Diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.85, 0.16, 0.4);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
    diffuser.position.set(0, 0.22, -2.15);
    carGroup.add(diffuser);

    // Twin Dual Exhausts
    [-0.32, -0.18, 0.18, 0.32].forEach(x => {
      const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16);
      const exhaust = new THREE.Mesh(exhaustGeo, chromeMat);
      exhaust.rotation.x = Math.PI / 2;
      exhaust.position.set(x, 0.32, -2.25);
      carGroup.add(exhaust);
    });

    // Headlights (LED Blades)
    [-0.72, 0.72].forEach(x => {
      const headlightGeo = new THREE.BoxGeometry(0.28, 0.05, 0.1);
      const headlight = new THREE.Mesh(headlightGeo, glowHeadlightMat);
      headlight.position.set(x, 0.44, 2.16);
      headlight.rotation.y = x > 0 ? -0.2 : 0.2;
      carGroup.add(headlight);
    });

    // Full-width Continuous Taillight Bar
    const taillightGeo = new THREE.BoxGeometry(1.7, 0.04, 0.08);
    const taillight = new THREE.Mesh(taillightGeo, glowTaillightMat);
    taillight.position.set(0, 0.52, -2.21);
    carGroup.add(taillight);

    // Wheels & Brake Calipers
    const wheelPositions = [
      { x: -0.98, z: 1.35 },
      { x: 0.98, z: 1.35 },
      { x: -0.98, z: -1.35 },
      { x: 0.98, z: -1.35 },
    ];

    wheelPositions.forEach((pos, idx) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, 0.34, pos.z);

      // Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 32);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Alloy Wheel Rim
      const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.25, 18);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Center Nut
      const nutGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.27, 8);
      const nut = new THREE.Mesh(nutGeo, new THREE.MeshBasicMaterial({ color: 0xe50914 }));
      nut.rotation.z = Math.PI / 2;
      wheelGroup.add(nut);

      carGroup.add(wheelGroup);
    });

    scene.add(carGroup);

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 10. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Paint Color dynamically
  useEffect(() => {
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(activeColor);
    }
  }, [activeColor]);

  return (
    <div className="w-full h-full relative bg-[#07070a] rounded-xl overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-[#2d2d3f] px-3.5 py-1.5 rounded-lg shadow-2xl pointer-events-auto">
          <Sparkles className="w-4 h-4 text-[#e50914] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-white">
            Legendary 3D Showroom
          </span>
          <span className="text-[9px] bg-red-950 text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-800/60">
            WebGL
          </span>
        </div>

        {onExit && (
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 bg-black/80 hover:bg-[#1a1a24] text-neutral-300 hover:text-white border border-[#2d2d3f] px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold uppercase tracking-wider transition-all pointer-events-auto cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Exit 3D</span>
          </button>
        )}
      </div>

      {/* Bottom Floating Paint Bar & Interaction Hints */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Color Palette Selector */}
        <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md border border-[#2d2d3f] p-2 rounded-xl shadow-2xl pointer-events-auto">
          <Palette className="w-4 h-4 text-neutral-400 ml-1 mr-1" />
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setActiveColor(c.hex)}
                title={c.name}
                className={`w-6 h-6 rounded-full transition-all border-2 cursor-pointer ${
                  activeColor === c.hex ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Interaction controls & instructions */}
        <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md border border-[#2d2d3f] px-3 py-2 rounded-xl shadow-2xl text-[11px] text-neutral-300 pointer-events-auto">
          <span className="text-neutral-400">Drag to rotate &bull; Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
