<script>
import { onMount } from "svelte";
import {ratio,frames,selectedframe,verticalstrip, rotateangle} from './store.js'
import {get} from 'svelte/store'
let canvas1,canvas2, timer;

const updateThumbnail=()=>{
    const img1=document.getElementById('image1');
    if (!img1) return;
    let c1=canvas1,c2=canvas2;
    if (swap) {c2=canvas1;c1=canvas2;}
    if (!c1||!c2) return;
    let nframe=-1;
    if ($selectedframe) nframe=Math.log2($selectedframe);
    const frms=$frames;
    const canvas=document.createElement('canvas')
    const ctx=canvas.getContext('2d');;
    canvas.width=img1.naturalWidth;
    canvas.height=img1.naturalHeight;

    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2)
    ctx.rotate( get(rotateangle) * Math.PI / (180*60));
    ctx.translate(-canvas.width/2,-canvas.height/2)
    ctx.drawImage(img1,0,0);
    
    ctx.restore()

    let ctx1 = c1.getContext('2d');
    let ctx2 = c2.getContext('2d');

    clearTimeout(timer)
    timer=setTimeout(()=>{
        ctx1.clearRect(0, 0, canvas1.width, c1.height);
        ctx2.clearRect(0, 0, canvas2.width, c2.height);
        if (!~nframe) return;

        setTimeout(()=>{
            const r=$ratio;
            const frame=frms[nframe];
            if (!frame) return;
            const vert=$verticalstrip;
            let x=frame[0] ,y=frame[1], w=frame[2]/vert, h=frame[3];
            c1.width=w;c1.height=h;
            ctx1.drawImage(canvas,x/r, y/r, w/r, h/r, 0, 0, w, h); 
            
            x=frame[0]+w*(vert-1); //last strip
            c2.width=w;c2.height=h;
            ctx2.drawImage(canvas,x/r, y/r, w/r, h/r, 0, 0, w, h); 
            
        })
    },100)

}
onMount(()=>updateThumbnail());
$: updateThumbnail($frames,$selectedframe,swap,$rotateangle);
let swap=0;
const swapthumbnail=()=>{
    swap=1-swap;
}
</script>

<div class="thumbnails">
<canvas  bind:this={canvas2}  on:click={swapthumbnail}></canvas><br/><canvas bind:this={canvas1}></canvas>
</div>


<style>
    canvas {width:100%}
    .thumbnails {align-items: center;align-content: center;height:100vh;z-index:299;margin-right:1em}
</style>