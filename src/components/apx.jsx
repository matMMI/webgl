"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
const Model = ({ url, color }) => {
  const model = useLoader(STLLoader, url);
  const mesh = useRef();
  const lightRef = useRef();

  useEffect(() => {
    if (mesh.current) {
      mesh.current.add(lightRef.current);
      const geometry = mesh.current.geometry;
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(mesh.current.position).multiplyScalar(-1);
    }
  }, [model]);

  return (
    <mesh ref={mesh}>
      <primitive object={model} />
      <meshStandardMaterial color={color} />
      <directionalLight ref={lightRef} position={[0, 0, 1]} intensity={3} />
    </mesh>
  );
};

const Scene = ({ modelUrl, color }) => {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 1]} intensity={3} />
      <Suspense fallback={null}>
        <Model url={modelUrl} color={color} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

const Page = () => {
  const [color, setColor] = useState("gray");
  const [modelUrl, setModelUrl] = useState("/mermer40.stl");
  const models = {
    mermer40: "/mermer40.stl",
    aster: "/Aster.stl",
    mdcn: "/mdcn.stl",
    mdcnAiles: "/referent_mdcn_ailes.stl",
  };
  const modelNames = {
    mermer40: "Mermer 40",
    aster: "Aster",
    mdcn: "MDCN",
    mdcnAiles: "MDCN Avec Ailes",
  };
  const buttonContainerStyle = {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    padding: "10px",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };
  const buttonStyle = {
    textTransform: "uppercase",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.1s",
  };
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div style={buttonContainerStyle}>
        {Object.entries(models).map(([key, path]) => (
          <button
            key={key}
            style={buttonStyle}
            onClick={() => setModelUrl(path)}
          >
            {modelNames[key]}
          </button>
        ))}
      </div>

      <Scene modelUrl={modelUrl} color={color} />
    </div>
  );
};
export default Page;
