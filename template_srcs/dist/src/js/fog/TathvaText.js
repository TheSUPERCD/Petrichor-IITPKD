__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */
__webpack_require__.d(__webpack_exports__, "default", function() {
    return TathvaText;
});
/* harmony import */
var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! three */ "./node_modules/three/build/three.module.js");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}



var THREE = __webpack_require__( /*! three */ "./node_modules/three/build/three.module.js");

var TathvaText =
    /*#__PURE__*/
    function() {
        function TathvaText() {
            _classCallCheck(this, TathvaText);

            this.uniforms = {
                time: {
                    type: 'f',
                    value: 0
                },
                width: {
                    type: 'f',
                    value: 0
                },
                height: {
                    type: 'f',
                    value: 0
                }
            };
        }

        _createClass(TathvaText, [{
            key: "create_text",
            value: function create_text(font) {
                var geometry = new THREE.TextGeometry("TATHVA '19", {
                    font: font,
                    size: Math.log(innerWidth) * 7.0 + 40.0,
                    height: 0,
                    bevelEnabled: false,
                    curveSegments: 10
                });
                var material = new THREE.ShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: __webpack_require__( /*! ./glsl/tathvaText.vs */ "./src/js/fog/glsl/tathvaText.vs")["default"],
                    fragmentShader: __webpack_require__( /*! ./glsl/tathvaText.fs */ "./src/js/fog/glsl/tathvaText.fs")["default"],
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.NormalBlending
                });
                this.obj = new THREE.Mesh(geometry, material);
                var box = new THREE.Box3().setFromObject(this.obj);
                this.uniforms.width.value = box.getSize().x;
                this.uniforms.height.value = box.getSize().y;
            }
        }, {
            key: "render",
            value: function render(time) {
                this.uniforms.time.value += time;
            }
        }]);

        return TathvaText;
    }();