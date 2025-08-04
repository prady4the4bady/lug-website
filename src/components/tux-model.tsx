"use client"

import { Suspense, useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton";
import type { ComponentType } from "react";

// We will dynamically import these components only on the client side.
let Canvas: ComponentType<any>;
let OrbitControls: ComponentType<any>;
let useGLTF: (path: string) => { scene: any };


function Model() {
  // useGLTF must be available here
  if (!useGLTF) return null;
  const { scene } = useGLTF('/tux.glb')
  return <primitive object={scene} scale={0.01} />
}

export function TuxModel() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    import("@react-three/fiber").then(fiber => {
      Canvas = fiber.Canvas;
      return import("@react-three/drei");
    }).then(drei => {
      OrbitControls = drei.OrbitControls;
      useGLTF = drei.useGLTF;
      setIsClient(true);
    }).catch(error => console.error("Failed to load 3D libraries", error));
  }, []);

  if (!isClient || !Canvas) {
    // Render a skeleton while we're on the server or before the libraries have loaded.
    return <Skeleton className="w-full max-w-md h-96 mx-auto lg:mx-0" />;
  }
  
  return (
    <div className="relative w-full max-w-md h-96 mx-auto lg:mx-0 rounded-lg bg-card/80">
       <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} />
            <Model />
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
       </Suspense>
    </div>
  );
}
