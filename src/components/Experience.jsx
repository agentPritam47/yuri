import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import CustomShaderMaterial from "three-custom-shader-material";
import { useControls } from "leva";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";

const Experience = () => {
  const materialRef = useRef();
  const geometryRef = useRef();
  const meshRef = useRef();
  const [geometryReady, setGeometryReady] = useState(false);

  const { 
    color,
    roughness,
    metalness,
    positionFrequency,
    positionStrength,
    timeFrequency,
    smallWavePositionFrequency,
    smallWavePositionStrength,
    smallWaveTimeFrequency,
    transparent,
    opacity
  } = useControls({
    color: "black",
    roughness: { value: 0.1, min: 0, max: 1 },
    metalness: { value: 0, min: 0, max: 1 },
    positionFrequency: { value: 1, min: 0, max: 5 },
    positionStrength: { value: 2, min: 0, max: 5 },
    timeFrequency: { value: 1, min: 0, max: 5 },
    smallWavePositionFrequency: { value: 1, min: 0, max: 5 },
    smallWavePositionStrength: { value: 0.2, min: 0, max: 1 },
    smallWaveTimeFrequency: { value: 0.2, min: 0, max: 1 },
    transparent: true,
    opacity: { value: 1, min: 0, max: 1 }
  });

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * 0.5;
      materialRef.current.uniforms.uPositionFrequency.value = positionFrequency;
      materialRef.current.uniforms.uPositionStrength.value = positionStrength;
      materialRef.current.uniforms.uTimeFrequency.value = timeFrequency;
      materialRef.current.uniforms.uSmallWavePositionFrequency.value = smallWavePositionFrequency;
      materialRef.current.uniforms.uSmallWavePositionStrength.value = smallWavePositionStrength;
      materialRef.current.uniforms.uSmallWaveTimeFrequency.value = smallWaveTimeFrequency;
    }
  });

  useEffect(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 140);
    const mergedGeometry = mergeVertices(geometry);
    mergedGeometry.computeTangents();
    geometryRef.current = mergedGeometry;
    setGeometryReady(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (meshRef.current) {
        if (window.innerWidth <= 768) { // Mobile breakpoint
          meshRef.current.scale.set(0.5, 0.5, 0.5);
        } else {
          meshRef.current.scale.set(1, 1, 1);
        }
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!geometryReady) {
    return null;
  }

  return (
    <>
      <mesh ref={meshRef} receiveShadow castShadow>
        <primitive object={geometryRef.current} attach="geometry" />
        <CustomShaderMaterial
          baseMaterial={THREE.MeshPhysicalMaterial}
          ref={materialRef}
          color={color}
          roughness={roughness}
          metalness={metalness}
          transparent={transparent}
          opacity={opacity}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={{
            uTime: { value: 0 },
            uPositionFrequency: { value: positionFrequency },
            uPositionStrength: { value: positionStrength },
            uTimeFrequency: { value: timeFrequency },
            uSmallWavePositionFrequency: { value: smallWavePositionFrequency },
            uSmallWavePositionStrength: { value: smallWavePositionStrength },
            uSmallWaveTimeFrequency: { value: smallWaveTimeFrequency },
          }}
        />
      </mesh>
    </>
  );
};

export default Experience;
