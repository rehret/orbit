/// <reference path="./models/game-state.ts" />
/// <reference path="./helpers/physics.ts" />
/// <reference path="./models/celestial.ts" />
/// <reference path="./models/ship.ts" />

let state = new GameState();

let sunObj = new celestial();
sunObj.mass = 1.989e30;
sunObj.radius = 6.95e8;
sunObj.color = "#FFFF00";
state.Celestials.push(sunObj);

let mercuryObj = new celestial();
mercuryObj.assignNewParent(sunObj);
mercuryObj.mass = 3.285e23;
mercuryObj.radius = 2.44e6;
mercuryObj.position.y = mercuryObj.parent.radius + 5.791e10;
mercuryObj.color = "#555555";
state.Celestials.push(mercuryObj);

let venusObj = new celestial();
venusObj.assignNewParent(sunObj);
venusObj.mass = 4.867e24;
venusObj.radius = 6.052e6;
venusObj.position.y = venusObj.parent.radius + 1.082e11;
venusObj.color = "#DDFFAA";
state.Celestials.push(venusObj);

let earthObj = new celestial();
earthObj.assignNewParent(sunObj);
earthObj.mass = 5.98e24;
earthObj.radius = 6.38e6;
earthObj.position.y = earthObj.parent.radius + 1.496e11;
earthObj.color = "#0033CC";
state.Celestials.push(earthObj);

let moonObj = new celestial();
moonObj.assignNewParent(earthObj);
moonObj.mass = 7.34767309e22;
moonObj.radius = 1.737e6;
moonObj.position.y = moonObj.parent.radius + 3.844e8;
moonObj.color = "#777777";
state.Celestials.push(moonObj);

let playerObj = new ship();
playerObj.assignNewParent(moonObj);
playerObj.radius = 5;
playerObj.position.y = playerObj.parent.radius + 25e3;
playerObj.color = "#EEEEEE";
state.Player.PlayerObject = playerObj;

let ISSObj = new celestial();
ISSObj.assignNewParent(moonObj);
ISSObj.radius = 54;
ISSObj.position.y = ISSObj.parent.radius + 1e5;
ISSObj.color = "#00CC77";
state.Celestials.push(ISSObj);

let marsObj = new celestial();
marsObj.assignNewParent(sunObj);
marsObj.mass = 6.39e23;
marsObj.radius = 3.39e6;
marsObj.position.y = marsObj.parent.radius + 2.279e11;
marsObj.color = "#DD3300";
state.Celestials.push(marsObj);

state.Celestials.forEach(obj => {
    if (obj.parent !== null) {
        obj.velocity.x = -physics.getCircularOrbitVelocity(obj.parent.mass, obj.getDistance(obj.parent));
    }

    let geometry = new THREE.SphereGeometry(obj.radius, 100, 50);
    let material: THREE.Material;
    if (obj === sunObj) {
        material = new THREE.MeshBasicMaterial({ color: obj.color });
    } else {
        material = new THREE.MeshStandardMaterial({ color: obj.color, roughness: 0.75, metalness: 0 });
    }
    obj.mesh = new THREE.Mesh(geometry, material);
    obj.mesh.position.x = obj.getWorldCoords().x;
    obj.mesh.position.y = obj.getWorldCoords().y;

    let dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    let dotMaterial = new THREE.PointsMaterial({ color: obj.color, size: 1, sizeAttenuation: false });
    obj.dot = new THREE.Points(dotGeometry, dotMaterial);
    obj.dot.position.x = obj.getWorldCoords().x;
    obj.dot.position.y = obj.getWorldCoords().y;
});

playerObj.velocity.x = -physics.getCircularOrbitVelocity(playerObj.parent.mass, playerObj.getDistance(playerObj.parent));
let geometry = new THREE.Geometry();
geometry.vertices.push(
    new THREE.Vector3( 0, 5, 0 ),
    new THREE.Vector3( -3, -5, 0 ),
    new THREE.Vector3( 3, -5, 0 )
);
geometry.faces.push( new THREE.Face3( 0, 1, 2) );
let material = new THREE.MeshBasicMaterial({ color: playerObj.color });
playerObj.mesh = new THREE.Mesh(geometry, material);
playerObj.mesh.position.x = playerObj.getWorldCoords().x;
playerObj.mesh.position.y = playerObj.getWorldCoords().y;
let dotGeometry = new THREE.Geometry();
dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
let dotMaterial = new THREE.PointsMaterial({ color: playerObj.color, size: 1, sizeAttenuation: false });
playerObj.dot = new THREE.Points(dotGeometry, dotMaterial);
playerObj.dot.position.x = playerObj.getWorldCoords().x;
playerObj.dot.position.y = playerObj.getWorldCoords().y;


window.addEventListener("load", () => {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e100);

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.01));
    scene.add(new THREE.PointLight(0xffffff, 1));

    state.Celestials.forEach(obj => {
        scene.add(obj.mesh);
        scene.add(obj.dot);
    });

    scene.add(state.Player.PlayerObject.mesh);
    scene.add(state.Player.PlayerObject.dot);

    state.CameraZ = marsObj.position.y * 1.5;
    window.addEventListener("mousewheel", event => state.CameraZoom(event.wheelDelta));
    window.addEventListener("keydown", event => state.KeyDownHandler(event.keyCode));
    window.addEventListener("keyup", event => state.KeyUpHandler(event.keyCode));

    let targetObj = playerObj;

    let targetInterval = (1 / 30) * 1000;
    setInterval(() => {
        for (let i = 0; i < 1; i++) {
            state.Update();
        }
    }, targetInterval);

    function render() {
        requestAnimationFrame(render);

        let cameraPos = targetObj.getWorldCoords();

        camera.position.x = cameraPos.x;
        camera.position.y = cameraPos.y;
        camera.position.z = state.CameraZ;

        if (camera.position.z < 750) {
            playerObj.mesh.position.z = 0;
        } else {
            playerObj.mesh.position.z = camera.position.z - 750;
        }

        camera.lookAt(new THREE.Vector3(cameraPos.x, cameraPos.y, 0));

        renderer.render(scene, camera);
    }
    render();
});
