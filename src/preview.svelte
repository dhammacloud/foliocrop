<script>
import {images,getImageURL,swiper,verticalstrip,horizontalstrip, showpreview} from './store.js'
import {get} from 'svelte/store'
import Swipe from './3rd/swipe.svelte';
import SwipeItem from './3rd/swipeitem.svelte';
import { onDestroy } from 'svelte';
import {sleep} from 'ptk'


let _swiper,ready=false;
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
let gridheight,gridwidth;

const drawGrid=(ctx,w,h,vs,hs)=>{
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

    for (let i=0;i<imgs.length;i++) {//assuming imgs[0] has no content
        jobs+=imgs[i].frames?.length||0;
    }
    const hs=$horizontalstrip, vs=$verticalstrip;
    for (let i=0;i<imgs.length;i++) {//assuming imgs[0] has no content
        const frames=[];
        for (let j=0;j<imgs[i].frames?.length||0;j++) {
            const [x,y,w,h]=imgs[i].frames[j];
            frames.push([Math.round(x),Math.round(y),Math.round(w),Math.round(h)]);
        }
        const url=await getImageURL(imgs,i);
        const img=new Image();
        img.src=url;
        await sleep(30); //wait for image to rady
        var canvas = document.createElement('CANVAS');

        let ctx = canvas.getContext('2d');
        for (let i=0;i<frames.length;i++) {
            const w=280;
            const h=w*2.2;
            canvas.width=w;
            canvas.height=h;
            gridheight=h;
            gridwidth=w;
            ctx.drawImage(img, frames[i][0],frames[i][1],frames[i][2],frames[i][3], 0,0,w,h);
            drawGrid(ctx,w,h,vs,hs);
            canvas.toBlob(function(b){
                previewimages.push(URL.createObjectURL(b));
                finished++;
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
$: setswiper(_swiper)
$: ready=jobs==finished;
$: genpreview();
//{previewimages[previewimages.length-idx-1]
</script>
<div class="popup">
    {#if ready}
    <div class="message">左：下一折<br/>右：上一折<br/>上：第一折，<br/>下：最末折<br/>鼠輪：翻頁</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={close} class="closebtn">✖️</span>
    <div class="swipe-holder" on:wheel={mousewheel} >
    <Swipe bind:this={_swiper} {...swipeConfig} defaultIndex={previewimages.length-1}>
        {#each previewimages as image,idx}
        <SwipeItem><img alt='no' class="swipe" src={previewimages[previewimages.length-idx-1]}/></SwipeItem>
        {/each}    
    </Swipe>
    <!-- <PreviewGrid left={gridleft} height={gridheight} width={gridwidth}/> -->
    </div>
    <!-- <img alt='no' src={previewimages[1]}/>
    <img alt='no' src={previewimages[2]}/> -->
    {:else}
    Creating Preview Images  {Math.round(finished*100/jobs)}%
    {/if}
</div>
<style>
.swipe-holder{
    z-index:99;
    height: 100vh;
    /* width: 50%;  */
}
.message {position:absolute;height: 1px;}
.swipe {position:absolute;top:50%;left:50%;transform: translate(-50%,-50%); }
.closebtn{position:absolute;right:0em;z-index:999;cursor:pointer}
</style>