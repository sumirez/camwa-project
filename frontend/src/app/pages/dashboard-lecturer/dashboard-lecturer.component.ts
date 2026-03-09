import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

import { StudentService } from 'src/app/services/student.service';
import { CourseService } from 'src/app/services/course.service';
import { ClassService } from 'src/app/services/class.service';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'dashboard-lecturer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-lecturer.component.html',
  styleUrl: './dashboard-lecturer.component.scss'
})
export class DashboardLecturerComponent implements OnInit, OnDestroy {
  barChart: Chart | null = null;

  totalStudents: number = 0;
  presentCount: number = 0;
  absentCount: number = 0;
  approvedAbsentCount: number = 0;
  pendingAbsentCount: number = 0;

  courses: any[] = [];
  classes: any[] = [];
  selectedCourseId: string = '';
  lecturerId: string = '';

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private classService: ClassService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.lecturerId = localStorage.getItem('userId') || '';

    this.courseService.getCoursesByLecturerId(this.lecturerId).subscribe({
      next: (response: any) => {
        this.courses = response.metaData;
      },
      error: (err) => console.error('Failed to load courses:', err)
    });

    this.classService.getClassesByLecturerId(this.lecturerId).subscribe({
      next: (response: any) => {
        this.classes = response.metaData;
        this.loadAttendanceForBarChart();
      },
      error: (err) => console.error('Failed to load classes:', err)
    });

    this.loadStudents();
    this.loadAttendanceRequests();
  }

  onCourseSelect(courseId: string) {
    this.selectedCourseId = courseId;
    this.loadStudents();
    this.loadAttendanceRequests();
    this.loadAttendanceForBarChart();
  }

  private getFilteredClasses(): any[] {
    if (!this.selectedCourseId) return this.classes;
    const selected = this.courses.find((c: any) => String(c.course_id) === String(this.selectedCourseId));
    if (!selected) return this.classes;
    return this.classes.filter((cls: any) => cls.intake_module_id && selected.intake_module_id
      ? cls.intake_module_id === selected.intake_module_id
      : true
    );
  }

  private loadStudents() {
    if (this.selectedCourseId) {
      const selected = this.courses.find((c: any) => String(c.course_id) === String(this.selectedCourseId));
      if (selected?.program_id) {
        this.studentService.getStudentsByProgramId(selected.program_id).subscribe({
          next: (response: any) => {
            this.totalStudents = response.metaData.length;
          },
          error: (err) => console.error('Failed to load students:', err)
        });
        return;
      }
    }
    this.studentService.getStudents().subscribe({
      next: (response: any) => {
        this.totalStudents = response.metaData.length;
      },
      error: (err) => console.error('Failed to load students:', err)
    });
  }

  private loadAttendanceRequests() {
    this.attendanceService.getAttendanceRequestsByLecturerId(this.lecturerId).subscribe({
      next: (response: any) => {
        let requests = response.metaData;

        if (this.selectedCourseId) {
          const filteredClassIds = this.getFilteredClasses().map((c: any) => c.class_id);
          requests = requests.filter((r: any) => filteredClassIds.includes(r.class_id));
        }

        this.approvedAbsentCount = requests.filter((r: any) => r.status === 'approved').length;
        this.pendingAbsentCount = requests.filter((r: any) => r.status === 'pending').length;
        this.absentCount = requests.length;
      },
      error: (err) => console.error('Failed to load attendance requests:', err)
    });
  }

  private loadAttendanceForBarChart() {
    const filteredClasses = this.getFilteredClasses();
    const classIds = filteredClasses.map((cls: any) => cls.class_id);

    if (!classIds.length) {
      this.presentCount = 0;
      if (this.barChart) {
        this.barChart.destroy();
        this.barChart = null;
      }
      return;
    }

    this.attendanceService.getAttendanceByClassIds(classIds).subscribe({
      next: (response: any) => {
        const records = response.metaData || response;

        const countsByClass: { [key: string]: { present: number; absent: number } } = {};
        let totalPresent = 0;

        for (const record of records) {
          const classId = record.class_id;
          const status = record.attendance_status;

          if (!countsByClass[classId]) {
            countsByClass[classId] = { present: 0, absent: 0 };
          }

          if (status === 'present' || status === 'late') {
            countsByClass[classId].present += 1;
            totalPresent += 1;
          } else if (status === 'absent' || status === 'excused') {
            countsByClass[classId].absent += 1;
          }
        }

        this.presentCount = totalPresent;

        const chartData = filteredClasses.map((cls: any) => {
          const labelDate = cls.class_date ? new Date(cls.class_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '';
          const label = labelDate ? `Class ${cls.class_number} - ${labelDate}` : `Class ${cls.class_number}`;
          const counts = countsByClass[cls.class_id] || { present: 0, absent: 0 };
          return {
            label,
            present: counts.present,
            absent: counts.absent
          };
        });

        this.buildBarChart(chartData);
      },
      error: (err) => console.error('Failed to load attendance for bar chart:', err)
    });
  }

  ngOnDestroy() {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
  }

  private buildBarChart(data: any[]) {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }

    if (!data || data.length === 0) return;

    const labels = data.map((r) => r.label);
    const presentCounts = data.map((r) => r.present);
    const absentCounts = data.map((r) => r.absent);

    this.barChart = new Chart('passFailChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Present', data: presentCounts, backgroundColor: '#0baae8' },
          { label: 'Absent', data: absentCounts, backgroundColor: '#ec1025' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Number of Students' } },
          x: { title: { display: true, text: 'Class' } }
        },
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
