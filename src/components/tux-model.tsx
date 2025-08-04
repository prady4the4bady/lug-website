
"use client";

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Skeleton } from "@/components/ui/skeleton";

function Model() {
  const { scene } = useGLTF('/tux.glb')
  return <primitive object={scene} scale={0.01} />
}

export function TuxModel() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
            <Model />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate />
    </Canvas>
  );
}
