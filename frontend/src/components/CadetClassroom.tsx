"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CadetClassroomProps {
  hoveredCourseId: string | null;
}

export default function CadetClassroom({ hoveredCourseId }: CadetClassroomProps) {
  const cadetGroup = useRef<THREE.Group>(null);
  const headMesh = useRef<THREE.Group>(null);
  const torsoMesh = useRef<THREE.Mesh>(null);
  
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse positions relative to screen dimensions
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Head looks at cursor
    if (headMesh.current) {
      const targetRY = mouse.x * 0.35;
      const targetRX = -mouse.y * 0.25;
      headMesh.current.rotation.y = THREE.MathUtils.lerp(headMesh.current.rotation.y, targetRY, 0.08);
      headMesh.current.rotation.x = THREE.MathUtils.lerp(headMesh.current.rotation.x, targetRX, 0.08);
    }

    // 2. Torso turns toward hovered course cards
    if (cadetGroup.current) {
      let targetRY = 0;
      if (hoveredCourseId) {
        // Rotate left/right based on course ID hashes or selections
        if (hoveredCourseId === "c1" || hoveredCourseId === "c2") {
          targetRY = -0.3; // Turn to Left
        } else {
          targetRY = 0.3; // Turn to Right
        }
      } else {
        // Base turn matches mouse movement slightly
        targetRY = mouse.x * 0.1;
      }
      cadetGroup.current.rotation.y = THREE.MathUtils.lerp(cadetGroup.current.rotation.y, targetRY, 0.06);
    }

    // 3. Subtle breathing scale
    if (torsoMesh.current) {
      const breathe = Math.sin(time * 1.5) * 0.01;
      torsoMesh.current.scale.set(1 + breathe, 1, 1 + breathe * 0.5);
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* 1. Study Desk (Wooden texture finish) */}
      <mesh position={[0, -0.7, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.4} /> {/* Brown wood */}
      </mesh>
      {/* Left Desk Leg */}
      <mesh position={[-1.1, -1.2, 0.6]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
        <meshStandardMaterial color="#2D3748" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Right Desk Leg */}
      <mesh position={[1.1, -1.2, 0.6]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
        <meshStandardMaterial color="#2D3748" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* 2. Laptop on the Desk */}
      <group position={[-0.4, -0.62, 0.7]} rotation={[0, 0.2, 0]}>
        {/* Keyboard Base */}
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.015, 0.3]} />
          <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Screen (Open at 110 degrees) */}
        <mesh position={[0, 0.12, -0.14]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.26, 0.015]} />
          <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Screen Face */}
        <mesh position={[0, 0.12, -0.13]} rotation={[-0.4, 0, 0]}>
          <planeGeometry args={[0.38, 0.24]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
      </group>

      {/* 3. Notebook on the Desk */}
      <mesh position={[0.3, -0.65, 0.7]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.26, 0.02, 0.32]} />
        <meshStandardMaterial color="#3182CE" roughness={0.7} /> {/* Blue notebook cover */}
      </mesh>
      <mesh position={[0.3, -0.63, 0.7]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.24, 0.022, 0.3]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} /> {/* White pages */}
      </mesh>

      {/* 4. Academy Shield Badge (Glows Gold) */}
      <mesh position={[0.7, -0.65, 0.8]} rotation={[-Math.PI / 2, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.01, 3]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Blue Ribbon/Accent on Badge */}
      <mesh position={[0.7, -0.645, 0.8]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.012, 3]} />
        <meshStandardMaterial color="#0B132B" roughness={0.4} />
      </mesh>

      {/* 5. Cadet Seated Behind the Desk */}
      <group ref={cadetGroup} position={[0, -0.6, 0]}>
        {/* Chair Backrest */}
        <mesh position={[0, 0.2, -0.45]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.05]} />
          <meshStandardMaterial color="#1A202C" roughness={0.8} />
        </mesh>
        
        {/* Torso (uniform) */}
        <mesh ref={torsoMesh} position={[0, 0.45, -0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.3, 0.75, 16]} />
          <meshStandardMaterial color="#0B132B" roughness={0.45} />
        </mesh>

        {/* Epaulets (Gold) */}
        <mesh position={[-0.35, 0.78, -0.1]} rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[0.16, 0.03, 0.2]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.35, 0.78, -0.1]} rotation={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.16, 0.03, 0.2]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Arms (typing stance on table) */}
        {/* Left Arm */}
        <mesh position={[-0.38, 0.25, 0.25]} rotation={[0.4, -0.2, -0.2]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.55, 12]} />
          <meshStandardMaterial color="#0B132B" roughness={0.45} />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.38, 0.25, 0.25]} rotation={[0.4, 0.2, 0.2]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.55, 12]} />
          <meshStandardMaterial color="#0B132B" roughness={0.45} />
        </mesh>

        {/* Forearms reaching table */}
        <mesh position={[-0.3, 0.02, 0.5]} rotation={[1.1, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.5, 12]} />
          <meshStandardMaterial color="#0B132B" roughness={0.45} />
        </mesh>
        <mesh position={[0.3, 0.02, 0.5]} rotation={[1.1, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.5, 12]} />
          <meshStandardMaterial color="#0B132B" roughness={0.45} />
        </mesh>

        {/* Hands on Keyboard / Desk */}
        <mesh position={[-0.24, -0.18, 0.68]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#F7D3A1" roughness={0.6} />
        </mesh>
        <mesh position={[0.24, -0.18, 0.68]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#F7D3A1" roughness={0.6} />
        </mesh>

        {/* Head and Peak Cap */}
        <group ref={headMesh} position={[0, 0.95, -0.1]}>
          {/* Neck */}
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.09, 0.12, 16]} />
            <meshStandardMaterial color="#F7D3A1" roughness={0.6} />
          </mesh>

          {/* Face */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#F7D3A1" roughness={0.5} />
          </mesh>

          {/* Cadet Cap */}
          <group position={[0, 0.2, 0]}>
            {/* Cap Base */}
            <mesh position={[0, 0.03, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />
              <meshStandardMaterial color="#0B132B" roughness={0.3} />
            </mesh>
            {/* Cap Crown (White) */}
            <mesh position={[0, 0.09, 0.02]} rotation={[0.08, 0, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.2, 0.07, 16]} />
              <meshStandardMaterial color="#E9ECEF" roughness={0.5} />
            </mesh>
            {/* Gold Ribbon */}
            <mesh position={[0, 0.02, 0.005]} castShadow>
              <cylinderGeometry args={[0.205, 0.205, 0.02, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Cap Visor */}
            <mesh position={[0, 0.0, 0.12]} rotation={[0.25, 0, 0]} castShadow>
              <boxGeometry args={[0.22, 0.015, 0.12]} />
              <meshStandardMaterial color="#050914" roughness={0.05} metalness={0.8} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
