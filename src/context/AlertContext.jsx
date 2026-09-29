import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { alertService } from '../services/alertService';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, acknowledged: 0, resolved: 0, criticalUnresolved: 0 });
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const [alertsRes, statsRes] = await Promise.all([
        alertService.getAlerts({ limit: 30 }),
        alertService.getAlertStats(),
      ]);

      if (alertsRes.success) setAlerts(alertsRes.data || []);
      if (statsRes.success) setStats(statsRes.data || {});
    } catch (err) {
      console.warn('Failed to fetch alerts:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    // Background polling interval for tactical notifications (every 30 seconds)
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const acknowledgeAlert = async (id) => {
    try {
      await alertService.updateAlertStatus(id, 'ACKNOWLEDGED');
      await fetchAlerts();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
      throw err;
    }
  };

  const resolveAlert = async (id) => {
    try {
      await alertService.updateAlertStatus(id, 'RESOLVED');
      await fetchAlerts();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
      throw err;
    }
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        stats,
        unreadCount: stats.new || 0,
        criticalCount: stats.criticalUnresolved || 0,
        loading,
        fetchAlerts,
        acknowledgeAlert,
        resolveAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
