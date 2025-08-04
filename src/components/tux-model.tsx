"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Skeleton } from "@/components/ui/skeleton";

function Model() {
  const { scene } = useGLTF('/tux.glb')
  return <primitive object={scene} scale={0.01} />
}

export function TuxModel() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative w-full max-w-md h-96 mx-auto lg:mx-0 rounded-lg bg-card/80">
       <Suspense fallback={<Skeleton className="w-full h-full" />}>
        {isClient ? (
          <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} />
            <Model />
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
        ) : null}
       </Suspense>
    </div>
  );
}
