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
let f1UniLoc = gl.getUniformLocation(program, 'f1');
let f2UniLoc = gl.getUniformLocation(program, 'f2');
let f3UniLoc = gl.getUniformLocation(program, 'f3');
let f4UniLoc = gl.getUniformLocation(program, 'f4');
let f5UniLoc = gl.getUniformLocation(program, 'f5');
let i1UniLoc = gl.getUniformLocation(program, 'i1');
let i2UniLoc = gl.getUniformLocation(program, 'i2');
let i3UniLoc = gl.getUniformLocation(program, 'i3');
let resolutionUniLoc = gl.getUniformLocation(program, 'uResolution');
let colorUniLoc = gl.getUniformLocation(program, 'uColor');
let positionAttrLoc = gl.getAttribLocation(program, 'position');
let renderTimes = 0

const parameters = {
    color: { r: 1, g: 0, b: 0 },
    f1: 1.0,
    f2: 1.0,
    f3: 1.0,
    f4: .5,
    f5: .5,
    i1: 3,
    i2: 3,
    i3: 1,
    b1: true,
}

gui.addColor(parameters, 'color').onChange((value) => {
    gl.uniform3f(colorUniLoc, value.r, value.g, value.b);
});
gui.add(parameters, 'f1').name('translate').min(0.0).max(1.0).step(0.01).onChange((v)=>{gl.uniform1f(f1UniLoc, v)})
gui.add(parameters, 'f2').name('zoomIn').min(0.0).max(1.0).step(0.01).onChange((v)=>{gl.uniform1f(f2UniLoc, v)})
gui.add(parameters, 'f3').min(0.0).max(1.0).step(0.01).onChange((v)=>{gl.uniform1f(f3UniLoc, v)})
gui.add(parameters, 'f4').name('zoomOut').min(0.0).max(1.0).step(0.01).onChange((v)=>{gl.uniform1f(f4UniLoc, v)})
gui.add(parameters, 'f5').name('radius').min(0.0).max(1.0).step(0.01).onChange((v)=>{gl.uniform1f(f5UniLoc, v)})
gui.add(parameters, 'i1').name('side').min(1).max(8).step(1).onChange((v)=>{gl.uniform1i(i1UniLoc, v)})
gui.add(parameters, 'i2').name('cellCount').min(2).max(6).step(1).onChange((v)=>{gl.uniform1i(i2UniLoc, v)})
gui.add(parameters, 'i3').min(0).max(100).step(1).onChange((v)=>{gl.uniform1i(i3UniLoc, v)})

const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.scissor(0, 0, canvas.width, canvas.height);

    // uniforms
    if (renderTimes === 0){
        renderTimes++;
        gl.uniform3f(colorUniLoc, 1.0, 0.0, 0.0);
        gl.uniform1f(f1UniLoc, parameters.f1)
        gl.uniform1f(f2UniLoc, parameters.f2)
        gl.uniform1f(f3UniLoc, parameters.f3)
        gl.uniform1f(f4UniLoc, parameters.f4)
        gl.uniform1f(f5UniLoc, parameters.f5)
        gl.uniform1i(i1UniLoc, parameters.i1)
        gl.uniform1i(i2UniLoc, parameters.i2)
        gl.uniform1i(i3UniLoc, parameters.i3)
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
