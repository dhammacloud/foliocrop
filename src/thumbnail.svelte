<script>
import { onMount } from "svelte";
import {ratio,frames,selectedframe,verticalstrip} from './store.js'

let canvas1,canvas2;

const updateThumbnail=()=>{
    const img1=document.getElementById('image1');
    let nframe=-1;
    if ($selectedframe) nframe=Math.log2($selectedframe);
    const frms=$frames;

    let c1=canvas1,c2=canvas2;
    if (swap) {c2=canvas1;c1=canvas2;}

    if (!c1||!c2) return;

    let ctx1 = c1.getContext('2d');
    let ctx2 = c2.getContext('2d');
    ctx1.clearRect(0, 0, canvas1.width, c1.height);
    ctx2.clearRect(0, 0, canvas2.width, c2.height);
    if (!~nframe || !img1) return;
    const r=$ratio;
    const frame=frms[nframe];
    if (!frame) return;
    const vert=$verticalstrip;
    let x=frame[0] ,y=frame[1], w=frame[2]/vert, h=frame[3];
    c1.width=w;c1.height=h;
    ctx1.drawImage(img1,x/r, y/r, w/r, h/r, 0, 0, w, h); 

    x=frame[0]+w*(vert-1); //last strip
    c2.width=w;c2.height=h;
    ctx2.drawImage(img1,x/r, y/r, w/r, h/r, 0, 0, w, h); 
}
onMount(()=>updateThumbnail());
$: updateThumbnail($frames,$selectedframe,swap);
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
    .thumbnails {align-items: center;align-content: center;height:100vh}
</style>