import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submittedBy, registerNumber, groupMembers } = body;

    if (!submittedBy || !registerNumber || !groupMembers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const coverPath = path.join(process.cwd(), 'public', 'cover_template.pdf');
    const reportPath = path.join(process.cwd(), 'public', 'main_report.pdf');

    const coverBytes = await fs.readFile(coverPath);
    const reportBytes = await fs.readFile(reportPath);

    const pdfDoc = await PDFDocument.create();
    const coverDoc = await PDFDocument.load(coverBytes);
    const reportDoc = await PDFDocument.load(reportBytes);

    const [coverPage] = await pdfDoc.copyPages(coverDoc, [0]);
    pdfDoc.addPage(coverPage);

    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const textSize = 14;
    const textColor = rgb(0, 0, 0);

    // These coordinates are guesses and will likely need adjustment.
    coverPage.drawText(submittedBy, {
      x: 310,
      y: 290,
      font,
      size: textSize,
      color: textColor,
    });

    coverPage.drawText(registerNumber, {
      x: 464.80,
      y: 418.40,
      font,
      size: textSize,
      color: textColor,
    });

    const groupMembersLines = groupMembers.split('\n');
    let yPosition = 373.40;
    for (const line of groupMembersLines) {
      coverPage.drawText(line, {
        x: 464.80,
        y: yPosition,
        font,
        size: textSize,
        color: textColor,
      });
      yPosition -= 20; // Move down for the next line
    }


    const reportPages = await pdfDoc.copyPages(reportDoc, reportDoc.getPageIndices());
    for (const page of reportPages) {
      pdfDoc.addPage(page);
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="carmel_report.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
