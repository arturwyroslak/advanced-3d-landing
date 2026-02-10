import * as THREE from 'three'
import { gsap } from 'gsap'

export default function initScene(container){
  if (!container) {
    console.warn('No container for scene')
    return null
  }

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x071025)

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  container.appendChild(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0,0,4)

  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambient)
  const dir = new THREE.DirectionalLight(0xffffff, 0.8)
  dir.position.set(5,5,5)
  scene.add(dir)

  // geometry
  const geo = new THREE.TorusKnotGeometry(0.8,0.28,256,32)
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x7c3aed),
    metalness: 0.6,
    roughness: 0.2,
    emissive: new THREE.Color(0x1b0333),
    emissiveIntensity: 0.3
  })
  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)

  // small orbit-like control abstraction
  const controls = createControls(camera, mesh)

  // entrance animation
  gsap.fromTo(mesh.rotation, { y: 0 }, { y: Math.PI * 2, duration: 6, repeat: -1, ease: 'none' })
  gsap.to(mesh.scale, { x:1.03, y:1.03, z:1.03, duration:2, yoyo:true, repeat:-1, ease:'sine.inOut' })

  // render loop
  let running = true
  function render(){
    if (!running) return
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  function resize(){
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w,h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  // return public API
  return { scene, camera, renderer, mesh, resize, controls }
}

function createControls(cam, mesh){
  let pointerX = 0, pointerY = 0

  function setPointer(x,y){
    pointerX = x
    pointerY = y
  }

  function update(){
    // camera subtle follow
    cam.position.x += (pointerX * 1.5 - cam.position.x) * 0.05
    cam.position.y += (-pointerY * 1.0 - cam.position.y) * 0.05
    cameraLookAtSmooth(cam, mesh.position)

    // mesh subtle rotation based on pointer
    mesh.rotation.x += (-pointerY * 0.5 - mesh.rotation.x) * 0.05
    mesh.rotation.z += (pointerX * 0.5 - mesh.rotation.z) * 0.03
  }

  return { setPointer, update }
}

function cameraLookAtSmooth(cam, target){
  const cur = new THREE.Vector3()
  cam.getWorldDirection(cur)
  const desired = target.clone().sub(cam.position)
  desired.multiplyScalar(0.08)
  cam.lookAt(target.x, target.y, target.z)
}
