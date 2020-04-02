var THREE = __webpack_require__( /*! three */ "./node_modules/three/build/three.module.js");

var OrbitControls = __webpack_require__( /*! three-orbitcontrols */ "./node_modules/three-orbitcontrols/OrbitControls.js");

var debounce = __webpack_require__( /*! js-util/debounce */ "./node_modules/js-util/debounce.js");

var NodeText = __webpack_require__( /*! ./NodeText */ "./src/js/fog/NodeText.js")["default"];

var BackgroundSphere = __webpack_require__( /*! ./BackgroundSphere */ "./src/js/fog/BackgroundSphere.js")["default"];

var TathvaText = __webpack_require__( /*! ./TathvaText */ "./src/js/fog/TathvaText.js")["default"];

var DescText = __webpack_require__( /*! ./DescText */ "./src/js/fog/DescText.js")["default"];

var loadTexs = __webpack_require__( /*! ../loadTexs */ "./src/js/loadTexs.js")["default"];

var Fog = __webpack_require__( /*! ./Fog */ "./src/js/fog/Fog.js")["default"]; // ==========
// Define common variables
//


var resolution = new THREE.Vector2();
var canvas = document.getElementById('canvas-webgl');
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas
});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var clock = new THREE.Clock();
var loader = new THREE.FontLoader();
camera.far = 50000;
camera.setFocalLength(27); // ==========
// Define unique variables
//

var texsSrc = {
    fog: './img/fog/fog.png'
};
var fog = new Fog();
var tathvaText = new TathvaText();
var descText = new DescText();
var nodeText = new NodeText();
var bg = new BackgroundSphere(); //======Camera movement==========

var scale = 5;
var mouseX = 0;
var mouseY = 0;
camera.rotation.order = "YXZ";

function mouseMove(event) {
    if (event.clientX) {
        mouseX = -(event.clientX / renderer.domElement.clientWidth) * 2 + 1;
        mouseY = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    }

    if (event.touches) {
        var touch = event.touches.item(0);
        mouseX = -(touch.clientX / renderer.domElement.clientWidth) * 2 + 1;
        mouseY = 0;
    } // console.log(camera.rotation.x + " " + camera.rotation.y);


    camera.rotation.x = mouseY / scale;
    camera.rotation.y = mouseX / scale;
} // ==========
// Define functions
//


var render = function render() {
    var time = clock.getDelta();
    fog.render(time);
    nodeText.render(time);
    tathvaText.render(time);
    renderer.render(scene, camera);
};

var renderLoop = function renderLoop() {
    if (window.pageYOffset < 100) {
        render();
        requestAnimationFrame(renderLoop);
    } else {
        window.setTimeout(renderLoop, 1000);
    }
};

var resizeCamera = function resizeCamera() {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
};

var resizeWindow = function resizeWindow() {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(resolution.x, resolution.y);
};

var on = function on() {
    window.addEventListener('resize', debounce(resizeWindow, 1000));
    window.setInterval(function() {
        nodeText.transform();
    }, 2000);
    window.addEventListener('click', function() {
        nodeText.transform();
    });
}; // ==========
// Initialize
//


var init = function init() {
    var light = new THREE.PointLight(0xffffff, 0.2);
    light.position.z = 1000;
    light.position.x = 800; // scene.add(light);

    loadTexs(texsSrc, function(loadedTexs) {
        fog.createObj(loadedTexs.fog);
        scene.add(fog.obj);
        renderer.setClearColor(0xffeecc, 1.0);
        camera.position.set(0, 0, 1000);
        camera.lookAt(new THREE.Vector3());
        clock.start();
        document.addEventListener('mousemove', mouseMove, false);
        loader.load('./font/Lato.json', function(font) {
            nodeText.createObj(font);
            var elems = [nodeText.obj];
            elems.map(function(e, i) {
                scene.add(e);

                if (innerWidth / innerHeight > 4 / 3) {
                    var box = new THREE.Box3().setFromObject(e);
                    var t = new THREE.Vector3();
                    box.getCenter(t);
                    var x = -innerWidth * 0.59;
                    var y = -innerHeight * 0.2;
                    e.position.set(x, y, -15);
                } else {
                    var vFOV = THREE.Math.degToRad(camera.fov); // convert vertical fov to radians

                    var dist = distanceVector(camera.position, e.position);
                    var height = 2 * Math.tan(vFOV / 2) * dist; // visible height

                    var box = new THREE.Box3().setFromObject(e);

                    var _y = -height * 0.3;

                    e.position.set(-box.getCenter().x, _y, -15);
                }
            });
        });
        var loader1 = new THREE.FontLoader();
        loader1.load('./font/Lato.json', function(font) {
            tathvaText.create_text(font);
            scene.add(tathvaText.obj);
            descText.create_text(font);
            scene.add(descText.obj);

            if (innerWidth / innerHeight > 4 / 3) {
                var x_pos = innerWidth / 1.2;
                var y_pos = innerHeight / 20.0;
                tathvaText.obj.position.set(-x_pos, y_pos, 20.0);
                tathvaText.obj.rotateY(0.1);
                descText.obj.rotateY(-0.1);
                descText.obj.position.x = innerWidth / 3.5 - 150.0;
                descText.obj.position.y = innerHeight / 3.5 - 10.0;
                descText.obj.position.z = 2;
            } else {
                {
                    var vFOV = THREE.Math.degToRad(camera.fov); // convert vertical fov to radians

                    var dist = distanceVector(camera.position, tathvaText.obj.position);
                    var height = 2 * Math.tan(vFOV / 2) * dist; // visible height

                    var tathvaTextBox = new THREE.Box3().setFromObject(tathvaText.obj);

                    var _x_pos = 0.0 - tathvaTextBox.getCenter().x;

                    var _y_pos = 0.0 - tathvaTextBox.getCenter().y + height * 0.25;

                    tathvaText.obj.position.set(_x_pos, _y_pos, 20.0);
                } {
                    var vFOV = THREE.Math.degToRad(camera.fov); // convert vertical fov to radians

                    var dist = distanceVector(camera.position, descText.obj.position);
                    var height = 2 * Math.tan(vFOV / 2) * dist; // visible height

                    var descTextBox = new THREE.Box3().setFromObject(descText.obj);

                    var _x_pos2 = 0.0 - descTextBox.getCenter().x;

                    var _y_pos2 = 0.0 - descTextBox.getCenter().y + height * 0.03;

                    descText.obj.position.set(_x_pos2, _y_pos2, 20.0);
                }
            }
        });
        on();
        resizeWindow();
        renderLoop();
    });
};

function distanceVector(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

init();