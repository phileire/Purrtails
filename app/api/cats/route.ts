import { getChatGPTUser } from '../../chatgpt-auth';
import { database, bucket } from '../../../db/store';
export async function GET() {
 const user = await getChatGPTUser(); if (!user) return Response.json({error:'Please sign in.'},{status:401});
 try { const rows = await database().prepare('SELECT * FROM cats WHERE owner = ? ORDER BY created DESC').bind(user.userId).all(); return Response.json(rows.results); } catch(e) { console.error(e); return Response.json({error:'Your journal is unavailable. Please try again.'},{status:503}); }
}
export async function POST(request: Request) {
 const user = await getChatGPTUser(); if (!user) return Response.json({error:'Please sign in before saving.'},{status:401});
 if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({error:'Invalid request.'},{status:403});
 const keys: string[]=[];
 try {
 if (Number(request.headers.get('content-length')) > 25000000) return Response.json({error:'Photos are too large.'},{status:413});
 const data=await request.formData();
 const names=String(data.get('names')||'').split(',').map(n=>n.trim()).filter(Boolean);
 const location=String(data.get('location')||'').trim(), notes=String(data.get('notes')||'');
 const files=data.getAll('photos').filter((f):f is File=>f instanceof File && f.size>0);
 if (!names.length || names.length>10 || names.some(n=>n.length>80) || !location || location.length>300 || notes.length>3000 || !files.length || files.length>6 || files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>4000000)) return Response.json({error:'Add a name, location and 1–6 JPG, PNG or WebP photos (up to 4 MB each).'}, {status:400});
 const id=crypto.randomUUID();
 for(const file of files) {const key=crypto.randomUUID(); await bucket().put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}}); keys.push(key);}
 await database().prepare('INSERT INTO cats (id,owner,names,location,notes,photos,created) VALUES (?,?,?,?,?,?,?)').bind(id,user.userId,JSON.stringify(names),location,notes,JSON.stringify(keys),new Date().toISOString()).run();
 return Response.json({id});
 }catch(e){console.error(e); await Promise.allSettled(keys.map(k=>bucket().delete(k))); return Response.json({error:'Could not save your cat. Your details are still here; please try again.'},{status:503});}
}
