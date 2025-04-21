"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Text, Html } from "@react-three/drei"
import { Sparkles, Float } from "@react-three/drei"
import { MathUtils } from "three"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { useWorlds } from "@/components/worlds-context"
import { useSound } from "@/hooks/use-sound"
import { Badge } from "@/components/ui/badge"
import { SparklesIcon } from "lucide-react"

function Tree({ position, scale = 1, rotation = [0, 0, 0] }: { position: [number, number, number], scale?: number, rotation?: [number, number, number] }) {
  const { scene } = useGLTF("/assets/3d/tree.glb")
  const treeRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (treeRef.current) {
      // Gentle swaying motion
      treeRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.05
    }
  })

  return (
    <primitive
      ref={treeRef}
      object={scene.clone()}
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
    />
  )
}

function Mushroom({ position, scale = 1, glowing = false, onClick }: { 
  position: [number, number, number], 
  scale?: number, 
  glowing?: boolean, 
  onClick: () => void 
}) {
  const mushroomRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (mushroomRef.current && glowing) {
      // Pulsing effect when glowing
      mushroomRef.current.scale.x = scale * (1 + Math.sin(clock.getElapsedTime() * 2) * 0.1)
      mushroomRef.current.scale.y = scale * (1 + Math.sin(clock.getElapsedTime() * 2) * 0.1)
      mushroomRef.current.scale.z = scale * (1 + Math.sin(clock.getElapsedTime() * 2) * 0.1)
    }
  })

  return (
    <group ref={mushroomRef} position={position} onClick={onClick}>
      {/* Mushroom cap */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={glowing ? "#f87171" : "#dc2626"}
          emissive={glowing ? "#fed7aa" : "#000000"}
          emissiveIntensity={glowing ? 0.5 : 0}
        />
      </mesh>

      {/* Mushroom stem */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1, 16]} />
        <meshStandardMaterial color={glowing ? "#fbcfe8" : "#f9a8d4"} />
      </mesh>

      {/* Glow effect */}
      {glowing && <Sparkles count={20} scale={[1, 1, 1]} size={6} speed={0.3} color="#fed7aa" />}
    </group>
  )
}

function Forest() {
  const [mushrooms, setMushrooms] = useState<{
    id: number;
    position: [number, number, number];
    glowing: boolean;
  }[]>([
    { id: 1, position: [-3, 0, 2], glowing: false },
    { id: 2, position: [2, 0, 3], glowing: false },
    { id: 3, position: [4, 0, -2], glowing: false },
    { id: 4, position: [-2, 0, -3], glowing: false },
    { id: 5, position: [0, 0, 4], glowing: false },
  ])
  const [foundSecret, setFoundSecret] = useState(false)
  const { discoverWorld } = useWorlds()
  const { playSound } = useSound()

  const handleMushroomClick = (id: number) => {
    playSound("magic")

    // Toggle the clicked mushroom's glowing state
    const updatedMushrooms = mushrooms.map((mushroom) =>
      mushroom.id === id ? { ...mushroom, glowing: !mushroom.glowing } : mushroom,
    )

    setMushrooms(updatedMushrooms)

    // Check if all mushrooms are glowing
    if (updatedMushrooms.every((m) => m.glowing) && !foundSecret) {
      setFoundSecret(true)
      discoverWorld("crystal")
      playSound("discovery")
    }
  }

  return (
    <>
      {/* Environment and lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="forest" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2d4a22" />
      </mesh>

      {/* Trees */}
      <Tree position={[-5, -0.5, -5]} scale={1.5} />
      <Tree position={[5, -0.5, -3]} scale={1.2} />
      <Tree position={[0, -0.5, -7]} scale={2} />
      <Tree position={[-7, -0.5, 2]} scale={1.8} />
      <Tree position={[7, -0.5, 5]} scale={1.3} />

      {/* Mushrooms */}
      {mushrooms.map((mushroom) => (
        <Mushroom
          key={mushroom.id}
          position={mushroom.position}
          scale={0.5}
          glowing={mushroom.glowing}
          onClick={() => handleMushroomClick(mushroom.id)}
        />
      ))}

      {/* Particles */}
      <Sparkles count={50} scale={[20, 10, 20]} size={1} speed={0.2} opacity={0.5} />

      {/* Floating leaves */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={1}
          floatIntensity={2}
          position={[MathUtils.randFloatSpread(20), MathUtils.randFloat(1, 5), MathUtils.randFloatSpread(20)]}
        >
          <mesh>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#f0e68c" opacity={0.7} transparent />
          </mesh>
        </Float>
      ))}

      {/* Title */}
      <Text
        position={[0, 5, -5]}
        rotation={[0, 0, 0]}
        fontSize={1}
        color="#1e3a8a"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist_Bold.json"
      >
        森林世界
      </Text>

      {/* Instructions */}
      <Html position={[0, -2, 5]} transform>
        <div className="bg-white/80 p-2 rounded text-sm text-center w-40">点击蘑菇寻找秘密</div>
      </Html>

      {/* Secret discovery notification */}
      {foundSecret && (
        <Html position={[0, 6, 0]} center>
          <Badge className="bg-amber-400 text-amber-900 animate-pulse">
            <SparklesIcon className="h-3 w-3 mr-1" />
            发现新世界！
          </Badge>
        </Html>
      )}
    </>
  )
}

export function Forest3DWorld() {
  const [is3DMode, setIs3DMode] = useState(false)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* 2D/3D Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 hover:bg-white"
          onClick={() => setIs3DMode(!is3DMode)}
        >
          {is3DMode ? "2D 视图" : "3D 视图"}
        </Button>
      </div>

      {/* 3D View */}
      {is3DMode ? (
        <div className="w-full h-full">
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
            <Forest />
            <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 - 0.1} minDistance={5} maxDistance={15} />
          </Canvas>
        </div>
      ) : (
        /* Original 2D Forest World Component */
        <div className="w-full h-full bg-gradient-to-b from-green-200 to-green-400">
          <div className="absolute top-4 left-4 text-2xl font-bold text-green-900">森林世界</div>
          <div className="absolute top-12 left-4 text-sm text-green-800">The Forest World</div>
          <div className="absolute bottom-4 right-4 text-xs text-green-900 bg-white/30 px-2 py-1 rounded">
            点击切换到3D视图探索更多
          </div>
        </div>
      )}
    </div>
  )
}
