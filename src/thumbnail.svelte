<script>
import { onMount } from "svelte";
import {ratio,frames,selectedframe,verticalstrip,fileprefix} from './store.js'

let canvas1,canvas2;

const updateThumbnail=()=>{
    const img1=document.getElementById('image1');
    let nframe=-1;
    if ($selectedframe) nframe=Math.log2($selectedframe);
    const frms=$frames;
    if (!canvas1||!canvas2) return;
    let ctx1 = canvas1.getContext('2d');
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

    let ctx2=canvas2.getContext('2d');
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    if (!~nframe || !img1) return;

    const r=$ratio;

    const frame=frms[nframe];
    if (!frame) return;
    const vert=$verticalstrip;

    let x=frame[0] ,y=frame[1], w=frame[2]/vert, h=frame[3],w2=w*0.5, h2=h*0.5;
    canvas1.width=w2;canvas1.height=h2;
    ctx1.drawImage(img1,x/r, y/r, w/r, h/r, 0, 0, w2, h2); 

    x=frame[0]+w*(vert-1); //last strip
    canvas2.width=w2;canvas2.height=h2;
    ctx2.drawImage(img1,x/r, y/r, w/r, h/r, 0, 0, w2, h2); 
}
onMount(()=>updateThumbnail());
$: updateThumbnail($frames);

</script>
{$fileprefix}
<div class="thumbnails">
<canvas bind:this={canvas2}></canvas><br/><canvas bind:this={canvas1}></canvas>
</div>


<style>
    .thumbnails {width:80px;align-items: center;}
    
</style>