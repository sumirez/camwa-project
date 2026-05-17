import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Chart } from 'chart.js/auto';

type ViewMode = 'daily' | 'weekly' | 'monthly';

@Component({
  selector: 'dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {
  chart: Chart | null = null;
  barChart: Chart | null = null;
  weeklyMajorChart: Chart | null = null;
  rawData: any[] = [];
  passFailData: any[] = [];
  weeklyMajorData: any[] = [];
  viewMode: ViewMode = 'daily';
  selectedYear = 2021;
  currentYear = new Date().getFullYear();
  totalStudents: number = 0;
  presentCount: number = 0;
  absentCount: number = 0;
  approvedAbsentCount: number = 0;
  pendingAbsentCount: number = 0;
  notifications: any[] = [];
  unreadCount: number = 0;
  notificationOpen: boolean = false;
  loadingNotifications: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadAttendanceAnalytics();
    this.loadUnreadCount();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.weeklyMajorChart) {
      this.weeklyMajorChart.destroy();
      this.weeklyMajorChart = null;
    }
  }

  private loadAttendanceAnalytics() {
    this.dashboardService.getAttendanceAnalytics(this.viewMode, this.selectedYear).subscribe({
      next: (response: any) => {
        const meta = response?.metaData;
        this.rawData = meta?.attendanceRates ?? [];
        this.passFailData = meta?.passFailByMajor ?? [];

        this.totalStudents = this.passFailData.reduce(
          (sum: number, r: any) => sum + Number(r.total_students),
          0
        );
        this.presentCount = this.rawData.reduce(
          (sum: number, r: any) => sum + Number(r.present),
          0
        );
        this.absentCount = this.rawData.reduce(
          (sum: number, r: any) => sum + (Number(r.total) - Number(r.present)),
          0
        );

        if (meta?.requestCounts) {
          this.approvedAbsentCount = Number(meta.requestCounts.approved_count);
          this.pendingAbsentCount = Number(meta.requestCounts.pending_count);
        }

        this.currentYear = new Date().getFullYear();

        this.buildChart();
        this.buildBarChart();
      },
      error: (err) => {
        console.error('Failed to load attendance analytics:', err);
      }
    });

    this.dashboardService.getAttendanceAnalytics('weekly', this.selectedYear).subscribe({
      next: (response: any) => {
        this.weeklyMajorData = response?.metaData?.attendanceRates ?? [];
        this.buildWeeklyMajorChart();
      },
      error: (err) => {
        console.error('Failed to load weekly major attendance:', err);
      }
    });
  }

  onViewChange() {
    this.loadAttendanceAnalytics();
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

  private buildChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const canvas = document.getElementById('attendanceChart') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');
    if (!canvas) return;
    const gradient = ctx?.createLinearGradient(0, 0, 0, canvas.height || 300);

    if (gradient) {
      gradient.addColorStop(0, '#00B5E2');
      gradient.addColorStop(1, '#FFFFFF00');
    }

    const { labels, datasets, tooltipDetails } = this.aggregateData(gradient ?? '#00B5E2');

    this.chart = new Chart('attendanceChart', {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20, color: '#000000' },
            border: { color: '#000000' }
          },
          x: {
            ticks: { color: '#000000' },
            border: { color: '#000000' },
            title: {
              display: false
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => items[0]?.label ?? '',
              label: (context) => {
                const dataIndex = context.dataIndex;
                const details = tooltipDetails[dataIndex];
                if (!details || details.length === 0) {
                  if (!context.parsed.y)
                    return
                  return `Average: ${context.parsed.y.toFixed(2)}%`;
                }
                const avg = details.reduce((s, d) => s + d.rate, 0) / details.length;
                const lines = [`Average: ${avg.toFixed(2)}%`];
                for (const d of details) {
                  lines.push(`${d.major}: ${d.rate}%`);
                }
                return lines;
              }
            }
          }
        }
      }
    });
  }

  private buildBarChart() {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }

    if (!this.passFailData || this.passFailData.length === 0) {
      return;
    }

    const majors = this.passFailData.map((r) => r.major);
    const passPercentages = this.passFailData.map((r) => Number(r.pass_percentage));
    const failPercentages = this.passFailData.map((r) => Number(r.fail_percentage));

    this.barChart = new Chart('passFailChart', {
      type: 'bar',
      data: {
        labels: majors,
        datasets: [
          {
            label: 'Pass (≥75%)',
            data: passPercentages,
            backgroundColor: '#0baae8'
          },
          {
            label: 'Fail (<75%)',
            data: failPercentages,
            backgroundColor: '#ec1025'
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
            ticks: { stepSize: 20 },
            title: {
              display: true,
              text: 'Student Percentage (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Major'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private buildWeeklyMajorChart() {
    if (this.weeklyMajorChart) {
      this.weeklyMajorChart.destroy();
      this.weeklyMajorChart = null;
    }

    if (!this.weeklyMajorData || this.weeklyMajorData.length === 0) {
      return;
    }

    const latestWeekDate = this.weeklyMajorData.reduce((latest: string, row: any) => {
      return new Date(row.date) > new Date(latest) ? row.date : latest;
    }, this.weeklyMajorData[0].date);

    const latestWeekRows = this.weeklyMajorData
      .filter((row: any) => row.date === latestWeekDate)
      .sort((a: any, b: any) => String(a.major).localeCompare(String(b.major)));

    const labels = latestWeekRows.map((row: any) => row.major);
    const data = latestWeekRows.map((row: any) => Number(row.rate));

    this.weeklyMajorChart = new Chart('weeklyMajorChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: '#00B5E2',
          borderColor: '#000000',
          borderWidth: 1,
          borderRadius: 8,
          maxBarThickness: 56
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20, color: '#000000' },
            border: { color: '#000000' },
            grid: { color: '#d9d9d9' }
          },
          x: {
            ticks: { color: '#000000' },
            border: { color: '#000000' },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed.y?.toFixed(2)}%`
            }
          }
        }
      }
    });
  }

  private aggregateData(fillColor: CanvasGradient | string): { labels: string[]; datasets: any[]; tooltipDetails: { major: string; rate: number }[][] } {
    if (!this.rawData.length) {
      return { labels: [], datasets: [], tooltipDetails: [] };
    }

    const groupMap = new Map<string, { major: string; rate: number }[]>();
    const labelsInOrder: string[] = [];

    for (const row of this.rawData) {
      const date = new Date(row.date);
      const major = row.major;
      const rate = typeof row.rate === 'number' ? row.rate : Number(row.rate);

      const label = this.getLabelForDate(date, this.viewMode);

      if (!labelsInOrder.includes(label)) {
        labelsInOrder.push(label);
      }

      if (!groupMap.has(label)) {
        groupMap.set(label, []);
      }
      groupMap.get(label)!.push({ major, rate });
    }

    const averageRates = labelsInOrder.map((label) => {
      const details = groupMap.get(label)!;
      const sum = details.reduce((acc, d) => acc + d.rate, 0);
      return sum / details.length;
    });

    const tooltipDetails = labelsInOrder.map((label) => groupMap.get(label)!);

    const datasets = [{
      label: 'Average Attendance Rate',
      data: averageRates,
      borderColor: '#000000',
      backgroundColor: fillColor,
      fill: true,
      tension: 0.2,
      spanGaps: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#000000',
      pointBorderWidth: 3,
      pointHoverBackgroundColor: '#FFFFFF',
      pointHoverBorderColor: '#000000',
      pointHoverBorderWidth: 3
    }];

    return { labels: labelsInOrder, datasets, tooltipDetails };
  }

  private getLabelForDate(date: Date, mode: ViewMode): string {
    const monthShort = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();

    if (mode === 'daily') {
      const dayLabel = day.toString().padStart(2, '0');
      return `${dayLabel}-${monthShort}`;
    }

    if (mode === 'weekly') {
      const weekNum = this.getWeekOfYear(date);
      return `Week ${weekNum}`;
    }

    return date.toLocaleString('en-US', { month: 'long' });
  }

  private getWeekOfYear(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
