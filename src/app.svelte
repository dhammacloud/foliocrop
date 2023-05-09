<script>
import Toolbar from './toolbar.svelte';
import ImageViewer from './imageviewer.svelte';
import FileList from './filelist.svelte';
import Thumbnail from './thumbnail.svelte';
</script>

<table>
    <tr>
        <td class="FileList">
            <Toolbar/>
            <FileList/></td>
            
        <td class="ImageViewer">
            <ImageViewer/>
        </td>
        <td class="Thumbnail"><Thumbnail/></td>
        
    </tr>
</table>

<style>
    .ImageViewer {width:80%;vertical-align: top;}
    .FileList {width:18% ;vertical-align: top;}
    .Thumbnail {width:2% ;vertical-align: top;}
</style>