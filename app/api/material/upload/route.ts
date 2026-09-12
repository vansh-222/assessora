// app/api/material/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { extractText } from '@/lib/parsers';
import { analyzeMaterial } from '@/lib/analyze';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let text: string;
    let sourceFileName: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const pastedText = formData.get('text') as string | null;

      if (file && file.size > 0) {
        const result = await extractText(file);
        text = result.text;
        sourceFileName = file.name;
      } else if (pastedText && pastedText.trim()) {
        const result = await extractText(pastedText.trim(), 'paste');
        text = result.text;
      } else {
        return NextResponse.json({ error: 'No content provided.' }, { status: 400 });
      }
    } else {
      const body = await req.json();
      const pastedText = body.text as string;
      if (!pastedText?.trim()) {
        return NextResponse.json({ error: 'No content provided.' }, { status: 400 });
      }
      const result = await extractText(pastedText.trim(), 'paste');
      text = result.text;
    }

    // Analyze the material
    const analysis = await analyzeMaterial(text);

    return NextResponse.json({
      analysis,
      sourceFileName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to process material';
    console.error('Material upload error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
