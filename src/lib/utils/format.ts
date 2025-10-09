export const formatSecondsToTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0m';
    const s = Math.floor(seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    const totalMinutes = mins + (secs > 0 ? 1 : 0); // round up minutes only when leftover seconds exist
  
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    }
    return `${minutes}m`;
  };

  // Humanizes a duration given in seconds with compact units.
  // Examples: 45s, 5m, 1h 05m, 2d 3h
  export const formatDurationSeconds = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0s';
    const s = Math.floor(seconds);
    if (s < 60) return `${s}s`;
  
    const minutesCeil = Math.ceil(s / 60);
    if (minutesCeil < 60) return `${minutesCeil}m`;
  
    const totalHours = Math.floor(minutesCeil / 60);
    const remMinutes = minutesCeil % 60;
  
    if (totalHours < 24) {
      return `${totalHours}h ${remMinutes.toString().padStart(2, '0')}m`;
    }
  
    const days = Math.floor(totalHours / 24);
    const remHours = totalHours % 24;
    if (remHours === 0) return `${days}d`;
    return `${days}d ${remHours}h`;
  };

  export const formatDuration = (ms: number) => {
    if (!Number.isFinite(ms) || ms <= 0) return '0s';
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;

    const minutesCeil = Math.ceil(s / 60);
    if (minutesCeil < 60) return `${minutesCeil}m`;

    const totalHours = Math.floor(minutesCeil / 60);
    const remMinutes = minutesCeil % 60;
    const remSeconds = s % 60;

    if (totalHours < 24) {
      return `${totalHours}h ${remMinutes.toString().padStart(2, '0')}m ${remSeconds.toString().padStart(2, '0')}s`;
    }

    const days = Math.floor(totalHours / 24);
    const remHours = totalHours % 24;
    if (remHours === 0) return `${days}d`;
    return `${days}d ${remHours}h ${remMinutes.toString().padStart(2, '0')}m ${remSeconds.toString().padStart(2, '0')}s`;
  };