import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Crystal } from '@/lib/database';

interface CrystalProps {
  crystal: Crystal;
  onCollect: (crystalId: string) => void;
}

const CrystalMesh: React.FC<CrystalProps> = ({ crystal, onCollect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = crystal.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  const getCrystalColor = (type: Crystal['type']) => {
    const colors = {
      blue: '#60a5fa',
      purple: '#a855f7',
      pink: '#ec4899',
      gold: '#fbbf24',
      green: '#10b981'
    };
    return colors[type];
  };

  const handleClick = () => {
    onCollect(crystal.id);
  };

  return (
    <mesh
      ref={meshRef}
      position={crystal.position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial
        color={getCrystalColor(crystal.type)}
        emissive={getCrystalColor(crystal.type)}
        emissiveIntensity={hovered ? 0.3 : 0.1}
        transparent
        opacity={0.8}
      />
      {hovered && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {crystal.value} pts
        </Text>
      )}
    </mesh>
  );
};

const Ground: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial 
        color="#1a1a2e"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

const CameraController: React.FC = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

interface GameWorldProps {
  crystals: Crystal[];
  onCrystalCollect: (crystalId: string) => void;
  score: number;
  level: number;
}

const GameWorld: React.FC<GameWorldProps> = ({ crystals, onCrystalCollect, score, level }) => {
  return (
    <div className="relative w-full h-screen bg-background">
      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <motion.div
          className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-primary/20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <div className="text-foreground">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-2xl font-bold text-primary">{score}</div>
            </div>
            <div className="text-foreground">
              <div className="text-sm text-muted-foreground">Level</div>
              <div className="text-2xl font-bold text-secondary">{level}</div>
            </div>
            <div className="text-foreground">
              <div className="text-sm text-muted-foreground">Crystals</div>
              <div className="text-2xl font-bold text-accent">{crystals.length}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-primary/20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center text-foreground text-sm">
            🖱️ Clic gauche + glisser pour tourner | 🎯 Cliquez sur les cristaux pour les collecter | 🎮 Molette pour zoomer
          </div>
        </motion.div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <CameraController />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#a855f7" />
        <spotLight
          position={[0, 20, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          color="#10b981"
        />

        {/* Environment */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        <Ground />
        
        {/* Crystals */}
        {crystals.map((crystal) => (
          <CrystalMesh
            key={crystal.id}
            crystal={crystal}
            onCollect={onCrystalCollect}
          />
        ))}

        {/* Welcome Text */}
        <Text
          position={[0, 6, 0]}
          fontSize={1}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_regular.typeface.json"
        >
          Crystal Quest 3D
        </Text>

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default GameWorld;