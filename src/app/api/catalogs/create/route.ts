import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/db';
import { catalog } from '@/db/schema';
import { getCurrentUserFromCookies } from '@/lib/auth';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'catalogs');
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_PDF_TYPE = 'application/pdf';

async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

function generateUniqueFilename(originalName: string): string {
  const ext = originalName.split('.').pop();
  const uuid = crypto.randomUUID();
  return `${uuid}.${ext}`;
}

async function saveFile(file: File, type: 'image' | 'pdf'): Promise<string> {
  const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_PDF_SIZE;
  
  if (file.size > maxSize) {
    throw new Error(`${type === 'image' ? 'Image' : 'PDF'} file size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  if (type === 'image' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Only JPG, PNG, and WebP images are allowed');
  }

  if (type === 'pdf' && file.type !== ALLOWED_PDF_TYPE) {
    throw new Error('Only PDF files are allowed');
  }

  const filename = generateUniqueFilename(file.name);
  const filepath = join(UPLOAD_DIR, filename);
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await writeFile(filepath, buffer);
  
  return `/uploads/catalogs/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromCookies();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureUploadDir();

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const subCategory = formData.get('subCategory') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const itemsJson = formData.get('items') as string;

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const imagePaths: string[] = [];
    const imageFiles = formData.getAll('images') as File[];
    
    if (imageFiles.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 images allowed' }, { status: 400 });
    }

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        try {
          const path = await saveFile(imageFile, 'image');
          imagePaths.push(path);
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }
    }

    let pdfPath: string | null = null;
    const pdfFile = formData.get('pdf') as File;
    
    if (pdfFile && pdfFile.size > 0) {
      try {
        pdfPath = await saveFile(pdfFile, 'pdf');
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    let items = [];
    if (itemsJson) {
      try {
        items = JSON.parse(itemsJson);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid items JSON' }, { status: 400 });
      }
    }

    const newCatalog = await db.insert(catalog)
      .values({
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || null,
        subCategory: subCategory?.trim() || null,
        images: imagePaths,
        pdfUrl: pdfPath,
        items: items,
        isPublic: isPublic,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ 
      success: true, 
      catalog: newCatalog[0] 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Catalog creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create catalog', 
      details: error.message 
    }, { status: 500 });
  }
}
