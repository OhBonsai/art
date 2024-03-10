import React from 'react'
import ReactDOM from 'react-dom/client'
import {Canvas} from "@react-three/fiber";
import {Leva, useControls} from "leva";
import {Perf} from "r3f-perf";
import {OrbitControls, OrthographicCamera} from "@react-three/drei";
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
        bgColor: "#08092d",
        light: true,
        ambientLightColor: "#ffffff",
        ambientLightIntensity: {value: 0.1, min: 0, max: 2, step: 0.1},
        directionalLightColor: "#ffffff",
        directionalLightIntensity: {value: 0., min: 0, max: 2, step: 0.1},
        directionalLightPosition: {value: [-10, 2, 0]},

        spotLightColor: "#ff0000",
        spotLightIntensity: {value: 5.0, min: 0, max: 100, step: 0.1},
        spotLightPosition: {value: [0, 1.0, 0]}
    })

    return <Canvas dpr={[1, 2]} orthographic={true}>
        <OrthographicCamera position={[0,100,100]} makeDefault={true} zoom={100} near={1} far={1000}/>
        <color attach="background" args={[options.bgColor]}/>
        <ambientLight color={options.ambientLightColor} intensity={options.ambientLightIntensity}/>
        <directionalLight position={options.directionalLightPosition} color={options.directionalLightColor} intensity={options.directionalLightIntensity}/>
        <spotLight position={options.spotLightPosition} color={options.spotLightColor} intensity={options.spotLightIntensity}/>
        {isDebug() && <Perf position={"top-left"}/>}
        <OrbitControls/>
        <World/>
    </Canvas>

}

function isDebug() {
    return window.location.search.includes("debug")
}


