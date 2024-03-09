export const createBuffer = (gl, arr) => {
    let buf = gl.createBuffer();
    let bufType = arr instanceof Uint16Array || arr instanceof Uint32Array ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    gl.bindBuffer(bufType, buf);
    gl.bufferData(bufType, arr, gl.STATIC_DRAW);
    return buf;
};


export const createShader = (gl, source, stage) => {
    let s = gl.createShader(stage);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(s));
    }
    return s;
};


export const createProgram = (gl, stages) => {
    let p = gl.createProgram();
    for (let stage of stages) {
        gl.attachShader(p, stage);
    }
    gl.linkProgram(p);
    return p;
};


export const initCanvas = () => {
    let canvas = document.getElementById('webgl');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas
}

export const initGL = (canvas) => {
    let realToCSSPixels = window.devicePixelRatio;
    let gl = canvas.getContext('webgl2');
    if (!gl) {
        window.alert("WebGL2 not supported")
    }

    window.addEventListener('resize', ()=>{
        canvas.width = Math.floor(window.innerWidth * realToCSSPixels);
        canvas.height = Math.floor(window.innerHeight * realToCSSPixels);
        gl.viewport(0, 0, canvas.width, canvas.height);
    })

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.colorMask(true, true, true, true);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.cullFace(gl.BACK);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return gl
}

