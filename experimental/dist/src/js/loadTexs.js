__webpack_require__.r(__webpack_exports__);
var THREE = __webpack_require__( /*! three */ "./node_modules/three/build/three.module.js");

var texLoader = new THREE.TextureLoader();
/* harmony default export */
__webpack_exports__["default"] = (function(imgs, callback) {
    var length = Object.keys(imgs).length;
    var loadedTexs = {};
    var count = 0;

    var _loop = function _loop() {
        var k = key;

        if (imgs.hasOwnProperty(k)) {
            texLoader.load(imgs[k], function(tex) {
                tex.repeat = THREE.RepeatWrapping;
                loadedTexs[k] = tex;
                count++;
                if (count >= length) callback(loadedTexs);
            });
        }
    };

    for (var key in imgs) {
        _loop();
    }
});