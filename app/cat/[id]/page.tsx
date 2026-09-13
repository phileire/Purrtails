import { database } from '../../../db/store';
import { getChatGPTUser } from '../../chatgpt-auth';
import { notFound } from 'next/navigation';
import CatDetail, {type Cat} from '../../cat-detail';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}) {
 const {id}=await params; let cat;
 try { cat=await database().prepare('SELECT id,owner,names,location,notes,photos,created FROM cats WHERE id=?').bind(id).first<Cat & {owner:string}>(); }
 catch(e){console.error(e);return <main className="shell"><h1>This cat is taking a little nap.</h1><p>We couldn’t load the profile. Please try again shortly.</p><a href="/">Back to journal</a></main>;}
 if(!cat)notFound();
 const user=await getChatGPTUser(); const canEdit=!!user&&user.userId===cat.owner;
 const {owner,...profile}=cat;
 return <CatDetail cat={profile} canEdit={canEdit}/>;
}

