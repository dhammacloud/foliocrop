<script>
import {images,nimage,fileprefix,getImageURL,activeimageurl,rotateangle,showpreview} from './store.js'
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

let r=1, height=2000,width=3000;

$: getImageURL($images,$nimage,activeimageurl);
// $: height=document.getElementById('image1')?.height||height , $activeimageurl;
// $: width=document.getElementById('image1')?.width||width , $activeimageurl;
//x={186*r+ (1000*r) } y={139*r} h={2123*r} w={990*r}
</script>
<span class="dropzone"><DropFile onDrop={onDrop} /></span>
{#if $activeimageurl}
{#key $activeimageurl,$rotateangle}
<span class="fileprefix">{$fileprefix}</span>
{#if !$showpreview}
<div class="croppers"><Croppers {height} {width} {r} start={1}/></div>
{/if}
<img id='image1' src={$activeimageurl} class="image" alt="noimage" style={"transform: rotate("+($rotateangle/60)+"deg);"}/>
{/key}
{:else}<Help/>
{/if}
<style>
.image {height:99vh;z-index:1}
.croppers {position:absolute}
.fileprefix{color:goldenrod;font-size:125%;position:absolute;right:0px;background:black;padding-left:0.5em;padding-right:0.5em}
.dropzone {position:absolute;width:120px;right:0px;height:70%}
</style>