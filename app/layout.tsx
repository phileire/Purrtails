import type { Metadata } from 'next';
import { PawPrint } from 'lucide-react';
import './globals.css';
export const metadata: Metadata={title:'Purrtrail · Cats worth remembering',description:'Keep a little journal of the cats you meet. Photos, names, places and stories.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><div className="site-content">{children}</div><footer className="creator-footer" aria-label="App creators"><PawPrint size={17} aria-hidden="true"/><p>App Created by <strong>Philip and Maxwell the cat</strong></p></footer></body></html>;}
