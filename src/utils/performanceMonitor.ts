/**
 * Performance Monitoring Utility
 *
 * Tracks and reports login performance metrics to identify bottlenecks
 * and measure optimization impact.
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface LoginPerformanceReport {
  totalDuration: number;
  authDuration: number;
  dataLoadDuration: number;
  cacheHit: boolean;
  timestamp: number;
  userType: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private enabled: boolean = true;

  constructor() {
    // Enable only in development or if explicitly enabled
    this.enabled = import.meta.env.DEV || localStorage.getItem('perf_monitor') === 'true';
  }

  /**
   * Start timing a specific operation
   */
  startTimer(name: string): () => void {
    if (!this.enabled) return () => {};

    const startTime = performance.now();

    return (metadata?: Record<string, any>) => {
      const duration = performance.now() - startTime;
      this.metrics.push({
        name,
        duration,
        timestamp: Date.now(),
        metadata
      });

      // Log if duration exceeds threshold
      if (duration > 200) {
        console.warn(`⚠️ [PERF] Slow operation: ${name} took ${duration.toFixed(2)}ms`);
      } else if (duration > 100) {
        console.log(`⏱️ [PERF] ${name}: ${duration.toFixed(2)}ms`);
      }
    };
  }

  /**
   * Record a login performance report
   */
  recordLogin(report: LoginPerformanceReport): void {
    if (!this.enabled) return;

    console.group('📊 Login Performance Report');
    console.log(`Total Duration: ${report.totalDuration.toFixed(2)}ms`);
    console.log(`Auth Duration: ${report.authDuration.toFixed(2)}ms`);
    console.log(`Data Load Duration: ${report.dataLoadDuration.toFixed(2)}ms`);
    console.log(`Cache Hit: ${report.cacheHit ? '✅ Yes' : '❌ No'}`);
    console.log(`User Type: ${report.userType}`);

    // Performance assessment
    if (report.totalDuration < 500) {
      console.log('✅ Performance: Excellent');
    } else if (report.totalDuration < 1000) {
      console.log('⚠️ Performance: Good');
    } else if (report.totalDuration < 2000) {
      console.log('⚠️ Performance: Slow');
    } else {
      console.log('❌ Performance: Very Slow - Investigation Needed');
    }

    console.groupEnd();

    // Store in session for analytics
    this.storeMetric('login', report);
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    averageLoginTime: number;
    cacheHitRate: number;
    slowLogins: number;
    totalLogins: number;
  } {
    const loginMetrics = this.getStoredMetrics('login') as LoginPerformanceReport[];

    if (loginMetrics.length === 0) {
      return {
        averageLoginTime: 0,
        cacheHitRate: 0,
        slowLogins: 0,
        totalLogins: 0
      };
    }

    const totalDuration = loginMetrics.reduce((sum, m) => sum + m.totalDuration, 0);
    const cacheHits = loginMetrics.filter(m => m.cacheHit).length;
    const slowLogins = loginMetrics.filter(m => m.totalDuration > 1000).length;

    return {
      averageLoginTime: totalDuration / loginMetrics.length,
      cacheHitRate: (cacheHits / loginMetrics.length) * 100,
      slowLogins,
      totalLogins: loginMetrics.length
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    sessionStorage.removeItem('perf_metrics');
  }

  /**
   * Export metrics for analysis
   */
  export(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Store metric in session storage
   */
  private storeMetric(type: string, data: any): void {
    try {
      const stored = sessionStorage.getItem('perf_metrics') || '{}';
      const metrics = JSON.parse(stored);

      if (!metrics[type]) {
        metrics[type] = [];
      }

      metrics[type].push(data);

      // Keep only last 50 entries per type
      if (metrics[type].length > 50) {
        metrics[type] = metrics[type].slice(-50);
      }

      sessionStorage.setItem('perf_metrics', JSON.stringify(metrics));
    } catch (error) {
      console.error('Failed to store performance metric:', error);
    }
  }

  /**
   * Get stored metrics by type
   */
  private getStoredMetrics(type: string): any[] {
    try {
      const stored = sessionStorage.getItem('perf_metrics') || '{}';
      const metrics = JSON.parse(stored);
      return metrics[type] || [];
    } catch {
      return [];
    }
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('perf_monitor', enabled ? 'true' : 'false');
  }
}

// Singleton instance
export const perfMonitor = new PerformanceMonitor();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).perfMonitor = perfMonitor;
}

/**
 * Usage in console:
 *
 * perfMonitor.getSummary() - View performance summary
 * perfMonitor.clear() - Clear all metrics
 * perfMonitor.export() - Export metrics as JSON
 * perfMonitor.setEnabled(true/false) - Enable/disable monitoring
 */
