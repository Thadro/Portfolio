const canvas = document.querySelector('canvas.webgl');
const canvasBounding = canvas.getBoundingClientRect()

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import globeMetalnessImageSource from './images/globe/metalness.jpg'
import globeDiffuseImageSource from './images/globe/diffuse.jpg'
import globeNormalImageSource from './images/globe/normal.jpg'
import globeRoughnessImageSource from './images/globe/roughness.jpg'
import cloudsAlphaImageSource from './images/clouds/alpha.jpg'
import starsTextureSource from './images/particles/1.png'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const starsTexture = textureLoader.load(starsTextureSource)
const globeDiffuseTexture = textureLoader.load(globeDiffuseImageSource)
const globeMetalnessTexture = textureLoader.load(globeMetalnessImageSource)
const globeNormalTexture = textureLoader.load(globeNormalImageSource)
const globeRoughnessTexture = textureLoader.load(globeRoughnessImageSource)
const cloudsAlphaTexture = textureLoader.load(cloudsAlphaImageSource)



/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

window.addEventListener('resize', () =>
{
    const canvasBounding = canvas.getBoundingClientRect()

    // Update renderer
    effectComposer.setSize(canvasBounding.width, canvasBounding.height)

    // Update camera
    camera.aspect = canvasBounding.width / canvasBounding.height
    camera.updateProjectionMatrix()

    renderer.setSize(canvasBounding.width, canvasBounding.height)

})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (_event) =>
{
    cursor.x = _event.clientX / sizes.width - 0.5
    cursor.y = _event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(35, canvasBounding.width / canvasBounding.height, 0.1, 100)
camera.position.x = 15
camera.position.y = 0
camera.position.z = 15
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas : canvas })
renderer.setSize(canvasBounding.width, canvasBounding.height)
renderer.render(scene, camera)

const effectComposer = new EffectComposer(renderer)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const unrealPass = new UnrealBloomPass(new THREE.Vector2(sizes.width, sizes.height))
unrealPass.strength = 0.35
unrealPass.radius = 0.1
unrealPass.threshold = 0.1
effectComposer.addPass(unrealPass)

/**
 * Orbit controls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enableZoom = false;

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffcccc, 0.2)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xffcccc, 1)
sunLight.position.x = 20
sunLight.position.y = 5
sunLight.position.z = 0
scene.add(sunLight)

/**
 * Planet
 */

//Globe
const globe = new THREE.Mesh(
    new THREE.SphereGeometry(5,64,64),
    new THREE.MeshStandardMaterial({
        map: globeDiffuseTexture,
        metalnessMap: globeMetalnessTexture,
        roughnessMap: globeRoughnessTexture,
        normalMap: globeNormalTexture
    })
)
globe.position.x = 11
scene.add(globe)

//Cloud
const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(5.01, 64, 64),
    new THREE.MeshStandardMaterial({
        alphaMap: cloudsAlphaTexture,
        transparent: true
    })
)
clouds.position.x = 11
scene.add(clouds)

//Stars
const starsGeometry = new THREE.Geometry()

for (let i=0; i< 100000; i++)
{
    const vertice = new THREE.Vector3(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 1000
    )
    starsGeometry.vertices.push(vertice)
}

//Material stars
const starsMaterial = new THREE.PointsMaterial({
    size: 0.4,
    alphaMap: starsTexture,
    transparent: true,
    depthWrite: false
})


//Points stars
const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)

/**
 * Loop
 */
const loop = () =>
{

    //Eath rotation
    globe.rotation.y += Math.PI*0.0001
    clouds.rotation.y += Math.PI*0.0001

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    effectComposer.render(scene, camera)

    window.requestAnimationFrame(loop)
}

loop()