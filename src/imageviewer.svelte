<script>
import {images,nimage,frames,ratio,defaultframe,resizeframe} from './store.js'
import Croppers from './croppers.svelte';
import Help from './help.svelte'

let imageurl='',r=1, height=100,width=100;
async function getImageURL () {
    if (!$images?.length) return;
    const item = $images[$nimage];
    if (item.zip) {
        imageurl = URL.createObjectURL(await item.entry.getData(new zip.BlobWriter()));
    } else {
        const imagefile=await item.entry.getFile();
        imageurl= URL.createObjectURL(imagefile);
    }
    setTimeout(()=>{
        const naturalWidth = document.getElementById('image1').naturalWidth;
        height = document.getElementById('image1').height;
        width = document.getElementById('image1').width;
        r=width/naturalWidth;      
        ratio.set(r);
        const frms=($images[$nimage].frames||[defaultframe(0),defaultframe(1), defaultframe(2)]).map(f=>resizeframe(f,r));
        frames.set( frms );
    },50);
}
$: getImageURL($images,$nimage);
$: height=document.getElementById('image1')?.height;
$: width=document.getElementById('image1')?.width;


//x={186*r+ (1000*r) } y={139*r} h={2123*r} w={990*r}
</script>
{#if imageurl}
<div class="croppers"><Croppers {height} {width} {r} start={1}/></div>
<img id='image1' src={imageurl} class="image" alt="noimage"/>
{:else}
<Help/>
{/if}
<style>
.image {height:99vh}
.croppers {position:absolute}
</style>