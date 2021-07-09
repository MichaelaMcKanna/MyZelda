
kaboom({
  global: true,
  fullscreen: true,
  //scale: 0.2,
  debug: true,
  clearColor:[0,0,0,1] 
})

  const playerSpeed = 120
  const slicerSpeed = 120
  const skeletorSpeed = 60

loadRoot('https://i.imgur.com/')
loadSprite('link-left', 'CyRUw2J.png')
loadSprite('link-right', 'qrbLJaf.png')
loadSprite('link-up', 'Rk7U00f.png')
loadSprite('link-down', 'f6YhNGx.png')
loadSprite('left-wall', 'ixzkd8z.png')
loadSprite('right-wall', 'FmDYPkR.png')
loadSprite('top-wall', 'AuObjfa.png')
loadSprite('bottom-wall', 'vWvxjkk.png')
loadSprite('bottom-left-wall','1DWxnG9.png')
loadSprite('bottom-right-wall', 'c7qIgGg.png')
loadSprite('top-left-wall', 'Qvh6NwA.png')
loadSprite('top-right-wall', 'lPLhpMe.png')
loadSprite('top-door','C3sYlSZ.png')
loadSprite('left-door','D77zUy2.png')
loadSprite('fire-pot','fzjynBf.png')
loadSprite('lanterns','Nedlst4.png')
loadSprite('skeletor','WeC81ne.png')
loadSprite('slicer','C0EE8WH.png')
loadSprite('stairs','SVayj9e.png')
loadSprite('bg','9qyt7np.png')
loadSprite('kaboom','Uo9zdGa.png')

scene('game', ({level, score}
  )=>{

  layers(['bg', 'obj', 'ui'], 'obj')  

  const maps = [[
    'fcclcccjce',
    'a        b',
    'a  x     b',
    'a        b',
    'i    m   b',
    'a        b',
    'a    m   b',
    'a  x     b',
    'a        b',
    'hddlddlddg',
], [
    'fcccccccce',
    'a        b',
    'l    y   l',
    'a        b',
    'a        b',
    'a  y     b',
    'a   k    b',
    'l        l',
    'a   y    b',
    'hddddddddg',
]]

  const levelConfig = {
    width: 48,
    height: 48,
    'a': [sprite('left-wall'), scale(0.2), solid(), 'wall'],
    'b': [sprite('right-wall'), scale(0.2), solid(), 'wall'],  
    'c': [sprite('top-wall'), scale(0.2), solid(), 'wall'],
    'd': [sprite('bottom-wall'), scale(0.2), solid(), 'wall'],
    'e': [sprite('top-right-wall'), scale(0.2), solid(), 'wall'],
    'f': [sprite('top-left-wall'), scale(0.2), solid(), 'wall'],
    'g': [sprite('bottom-right-wall'), scale(0.2), solid(), 'wall'],
    'h': [sprite('bottom-left-wall'), scale(0.2), solid(), 'wall'],
    'i': [sprite('left-door'), scale(0.2)],  
    'j': [sprite('top-door'), 'next-level',scale(0.2)],  
    'k': [sprite('stairs'), 'next-level', scale(0.2)],   
    'l': [sprite('lanterns'), solid(),'wall'],  
    'm': [sprite('fire-pot'), scale(0.17), solid()],  
    'x': [sprite('slicer'),'slicer', 'danger', scale(0.27), {dir: -1}],  
    'y': [sprite('skeletor'),'skeletor', 'danger', scale(0.4), {dir: -1, timer:0}], 
}
  addLevel(maps[level],levelConfig)

  add([sprite('bg'), layer('bg')])

  const scoreLabel = add([
    text(0),
    pos(400, 450),
    layer('ui'),
    {
      value: score, 
    },
    scale(4)
  ])

  const player = add([sprite('link-right'), 
  pos(5,190), 
  scale(.5),
  {
    dir: vec2(1,0)
  }
  ])
//keeps the player from walking through solid objects
  player.action( () =>{
    player.resolve()
  })

  player.overlaps('next-level', ()=>{
    go('game',{
      level: (level + 1) % maps.length,
      score: scoreLabel.value
    })
  })


  keyDown('left', ()=>{
    player.changeSprite('link-left')
    player.move(-playerSpeed, 0)
    player.dir = vec2(-1, 0)
    
  })

  keyDown('right', ()=>{
    player.changeSprite('link-right')
    player.move(playerSpeed, 0)
    player.dir = vec2(1, 0)
    
  })

  keyDown('up', ()=>{
    player.changeSprite('link-up')
    player.move(0, -playerSpeed)
    player.dir = vec2(0,-1)

  })

  keyDown('down', ()=>{
    player.changeSprite('link-down')
    player.move(0, playerSpeed)
    player.dir = vec2(0, 1)
  })

  function spawnKaboom(p){
    const obj = add([sprite('kaboom'), pos(p), 'kaboom', scale(.3)])
    wait(1, () =>{
      destroy(obj)
    })
  }

  keyPress('space', ()=>{
    spawnKaboom(player.pos.add(player.dir.scale(48)))
  })

  action('slicer',(s) =>{
    s.move(s.dir * slicerSpeed, 0)
  })

  collides('danger', 'wall', (d) =>{
    d.dir = -d.dir
  })

  collides('danger', 'danger', (d) =>{
    d.dir = -d.dir
  })

  action('skeletor', (s)=>{
    s.move(s.dir * skeletorSpeed, s.dir * skeletorSpeed)
    s.resolve()
    s.timer -= dt()
    if(s.timer <= 0){
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })

  collides('kaboom', 'danger', (k,d)=>{
    wait(1, ()=>{
      destroy(k)
    })
    destroy(d)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
    camShake(4)
  })
  
  player.overlaps('danger', () =>{
    go('lose', {score: scoreLabel.value })
  })

})

scene('lose', ({score}) =>{
  add([
    text(score, 32), 
    origin('center'), 
    pos(width()/2, height()/2)
    ])
})

start('game', 
{level: 0, score:0 }
)