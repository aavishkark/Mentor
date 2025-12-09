import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface NoteData {
    title: string;
    content: string;
    tags?: string[];
    aiSummary?: string;
    createdAt?: string;
    updatedAt?: string;
    companionName?: string;
}

export const exportNoteToPDF = (note: NoteData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = 20;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(note.title, margin, currentY);
    currentY += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    if (note.createdAt) {
        doc.text(`Created: ${new Date(note.createdAt).toLocaleDateString()}`, margin, currentY);
        currentY += 6;
    }

    if (note.companionName) {
        doc.text(`Mentor: ${note.companionName}`, margin, currentY);
        currentY += 6;
    }

    currentY += 5;

    if (note.tags && note.tags.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(254, 51, 51);
        doc.text(`Tags: ${note.tags.join(', ')}`, margin, currentY);
        currentY += 8;
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    if (note.aiSummary) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('AI Summary', margin, currentY);
        currentY += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(60, 60, 60);
        const summaryLines = doc.splitTextToSize(note.aiSummary, pageWidth - 2 * margin);
        doc.text(summaryLines, margin, currentY);
        currentY += summaryLines.length * 6 + 10;

        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Content', margin, currentY);
    currentY += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const formattedContent = formatMarkdownForPDF(note.content);
    const contentLines = doc.splitTextToSize(formattedContent, pageWidth - 2 * margin);

    contentLines.forEach((line: string) => {
        if (currentY > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            currentY = 20;
        }
        doc.text(line, margin, currentY);
        currentY += 6;
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    const fileName = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    doc.save(fileName);
};

export const exportMultipleNotesToPDF = (notes: NoteData[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('My Notes', pageWidth / 2, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        50,
        { align: 'center' }
    );

    doc.setFontSize(10);
    doc.text(`Total Notes: ${notes.length}`, pageWidth / 2, 60, { align: 'center' });

    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Table of Contents', margin, 20);

    const tableData = notes.map((note, index) => [
        `${index + 1}`,
        note.title,
        note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {
        startY: 30,
        head: [['#', 'Title', 'Date']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [254, 51, 51] }
    });

    notes.forEach((note, index) => {
        doc.addPage();
        let currentY = 20;

        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Note ${index + 1} of ${notes.length}`, margin, currentY);
        currentY += 10;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        const titleLines = doc.splitTextToSize(note.title, pageWidth - 2 * margin);
        doc.text(titleLines, margin, currentY);
        currentY += titleLines.length * 8 + 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        if (note.createdAt) {
            doc.text(`Created: ${new Date(note.createdAt).toLocaleDateString()}`, margin, currentY);
            currentY += 5;
        }
        if (note.companionName) {
            doc.text(`Mentor: ${note.companionName}`, margin, currentY);
            currentY += 5;
        }
        if (note.tags && note.tags.length > 0) {
            doc.text(`Tags: ${note.tags.join(', ')}`, margin, currentY);
            currentY += 5;
        }

        currentY += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const formattedContent = formatMarkdownForPDF(note.content);
        const contentLines = doc.splitTextToSize(formattedContent, pageWidth - 2 * margin);

        contentLines.forEach((line: string) => {
            if (currentY > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage();
                currentY = 20;
            }
            doc.text(line, margin, currentY);
            currentY += 6;
        });
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    const fileName = `notes_export_${new Date().getTime()}.pdf`;
    doc.save(fileName);
};

export const formatMarkdownForPDF = (markdown: string): string => {
    let formatted = markdown
        .replace(/^#{1,6}\s+(.+)$/gm, '$1')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
        .replace(/^[\*\-\+]\s+/gm, '• ')
        .replace(/^\d+\.\s+/gm, '');

    return formatted;
};
