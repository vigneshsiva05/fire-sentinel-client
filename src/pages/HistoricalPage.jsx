import React, { useState, useEffect } from 'react';
import { History, Calendar, MapPin, Gauge, Layers, Filter, TrendingUp, Sparkles } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { RiskBadge } from '../components/common/RiskBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatFRP, formatCoords, formatArea } from '../utils/formatters';

export const HistoricalPage = () => {
  const [events, setEvents] = useState([]);
  const [yearlyTrends, setYearlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchHistorical = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getHistoricalEvents({
          year: yearFilter || undefined,
          classification: categoryFilter !== 'All' ? categoryFilter : undefined,
        });
        if (res.success) {
          setEvents(res.data || []);
          setYearlyTrends(res.yearlyTrends || []);
        }
      } catch (err) {
        console.error('Historical fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorical();
  }, [yearFilter, categoryFilter]);

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <History className="w-5 h-5 text-fire-500" />
          Historical Satellite Fire Archive & Multi-Year Comparisons
        </h1>
        <p className="text-xs text-slate-400">
          Comparative longitudinal analysis across seasons, forest divisions, and agricultural cycles
        </p>
      </div>

      {/* Yearly Trends Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {yearlyTrends.map((yt) => (
          <div key={yt.year} className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-white font-mono">Season {yt.year}</span>
              <span className="text-xs font-mono text-fire-400 bg-fire-500/10 px-2 py-0.5 rounded border border-fire-500/20">
                {yt.eventCount} Major Events
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Aggregated Hotspots</span>
                <span className="text-white font-bold">{yt.totalHotspots.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Total Radiative Power</span>
                <span className="text-fire-400 font-bold">{formatFRP(yt.totalFRP)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-dark-850/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase text-[11px]">
          <Filter className="w-3.5 h-3.5 text-fire-500" />
          <span>Archive Filter:</span>
        </div>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-fire-500 font-mono"
        >
          <option value="">All Historical Years</option>
          <option value="2025">2025 Season</option>
          <option value="2024">2024 Season</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-fire-500"
        >
          <option value="All">All Classifications</option>
          <option value="Forest / Wildfire">Forest / Wildfire</option>
          <option value="Agricultural / Crop Residue Burning">Agricultural Burning</option>
          <option value="Industrial Fire">Industrial Fire</option>
        </select>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner text="Retrieving archived satellite incident records..." />
        ) : events.length > 0 ? (
          events.map((ev) => (
            <div
              key={ev.eventId || ev._id}
              className="p-5 rounded-xl bg-dark-850/90 border border-slate-800 space-y-3 transition-all hover:border-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-fire-400">{ev.eventId}</span>
                  <h3 className="text-sm font-bold text-white">{ev.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={ev.riskLevel} size="sm" />
                  <span className="text-xs text-slate-400 font-mono">{ev.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Region / Division</span>
                  <span className="text-slate-200 font-sans font-semibold">{ev.region}, {ev.state}</span>
                </div>

                <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Classification</span>
                  <CategoryBadge category={ev.classification} />
                </div>

                <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Aggregated FRP</span>
                  <span className="text-fire-400 font-bold">{formatFRP(ev.totalFRP)} (Peak {formatFRP(ev.maxFRP)})</span>
                </div>

                <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Est. Burn Extent</span>
                  <span className="text-blue-400 font-bold">{formatArea(ev.estimatedAreaKm2)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-dark-900/60 p-3 rounded-lg border border-slate-800/80">
                {ev.summary}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-xl bg-dark-850 border border-slate-800 text-slate-500 text-xs italic">
            No historical records found for active filters.
          </div>
        )}
      </div>
    </div>
  );
};
