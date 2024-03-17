precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;



vec2 guv() {
    float aspectRatio = uResolution.x / uResolution.y;

    vec2 uv = gl_FragCoord.xy / uResolution;
    if (aspectRatio >= 1.0) {
        uv.x = (gl_FragCoord.x - (uResolution.x - uResolution.y) / 2.0) / uResolution.y;
    } else {
        uv.y = (gl_FragCoord.y - (uResolution.y - uResolution.x) / 2.0) / uResolution.x;
    }
    uv = (uv - 0.5) * 2.0;
    return uv;
}


void main()
{
    vec2 uv = guv();

    float radius = 0.5;
    float distance = length(uv);
    float alpha = smoothstep(radius - 0.01, radius + 0.01, distance);

    vec3 finalColor = uColor * (alpha > 0. ? 0.0 : 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
}
