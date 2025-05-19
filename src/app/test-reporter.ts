import { PerformanceObserver, performance } from 'perf_hooks';

export class TestReporter {
  private static measurements: { [key: string]: number[] } = {};

  static startMeasure(label: string): void {
    performance.mark(`${label}-start`);
  }

  static endMeasure(label: string): void {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
  }

  static collectMeasurements(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!this.measurements[entry.name]) {
          this.measurements[entry.name] = [];
        }
        this.measurements[entry.name].push(entry.duration);
      }
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  static getAverageTime(label: string): number {
    const times = this.measurements[label];
    if (!times || times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  static printResults(): void {
    console.log('\nPerformance Test Results:');
    console.log('========================');
    
    Object.entries(this.measurements).forEach(([label, times]) => {
      const avg = this.getAverageTime(label);
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      console.log(`\n${label}:`);
      console.log(`  Average: ${avg.toFixed(2)}ms`);
      console.log(`  Min: ${min.toFixed(2)}ms`);
      console.log(`  Max: ${max.toFixed(2)}ms`);
      console.log(`  Samples: ${times.length}`);
    });
  }
} 