import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const analyticsFilePath = path.join(process.cwd(), 'analytics.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceName, androidVersion, formData } = body;
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

    let analyticsData = [];
    try {
      const fileContent = await fs.readFile(analyticsFilePath, 'utf-8');
      analyticsData = JSON.parse(fileContent);
    } catch {
      // If the file doesn't exist, it will be created.
    }

    analyticsData.push({
      timestamp: new Date().toISOString(),
      ip,
      deviceName,
      androidVersion,
      formData,
    });

    await fs.writeFile(analyticsFilePath, JSON.stringify(analyticsData, null, 2));

    return NextResponse.json({ message: 'Analytics data saved' }, { status: 200 });
  } catch (error) {
    console.error('Error saving analytics data:', error);
    return NextResponse.json({ message: 'Error saving analytics data' }, { status: 500 });
  }
}