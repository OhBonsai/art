void main() {
    float x = gl_FragCoord.x / 14.6;
    vec3 color = vec3(x);
    gl_FragColor = vec4(color,1.0);
}