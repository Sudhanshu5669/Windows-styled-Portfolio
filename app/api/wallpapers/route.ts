import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const wallpaperDir = path.join(process.cwd(), 'public/images/wallpapers');
  
  try {
    const files = fs.readdirSync(wallpaperDir);
    const wallpapers = files
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .map(file => ({
        name: file.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
        path: `/images/wallpapers/${file}`
      }));

    return NextResponse.json(wallpapers);
  } catch (error) {
    return NextResponse.json([]);
  }
}