__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */
__webpack_require__.d(__webpack_exports__, "default", function() {
    return Node;
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

var Node =
    /*#__PURE__*/
    function() {
        function Node() {
            _classCallCheck(this, Node);

            this.durationTransform = 0.5;
            this.uniforms = {
                time: {
                    type: 'f',
                    value: 0
                },
                timeTransform: {
                    type: 'f',
                    value: this.durationTransform * 2
                },
                durationTransform: {
                    type: 'f',
                    value: this.durationTransform
                },
                prevIndex: {
                    type: 'f',
                    value: 3
                },
                nextIndex: {
                    type: 'f',
                    value: 0
                }
            };
            this.isTransform = false;
            this.obj;
            this.objWire = null;
            this.objPoints = null;
        }

        _createClass(Node, [{
            key: "createObj",
            value: function createObj(font) {
                // Define Geometry
                var optTextGeometry = {
                    font: font,
                    size: Math.log(innerWidth) * 5.0 + 20.0,
                    height: 0,
                    curveSegments: 1
                };
                var baseGeometries = [new THREE.TextBufferGeometry('4 DAYS', optTextGeometry), new THREE.TextBufferGeometry('60+ EVENTS', optTextGeometry), new THREE.TextBufferGeometry('300K+ WEBSITE HITS', optTextGeometry), new THREE.TextBufferGeometry('1200+ COLLEGES', optTextGeometry), new THREE.TextBufferGeometry('35K+ FOOTFALL', optTextGeometry)];
                var geometry = new THREE.BufferGeometry();
                var maxCount = 0;
                baseGeometries.map(function(g, i) {
                    g.center(); //g.mergeVertices();

                    if (g.attributes.position.count > maxCount) {
                        maxCount = g.attributes.position.count;
                    }
                });
                baseGeometries.map(function(g, i) {
                    var index = i > 0 ? i + 1 : '';

                    if (g.attributes.position.count < maxCount) {
                        var basePosition = g.attributes.position.array;
                        var position = [];
                        var opacity = [];

                        for (var j = 0; j < maxCount * 3; j += 3) {
                            if (j < (maxCount * 3 - basePosition.length) / 2) {
                                position[j] = (Math.random() * 2 - 1) * 200;
                                position[j + 1] = (Math.random() * 2 - 1) * 150;
                                position[j + 2] = (Math.random() * 2 - 1) * 150;
                                opacity[j / 3] = 0;
                            } else if (j >= basePosition.length + (maxCount * 3 - basePosition.length) / 2) {
                                position[j] = (Math.random() * 2 - 1) * 200;
                                position[j + 1] = (Math.random() * 2 - 1) * 150;
                                position[j + 2] = (Math.random() * 2 - 1) * 150;
                                opacity[j / 3] = 0;
                            } else {
                                var k = j - (maxCount * 3 - basePosition.length) / 2;
                                position[j] = g.attributes.position.array[k];
                                position[j + 1] = g.attributes.position.array[k + 1];
                                position[j + 2] = g.attributes.position.array[k + 2];
                                opacity[j / 3] = 1;
                            }
                        }

                        geometry.addAttribute("position".concat(index), new THREE.Float32BufferAttribute(position, 3, 1));
                        geometry.addAttribute("opacity".concat(index), new THREE.Float32BufferAttribute(opacity, 1, 1));
                    } else {
                        var _opacity = [];

                        for (var j = 0; j < maxCount; j++) {
                            _opacity[j] = 1;
                        }

                        geometry.addAttribute("position".concat(index), g.attributes.position);
                        geometry.addAttribute("opacity".concat(index), new THREE.Float32BufferAttribute(_opacity, 1, 1));
                        geometry.addAttribute('normal', g.attributes.normal);
                        geometry.addAttribute("uv", g.attributes.uv);
                        geometry.setIndex(g.index);
                    }
                }); // Define Material

                var material = new THREE.RawShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: __webpack_require__( /*! ./glsl/nodeText.vs */ "./src/js/fog/glsl/nodeText.vs")["default"],
                    fragmentShader: __webpack_require__( /*! ./glsl/nodeText.fs */ "./src/js/fog/glsl/nodeText.fs")["default"],
                    depthWrite: false,
                    transparent: true,
                    flatShading: true
                });
                var materialWire = new THREE.RawShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: __webpack_require__( /*! ./glsl/nodeText.vs */ "./src/js/fog/glsl/nodeText.vs")["default"],
                    fragmentShader: __webpack_require__( /*! ./glsl/nodeTextWire.fs */ "./src/js/fog/glsl/nodeTextWire.fs")["default"],
                    depthWrite: false,
                    transparent: true,
                    wireframe: true
                });
                var materialPoints = new THREE.RawShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: __webpack_require__( /*! ./glsl/nodeTextPoints.vs */ "./src/js/fog/glsl/nodeTextPoints.vs")["default"],
                    fragmentShader: __webpack_require__( /*! ./glsl/nodeTextPoints.fs */ "./src/js/fog/glsl/nodeTextPoints.fs")["default"],
                    depthWrite: false,
                    transparent: true
                }); // Create Object3D

                this.obj = new THREE.Mesh(geometry, material);
                this.objWire = new THREE.Mesh(geometry, materialWire);
                this.objPoints = new THREE.Points(geometry, materialPoints);
            }
        }, {
            key: "transform",
            value: function transform() {
                var max = 4;
                this.isTransform = true;
                this.uniforms.timeTransform.value = 0;
                this.uniforms.prevIndex.value = this.uniforms.prevIndex.value < max ? this.uniforms.prevIndex.value + 1 : 0;
                this.uniforms.nextIndex.value = this.uniforms.nextIndex.value < max ? this.uniforms.nextIndex.value + 1 : 0;
            }
        }, {
            key: "render",
            value: function render(time) {
                this.uniforms.time.value += time;

                if (this.isTransform) {
                    this.uniforms.timeTransform.value = MathEx.clamp(this.uniforms.timeTransform.value + time, 0, this.durationTransform);
                }

                if (this.uniforms.timeTransform.value === this.durationTransform) {
                    this.isTransform = false;
                }
            }
        }]);

        return Node;
    }();