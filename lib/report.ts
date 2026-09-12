// lib/report.ts
// Client-side PDF generation using jsPDF + autotable

import type { AttemptResult, Question, BloomDistribution, BloomLevel } from '@/types';
import { pct, formatTime, formatDate } from './utils';
import { BLOOM_LABELS } from './bloom';

interface ReportAssessment {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  bloomDistribution: BloomDistribution;
  questions: Question[];
}

export async function generateReport(
  attempt: AttemptResult & { id?: string },
  assessment: ReportAssessment
): Promise<void> {
  // Dynamic imports to avoid SSR issues
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
  await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;

  // ─── Helper functions ───
  const addPage = () => { doc.addPage(); return margin; };

  const drawRect = (x: number, y: number, w: number, h: number, r: number, fillColor: string) => {
    doc.setFillColor(fillColor);
    doc.roundedRect(x, y, w, h, r, r, 'F');
  };

  const text = (str: string, x: number, y: number, options?: { align?: 'left' | 'center' | 'right'; color?: string; size?: number; bold?: boolean }) => {
    if (options?.color) doc.setTextColor(options.color);
    if (options?.size) doc.setFontSize(options.size);
    doc.setFont('helvetica', options?.bold ? 'bold' : 'normal');
    doc.text(str, x, y, { align: options?.align || 'left' });
  };

  // ─── PAGE 1: Cover ───
  // Green header bar
  drawRect(0, 0, pageW, 55, 0, '#16a34a');
  text('ASSESSORA', margin, 22, { color: '#ffffff', size: 22, bold: true });
  text('Performance Report', margin, 32, { color: '#bbf7d0', size: 11 });
  text(formatDate(attempt.submittedAt), pageW - margin, 32, { color: '#bbf7d0', size: 10, align: 'right' });

  let y = 70;

  // Assessment title
  text(assessment.title, margin, y, { color: '#0f172a', size: 18, bold: true });
  y += 8;
  text(assessment.subject, margin, y, { color: '#64748b', size: 11 });
  y += 6;
  text(`Difficulty: ${assessment.difficulty.charAt(0).toUpperCase() + assessment.difficulty.slice(1)}`, margin, y, { color: '#64748b', size: 10 });
  y += 16;

  // Score box
  const scoreColor = attempt.percentage >= 80 ? '#16a34a' : attempt.percentage >= 60 ? '#d97706' : '#dc2626';
  const scoreBg = attempt.percentage >= 80 ? '#f0fdf4' : attempt.percentage >= 60 ? '#fffbeb' : '#fef2f2';
  drawRect(margin, y, contentW, 30, 3, scoreBg);
  text(`${Math.round(attempt.percentage)}%`, margin + 10, y + 20, { color: scoreColor, size: 28, bold: true });
  const scoreLabel = attempt.percentage >= 80 ? 'Excellent' : attempt.percentage >= 60 ? 'Good' : attempt.percentage >= 40 ? 'Fair' : 'Needs Improvement';
  text(scoreLabel, margin + 30, y + 14, { color: scoreColor, size: 12, bold: true });
  text(`${attempt.correct} / ${attempt.totalQuestions} questions correct`, margin + 30, y + 22, { color: '#64748b', size: 10 });
  text(`Time: ${formatTime(attempt.timeTaken)}`, pageW - margin - 10, y + 14, { color: '#374151', size: 10, align: 'right' });
  y += 38;

  // Stats table
  const statsData = [
    ['Correct', String(attempt.correct), 'Incorrect', String(attempt.incorrect)],
    ['Unanswered', String(attempt.unanswered), 'Time Used', formatTime(attempt.timeTaken)],
  ];

  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [],
    body: statsData,
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold', textColor: [71, 85, 105] },
      1: { cellWidth: 45, textColor: [15, 23, 42] },
      2: { cellWidth: 40, fontStyle: 'bold', textColor: [71, 85, 105] },
      3: { cellWidth: 45, textColor: [15, 23, 42] },
    },
    styles: { fontSize: 10, cellPadding: 4 },
    theme: 'plain',
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  // ─── PAGE 2: Performance Analysis ───
  y = addPage();
  text("Performance Analysis", margin, y, { color: '#0f172a', size: 16, bold: true });
  y += 10;

  // Bloom performance
  text("Bloom's Taxonomy Breakdown", margin, y, { color: '#374151', size: 12, bold: true });
  y += 6;

  const bloomRows = Object.entries(attempt.bloomPerformance).map(([level, stat]) => {
    const bloomLevel = level as BloomLevel;
    const s = stat as { correct: number; total: number };
    const p = pct(s.correct, s.total);
    return [BLOOM_LABELS[bloomLevel] || level, `${s.correct}/${s.total}`, `${p}%`, p >= 80 ? 'Strong' : p >= 60 ? 'Developing' : 'Needs Attention'];
  });

  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Bloom Level', 'Score', 'Percentage', 'Status']],
    body: bloomRows,
    headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold', fontSize: 10 },
    styles: { fontSize: 10, cellPadding: 4 },
    theme: 'striped',
    alternateRowStyles: { fillColor: [240, 253, 244] },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  // Topic performance
  text('Topic Performance', margin, y, { color: '#374151', size: 12, bold: true });
  y += 6;

  const topicRows = Object.entries(attempt.topicPerformance).map(([topic, stat]) => {
    const s = stat as { correct: number; total: number };
    const p = pct(s.correct, s.total);
    return [topic, `${s.correct}/${s.total}`, `${p}%`, p >= 80 ? 'Strong' : p >= 60 ? 'Developing' : 'Needs Attention'];
  });

  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Topic', 'Score', 'Percentage', 'Status']],
    body: topicRows,
    headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold', fontSize: 10 },
    styles: { fontSize: 10, cellPadding: 4 },
    theme: 'striped',
    alternateRowStyles: { fillColor: [240, 253, 244] },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  // Strengths & Weaknesses
  if (y + 40 > pageH - margin) { y = addPage(); }
  text('Strengths', margin, y, { color: '#15803d', size: 11, bold: true });
  y += 6;
  if (attempt.strengths.length > 0) {
    doc.setFontSize(10);
    doc.setTextColor('#374151');
    doc.setFont('helvetica', 'normal');
    doc.text(attempt.strengths.join(', '), margin, y);
  } else {
    text('No areas rated as strong yet — keep practising.', margin, y, { color: '#94a3b8', size: 10 });
  }
  y += 10;

  text('Areas Needing Attention', margin, y, { color: '#d97706', size: 11, bold: true });
  y += 6;
  if (attempt.weaknesses.length > 0) {
    doc.setFontSize(10);
    doc.setTextColor('#374151');
    doc.setFont('helvetica', 'normal');
    doc.text(attempt.weaknesses.join(', '), margin, y);
  } else {
    text('No major weak areas identified.', margin, y, { color: '#94a3b8', size: 10 });
  }
  y += 14;

  text('Recommendation', margin, y, { color: '#374151', size: 11, bold: true });
  y += 6;
  const recommendation = attempt.weaknesses.length > 0
    ? `Review ${attempt.weaknesses.slice(0, 2).join(' and ')} before your next assessment.`
    : 'Continue building on your strong foundation with more advanced material.';
  doc.setFontSize(10);
  doc.setTextColor('#374151');
  doc.setFont('helvetica', 'normal');
  const splitRec = doc.splitTextToSize(recommendation, contentW);
  doc.text(splitRec, margin, y);

  // ─── PAGE 3: Question Review ───
  doc.addPage();
  y = margin;
  text('Question Review', margin, y, { color: '#0f172a', size: 16, bold: true });
  y += 10;

  for (let i = 0; i < assessment.questions.length; i++) {
    const q = assessment.questions[i];
    const userAnswer = attempt.answers[q.id] || 'Not answered';
    const isCorrect = userAnswer === q.correctAnswer;

    if (y + 45 > pageH - margin) { y = addPage(); }

    // Question header
    const statusColor = isCorrect ? '#16a34a' : userAnswer === 'Not answered' ? '#94a3b8' : '#dc2626';
    const statusLabel = isCorrect ? '✓ Correct' : userAnswer === 'Not answered' ? '— Skipped' : '✗ Incorrect';

    drawRect(margin, y, contentW, 8, 1, isCorrect ? '#f0fdf4' : userAnswer === 'Not answered' ? '#f8fafc' : '#fef2f2');
    text(`Q${i + 1}: ${statusLabel}`, margin + 3, y + 5.5, { color: statusColor, size: 9, bold: true });
    text(`${BLOOM_LABELS[q.bloomLevel]} · ${q.topic}`, pageW - margin - 3, y + 5.5, { color: '#64748b', size: 9, align: 'right' });
    y += 10;

    // Question text
    doc.setFontSize(10);
    doc.setTextColor('#0f172a');
    doc.setFont('helvetica', 'normal');
    const qLines = doc.splitTextToSize(q.question, contentW);
    if (y + qLines.length * 5 + 30 > pageH - margin) { y = addPage(); }
    doc.text(qLines, margin, y);
    y += qLines.length * 5 + 3;

    // Your answer / Correct answer
    text(`Your answer: ${userAnswer}`, margin, y, { color: isCorrect ? '#15803d' : '#dc2626', size: 9 });
    if (!isCorrect) {
      text(`Correct: ${q.correctAnswer}`, margin, y + 5, { color: '#15803d', size: 9 });
      y += 5;
    }
    y += 8;

    // Explanation
    doc.setFontSize(9);
    doc.setTextColor('#4b5563');
    doc.setFont('helvetica', 'italic');
    const expLines = doc.splitTextToSize(q.explanation, contentW - 4);
    if (y + expLines.length * 4.5 > pageH - margin) { y = addPage(); }
    doc.text(expLines, margin + 2, y);
    y += expLines.length * 4.5 + 8;

    // Separator
    doc.setDrawColor('#e2e8f0');
    doc.line(margin, y - 2, pageW - margin, y - 2);
  }

  // ─── Footer on every page ───
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor('#94a3b8');
    doc.setFont('helvetica', 'normal');
    doc.text(`Assessora Performance Report · ${assessment.title}`, margin, pageH - 8);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 8, { align: 'right' });
  }

  // Save
  const fileName = `${assessment.title.replace(/\s+/g, '_')}_Report.pdf`;
  doc.save(fileName);
}
