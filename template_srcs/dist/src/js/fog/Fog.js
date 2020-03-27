__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */
__webpack_require__.d(__webpack_exports__, "default", function() {
    return Fog;
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

var MathEx = __webpack_require__( /*! js-util/MathEx */ "./node_modules/js-util/MathEx.js"); // Standard Normal variate using Box-Muller transform.


function randn_bm() {
    var u = 0,
        v = 0;

    while (u === 0) {
        u = Math.random();
    } //Converting [0,1) to (0,1)


    while (v === 0) {
        v = Math.random();
    }

    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

var Fog =
    /*#__PURE__*/
    function() {
        function Fog() {
            _classCallCheck(this, Fog);

            this.uniforms = {
                time: {
                    type: 'f',
                    value: 0
                },
                tex: {
                    type: 't',
                    value: null
                }
            };
            this.num = 5;
            this.obj;
        }

        _createClass(Fog, [{
            key: "createObj",
            value: function createObj(tex) {
                // Define Geometries
                var geometry = new THREE.InstancedBufferGeometry();
                var baseGeometry = new THREE.PlaneBufferGeometry(2100, 2100, 20, 20); // Copy attributes of the base Geometry to the instancing Geometry

                geometry.copy(baseGeometry); // Define attributes of the instancing geometry

                var instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3);
                var delays = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);
                var rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);

                for (var i = 0, ul = this.num; i < ul; i++) {
                    var x = (Math.random() - 0.5) * 500;
                    var y = randn_bm() * 50;
                    var z = randn_bm() * 10 - 100.0;
                    instancePositions.setXYZ(i, x, y, z);
                    delays.setXYZ(i, randn_bm() + 0.5);
                    rotates.setXYZ(i, randn_bm() + 1);
                }

                geometry.addAttribute('instancePosition', instancePositions);
                geometry.addAttribute('delay', delays);
                geometry.addAttribute('rotate', rotates); // Define Material

                var material = new THREE.RawShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: __webpack_require__( /*! ./glsl/fog.vs */ "./src/js/fog/glsl/fog.vs")["default"],
                    fragmentShader: __webpack_require__( /*! ./glsl/fog.fs */ "./src/js/fog/glsl/fog.fs")["default"],
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.NormalBlending
                });
                this.uniforms.tex.value = tex; // Create Object3D

                this.obj = new THREE.Mesh(geometry, material);
                this.obj.position.setZ(-50.0);
            }
        }, {
            key: "render",
            value: function render(time) {
                this.uniforms.time.value += time;
            }
        }]);

        return Fog;
    }();