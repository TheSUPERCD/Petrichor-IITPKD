__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */
__webpack_require__.d(__webpack_exports__, "default", function() {
    return TathvaText;
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

var TathvaText =
    /*#__PURE__*/
    function() {
        function TathvaText() {
            _classCallCheck(this, TathvaText);
        }

        _createClass(TathvaText, [{
            key: "create_text",
            value: function create_text(font) {
                var geometry = new THREE.TextGeometry("What started out as the brainchild\n" + "of a few curious minds, is now an\n" + "emotion carried by those in and out\n" + "of the college.\n" + "Designate yourself as the supporter \n" + "of this techno-managerial festival", {
                    font: font,
                    size: Math.log(innerWidth) * 4.0 + 2.0,
                    height: 0,
                    bevelEnabled: false,
                    curveSegments: 1
                });
                this.obj = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                    color: 0x333333
                }));
                var plane = new THREE.PlaneGeometry(1100, 700, 1, 1);
                this.bgObj = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                }));
            }
        }]);

        return TathvaText;
    }();