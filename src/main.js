import initScene from './scene.js'

const container = document.getElementById('canvas-container')
let scene = null

function onLoad(){
  scene = initScene(container)

  // simple pointer parallax
  window.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth) - 0.5
    const y = (e.clientY / window.innerHeight) - 0.5
    if (scene && scene.controls) scene.controls.setPointer(x,y)
  })

  window.addEventListener('resize', ()=>{
    if (scene && scene.resize) scene.resize()
  })
}

if (document.readyState === 'loading'){
  window.addEventListener('DOMContentLoaded', onLoad)
} else onLoad()

export { onLoad }
