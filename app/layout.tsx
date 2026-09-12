import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Purrtrail · Cats worth remembering',description:'Keep a little journal of the cats you meet. Photos, names, places and stories.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
