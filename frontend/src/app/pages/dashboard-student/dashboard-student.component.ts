import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Chart } from 'chart.js/auto';

type ViewMode = 'daily' | 'weekly' | 'monthly';

@Component({
  selector: 'dashboard-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-student.component.html',
  styleUrl: './dashboard-student.component.scss'
})
export class DashboardStudentComponent {
  chart: Chart | null = null;
  barChart: Chart | null = null;
  rawData: any[] = [];
  viewMode: ViewMode = 'daily';
  currentYear: number = new Date().getFullYear();
  totalStudents: number = 0;
  presentCount: number = 0;
  absentCount: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAttendanceAnalytics().subscribe({
      next: (response: any) => {
        const meta = response?.metaData;
        const rows = Array.isArray(meta) ? meta : meta?.attendanceRates ?? [];
        const passFailRows = Array.isArray(meta) ? [] : meta?.passFailByMajor ?? [];
        this.rawData = rows;

        this.totalStudents = passFailRows.reduce(
          (sum: number, r: any) => sum + Number(r.total_students),
          0
        );
        this.presentCount = rows.reduce(
          (sum: number, r: any) => sum + Number(r.present),
          0
        );
        this.absentCount = rows.reduce(
          (sum: number, r: any) => sum + (Number(r.total) - Number(r.present)),
          0
        );

        if (rows.length > 0 && rows[0].date) {
          this.currentYear = new Date(rows[0].date).getFullYear();
        }

        this.buildChart();
        this.buildBarChart(passFailRows);
      },
      error: (err) => {
        console.error('Failed to load attendance analytics:', err);
      }
    });
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
  }

  onViewChange() {
    if (this.rawData.length) {
      this.buildChart();
    }
  }

  private buildChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const { labels, datasets } = this.aggregateData();

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
            ticks: { stepSize: 20 },
            title: {
              display: true,
              text: 'Rate (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
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

  private buildBarChart(data: any[]) {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }

    if (!data || data.length === 0) {
      return;
    }

    const majors = data.map((r) => r.major);
    const passPercentages = data.map((r) => Number(r.pass_percentage));
    const failPercentages = data.map((r) => Number(r.fail_percentage));

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

  private aggregateData(): { labels: string[]; datasets: any[] } {
    if (!this.rawData.length) {
      return { labels: [], datasets: [] };
    }

    const groupMap = new Map<string, { label: string; major: string; rates: number[] }>();
    const labelsInOrder: string[] = [];

    for (const row of this.rawData) {
      const date = new Date(row.date);
      const major = row.major;
      const rate = typeof row.rate === 'number' ? row.rate : Number(row.rate);

      const label = this.getLabelForDate(date, this.viewMode);

      if (!labelsInOrder.includes(label)) {
        labelsInOrder.push(label);
      }

      const key = `${label}__${major}`;
      const existing = groupMap.get(key);

      if (existing) {
        existing.rates.push(rate);
      } else {
        groupMap.set(key, { label, major, rates: [rate] });
      }
    }

    const majors = Array.from(
      new Set(Array.from(groupMap.values()).map((g) => g.major))
    );

    const colors = ['#0baae8', '#ec1025', '#0d2240', '#bdbbbb', '#656663'];

    const datasets = majors.map((major, index) => {
      const color = colors[index % colors.length];

      const data = labelsInOrder.map((label) => {
        const key = `${label}__${major}`;
        const group = groupMap.get(key);

        if (!group) {
          return null;
        }

        const sum = group.rates.reduce((acc, r) => acc + r, 0);
        return sum / group.rates.length;
      });

      return {
        label: major,
        data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.2
      };
    });

    return { labels: labelsInOrder, datasets };
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
