import {useControls} from "leva";
import React, {useRef} from "react";
import {useTexture} from "@react-three/drei";
import {useFrame, useLoader} from "@react-three/fiber";
import * as THREE from "three";

export default function World() {
    const options = useControls("scene", {
        moonColor: "#ffffff"
    })
    const texture = useLoader(THREE.TextureLoader, "moon1.jpg")
    const moonRef = useRef()

    useFrame(({clock})=>{
        const elapsed = clock.getElapsedTime()
        moonRef.current.rotation.y = elapsed * .5
    })


    return <group>
        <mesh ref={moonRef}>
            <sphereGeometry args={[1, 64, 64]}/>
            <meshStandardMaterial map={texture} color={options.moonColor}/>
        </mesh>
    </group>
}
