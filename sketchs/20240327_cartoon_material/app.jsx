import {useControls} from "leva";
import React, {useMemo, useRef} from "react";
import {useTexture} from "@react-three/drei";
import {useFrame, useLoader} from "@react-three/fiber";
import * as THREE from "three";
import {shared} from "./shared.jsx";



export default function World() {
    const options = useControls("scene", {
        outlineColor: {
            value: "#1a1a1a",
            onChange: (value) => {
                // material.uniforms.uColor.value = new THREE.Color(value)
            }
        },
        geometryColor: "#4e62f9",
        width: {value: 0.02, min:0.005, max:0.1, step: 0.005},
    })

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uColor: {value: new THREE.Color("#000000")}
            },
            vertexShader: `void main(){
        vec3 newPosition = position + normal * 0.01;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}        `,
            fragmentShader: `
uniform vec3 uColor;
void main() {
        gl_FragColor = vec4(uColor, 1.0);
}        `,
            side: THREE.BackSide,
            transparent: true,
        })


    const texture = useLoader(THREE.TextureLoader, "fiveTone.jpg")
    texture.magFilter = texture.minFilter = THREE.NearestFilter
    const geometry = new THREE.TorusKnotGeometry(1, 0.25, 100, 100)
    const geometry2 = new THREE.BoxGeometry(2, 2, 2)
    const geometry3 = new THREE.CylinderGeometry(1, 2, 2)
    const geometry4 = new THREE.OctahedronGeometry(2, 0)



    return <group>
        <group position={[-5, 0, 0]}>
            <mesh geometry={geometry}>
                <meshToonMaterial color={options.geometryColor} gradientMap={texture}/>
            </mesh>
            <mesh geometry={geometry} material={material}
                  scale={[1 + options.width, 1 + options.width, 1 + options.width]}/>
        </group>

        <group position={[-5, 0, 0]}>
            <mesh>
                <torusKnotGeometry args={[1, 0.25, 100, 100]}/>
                <meshToonMaterial color={options.geometryColor} gradientMap={texture}/>
            </mesh>
            <mesh material={material}
                  scale={[1 + options.width, 1 + options.width, 1 + options.width]}>
                <torusKnotGeometry args={[1, 0.25, 100, 100]}/>
            </mesh>
        </group>

        <group position={[0, 0, 0]}>
            <mesh geometry={geometry3}>
                <meshToonMaterial color={options.geometryColor} gradientMap={texture}/>
            </mesh>
            <group scale={[1 + options.width, 1 + options.width, 1 + options.width]}>
                <mesh geometry={geometry3} material={material}/>

            </group>
        </group>

        <group position={[5, 0, 0]}>
            <mesh geometry={geometry2}>
                <meshToonMaterial color={options.geometryColor} gradientMap={texture}/>
            </mesh>
            <group scale={[1 + options.width, 1 + options.width, 1 + options.width]}>
                <mesh geometry={geometry2} material={material}/>

            </group>
        </group>


        <group position={[5, 5, 0]}>
            <mesh geometry={geometry4}>
                <meshToonMaterial color={options.geometryColor} gradientMap={texture}/>
            </mesh>
            <group scale={[1 + options.width, 1 + options.width, 1 + options.width]}>
                <mesh geometry={geometry4} material={material}/>

            </group>
        </group>
    </group>

}
