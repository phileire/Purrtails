import { database } from '../../../db/store';
import { notFound } from 'next/navigation';
import CatDetail from '../../cat-detail';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}) {const {id}=await params; let cat; try { cat=await database().prepare('SELECT id,names,location,notes,photos,created FROM cats WHERE id=?').bind(id).first(); }catch(e){console.error(e);return <main className="shell"><h1>This cat is taking a little nap.</h1><p>We couldn’t load the profile. Please try again shortly.</p><a href="/">Back to journal</a></main>;} if(!cat)notFound(); return <CatDetail cat={cat}/>;}
