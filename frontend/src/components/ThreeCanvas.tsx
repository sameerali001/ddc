"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floating dust particles component for cinematic lighting atmosphere
function AmbientParticles({ count = 80 }) {
  const meshRef = useRef<THREE.Points>(null);
  const tempPositions = new Float32Array(count * 3);
  const tempRandom = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    tempPositions[i * 3] = (Math.random() - 0.5) * 15;
    tempPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    tempPositions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    tempRandom[i] = Math.random();
  }

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * 0.05;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Add subtle drift wave
      positions[idx + 1] += Math.sin(time + tempRandom[i] * 10) * 0.005;
      positions[idx] += Math.cos(time + tempRandom[i] * 10) * 0.003;

      // Wrap particles if they drift out of view bounds
      if (positions[idx + 1] > 6) positions[idx + 1] = -6;
      if (positions[idx + 1] < -6) positions[idx + 1] = 6;
      if (positions[idx] > 6) positions[idx] = -6;
      if (positions[idx] < -6) positions[idx] = 6;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[tempPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#D4AF37" // Golden dust glow
        size={0.06}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface ThreeCanvasProps {
  children: React.ReactNode;
  cameraPos?: [number, number, number];
}

export default function ThreeCanvas({
  children,
  cameraPos = [0, 0, 5],
}: ThreeCanvasProps) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#0B132B]/10 to-[#F8F9FA]/5">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: cameraPos, fov: 45 }}
        className="w-full h-full pointer-events-auto"
      >
        <ambientLight intensity={0.4} color="#FFFFFF" />
        
        {/* Main cinematic directional sunlight */}
        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={1.2}
          color="#FFEFC4" // Warm golden sunrise tint
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        
        {/* Soft fill light */}
        <pointLight position={[-5, 5, -3]} intensity={0.5} color="#8A9EB7" />
        
        {/* Dust motes */}
        <AmbientParticles count={100} />
        
        {children}
      </Canvas>
    </div>
  );
}
