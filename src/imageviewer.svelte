<script>
import {images,nimage,frames,ratio,defaultframe,resizeframe,fileprefix} from './store.js'
import Croppers from './croppers.svelte';
import Help from './help.svelte'
import DropFile from './3rd/dropfile.svelte'
import { openWorkingFile,loadfile } from './working.js';
const onDrop=async files=>{
    let jsonname=false,prefix='',inputfiles=[];

    for (let i=0;i<files.length;i++) {
        const file=files[i];
        if (file.name.endsWith('.zip') || file.name.endsWith('.pdf') || file.name.endsWith('json')) {
            inputfiles.push(file);
        }
        
    }
    //make sure json after zip and pdf
    inputfiles.sort((a,b)=> a.name==b.name?0:(a.name>a.name?-1:1) );
    
    for (let i=0;i<inputfiles.length;i++){
        const file=inputfiles[i];
        console.log(file.name)
        if (file.name.endsWith('.zip') || file.name.endsWith('.pdf') ) {
            await openWorkingFile(file);
            prefix=file.name.replace(/\.[a-z]+$/,'');
        }
        if (file.name.endsWith('.json') ) {
            jsonname=file.name.replace('.json','');
            if (prefix && jsonname && jsonname!==prefix) alert('filename mismatch');
            else await loadfile(file);
        }
        if (prefix&&jsonname) break;
    }
}

let imageurl='',r=1, height=100,width=100;
async function getImageURL () {
    if (!$images?.length) return;
    const item = $images[$nimage];
    if (item.zip) {
        imageurl = URL.createObjectURL(await item.entry.getData(new zip.BlobWriter()));
    } else if (item.pdf) {
        await item.pdf.getPage(item.page).then(async function(page){
            const viewport = page.getViewport({ scale:1});
		    const canvas = document.createElement("canvas")
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({canvasContext: canvas.getContext('2d'),viewport}).promise; 
            imageurl = canvas.toDataURL("image/png");
        });
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
<span class="dropzone"><DropFile onDrop={onDrop} /></span>
{#if imageurl}
<span class="fileprefix">{$fileprefix}</span>
<div class="croppers"><Croppers {height} {width} {r} start={1}/></div>
<img id='image1' src={imageurl} class="image" alt="noimage"/>
{:else}<Help/>
{/if}
<style>
.image {height:99vh}
.croppers {position:absolute}
.fileprefix{color:goldenrod;font-size:125%;position:absolute;right:0px;background:black;padding-left:0.5em;padding-right:0.5em}
.dropzone {position:absolute;width:120px;right:0px;height:70%}
</style>