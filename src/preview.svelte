<script>
import {images,getImageURL,swiper,verticalstrip,horizontalstrip, showpreview, togglemark} from './store.js'
import {get} from 'svelte/store'
import Swipe from './3rd/swipe.svelte';
import SwipeItem from './3rd/swipeitem.svelte';
import { onDestroy } from 'svelte';
import {sleep} from 'ptk'

let defaultIndex=0;
let _swiper,ready=false;
let items=[];// preview image to source image index
const swipeConfig = {
    autoplay: false,
    delay: 0,
    showIndicators: true,
    transitionDuration: 250
};
onDestroy(()=>{
    swiper.set(null);
});
let jobs=0,finished=0;
let previewimages=[];

const drawGrid=(ctx,w,h,vs,hs,name,nth)=>{
    ctx.lineWidth=1;
    ctx.beginPath();
    const unitw=w/vs;
    const unith=h/hs;

    ctx.strokeStyle="rgba(0,0,0,0.5)"
    for (let i=0;i<=vs;i++) {
        ctx.moveTo(i*unitw,0);
        ctx.lineTo(i*unitw,h);
    }
    ctx.strokeStyle="rgba(255,0,0,0.5)"
    for (let i=0;i<=hs;i++) {
        ctx.moveTo(0,i*unith);
        ctx.lineTo(w,i*unith);
    }
    ctx.stroke();
}
const genpreview=async ()=>{
    const imgs=get(images);
    previewimages=[];
    jobs=0,finished=0;
    items=[];
    for (let i=0;i<imgs.length;i++) {//assuming imgs[0] has no content
        jobs+=imgs[i].frames?.length||0;
    }
    const hs=$horizontalstrip, vs=$verticalstrip;
    for (let i=0;i<imgs.length;i++) {//assuming imgs[0] has no content
        const frames=[];
        if (!imgs[i].frames?.length) continue;
        for (let j=0;j<imgs[i].frames.length||0;j++) {
            const [x,y,w,h]=imgs[i].frames[j];
            frames.push([Math.round(x),Math.round(y),Math.round(w),Math.round(h)]);
        }
        
        const url=await getImageURL(imgs,i);
        const img=new Image();
        img.src=url;
        await sleep(100); //wait for image to rady

        const canvas = document.createElement('CANVAS');
        canvas.width=img.naturalWidth;
        canvas.height=img.naturalHeight;
        const rotate=imgs[i].rotate||0;
        let ctx = canvas.getContext('2d');

        if (rotate) {
            ctx.save();
            ctx.translate(canvas.width/2,canvas.height/2);
            ctx.rotate( rotate * Math.PI / (180*60) ); 
            ctx.translate(-canvas.width/2,-canvas.height/2);
            ctx.drawImage(img, 0 ,0,canvas.width,canvas.height);
            ctx.restore();
        }  else {
            ctx.drawImage(img, 0 ,0,canvas.width,canvas.height);
        }
        
        for (let j=0;j<frames.length;j++) {
            const canvas1 = document.createElement('CANVAS');
            const ctx1=canvas1.getContext('2d');
            const w=250;
            const h=w*2.2;
            canvas1.width=w;
            canvas1.height=h;
            items.push(i);
            ctx1.drawImage(canvas, frames[j][0],frames[j][1],frames[j][2],frames[j][3], 0,0,canvas1.width,canvas1.height);
            drawGrid(ctx1,w,h,vs,hs,imgs[i].name,j+1);
            canvas1.toBlob(function(b){
                previewimages.push(URL.createObjectURL(b));
                finished++;
                defaultIndex=previewimages.length-1;
            });
        }
    }
    
}
const mousewheel=(e)=>{
	if (e.ctrlKey ) return;
    hidepunc=true;
	if (e.deltaY>0) {
		_swiper.prevItem();
	} else {
        _swiper.nextItem();
	}
	e.preventDefault();
}
const setswiper=ele=>{
    swiper.set(ele);
}
const close=()=>{
    showpreview.set(false)
}
const swipeChanged=(obj)=>{
    const {active_item}=obj.detail;
    defaultIndex
}

$: setswiper(_swiper)
$: ready=jobs==finished;
$: genpreview();

//{previewimages[previewimages.length-idx-1]
</script>
<div class="popup">
    {#if ready}
    <div class="message">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="bigmark" class:markon={$images[items[previewimages.length-defaultIndex-1]].mark} 
    on:click={()=>togglemark(items[previewimages.length-defaultIndex-1])}>
    {$images[items[previewimages.length-defaultIndex-1]].mark?'●':'○'}</span>
        
        <br/>左：下一折<br/>右：上一折<br/>上：第一折，<br/>下：最末折<br/>鼠輪：翻頁
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={close} class="closebtn">✖️</span>
    <div class="swipe-holder" on:wheel={mousewheel} on:change={swipeChanged}>
    <Swipe bind:this={_swiper} {...swipeConfig} {defaultIndex}>
        {#each previewimages as image,idx}
        <SwipeItem><img alt='no' class="swipe" src={previewimages[previewimages.length-idx-1]}/></SwipeItem>
        {/each}    
    </Swipe>
    </div>
    {:else}
    Creating Preview Images  {Math.round(finished*100/jobs)}%
    {/if}
</div>
<style>
.swipe-holder{
    z-index:999;
    height: 100vh;
    /* width: 50%;  */
}
.message {position:absolute;height: 1px;z-index:299}
.swipe {position:absolute;top:50%;left:50%;transform: translate(-50%,-50%); }
.closebtn{position:absolute;right:0em;z-index:999;cursor:pointer}
</style>