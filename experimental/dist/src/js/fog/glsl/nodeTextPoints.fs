__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision highp float;\n#define GLSLIFY 1\n\nvarying float vOpacity;\n\nvoid main() {\n  // Round the point\n  vec3 n;\n  n.xy = gl_PointCoord * 2.0 - 1.0;\n  n.z = 1.0 - dot(n.xy, n.xy);\n  if (n.z < 0.0) discard;\n\n  gl_FragColor = vec4(vec3(0.1), vOpacity*0.5);\n}\n");
