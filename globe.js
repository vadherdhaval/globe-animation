import * as THREE from 'three';
import ThreeGlobe from 'three-globe';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let render,camera, scene, controls, Globe, size;
const globeContainer = document.querySelector('.payment-ecosystem-wrapper');
const fov = window.innerWidth < 560 ? 20 : 45;

init();
initGlobe();
animate();

function init(){
    size = {
        width: window.innerWidth < 767 ? window.innerWidth * 2.5 : window.innerWidth < 992 ? window.innerWidth : window.innerWidth < 1200 ? globeContainer.offsetWidth : globeContainer.offsetWidth - 50,
        height: window.innerWidth < 767 ? globeContainer.offsetHeight : 
                window.innerWidth < 992 ? globeContainer.offsetHeight : 
                window.innerWidth < 1200 && globeContainer.offsetHeight > window.innerHeight ? globeContainer.offsetHeight + 100 : 
                window.innerWidth < 1200 && globeContainer.offsetHeight < window.innerHeight ? globeContainer.offsetHeight :
                globeContainer.offsetHeight + 20 ,
        zPosition: window.innerWidth < 767 ? 900 : window.innerWidth < 992 ? 400 : window.innerWidth < 1200 ? 350 : 280
    }

    render = new THREE.WebGLRenderer({antialias: true, canvas: document.querySelector('.canvas')});
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(size.width,size.height);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232E3A);

    camera = new THREE.PerspectiveCamera(fov, globeContainer.offsetWidth, 0.5, 1000);
    camera.aspect = size.width/size.height;
    camera.updateProjectionMatrix();

    let dLight = new THREE.DirectionalLight('#ffffff',1.5);
    dLight.position.set(0,1,0);
    camera.add(dLight);

    let dLight1 = new THREE.DirectionalLight('#ffffff',1.5);
    dLight1.castShadow = true;
    dLight.position.set(-200,500,200);
    camera.add(dLight1);

    camera.position.z = size.zPosition;
    camera.position.x = 0;
    camera.position.y = 0;

    scene.add(camera);

    controls = new OrbitControls(camera,render.domElement);
    console.log(controls)
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = window.innerWidth < 992 ? false : true;
    controls.rotateSpeed = 0.2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
}

async function initGlobe(){
    const geoDataResponse = await fetch('./custom.geo.json');
    const geoData = await geoDataResponse.json();
    const linesDataResponse = await fetch('./lines.json');
    const linesData = await linesDataResponse.json();
    const mapsDataResponse = await fetch('./map.json');
    const mapsData = await mapsDataResponse.json();
    GlobeDisplay(geoData,linesData,mapsData);
}

function GlobeDisplay(data,lines,map){
    Globe = new ThreeGlobe({
        waitForGlobeReady: true,
        animateIn: true
    })
    .showAtmosphere(false)
    .hexPolygonsData(data.features)
    .hexPolygonResolution(3)
    .hexPolygonColor(() => '#618ee8')
    .hexPolygonMargin(0.7);

    setTimeout(() => {
        Globe.arcsData(lines.pulls)
        .arcColor((e) => {
            return e.to === 'BRA' ? ['#FA4663','#30C2E1'] : ['#30C2E1','#FA4663']
        })
        .arcAltitude((e) => {
            return e.arcAlt
        })
        .arcStroke(1)
        .arcDashLength(0.9)
        .arcDashGap(4)
        .arcDashAnimateTime(2000)
        .arcsTransitionDuration(2000)
        .arcDashInitialGap((e) => e.order * 1)
        .labelsData(map.coordinates)
        .labelColor((e) => {
            return '#30C2E1'
        })
        .labelDotRadius(0.7)
        .labelSize((e) => e.size)
        .labelText("city")
        .labelResolution(6)
        .labelAltitude(0.01)
        .pointsData(map.Map)
        .pointColor((e) => {
            return '#30C2E1'
        })
        .pointsMerge(true)
        .pointAltitude(7)
    },1000)
    Globe.rotateY(-Math.PI*(5/9));
    Globe.rotateZ(-Math.PI/6);

    const globeMaterial = Globe.globeMaterial();
    globeMaterial.color = new THREE.Color('#11171d');

    scene.add(Globe);
}

function onWindowResize(){
    // init();
    // initGlobe();
    // animate();
}

function animate(){
    camera.lookAt(scene.position);
    controls.update();
    render.render(scene,camera);
    requestAnimationFrame(animate);
}