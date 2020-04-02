__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */
__webpack_require__.d(__webpack_exports__, "default", function() {
    return backgroundSphere;
});

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

var MathEx = __webpack_require__( /*! js-util/MathEx */ "./node_modules/js-util/MathEx.js");

var backgroundSphere =
    /*#__PURE__*/
    function() {
        function backgroundSphere() {
            _classCallCheck(this, backgroundSphere);

            this.uniforms = {
                time: {
                    type: 'f',
                    value: 0
                }
            };
            this.obj;
        }

        _createClass(backgroundSphere, [{
            key: "createObj",
            value: function createObj() {
                var geometry = new THREE.SphereBufferGeometry(10000, 128, 128); // Materialを定義

                var material = new THREE.RawShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: __webpack_require__( /*! ./glsl/backgroundSphere.vs */ "./src/js/fog/glsl/backgroundSphere.vs")["default"],
                    fragmentShader: __webpack_require__( /*! ./glsl/backgroundSphere.fs */ "./src/js/fog/glsl/backgroundSphere.fs")["default"],
                    side: THREE.BackSide
                }); // Object3Dを作成

                this.obj = new THREE.Mesh(geometry, material);
            }
        }, {
            key: "render",
            value: function render(time) {
                this.uniforms.time.value += time;
            }
        }]);

        return backgroundSphere;
    }();