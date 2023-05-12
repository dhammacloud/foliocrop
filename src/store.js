// E:\yongle-bei-3400\金剛經\11796711_38
import {writable ,get} from 'svelte/store';

export const images=writable([]);
export const frames=writable([]);
export const nimage=writable(0);
export const ratio=writable(1);  // width / naturalWidth
export const totalframe=writable(0);
export const dirty=writable(false);
export const pageframe=writable(3);
export const selectedframe=writable(0);
export const fileprefix=writable('');

export const verticalstrip=writable(5);
export const horizontalstrip=writable(17);

export let defaultframe;


export const setTemplate=(name)=>{
    if (name=='shandong') { //山東圖書館
        defaultframe=function(idx){return [ 1030*(2-idx)+186,139,950,2180]};
        pageframe.set(3);
    } else if (name=='qindinglongcang') {//欽定龍藏
        pageframe.set(2);
        defaultframe=function(idx){return [ 385*(1-idx)+18,148,364,810]};
    }
}

export const caltotalframe=()=>{
    const imgs=get(images);
    let out=0;
    for (let i=0;i<imgs.length;i++) {
        out+= imgs[i].frames?.length||0
    }
    return out;
}

export const resizeframe=(frame,ratio)=>{
    const [x,y,w,h]=frame;
    return [x*ratio,y*ratio,w*ratio,h*ratio];
}
export const selectimage=(n)=>{
    const imgs=get(images);
    const nimg=get(nimage);
    const frms=get(frames);
    const r=get(ratio);

    if (imgs?.length && imgs[nimg]) {
        imgs[nimg].frames=frms.map( f=>resizeframe(f,1/r) ) ;
        dirty.set(true);
    }
    totalframe.set( caltotalframe())
    nimage.set(n);
}
export const genjson=()=>{
    const imgs=get(images);
    const out=[];
    for (let i=0;i<imgs.length;i++) {
        const frames=[];
        for (let j=0;j<imgs[i].frames?.length||0;j++) {
            const [x,y,w,h]=imgs[i].frames[j];
            frames.push([Math.round(x),Math.round(y),Math.round(w),Math.round(h)]);
        }
        out.push(  '{"name":"'+imgs[i].name+'","frames":'+JSON.stringify(frames)+"}" );
    }
    return '['+out.join(',\n')+']';
}