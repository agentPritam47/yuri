import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from './Experience'
import { Environment, OrbitControls } from '@react-three/drei'

const Scene = () => {
  return (
    <Canvas camera={{position:[0,0,7], fov:25}} >
        {/* <color attach="background" args={['#fff']} /> */}
        <Experience />
        <OrbitControls />
        <Environment preset="studio" environmentIntensity={.5} />
        {/* <directionalLight position={[1,2,3]} intensity={1} /> */}
    </Canvas>
  )
}

export default Scene