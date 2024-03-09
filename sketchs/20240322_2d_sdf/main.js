import fragmentShader from './play.frag';
import vertexShader from './play.vert';
import {createBuffer, createProgram, createShader, initCanvas, initGL} from "./tool.js";
import GUI from 'lil-gui';


const canvas = initCanvas()
const gl = initGL(canvas)
const gui = new GUI();

let positionBuffer = createBuffer(gl, new Float32Array([
    -1, -1, 0,
    -1, 1, 0,
    1, -1 ,0,
    1, -1, 0,
    1, 1, 0,
    -1, 1, 0,
]));
let vertModule = createShader(gl, vertexShader, gl.VERTEX_SHADER);
let fragModule = createShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
let program = createProgram(gl, [vertModule, fragModule]);
let timeUniLoc = gl.getUniformLocation(program, 'uTime');
let n1UniLoc = gl.getUniformLocation(program, 'n1');
let n2UniLoc = gl.getUniformLocation(program, 'n2');
let n3UniLoc = gl.getUniformLocation(program, 'n3');
let resolutionUniLoc = gl.getUniformLocation(program, 'uResolution');
let colorUniLoc = gl.getUniformLocation(program, 'uColor');
let positionAttrLoc = gl.getAttribLocation(program, 'position');
let renderTimes = 0

const parameters = {
    color: { r: 1, g: 0, b: 0 },
    n1: 1.0,
    n2: 1.0,
    n3: 3,
}

gui.addColor(parameters, 'color').onChange((value) => {
    gl.uniform3f(colorUniLoc, value.r, value.g, value.b);
});
gui.add(parameters, 'n1').min(0.0).max(1.0).step(0.01).onChange((v)=>{
    gl.uniform1f(n1UniLoc, v)
})
gui.add(parameters, 'n2').min(0.0).max(1.0).step(0.01).onChange((v)=>{
    gl.uniform1f(n2UniLoc, v)
})
gui.add(parameters, 'n3').min(1).max(20).step(1).onChange((v)=>{
    gl.uniform1i(n3UniLoc, v)
})
const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.scissor(0, 0, canvas.width, canvas.height);

    // uniforms
    if (renderTimes === 0){
        renderTimes++;
        gl.uniform3f(colorUniLoc, 1.0, 0.0, 0.0);
        gl.uniform1f(n1UniLoc, parameters.n1)
        gl.uniform1f(n2UniLoc, parameters.n2)
        gl.uniform1i(n3UniLoc, parameters.n3)
    }
    gl.uniform1f(timeUniLoc, performance.now() / 1000);
    gl.uniform2f(resolutionUniLoc, canvas.width, canvas.height);

    // attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttrLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttrLoc);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    requestAnimationFrame(render);
};



render();
