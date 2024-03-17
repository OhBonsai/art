uniform float uTime;
uniform sampler2D uTexture;
uniform float uNumber;
uniform float uSize;
varying vec2 vUv;

void main() {
    // get texture
    vec2 start = floor(vec2(uNumber/uSize, mod(uNumber, uSize)));
    vec2 scaledUV = (vUv + start) / uSize;

    vec3 finalColor = texture2D(uTexture, vUv).rgb;

    // draw grid
    float lineWidth = 0.05;
    vec2 gridPosition = fract(vUv * uSize);
    float lineX = step(lineWidth, gridPosition.x) * step(gridPosition.x, 1.0 - lineWidth);
    float lineY = step(lineWidth, gridPosition.y) * step(gridPosition.y, 1.0 - lineWidth);
    float isLine = min(lineX, lineY);

    // draw current cell
    vec2 gridIndex = floor(vUv * uSize);
    float gridIndex1D = floor(gridIndex.x + gridIndex.y * uSize);

    float xNumber = (uTime + 2.5) / 5.0;
    xNumber = mod((uNumber + xNumber) , (uSize * uSize));

    if (gridIndex1D == floor(xNumber)) {
        finalColor += mix(vec3(1.0, 1., 0.), vec3(0.0), isLine);
    } else {
        finalColor += mix(vec3(0.1), vec3(0.0), isLine);
    }





    gl_FragColor = vec4(finalColor, 1.0);
}
