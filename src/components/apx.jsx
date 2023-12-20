"use client";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
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
      if (url.endsWith("/Aster.stl")) {
        mesh.current.scale.set(3, 3, 3);
      } else {
        mesh.current.scale.set(1, 1, 1);
      }
    }
  }, [model, url]);
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.5;
    }
  });
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
      <OrbitControls
        minDistance={10}
        maxDistance={40}
        minPolarAngle={0} // Increase this to allow full vertical rotation
        maxPolarAngle={Math.PI * 2}
      />
    </Canvas>
  );
};
const Page = () => {
  const [color, setColor] = useState("gray");
  const [modelUrl, setModelUrl] = useState("/mermer40.stl");
  const [selectedModel, setSelectedModel] = useState("mermer40");
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
    top: 15,
    left: 15,
    zIndex: 10,
    padding: "10px",
    backdropFilter: "blur(10px)",
    backgroundColor: "#000000",
    border: "2px solid #1D1D1D",

    borderRadius: "7px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };
  const buttonStyle = {
    textTransform: "uppercase",
    padding: "10px 15px",
    color: "#ffffff",
    backgroundColor: "#121212",
    border: "2px solid transparent",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "border 0.3s ease, padding 0.3s ease, transform 0.3s ease",
    boxSizing: "border-box",
  };
  const activeButtonStyle = {
    ...buttonStyle,
    border: "2px solid #0CFF99",
  };
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div style={buttonContainerStyle}>
        {Object.entries(models).map(([key, path]) => (
          <button
            key={key}
            style={selectedModel === key ? activeButtonStyle : buttonStyle}
            onClick={() => {
              setModelUrl(path);
              setSelectedModel(key);
            }}
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
