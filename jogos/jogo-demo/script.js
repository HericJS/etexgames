(() => {
  const canvas = document.querySelector('#game-canvas');
  const ctx = canvas?.getContext('2d');
  const scoreLabel = document.querySelector('#score');
  const restartButton = document.querySelector('#restart');
  const W = 800, H = 450, size = 25;
  const keys = new Set();
  const starsStart = [{x:125,y:100},{x:675,y:100},{x:400,y:75},{x:175,y:350},{x:650,y:350}];
  const walls = [{x:250,y:150,w:75,h:25},{x:475,y:250,w:75,h:25},{x:350,y:300,w:25,h:75}];
  let player, stars, collected, won;

  function reset() {
    player = {x:W/2-size/2,y:H/2-size/2,speed:3.1};
    stars = starsStart.map((star) => ({...star,got:false}));
    collected = 0; won = false; updateScore(); draw();
  }
  function updateScore() { if (scoreLabel) scoreLabel.textContent = won ? 'Você venceu! ✦' : `Estrelas: ${collected} / ${stars.length}`; }
  function hit(a,b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#142638'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#ffffff0c'; ctx.lineWidth=1;
    for(let x=0;x<W;x+=25){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    ctx.fillStyle='#254c47'; ctx.fillRect(0,H-28,W,28);
    walls.forEach(w=>{ctx.fillStyle='#596477';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.fillStyle='#8c99ab';ctx.fillRect(w.x,w.y,w.w,5)});
    stars.forEach(s=>{if(s.got)return;ctx.save();ctx.translate(s.x,s.y);ctx.fillStyle='#a7ffeb';ctx.shadowColor='#a7ffeb';ctx.shadowBlur=13;ctx.font='28px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('★',0,0);ctx.restore()});
    ctx.fillStyle='#e5232e';ctx.fillRect(player.x,player.y,size,size);
    ctx.fillStyle='#ffc7a6';ctx.fillRect(player.x+5,player.y+4,15,8);
    ctx.fillStyle='#fff';ctx.fillRect(player.x+7,player.y+6,3,3);ctx.fillRect(player.x+16,player.y+6,3,3);
    if(won){ctx.fillStyle='#07121bd9';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#a7ffeb';ctx.font='bold 38px sans-serif';ctx.fillText('MISSÃO CONCLUÍDA!',W/2,H/2-8);ctx.fillStyle='#fff';ctx.font='18px sans-serif';ctx.fillText('Você coletou todas as estrelas!',W/2,H/2+28)}
  }
  function tick() {
    if(!ctx) return;
    if(!won){
      const old={x:player.x,y:player.y};
      if(keys.has('arrowleft')||keys.has('a'))player.x-=player.speed;
      if(keys.has('arrowright')||keys.has('d'))player.x+=player.speed;
      if(keys.has('arrowup')||keys.has('w'))player.y-=player.speed;
      if(keys.has('arrowdown')||keys.has('s'))player.y+=player.speed;
      player.x=Math.max(0,Math.min(W-size,player.x));player.y=Math.max(0,Math.min(H-size,player.y));
      if(walls.some(w=>hit(player,{x:w.x,y:w.y,w:w.w,h:w.h}))){player.x=old.x;player.y=old.y}
      stars.forEach(s=>{if(!s.got&&hit(player,{x:s.x-11,y:s.y-11,w:22,h:22})){s.got=true;collected++;if(collected===stars.length)won=true;updateScore()}});
      draw();
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown',' '].includes(key))e.preventDefault();keys.add(key)});
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur',()=>keys.clear());
  restartButton?.addEventListener('click',reset);
  const year=document.querySelector('#year');if(year)year.textContent=String(new Date().getFullYear());
  reset();requestAnimationFrame(tick);
})();
