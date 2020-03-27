__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\nvarying float vOpacity;\n\nvoid main() {\n  gl_FragColor = vec4(vec3(0.1), vOpacity*0.8);\n}\n");
