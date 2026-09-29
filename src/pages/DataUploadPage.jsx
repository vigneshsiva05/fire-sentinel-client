import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  ShieldCheck,
  Database,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
  Globe,
  Radio,
  Satellite,
  Link as LinkIcon,
  RefreshCw,
  Info,
  Check,
  Download,
  Flame,
  FileSpreadsheet
} from 'lucide-react';
import { uploadService } from '../services/uploadService';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DataUploadPage = () => {
  const { hasRole } = useAuth();

  const [activeTab, setActiveTab] = useState('firms'); // 'firms' | 'upload' | 'presets'
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [ingestionResult, setIngestionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [batches, setBatches] = useState([]);

  // NASA FIRMS Live Connector State
  const [firmsMapKey, setFirmsMapKey] = useState('');
  const [firmsCountry, setFirmsCountry] = useState('IND');
  const [firmsSensor, setFirmsSensor] = useState('VIIRS_SNPP_NRT');
  const [firmsDayRange, setFirmsDayRange] = useState('1');

  // Direct URL Ingestion State
  const [customUrl, setCustomUrl] = useState('');

  const pipelineSteps = [
    { title: 'Data Ingestion & CSV Parsing', desc: 'Validating coordinates [-90,90; -180,180] & deduplication' },
    { title: 'Spatial DBSCAN Clustering', desc: 'Haversine distance grouping into contiguous fire event clusters' },
    { title: 'AI Fire Classification', desc: 'Random Forest model predicting Wildfire vs Agricultural vs Industrial' },
    { title: 'Multi-Criteria Risk Calculation', desc: 'Calibrating Intensity + Spatial + Exposure + Confidence weights' },
    { title: 'Convex Hull Delineation & Storage', desc: 'Generating GeoJSON polygons and storing in MongoDB 2dsphere index' },
  ];

  const fetchBatches = async () => {
    try {
      const res = await uploadService.getUploadBatches();
      if (res.success) setBatches(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch batches:', err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const simulatePipeline = () => {
    setPipelineStep(1);
    const t1 = setTimeout(() => setPipelineStep(2), 400);
    const t2 = setTimeout(() => setPipelineStep(3), 900);
    const t3 = setTimeout(() => setPipelineStep(4), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 1. Execute Manual File Upload
  const executeUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIngestionResult(null);

      const clearTimer = simulatePipeline();

      const res = await uploadService.uploadFile(file, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      clearTimer();
      setPipelineStep(5);

      if (res.success) {
        setIngestionResult(res.data);
        setSuccessMessage(`File "${file.name}" ingested successfully!`);
        setFile(null);
        fetchBatches();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Data ingestion pipeline failed');
    } finally {
      setUploading(false);
    }
  };

  // 2. Execute Live NASA FIRMS API Fetch
  const handleFetchNasaFirms = async () => {
    try {
      setUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIngestionResult(null);

      const clearTimer = simulatePipeline();

      const res = await uploadService.fetchNasaFirms({
        mapKey: firmsMapKey,
        country: firmsCountry,
        source: firmsSensor,
        dayRange: parseInt(firmsDayRange, 10) || 1,
      });

      clearTimer();
      setPipelineStep(5);

      if (res.success) {
        setIngestionResult(res.data);
        setSuccessMessage(`NASA FIRMS ${firmsSensor} telemetry for ${firmsCountry} ingested & analyzed!`);
        fetchBatches();
      }
    } catch (err) {
      setErrorMessage(err.message || 'NASA FIRMS fetch failed');
    } finally {
      setUploading(false);
    }
  };

  // 3. Execute Remote Dataset URL Ingestion
  const handleIngestFromUrl = async () => {
    if (!customUrl.trim()) return;

    try {
      setUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIngestionResult(null);

      const clearTimer = simulatePipeline();

      const res = await uploadService.ingestFromUrl(customUrl.trim());

      clearTimer();
      setPipelineStep(5);

      if (res.success) {
        setIngestionResult(res.data);
        setSuccessMessage(`Data from URL fetched and processed successfully!`);
        setCustomUrl('');
        fetchBatches();
      }
    } catch (err) {
      setErrorMessage(err.message || 'URL ingestion failed');
    } finally {
      setUploading(false);
    }
  };

  // 4. Execute 1-Click Demo / Authentic Dataset Ingestion
  const handleLoadDemoPreset = async (presetType) => {
    try {
      setUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIngestionResult(null);

      const clearTimer = simulatePipeline();

      const res = await uploadService.loadDemoDataset(presetType);

      clearTimer();
      setPipelineStep(5);

      if (res.success) {
        setIngestionResult(res.data);
        setSuccessMessage(`Dataset loaded & AI processed successfully!`);
        fetchBatches();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Demo preset loading failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-mono">
            <UploadCloud className="w-5 h-5 text-fire-500" />
            NASA FIRMS Satellite Data Ingestion & AI Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect live NASA FIRMS feeds, download real satellite observations, or upload CSV/JSON for automated clustering & risk scoring
          </p>
        </div>

        {/* External FIRMS Portal Link Button */}
        <a
          href="https://firms.modaps.eosdis.nasa.gov/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-fire-600 to-amber-600 hover:from-fire-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-fire-600/20 transition-all border border-fire-400/30 hover:scale-[1.02] shrink-0"
        >
          <Satellite className="w-4 h-4" />
          <span>Open NASA FIRMS Download Portal</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-slate-800 gap-2 pb-1">
        <button
          onClick={() => setActiveTab('firms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
            activeTab === 'firms'
              ? 'bg-fire-500/10 text-fire-400 border-fire-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-dark-850'
          }`}
        >
          <Satellite className="w-4 h-4" />
          <span>NASA FIRMS Real Dataset Hub</span>
          <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase rounded bg-fire-500/20 text-fire-300">
            Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
            activeTab === 'upload'
              ? 'bg-fire-500/10 text-fire-400 border-fire-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-dark-850'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Manual CSV / JSON Upload</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
            activeTab === 'presets'
              ? 'bg-fire-500/10 text-fire-400 border-fire-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-dark-850'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Incident Scenario Presets</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: NASA FIRMS REAL DATASET HUB */}
      {activeTab === 'firms' && (
        <div className="space-y-6">
          {/* Hero NASA FIRMS Official Direct Link & Guide Card */}
          <div className="rounded-2xl bg-gradient-to-br from-dark-850 via-slate-900 to-dark-850 border border-slate-800 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-fire-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-fire-500/20 text-fire-400 border border-fire-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Official Data Source: NASA EOSDIS
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping-slow"></span>
                    VIIRS 375m & MODIS 1km NRT Active
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white tracking-tight">
                  NASA Fire Information for Resource Management System (FIRMS)
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  FIRMS distributes Near Real-Time (NRT) active fire data within 3 hours of satellite observation from the 
                  <strong className="text-white"> VIIRS (Suomi-NPP, NOAA-20, NOAA-21) 375m</strong> and 
                  <strong className="text-white"> MODIS (Terra & Aqua) 1km</strong> sensors. Download country-level archives, 
                  custom area shapes, or direct CSV streams to feed IGNIS-AI's real-time detection pipeline.
                </p>

                {/* Direct Links Grid */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <a
                    href="https://firms.modaps.eosdis.nasa.gov/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fire-600 hover:bg-fire-500 text-white text-xs font-semibold shadow-md shadow-fire-600/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>firms.modaps.eosdis.nasa.gov/download/</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  <a
                    href="https://firms.modaps.eosdis.nasa.gov/map/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>NASA FIRMS Global Fire Map</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <a
                    href="https://firms.modaps.eosdis.nasa.gov/api/map_key/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Get Free NASA Map Key</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Step Guide Box */}
              <div className="rounded-xl bg-dark-900/80 border border-slate-800 p-4 space-y-2.5 text-xs">
                <p className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-fire-400" />
                  How to Download & Ingest FIRMS Data
                </p>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-fire-500/20 text-fire-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <span>Visit <a href="https://firms.modaps.eosdis.nasa.gov/download/" target="_blank" rel="noopener noreferrer" className="text-fire-400 underline">NASA FIRMS Download</a></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-fire-500/20 text-fire-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <span>Select <strong className="text-white">Country (India)</strong> or bounding box</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-fire-500/20 text-fire-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <span>Choose <strong className="text-white">VIIRS 375m</strong> or <strong className="text-white">MODIS 1km</strong> CSV</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-fire-500/20 text-fire-400 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                    <span>Upload CSV here or use the direct Live Ingest connector below</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Ingestion Columns: Live NASA API Ingest + Direct URL Ingest */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Live NASA FIRMS API Connector */}
            <div className="rounded-xl bg-dark-850 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-fire-500/10 text-fire-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Live NASA FIRMS Country Connector
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Direct HTTP Stream from NASA API Gateway
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  Direct API
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">
                    NASA FIRMS MAP_KEY <span className="text-slate-500">(Optional - leave blank for pre-authenticated feed)</span>
                  </label>
                  <input
                    type="text"
                    value={firmsMapKey}
                    onChange={(e) => setFirmsMapKey(e.target.value)}
                    placeholder="Enter your 32-character NASA Map Key"
                    className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-fire-500"
                  />
                  <div className="flex justify-between items-center mt-1 text-[10px]">
                    <span className="text-slate-500">Endpoint: /api/country/csv/[KEY]/[SENSOR]/[COUNTRY]/[DAYS]</span>
                    <a
                      href="https://firms.modaps.eosdis.nasa.gov/api/map_key/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fire-400 hover:underline flex items-center gap-0.5"
                    >
                      Get Free Key <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Satellite Sensor</label>
                    <select
                      value={firmsSensor}
                      onChange={(e) => setFirmsSensor(e.target.value)}
                      className="w-full bg-dark-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-fire-500"
                    >
                      <option value="VIIRS_SNPP_NRT">VIIRS S-NPP (375m)</option>
                      <option value="VIIRS_NOAA20_NRT">VIIRS NOAA-20 (375m)</option>
                      <option value="VIIRS_NOAA21_NRT">VIIRS NOAA-21 (375m)</option>
                      <option value="MODIS_NRT">MODIS Terra & Aqua (1km)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Country / Region</label>
                    <select
                      value={firmsCountry}
                      onChange={(e) => setFirmsCountry(e.target.value)}
                      className="w-full bg-dark-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-fire-500"
                    >
                      <option value="IND">India (IND)</option>
                      <option value="USA">United States (USA)</option>
                      <option value="AUS">Australia (AUS)</option>
                      <option value="CAN">Canada (CAN)</option>
                      <option value="BRA">Brazil (BRA)</option>
                      <option value="IDN">Indonesia (IDN)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Time Window</label>
                    <select
                      value={firmsDayRange}
                      onChange={(e) => setFirmsDayRange(e.target.value)}
                      className="w-full bg-dark-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-fire-500"
                    >
                      <option value="1">Past 24 Hours (1 Day)</option>
                      <option value="2">Past 48 Hours (2 Days)</option>
                      <option value="7">Past 7 Days</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleFetchNasaFirms}
                  disabled={uploading}
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-fire-600 to-amber-600 hover:from-fire-500 hover:to-amber-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-fire-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Radio className={`w-4 h-4 ${uploading ? 'animate-spin' : ''}`} />
                  <span>{uploading ? 'Connecting & Processing Telemetry...' : 'Fetch & Ingest Real NASA FIRMS Feed'}</span>
                </button>
              </div>
            </div>

            {/* 2. Direct Remote URL Ingestion */}
            <div className="rounded-xl bg-dark-850 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Direct Dataset URL Ingestion
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Paste any remote NASA FIRMS CSV, KML, or GeoJSON link
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/30">
                  Remote Fetch
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Remote Dataset URL</label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://firms.modaps.eosdis.nasa.gov/api/country/csv/... or raw CSV link"
                    className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] text-slate-400">Quick URL Presets:</p>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setCustomUrl('https://firms.modaps.eosdis.nasa.gov/api/country/csv/demo/VIIRS_SNPP_NRT/IND/1')}
                      className="px-2 py-1 rounded bg-dark-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors truncate max-w-full"
                    >
                      FIRMS VIIRS India 24h Feed
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomUrl('https://firms.modaps.eosdis.nasa.gov/api/country/csv/demo/MODIS_NRT/IND/1')}
                      className="px-2 py-1 rounded bg-dark-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors truncate max-w-full"
                    >
                      FIRMS MODIS India 24h Feed
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleIngestFromUrl}
                  disabled={uploading || !customUrl.trim()}
                  className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${uploading ? 'animate-spin' : ''}`} />
                  <span>{uploading ? 'Fetching from Remote URL...' : 'Fetch & Ingest from URL'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Pre-Configured Real FIRMS Datasets (1-Click Loaders) */}
          <div className="rounded-xl bg-dark-850 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Real NASA FIRMS Calibrated Datasets (1-Click Pipeline)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Pre-processed authentic FIRMS telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleLoadDemoPreset('firms_viirs')}
                disabled={uploading}
                className="text-left p-3.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-fire-500/50 hover:bg-slate-800/40 transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-fire-400 transition-colors">
                    Real VIIRS 375m India Active
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-fire-500/20 text-fire-300">
                    VIIRS NRT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Authentic 375m resolution active fire observations across India (Punjab, Uttarakhand, Odisha).
                </p>
              </button>

              <button
                onClick={() => handleLoadDemoPreset('firms_modis')}
                disabled={uploading}
                className="text-left p-3.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    Real MODIS 1km Thermal Data
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    MODIS 6.1
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Standard 1km thermal anomaly observations from Terra & Aqua satellites over India.
                </p>
              </button>

              <button
                onClick={() => handleLoadDemoPreset('punjab')}
                disabled={uploading}
                className="text-left p-3.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/40 transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    Punjab Agricultural Stubble
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Agri Spike
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  High-density crop residue burning cluster dataset (Sangrur, Patiala, Ludhiana).
                </p>
              </button>

              <button
                onClick={() => handleLoadDemoPreset('uttarakhand')}
                disabled={uploading}
                className="text-left p-3.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-800/40 transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                    Uttarakhand Wildfire Spike
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                    High FRP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Extreme Fire Radiative Power (&gt;300 MW) mountain forest fire cluster in Garhwal.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL CSV / JSON UPLOAD */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-dark-850 border border-slate-800 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Upload Local FIRMS CSV / JSON Dataset
            </h3>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                isDragging
                  ? 'border-fire-500 bg-fire-500/10'
                  : 'border-slate-700/80 bg-dark-900/50 hover:border-slate-600'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-fire-500/10 border border-fire-500/30 flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7 text-fire-500" />
              </div>

              <p className="text-sm font-semibold text-white">
                {file ? file.name : 'Drag & drop your satellite observation file here'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports NASA FIRMS formatted <strong className="text-slate-200">.csv</strong> and <strong className="text-slate-200">.json</strong> (Up to 25 MB)
              </p>

              <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold cursor-pointer border border-slate-600 transition-colors">
                <FileText className="w-4 h-4 text-fire-400" />
                <span>Browse Local File</span>
                <input type="file" accept=".csv,.json" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-dark-900 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-fire-400" />
                  <span className="text-xs font-mono text-white">{file.name}</span>
                  <span className="text-[10px] text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>

                <button
                  onClick={executeUpload}
                  disabled={uploading}
                  className="px-4 py-1.5 bg-fire-600 hover:bg-fire-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-fire-600/20 transition-all disabled:opacity-50"
                >
                  {uploading ? 'Processing AI Pipeline...' : 'Run Pipeline & Ingest'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: HAZARD SCENARIO PRESETS */}
      {activeTab === 'presets' && (
        <div className="rounded-xl bg-dark-850 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fire-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Instant Pre-configured Incident Scenarios
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Load specialized benchmark scenarios to demonstrate AI classification, spatial clustering, and multi-factor risk scoring:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <button
              onClick={() => handleLoadDemoPreset('mixed')}
              disabled={uploading}
              className="text-left p-4 rounded-xl bg-dark-900 border border-slate-800 hover:border-fire-500/50 hover:bg-slate-800/40 transition-all text-xs space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-fire-400 transition-colors">
                  National Mixed Anomaly Set
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-fire-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Combined dataset featuring forest, agricultural, and industrial clusters across India.
              </p>
            </button>

            <button
              onClick={() => handleLoadDemoPreset('punjab')}
              disabled={uploading}
              className="text-left p-4 rounded-xl bg-dark-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/40 transition-all text-xs space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                  Punjab Agricultural Stubble
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                High-density spatial crop burning anomalies (Sangrur, Ludhiana, Patiala).
              </p>
            </button>

            <button
              onClick={() => handleLoadDemoPreset('uttarakhand')}
              disabled={uploading}
              className="text-left p-4 rounded-xl bg-dark-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-800/40 transition-all text-xs space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-red-400 transition-colors">
                  Uttarakhand Himalayan Wildfire
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Extreme FRP (&gt;300 MW) mountain forest fire cluster in Garhwal division.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Pipeline Execution Flow Status */}
      {uploading && (
        <div className="rounded-xl bg-dark-850 border border-fire-500/30 p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-fire-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 animate-spin" />
              AI Pipeline Execution In Progress...
            </span>
            <span className="text-xs font-mono text-slate-400">Step {pipelineStep} of 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {pipelineSteps.map((step, idx) => {
              const isCompleted = pipelineStep > idx + 1;
              const isCurrent = pipelineStep === idx + 1;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isCurrent
                      ? 'bg-fire-500/15 border-fire-500/50 text-fire-300 animate-pulse'
                      : 'bg-dark-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <p className="font-bold truncate">{step.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ingestion Results Summary Card */}
      {ingestionResult && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Ingestion & AI Processing Pipeline Completed
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Batch: {ingestionResult.batchId}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-mono pt-1">
            <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Total Records</span>
              <span className="text-white font-bold">{ingestionResult.stats?.total_records}</span>
            </div>
            <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Valid Records</span>
              <span className="text-emerald-400 font-bold">{ingestionResult.stats?.valid_records}</span>
            </div>
            <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Duplicates Filtered</span>
              <span className="text-amber-400 font-bold">{ingestionResult.stats?.duplicates_removed}</span>
            </div>
            <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Fire Clusters Formed</span>
              <span className="text-blue-400 font-bold">{ingestionResult.stats?.totalClustersCreated}</span>
            </div>
            <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Alerts Triggered</span>
              <span className="text-red-400 font-bold">{ingestionResult.stats?.alertsGenerated}</span>
            </div>
            <div className="p-2.5 rounded bg-dark-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Pipeline Latency</span>
              <span className="text-slate-300 font-bold">{ingestionResult.stats?.processingTimeMs} ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Historical Batch Audit Logs */}
      <div className="rounded-xl bg-dark-850 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Ingestion Batch History & Telemetry Logs
          </h3>
          <span className="text-xs font-mono text-slate-400">{batches.length} uploads logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-dark-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Batch ID</th>
                <th className="p-3">File / Source</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Valid Hotspots</th>
                <th className="p-3">Clusters</th>
                <th className="p-3">Time</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {batches.map((b) => (
                <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{b.batchId}</td>
                  <td className="p-3 text-slate-300">{b.fileName}</td>
                  <td className="p-3 text-slate-400">{b.uploadedByName}</td>
                  <td className="p-3 text-emerald-400 font-bold">{b.validRecords}</td>
                  <td className="p-3 text-blue-400 font-bold">{b.totalClustersCreated}</td>
                  <td className="p-3 text-slate-400">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
