import { getChatGPTUser } from '../../../chatgpt-auth';
import { database, bucket } from '../../../../db/store';
type SavedCat = { id:string; owner:string; names:string; location:string; notes:string; photos:string; created:string };
async function context(request:Request, params:Promise<{id:string}>) {
 const user=await getChatGPTUser();
 if(!user)return {error:Response.json({error:'Please sign in to edit your cat.'},{status:401})};
 if(request.headers.get('origin')!==new URL(request.url).origin)return {error:Response.json({error:'Invalid request.'},{status:403})};
 const {id}=await params;
 const cat=await database().prepare('SELECT * FROM cats WHERE id=? AND owner=?').bind(id,user.userId).first<SavedCat>();
 if(!cat)return {error:Response.json({error:'This cat is unavailable or does not belong to your journal.'},{status:404})};
 return {cat,user};
}
async function removeFiles(keys:string[]) {
 const results=await Promise.allSettled(keys.map(key=>bucket().delete(key)));
 for(const result of results)if(result.status==='rejected')console.error('Photo cleanup failed',result.reason);
}
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}) {
 try {
 const ctx=await context(request,params);if(ctx.error)return ctx.error;
 const {cat,user}=ctx;
 let data:{location:string;notes:string;photos:string[];originalPhotos:string;originalLocation:string;originalNotes:string};try{data=await request.json() as typeof data;}catch{return Response.json({error:'Invalid update.'},{status:400});}
 if(!data || typeof data.location!=='string' || !data.location.trim() || data.location.trim().length>300 || typeof data.notes!=='string' || data.notes.length>3000 || !Array.isArray(data.photos) || data.photos.length>6 || data.photos.some((p:unknown)=>typeof p!=='string') || new Set(data.photos).size!==data.photos.length) return Response.json({error:'Enter a location (up to 300 characters) and notes (up to 3,000 characters).'}, {status:400});
 const oldPhotos:string[]=JSON.parse(cat.photos);
 if(data.photos.some((p:string)=>!oldPhotos.includes(p)))return Response.json({error:'These photos have changed. Reload the profile and try again.'},{status:409});
 if(data.originalPhotos!==cat.photos || data.originalLocation!==cat.location || data.originalNotes!==cat.notes)return Response.json({error:'This profile changed in another window. Reload it before editing again.'},{status:409});
 const photos=JSON.stringify(data.photos), location=data.location.trim();
 const result=await database().prepare('UPDATE cats SET location=?,notes=?,photos=? WHERE id=? AND owner=? AND photos=? AND location=? AND notes=?').bind(location,data.notes,photos,cat.id,user.userId,cat.photos,cat.location,cat.notes).run();
 if(!result.meta.changes)return Response.json({error:'This profile changed. Reload it before editing again.'},{status:409});
 await removeFiles(oldPhotos.filter(p=>!data.photos.includes(p)));
 return Response.json({id:cat.id,names:cat.names,location,notes:data.notes,photos,created:cat.created});
 }catch(e){console.error(e);return Response.json({error:'Could not save your changes. Please try again.'},{status:503});}
}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}) {
 try {
 const ctx=await context(request,params);if(ctx.error)return ctx.error;
 const {cat,user}=ctx;
 await database().prepare('DELETE FROM cats WHERE id=? AND owner=?').bind(cat.id,user.userId).run();
 await removeFiles(JSON.parse(cat.photos));
 return Response.json({deleted:true});
 }catch(e){console.error(e);return Response.json({error:'Could not delete this cat. Please try again.'},{status:503});}
}

