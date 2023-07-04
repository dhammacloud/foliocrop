<script>
import {images,nimage,fileprefix,getImageURL,activeimageurl} from './store.js'
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

let r=1, height=100,width=100;

$: getImageURL($images,$nimage,activeimageurl);
$: height=document.getElementById('image1')?.height , $activeimageurl;
$: width=document.getElementById('image1')?.width , $activeimageurl;

//x={186*r+ (1000*r) } y={139*r} h={2123*r} w={990*r}
</script>
<span class="dropzone"><DropFile onDrop={onDrop} /></span>
{#if $activeimageurl}
{#key $activeimageurl}
<span class="fileprefix">{$fileprefix}</span>
<div class="croppers"><Croppers {height} {width} {r} start={1}/></div>
<img id='image1' src={$activeimageurl} class="image" alt="noimage"/>
{/key}
{:else}<Help/>
{/if}
<style>
.image {height:99vh}
.croppers {position:absolute}
.fileprefix{color:goldenrod;font-size:125%;position:absolute;right:0px;background:black;padding-left:0.5em;padding-right:0.5em}
.dropzone {position:absolute;width:120px;right:0px;height:70%}
</style>