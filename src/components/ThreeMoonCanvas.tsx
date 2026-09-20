import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { LUNAR_LOCATIONS } from '../data/lunarData';
import { LunarLocation } from '../types';

interface ThreeMoonCanvasProps {
  onSelectLocation?: (location: LunarLocation) => void;
  selectedLocationId?: string;
  autoRotateSpeed?: number;
  showPins?: boolean;
  className?: string;
  enableZoom?: boolean;
}

export const ThreeMoonCanvas: React.FC<ThreeMoonCanvasProps> = ({
  onSelectLocation,
  selectedLocationId,
  autoRotateSpeed = 0.003,
  showPins = true,
  className = 'w-full h-full',
  enableZoom = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activePinName, setActivePinName] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.6;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.warn('WebGL initialization failed, falling back', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Generate procedural high-detail Lunar Texture
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 2048;
    textureCanvas.height = 1024;
    const ctx = textureCanvas.getContext('2d')!;

    // Base highland gray
    const grad = ctx.createLinearGradient(0, 0, 0, textureCanvas.height);
    grad.addColorStop(0, '#5a5d64');
    grad.addColorStop(0.5, '#767980');
    grad.addColorStop(1, '#4f5259');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    // Add maria (dark basalt volcanic plains)
    const maria = [
      { x: 700, y: 350, rx: 190, ry: 150, color: 'rgba(28, 30, 36, 0.72)' }, // Imbrium
      { x: 920, y: 440, rx: 140, ry: 110, color: 'rgba(25, 27, 33, 0.75)' }, // Serenitatis
      { x: 1060, y: 490, rx: 150, ry: 120, color: 'rgba(22, 24, 30, 0.78)' }, // Tranquillitatis
      { x: 500, y: 420, rx: 240, ry: 280, color: 'rgba(32, 34, 40, 0.65)' }, // Oceanus Procellarum
      { x: 1250, y: 420, rx: 110, ry: 100, color: 'rgba(30, 32, 38, 0.7)' }, // Crisium
      { x: 960, y: 640, rx: 160, ry: 120, color: 'rgba(29, 31, 37, 0.7)' }, // Nectaris & Nubium
      { x: 740, y: 580, rx: 130, ry: 110, color: 'rgba(28, 30, 36, 0.68)' }, // Humorum
    ];

    maria.forEach(m => {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, 0.15, 0, Math.PI * 2);
      ctx.fillStyle = m.color;
      ctx.filter = 'blur(16px)';
      ctx.fill();
      ctx.restore();
    });

    // Add crater clusters & highland noise
    ctx.filter = 'none';
    for (let i = 0; i < 350; i++) {
      const cx = Math.random() * textureCanvas.width;
      const cy = Math.random() * textureCanvas.height;
      const radius = Math.random() * 8 + 2;

      // Dark pit
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20, 22, 26, 0.5)';
      ctx.fill();

      // Bright sunlit rim
      ctx.beginPath();
      ctx.arc(cx - 1, cy - 1, radius * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 210, 225, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Tycho bright ray system at South
    const tychoX = 890;
    const tychoY = 740;
    ctx.save();
    for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
      ctx.beginPath();
      ctx.moveTo(tychoX, tychoY);
      const len = 300 + Math.random() * 450;
      ctx.lineTo(tychoX + Math.cos(angle) * len, tychoY + Math.sin(angle) * len);
      ctx.strokeStyle = 'rgba(240, 245, 255, 0.18)';
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.stroke();
    }
    // Tycho core
    ctx.beginPath();
    ctx.arc(tychoX, tychoY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // Copernicus rays
    const copX = 730;
    const copY = 460;
    ctx.save();
    for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
      ctx.beginPath();
      ctx.moveTo(copX, copY);
      const len = 150 + Math.random() * 180;
      ctx.lineTo(copX + Math.cos(angle) * len, copY + Math.sin(angle) * len);
      ctx.strokeStyle = 'rgba(220, 235, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(copX, copY, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f4f8';
    ctx.fill();
    ctx.restore();

    const moonTexture = new THREE.CanvasTexture(textureCanvas);

    // 3. Moon Sphere Geometry & Material
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonGeometry = new THREE.SphereGeometry(1.35, 64, 64);
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.9,
      metalness: 0.05,
      bumpMap: moonTexture,
      bumpScale: 0.025,
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonGroup.add(moonMesh);

    // 4. Subtle Lunar Corona / Atmosphere Glow
    const glowGeometry = new THREE.SphereGeometry(1.39, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          gl_FragColor = vec4(0.25, 0.65, 0.95, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    moonGroup.add(glowMesh);

    // 5. Pins for Locations
    const pinsGroup = new THREE.Group();
    moonGroup.add(pinsGroup);

    const pinObjects: { mesh: THREE.Mesh; location: LunarLocation }[] = [];

    if (showPins) {
      LUNAR_LOCATIONS.forEach(loc => {
        // Convert lat/lng to 3D Cartesian coordinates on sphere
        const phi = (90 - loc.lat) * (Math.PI / 180);
        const theta = (loc.lng + 180) * (Math.PI / 180);
        const radius = 1.365;

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        const pinGeo = new THREE.SphereGeometry(0.032, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({
          color: loc.id === selectedLocationId ? 0x22d3ee : 0x38bdf8,
        });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.set(x, y, z);
        pinMesh.userData = { location: loc };

        // Outer pulse ring
        const ringGeo = new THREE.RingGeometry(0.045, 0.065, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.lookAt(x * 2, y * 2, z * 2);
        pinMesh.add(ringMesh);

        pinsGroup.add(pinMesh);
        pinObjects.push({ mesh: pinMesh, location: loc });
      });
    }

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-5, -2, -2);
    scene.add(rimLight);

    // 7. Raycasting for Pin Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;

        moonGroup.rotation.y += deltaX * 0.006;
        moonGroup.rotation.x += deltaY * 0.006;

        previousMousePosition = { x: clientX, y: clientY };
      }

      // Hover check for pins
      if (showPins && !('touches' in event)) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const pinMeshes = pinObjects.map(p => p.mesh);
        const intersects = raycaster.intersectObjects(pinMeshes, true);

        if (intersects.length > 0) {
          let foundLoc: LunarLocation | null = null;
          let current: THREE.Object3D | null = intersects[0].object;
          while (current) {
            if (current.userData?.location) {
              foundLoc = current.userData.location;
              break;
            }
            current = current.parent;
          }
          if (foundLoc) {
            setActivePinName(foundLoc.name);
            container.style.cursor = 'pointer';
          }
        } else {
          setActivePinName(null);
          container.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
      }
    };

    const handlePointerUp = (event: MouseEvent | TouchEvent) => {
      // Check click without significant drag
      if (showPins && onSelectLocation) {
        const rect = container.getBoundingClientRect();
        const clientX = 'changedTouches' in event ? event.changedTouches[0].clientX : event.clientX;
        const clientY = 'changedTouches' in event ? event.changedTouches[0].clientY : event.clientY;
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const pinMeshes = pinObjects.map(p => p.mesh);
        const intersects = raycaster.intersectObjects(pinMeshes, true);

        if (intersects.length > 0) {
          let current: THREE.Object3D | null = intersects[0].object;
          while (current) {
            if (current.userData?.location) {
              onSelectLocation(current.userData.location);
              break;
            }
            current = current.parent;
          }
        }
      }
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!enableZoom) return;
      e.preventDefault();
      camera.position.z = Math.max(2.2, Math.min(5.5, camera.position.z + e.deltaY * 0.003));
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    if (enableZoom) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!isDragging) {
        moonGroup.rotation.y += autoRotateSpeed;
      }

      // Animate pin rings
      pinsGroup.children.forEach((pin, i) => {
        const ring = pin.children[0] as THREE.Mesh;
        if (ring) {
          const scale = 1 + 0.18 * Math.sin(clock.elapsedTime * 3 + i);
          ring.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      if (enableZoom) {
        container.removeEventListener('wheel', handleWheel);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      moonGeometry.dispose();
      moonMaterial.dispose();
      moonTexture.dispose();
    };
  }, [selectedLocationId, autoRotateSpeed, showPins, enableZoom]);

  return (
    <div
      ref={mountRef}
      className={`relative cursor-grab active:cursor-grabbing select-none overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating pin hover badge */}
      {activePinName && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400 text-cyan-300 text-xs font-mono font-semibold tracking-wide shadow-lg shadow-cyan-500/20 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            TARGET: {activePinName}
          </div>
        </div>
      )}

      {/* Subtle UI Overlay Hint */}
      {isHovered && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 pointer-events-none z-10 text-[11px] font-mono text-slate-400/80 bg-slate-950/70 px-3 py-1 rounded-full border border-slate-800">
          DRAG TO ROTATE {enableZoom && '• SCROLL TO ZOOM'} {showPins && '• CLICK PINS'}
        </div>
      )}
    </div>
  );
};
