/// <reference path="./helpers/physics.ts" />
/// <reference path="./classes/celestial.ts" />

let objs = new Array<celestial>();

let sunObj = new celestial();
sunObj.mass = 1.989e30;
sunObj.radius = 6.95e8;
sunObj.color = "#FFFF00";
objs.push(sunObj);

let mercuryObj = new celestial();
mercuryObj.parent = sunObj;
mercuryObj.mass = 3.285e23;
mercuryObj.radius = 2.44e6;
mercuryObj.position.y = mercuryObj.parent.radius + 5.791e10;
mercuryObj.color = "#555555";
objs.push(mercuryObj);

let venusObj = new celestial();
venusObj.parent = sunObj;
venusObj.mass = 4.867e24;
venusObj.radius = 6.052e6;
venusObj.position.y = venusObj.parent.radius + 1.082e11;
venusObj.color = "#DDFFAA";
objs.push(venusObj);

let earthObj = new celestial();
earthObj.parent = sunObj;
earthObj.mass = 5.98e24;
earthObj.radius = 6.38e6;
earthObj.position.y = earthObj.parent.radius + 1.496e11;
earthObj.color = "#0033CC";
objs.push(earthObj);

let moonObj = new celestial();
moonObj.parent = earthObj;
moonObj.mass = 7.34767309e22;
moonObj.radius = 1.737e6;
moonObj.position.y = moonObj.parent.radius + 3.844e8;
moonObj.color = "#777777";
objs.push(moonObj);

let ISSObj = new celestial();
ISSObj.parent = moonObj;
ISSObj.radius = 54;
ISSObj.position.y = ISSObj.parent.radius + 1e5;
ISSObj.color = "#00CC77";
objs.push(ISSObj);

let marsObj = new celestial();
marsObj.parent = sunObj;
marsObj.mass = 6.39e23;
marsObj.radius = 3.39e6;
marsObj.position.y = marsObj.parent.radius + 2.279e11;
marsObj.color = "#DD3300";
objs.push(marsObj);

objs.forEach(obj => {
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

    objs.forEach(obj => {
        scene.add(obj.mesh);
        scene.add(obj.dot);
    });

    camera.position.z = marsObj.position.y * 1.5;
    window.addEventListener("mousewheel", event => {
        camera.position.z -= camera.position.z / (event.wheelDelta / 20);
        if (camera.position.z > 1e13) {
            camera.position.z = 1e13;
        } else if (camera.position.z < targetObj.radius * 2) {
            camera.position.z = targetObj.radius * 2;
        }
    });

    let targetObj = ISSObj;

    let targetInterval = (1 / 30) * 1000;
    setInterval(() => {
        for (let i = 0; i < 1; i++) {
            objs.forEach(obj => {
                obj.update();
            });
        }
    }, targetInterval);

    function render() {
        requestAnimationFrame(render);

        objs.forEach(obj => {
            let worldCoords = obj.getWorldCoords();
            obj.mesh.position.x = worldCoords.x;
            obj.mesh.position.y = worldCoords.y;
            obj.dot.position.x = worldCoords.x;
            obj.dot.position.y = worldCoords.y;
        });

        let cameraPos = targetObj.getWorldCoords();

        camera.position.x = cameraPos.x;
        camera.position.y = cameraPos.y;
        camera.lookAt(new THREE.Vector3(cameraPos.x, cameraPos.y, 0));

        renderer.render(scene, camera);
    }
    render();
});
