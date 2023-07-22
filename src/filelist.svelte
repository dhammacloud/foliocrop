<script>
import {nimage,images,selectimage,togglemark} from './store.js'

</script>
<div class="filelist">

{#key $nimage}
{#each $images as image,idx}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class:selected={idx==$nimage} on:click={()=>selectimage(idx)}>
    <span class:done={image.frames}>{image.name}</span>     
    <span class="mark" class:markon={image.mark} on:click={()=>togglemark(idx)}>{image.mark?'●':'○'}</span>
    <span class="framecount">{image.frames?.length||''}</span>

</div>
{/each}
{/key}
</div>
<style>
.framecount {font-weight: bold;border-bottom:1px dotted silver}
.done {color:yellowgreen}
.filelist {cursor:pointer;overflow-y: auto; height:85vh;}
.selected {background-color: rgb(72, 72, 72);}

</style>