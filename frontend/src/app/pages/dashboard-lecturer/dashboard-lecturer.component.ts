import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

import { StudentService } from 'src/app/services/student.service';
import { CourseService } from 'src/app/services/course.service';
import { ClassService } from 'src/app/services/class.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'dashboard-lecturer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-lecturer.component.html',
  styleUrl: './dashboard-lecturer.component.scss'
})
export class DashboardLecturerComponent implements OnInit, OnDestroy {
  barChart: Chart | null = null;
  subjectAttendanceChart: Chart | null = null;

  totalStudents: number = 0;
  presentCount: number = 0;
  absentCount: number = 0;
  approvedAbsentCount: number = 0;
  pendingAbsentCount: number = 0;
  lateArrivalCount: number = 0;
  disciplinaryIncidentCount: number = 0;

  courses: any[] = [];
  classes: any[] = [];
  selectedCourseId: string = '';
  lecturerId: string = '';
  notifications: any[] = [];
  unreadCount: number = 0;
  notificationOpen: boolean = false;
  loadingNotifications: boolean = false;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private classService: ClassService,
    private attendanceService: AttendanceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.lecturerId = localStorage.getItem('userId') || '';

    this.courseService.getCoursesByLecturerId(this.lecturerId).subscribe({
      next: (response: any) => {
        this.courses = response.metaData;
        if (this.classes.length) {
          this.loadAttendanceForBarChart();
        }
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
    this.loadUnreadCount();
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
      this.lateArrivalCount = 0;
      if (this.barChart) {
        this.barChart.destroy();
        this.barChart = null;
      }
      if (this.subjectAttendanceChart) {
        this.subjectAttendanceChart.destroy();
        this.subjectAttendanceChart = null;
      }
      return;
    }

    this.attendanceService.getAttendanceByClassIds(classIds).subscribe({
      next: (response: any) => {
        const records = response.metaData || response;

        const countsByClass: { [key: string]: { present: number; absent: number } } = {};
        let totalPresent = 0;
        let totalLate = 0;

        for (const record of records) {
          const classId = record.class_id;
          const status = record.attendance_status;

          if (!countsByClass[classId]) {
            countsByClass[classId] = { present: 0, absent: 0 };
          }

          if (status === 'present' || status === 'late') {
            countsByClass[classId].present += 1;
            totalPresent += 1;
            if (status === 'late') {
              totalLate += 1;
            }
          } else if (status === 'absent' || status === 'excused') {
            countsByClass[classId].absent += 1;
          }
        }

        this.presentCount = totalPresent;
        this.lateArrivalCount = totalLate;

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

        const filteredCourses = this.selectedCourseId
          ? this.courses.filter((course: any) => String(course.course_id) === String(this.selectedCourseId))
          : this.courses;

        const subjectChartData = filteredCourses
          .map((course: any) => {
            const relatedClasses = filteredClasses.filter((cls: any) => cls.intake_module_id && course.intake_module_id
              ? cls.intake_module_id === course.intake_module_id
              : false
            );
            const relatedClassIds = relatedClasses.map((cls: any) => cls.class_id);
            const subjectRecords = records.filter((record: any) => relatedClassIds.includes(record.class_id));
            const totalRecords = subjectRecords.length;
            const nonAbsentRecords = subjectRecords.filter((record: any) => (
              record.attendance_status === 'present'
              || record.attendance_status === 'late'
              || record.attendance_status === 'excused'
            )).length;
            const percentage = totalRecords > 0 ? Number(((nonAbsentRecords / totalRecords) * 100).toFixed(2)) : 0;

            return {
              label: course.name || course.course_id || course.intake_module_id,
              percentage
            };
          })
          .filter((courseData: any) => courseData.label);

        this.buildBarChart(chartData);
        this.buildSubjectAttendanceChart(subjectChartData);
      },
      error: (err) => console.error('Failed to load attendance for bar chart:', err)
    });
  }

  toggleNotifications() {
    this.notificationOpen = !this.notificationOpen;
    if (this.notificationOpen) {
      this.loadNotifications();
      this.loadUnreadCount();
    }
  }

  loadNotifications() {
    this.loadingNotifications = true;
    this.notificationService.getNotifications().subscribe({
      next: (response) => {
        this.notifications = response?.metaData ?? [];
        this.loadingNotifications = false;
      },
      error: () => {
        this.notifications = [];
        this.loadingNotifications = false;
      }
    });
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        this.unreadCount = Number(response?.metaData?.count ?? 0);
      },
      error: () => {
        this.unreadCount = 0;
      }
    });
  }

  markAsRead(notification: any) {
    if (notification.status === 'read') {
      return;
    }

    this.notificationService.markAsRead(notification.notification_id).subscribe({
      next: () => {
        notification.status = 'read';
        notification.read_at = new Date().toISOString();
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      },
      error: () => {
      }
    });
  }

  markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map((notification) => ({
          ...notification,
          status: 'read',
          read_at: notification.read_at ?? new Date().toISOString()
        }));
        this.unreadCount = 0;
      },
      error: () => {
      }
    });
  }

  getNotificationMessage(notification: any): string {
    switch (notification.notification_type) {
      case 'new_request':
        return `Attendance request #${notification.request_id} needs review`;
      case 'request_approved':
        return `Attendance request #${notification.request_id} was approved`;
      case 'request_rejected':
        return `Attendance request #${notification.request_id} was rejected`;
      default:
        return 'New notification';
    }
  }

  ngOnDestroy() {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.subjectAttendanceChart) {
      this.subjectAttendanceChart.destroy();
      this.subjectAttendanceChart = null;
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

  private buildSubjectAttendanceChart(data: any[]) {
    if (this.subjectAttendanceChart) {
      this.subjectAttendanceChart.destroy();
      this.subjectAttendanceChart = null;
    }

    if (!data || data.length === 0) return;

    const labels = data.map((r) => r.label);
    const percentages = data.map((r) => r.percentage);

    this.subjectAttendanceChart = new Chart('subjectAttendanceChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Attendance Percentage',
            data: percentages,
            backgroundColor: '#0baae8'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { stepSize: 10 },
            title: { display: true, text: 'Attendance Percentage (%)' }
          },
          x: {
            title: { display: true, text: 'Subject' }
          }
        },
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
