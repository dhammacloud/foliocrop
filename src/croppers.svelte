<script>
import Cropper from './cropper.svelte';
import {selectedframe,frames,verticalstrip,horizontalstrip} from './store.js'

export let height = 2000 
export let width =  2000

export let start='';


export let r=1;

let expanding = null
let startx,starty,initial={},nframe=0;
$: theframes=$frames||[];
function startExpand(type, _nframe, event) {
    nframe=_nframe;
	expanding = type
	startx = event.pageX;
	starty = event.pageY;
    //theframes=$frames;
    const [x,y,w,h]=theframes[nframe];
	initial = { x, y , w, h }
}	
let svg1;
const insideSvg=(ele)=>{
    if (!svg1)return;
    while (ele) {
        if (ele==document.body || ele==svg1)break;
        ele=ele.parentElement;
    }
    return ele==svg1;
}
function stopExpand(evt) {   
    expanding = null
    const sel=$selectedframe;
    if (!insideSvg(evt.srcElement)) return;
    const deltax=evt.pageX-startx;
    const deltay=evt.pageY-starty;
    const mask=1<<nframe;
    if (Math.abs(deltax) + Math.abs(deltay) <5 && sel & mask) {
        selectedframe.set(0);
    } else {
        selectedframe.set(mask);
    }
    frames.set(theframes);
    startx = 0, starty=0;
}

function expand(event) {
    if (!expanding) return;
    
    let [x,y,w,h]=theframes[nframe];
    if (expanding == 'left') {
        const delta = startx-event.pageX
        x = initial.x - delta
        //w = initial.w + delta do not change the width
    } else if (expanding == 'right') {
        const delta = event.pageX-startx
        w = initial.w + delta
    } else if (expanding == 'top') {
        const delta = starty-event.pageY
        y = initial.y - delta;
    } else if (expanding =='bottom') {
        const delta = event.pageY-starty
        h = initial.h + delta
    } else if (expanding =='middle') {
        const deltax=event.pageX-startx;
        const deltay=event.pageY-starty;
        x = initial.x + deltax;
        y = initial.y + deltay;
    }
    theframes[nframe]=[x,y,w,h];
}
</script>

<svelte:window on:mouseup={stopExpand} />
<div style="position:absolute;z-index:199">
{#key theframes}
<svg  bind:this={svg1} viewBox={"0 0 "+(width)+' '+height} {height} {width} 
    on:mousemove={expand} class:expanding>
    {#each theframes as frame,idx}
    <Cropper x={frame[0]} y={frame[1]} w={frame[2]} h={frame[3]} bind:expanding selected={$selectedframe & ( 1<<idx)}
    verticalstrip={$verticalstrip} horizontalstrip={$horizontalstrip} {r} nframe={idx} {startExpand} caption={start+idx} frameidx={idx}/>
    {/each}
</svg>
{/key}
</div>

<style>
.expanding {
	fill:rgba(128,128,128,0.3);
}
</style>