import { bucket, database } from '../../../../db/store';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}) {
 try {
 const {id}=await params;
 if(!/^[0-9a-f-]{36}$/.test(id))return new Response('Not found',{status:404});
 const linked=await database().prepare('SELECT id FROM cats WHERE EXISTS (SELECT 1 FROM json_each(cats.photos) WHERE value=?) LIMIT 1').bind(id).first();
 if(!linked)return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 const file=await bucket().get(id);if(!file)return new Response('Not found',{status:404});
 return new Response(file.body,{headers:{'Content-Type':file.httpMetadata?.contentType||'image/jpeg','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }catch(e){console.error(e);return new Response('Photos unavailable',{status:503});}
}
