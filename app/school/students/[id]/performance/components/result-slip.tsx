"use client";

import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ResultSlipProps {
  student: any; 
  exam: any; 
  school: any; 
  classTeacher: any; 
  principal: any; 
}

export function ResultSlip({ student, exam, school, classTeacher, principal }: ResultSlipProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    if (!printRef.current) return;

    // School Header
    doc.setFontSize(20);
    doc.text(school.name, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(school.address, doc.internal.pageSize.width / 2, 30, { align: 'center' });
    doc.text(school.contact, doc.internal.pageSize.width / 2, 35, { align: 'center' });

    // Student Info
    if (student.photo) {
      doc.addImage(student.photo, 'PNG', 15, 45, 30, 30);
    }
    doc.text(`Name: ${student.name}`, 50, 50);
    doc.text(`Admission No: ${student.admissionNo}`, 50, 55);
    doc.text(`Class: ${student.stream.class.name} ${student.stream.name}`, 50, 60);

    // Exam Info
    doc.text(`Examination: ${exam.name}`, 15, 75);
    doc.text(`Term: ${exam.term}`, 15, 80);
    doc.text(`Academic Year: ${exam.academicYear}`, 15, 85);

    // Results Table
    const tableData = exam.subjects.map((subject: any) => [
      subject.name,
      subject.teacher.name,
      subject.marks,
      subject.grade,
      subject.remarks
    ]);

    autoTable(doc, {
      head: [['Subject', 'Teacher', 'Marks', 'Grade', 'Remarks']],
      body: tableData,
      startY: 95,
      styles: { cellPadding: 4, fontSize: 10, overflow: 'linebreak' },
      headStyles: { fillColor: [230, 230, 230] }, // Light gray for headers
      margin: { top: 20 },
    });

    // Performance Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Mean Grade: ${exam.meanGrade}`, 15, finalY);
    doc.text(`Mean Marks: ${exam.meanMarks}`, 15, finalY + 5);
    doc.text(`Rank: ${exam.rank} out of ${exam.totalStudents}`, 15, finalY + 10);

    // Remarks
    doc.text('Class Teacher\'s Remarks:', 15, finalY + 20);
    doc.text(classTeacher.remarks, 15, finalY + 25);
    doc.text(`Class Teacher: ${classTeacher.name}`, 15, finalY + 30);

    doc.text('Principal\'s Remarks:', 15, finalY + 40);
    doc.text(principal.remarks, 15, finalY + 45);
    doc.text(`Principal: ${principal.name}`, 15, finalY + 50);

    // Footer
    doc.text(`Date Printed: ${format(new Date(), 'PPP')}`, 15, doc.internal.pageSize.height - 20);
    doc.text(`Signature: _________________`, doc.internal.pageSize.width - 80, doc.internal.pageSize.height - 20);

    doc.save(`${student.name}_${exam.name}_result_slip.pdf`);
  };

  return (
    <Card className="p-6" ref={printRef}>
      <button onClick={generatePDF} className="mb-4">Download PDF</button>
      <div className="space-y-6">
        {/* Preview content matching the PDF layout */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">{school.name}</h1>
          <p>{school.address}</p>
          <p>{school.contact}</p>
        </div>

        <div className="flex items-start gap-4">
          {student.photo && (
            <Image
              src={student.photo} 
              alt={student.name} 
              className="w-24 h-24 object-cover rounded" 
              width={100} 
              height={100} 
            />
          )}
          <div>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Admission No:</strong> {student.admissionNo}</p>
            <p><strong>Class:</strong> {student.stream.class.name} {student.stream.name}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="space-y-2">
            <p><strong>Examination:</strong> {exam.name}</p>
            <p><strong>Term:</strong> {exam.term}</p>
            <p><strong>Academic Year:</strong> {exam.academicYear}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">Performance Summary:</h3>
            <p><strong>Mean Grade:</strong> {exam.meanGrade}</p>
            <p><strong>Mean Marks:</strong> {exam.meanMarks}</p>
            <p><strong>Rank:</strong> {exam.rank} out of {exam.totalStudents}</p>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border">Subject</th>
              <th className="border">Teacher</th>
              <th className="border">Marks</th>
              <th className="border">Grade</th>
              <th className="border">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {exam.subjects.map((subject: any) => (
              <tr key={subject.name}>
                <td className="border">{subject.name}</td>
                <td className="border">{subject.teacher.name}</td>
                <td className="border">{subject.marks}</td>
                <td className="border">{subject.grade}</td>
                <td className="border">{subject.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-4">
          <div>
            <h4>Class Teacher&apos;s Remarks:</h4>
            <p>{classTeacher.remarks}</p>
            <p><strong>Class Teacher:</strong> {classTeacher.name}</p>
          </div>

          <div>
            <h4>Principal&apos;s Remarks:</h4>
            <p>{principal.remarks}</p>
            <p><strong>Principal:</strong> {principal.name}</p>
          </div>
        </div>

        <div className="flex w-full justify-between">
          <p>Date Printed: {format(new Date(), 'PPP')}</p>
          <p>Signature: _________________</p>
        </div>
      </div>
    </Card>
  );
}
