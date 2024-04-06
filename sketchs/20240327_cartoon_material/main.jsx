import React from 'react'
import ReactDOM from 'react-dom/client'
import {Canvas} from "@react-three/fiber";
import {Leva, useControls} from "leva";
import {Perf} from "r3f-perf";
import {OrbitControls} from "@react-three/drei";
import World from "./app.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)

function App() {
    return  <>
        <Leva hidden={!isDebug()} collapsed/>
        <Experience/>
    </>
}


function Experience() {
    const options = useControls("world", {
        bgColor: "#9d5e5e",
        light: true,
        ambientLightColor: "#ffffff",
        ambientLightIntensity: {value: 0.2, min: 0, max: 2, step: 0.1},
        directionalLightColor: "#ffffff",
        directionalLightIntensity: {value: 1.0, min: 0, max: 2, step: 0.1},
    })

    return <Canvas dpr={[1, 2]}>
        <color attach="background" args={[options.bgColor]}/>
        <ambientLight color={options.ambientLightColor} intensity={options.ambientLightIntensity}/>
        <directionalLight position={[0, 0, 0]} color={options.directionalLightColor}
                          intensity={options.directionalLightIntensity}/>
        <directionalLight position={[0, 5, 0]} color={options.directionalLightColor}
                          intensity={options.directionalLightIntensity}/>
        <directionalLight position={[-5, 0, 0]} color={options.directionalLightColor}
                          intensity={options.directionalLightIntensity}/>
        {isDebug() && <Perf position={"top-left"}/>}
        <OrbitControls/>
        <World/>
    </Canvas>

}

function isDebug() {
    return window.location.search.includes("debug")
}


