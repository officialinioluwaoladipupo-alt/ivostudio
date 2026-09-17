import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeHeroCanvas
 * Subtle, atmospheric 3D spatial field on the home hero.
 * Renders an architectural coordinate wireframe mesh with subtle ambient oscillation
 * and gentle mouse parallax. Degrades gracefully if WebGL is unavailable or reduced motion is enabled.
 */
export function ThreeHeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canvasRef.current) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: "low-power"
      });
    } catch (e) {
      return; // WebGL not available
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 18, 28);
    camera.lookAt(0, 0, 0);

    const resize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.parentElement ? canvasRef.current.parentElement.clientWidth : window.innerWidth;
      const height = canvasRef.current.parentElement ? canvasRef.current.parentElement.clientHeight : window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };
    resize();
    window.addEventListener('resize', resize);

    // Architectural Wireframe Plane
    const width = 64;
    const depth = 64;
    const segs = 32;
    const geometry = new THREE.PlaneGeometry(width, depth, segs, segs);
    geometry.rotateX(-Math.PI / 2);

    // Initial subtle undulating heights
    const pos = geometry.attributes.position;
    const initialY = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 1.8;
      pos.setY(i, y);
      initialY[i] = y;
    }
    pos.needsUpdate = true;

    // Wireframe material with Architectural Purple & Deep Violet
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x29233d,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });

    const mesh = new THREE.Mesh(geometry, wireframeMat);
    scene.add(mesh);

    // Subtle coordinate node dots
    const pointsMat = new THREE.PointsMaterial({
      color: 0x867ea4,
      size: 0.15,
      transparent: true,
      opacity: 0.65
    });
    const points = new THREE.Points(geometry, pointsMat);
    scene.add(points);

    // Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 4;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 3;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Subtle wave breathing
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const y = initialY[i] + Math.sin(elapsedTime * 0.8 + x * 0.15 + z * 0.1) * 0.45;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX;
      camera.position.y = 18 - mouseY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      geometry.dispose();
      wireframeMat.dispose();
      pointsMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="three-hero-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="three-hero-canvas" />
    </div>
  );
}

export default ThreeHeroCanvas;
