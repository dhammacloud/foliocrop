<script>
import { get } from 'svelte/store';
import {dirty,selectimage,pageframe,defaultframe, verticalstrip,setTemplate,swiper,
    selectedframe,resizeframe,images, frames,nimage,ratio,totalframe,showpreview}from './store.js'
import {openImageFiles,getFolder,load,save} from './working.js'

const previmage=()=>{
    let n=$nimage;
    n--;
    if (n<0) n=0;
    selectimage(n);
}

const nextimage=()=>{
    let n=$nimage;
    n++;
    if (n>=$images?.length) n=$images?.length-1;
    selectimage(n);
}

function handleFrameMove (evt) {
    const key=evt.key.toLowerCase();
    const alt=evt.altKey;
    const ctrl=evt.ctrlKey;

    let dy=0,dx=0,xinc=0,yinc=0;
    if (key=='arrowup') dy=-1;
    if (key=='arrowdown') dy=1;
    if (key=='arrowleft') dx=-1;
    if (key=='arrowright') dx=1;

    if (alt) {dx*=1;dy*=1;}
    else {//default
        dx*=2;dy*=2;
    }
    if (ctrl) {
        xinc+=dx;
        yinc+=dy
        dx=0,dy=0;
        //dx*=5;dy*=5;
    }
    const frms=$frames;
    const sel=$selectedframe;
    for (let i=0;i<frms.length;i++) {
        let [x,y,w,h]=frms[i];
        x+=dx; y+=dy;
        if ( (1<<i)&sel || !sel) { //move all frame if no selected
            frms[i]=[x,y,w+xinc,h+yinc];
        }
    }
    frames.set(frms);
}
function handlePreviewKeydown(evt){
    const key=evt.key.toLowerCase();
    if (key=="arrowdown" || key=="arrowup" ||key=="arrowright" || key=="arrowleft") {
        if (key=="arrowright") {
            get(swiper).nextItem();
        } else if (key=="arrowleft") {
            get(swiper).prevItem();
        } else if (key=="arrowup") {
            get(swiper).goLast();
        } else {
            get(swiper).goTo(0);
        }
        
        evt.preventDefault();
    }
}
function handleKeydown(evt) {
    const key=evt.key.toLowerCase();
    const alt=evt.altKey;
    if (key=='f5') {//prevent refresh accidently
        evt.preventDefault();
        return;
    } else if (get(swiper)) {
        return handlePreviewKeydown(evt);
    } else if (key=='0'||key=='1'||key=='2'||key=='3') {
        let f=parseInt(key);
        if (f==3) f=4;
        selectedframe.set(f);   
        evt.preventDefault();    
    }


    else if (alt && key=='n' || key=='enter') {nextimage();evt.preventDefault();}
    else if (alt && key=='p') {previmage();;evt.preventDefault();}
    else if (alt && key=='o') {openImageFiles();evt.preventDefault();}
    else if (alt && key=='f'&&!$dirty) {getFolder();;evt.preventDefault();}
    else if (alt && key=='r') {reset();;evt.preventDefault();}
    else if (alt && key=='s'&& $dirty) {save();;evt.preventDefault();}
    else if (alt && key=='l'&& !$dirty) {load();;evt.preventDefault();}
    else if (alt && key=='d') {deleteframe();evt.preventDefault();}
    else if (alt && key=='v') {togglepreview();evt.preventDefault();}

    if (evt.srcElement.nodeName=='INPUT' || evt.srcElement.nodeName=='TEXTAREA'
    || evt.srcElement.nodeName=='BUTTON') return;

    if (key=="arrowdown" || key=="arrowup" ||key=="arrowright" || key=="arrowleft") {
        handleFrameMove(evt);
        evt.preventDefault();
    }
}
const reset=()=>{
    const frms=[];
    const r=$ratio;
    for (let i=0;i<$pageframe;i++) {
        frms.push(defaultframe(i));
    }
    frames.set( frms.map(f=>resizeframe(f,r)) );
}
const deleteframe=()=>{
    const frms=$frames;
    frms.shift();
    frames.set(frms);
    selectedframe.set(0);
}
const toggleNanzang=()=>{
    if ($verticalstrip==6) {
        setTemplate('beizang')    ;
    } else {
        setTemplate('nanzang')
    }
    
}
const togglepreview=()=>{
    showpreview.set(!$showpreview);
}
</script>
<svelte:window on:keydown={handleKeydown}/>
<!-- <button title="Alt O, Open Folder" disabled={$dirty} on:click={getFolder}>📁</button> -->
<!-- <button title="Alt O, Open Image Zip/PDF" disabled={$dirty} on:click={openImageFiles}>📁</button> -->
<button title="Alt S, Save" disabled={!$dirty} on:click={save}>💾</button>
<button title="Alt F, Remove Frame" on:click={deleteframe}>➖</button>
<button title="Alt R, Reset Frame" on:click={reset}>♻️</button>
<!-- <button on:click={previmage}>Prev</button> --> 
<!-- <button title="Alt N" on:click={nextimage}>下個</button> -->
<button title="Alt L, Load Frame Setting" on:click={load}  disabled={$dirty} >📐</button>
<br/>
<button title="Alt V, 預覽" on:click={togglepreview}>👁</button>
<button title="永樂南北藏切換" on:click={toggleNanzang}>{$verticalstrip==6?'南藏':'北藏'}</button>
{$totalframe}