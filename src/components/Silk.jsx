import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const hexToNormalizedRGB = (hex) => {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLightMode;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float grain = rnd / 15.0 * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);

  if (uLightMode > 0.5) {
    float fold = smoothstep(0.28, 0.9, pattern);
    float specular = smoothstep(0.72, 0.98, pattern);
    vec3 shadowColor = uColor * 0.72;
    vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
    vec3 lightBase = mix(shadowColor, bodyColor, fold);
    lightBase = mix(lightBase, vec3(1.0), specular * 0.92);
    float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
    float grainSignal = (rnd + fineNoise - 1.0);
    float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
    result = lightBase + grainSignal * grainStrength;
  }

  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`;

/**
 * Silk component from @react-bits/Silk-JS-CSS
 * Renders smooth fluid waves with subtle soft lighting, micro-grain texture, and procedural folds.
 */
export const Silk = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  lightMode = false,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const uniformsRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;
    const height = containerRef.current.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      return;
    }

    const rgb = hexToNormalizedRGB(color);
    const uniforms = {
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new THREE.Color(rgb[0], rgb[1], rgb[2]) },
      uRotation: { value: rotation },
      uLightMode: { value: lightMode ? 1 : 0 },
      uTime: { value: 0 }
    };
    uniformsRef.current = uniforms;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let lastTime = performance.now();
    let isMounted = true;

    const animate = (currentTime) => {
      if (!isMounted) return;
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      uniforms.uTime.value += 0.1 * delta;
      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
    };

    // The hero can finish layout after the first effect pass. ResizeObserver
    // keeps the WebGL drawing buffer aligned with the actual visible canvas.
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    requestAnimationFrame(handleResize);
    const resizeTimer = window.setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      window.clearTimeout(resizeTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Live uniform updates
  useEffect(() => {
    if (!uniformsRef.current) return;
    const rgb = hexToNormalizedRGB(color);
    uniformsRef.current.uSpeed.value = speed;
    uniformsRef.current.uScale.value = scale;
    uniformsRef.current.uNoiseIntensity.value = noiseIntensity;
    uniformsRef.current.uColor.value.setRGB(rgb[0], rgb[1], rgb[2]);
    uniformsRef.current.uRotation.value = rotation;
    uniformsRef.current.uLightMode.value = lightMode ? 1 : 0;
  }, [speed, scale, noiseIntensity, color, rotation, lightMode]);

  return (
    <div
      ref={containerRef}
      className={`silk-canvas-wrapper ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default Silk;
