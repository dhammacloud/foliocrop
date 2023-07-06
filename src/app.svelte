<script>
import Toolbar from './toolbar.svelte';
import ImageViewer from './imageviewer.svelte';
import FileList from './filelist.svelte';
import Thumbnail from './thumbnail.svelte';
import { showpreview } from './store';
import Preview from './preview.svelte';
</script>

{#if $showpreview}
<Preview/>
{/if}
<table><tr>
    <td class="FileList"><Toolbar/><FileList/></td>
    <td class="Thumbnail"><Thumbnail/></td>    
    <td class="ImageViewer"><ImageViewer/></td>
</tr></table>

<style>
    .ImageViewer {width:80%;vertical-align: top;}
    .FileList {width:15%;vertical-align: top;}
    .Thumbnail { width:5%; vertical-align: top}
</style>