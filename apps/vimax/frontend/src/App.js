/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';
import Sidebar from './components/Sidebar';
import WizardProgress from './components/WizardProgress';
import TemplateLibrary from './components/TemplateLibrary';
import HistoryView from './components/HistoryView';
import PipelineSelectStep from './steps/PipelineSelectStep';
import IntakeStep from './steps/IntakeStep';
import ContentStep from './steps/ContentStep';
import StyleStep from './steps/StyleStep';
import GenerationStep from './steps/GenerationStep';
import ResultStep from './steps/ResultStep';
import { ViMaxLayout } from './layout/ViMaxLayout';
import {
  upsertUser,
  getUserJobs,
  insertJob,
  insertFeedback,
  incrementTemplateUsage,
  getUserBatches,
  trackPipelineSelection,
} from './supabase';
import './App.css';

const STEP_INTAKE = 0;
const STEP_CONTENT = 1;
const STEP_STYLE = 2;
const STEP_GENERATION = 3;
const STEP_RESULT = 4;

function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function getApiBaseUrl() {
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
}

function getGenerateVideoUrl() {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/functions/v1/generate-video-proxy`;
  }
  return `${getApiBaseUrl()}/generate-video`;
}

function getEnhanceTextUrl() {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/functions/v1/enhance-text`;
  }
  return `${getApiBaseUrl()}/enhance-text`;
}

const DEFAULT_FORM = {
  pipeline: 'idea2video',
  idea: '',
  script: '',
  requirement: '',
  style: 'Cinematic',
  quality: 'standard',
  resolution: '1080p',
  format: 'mp4',
  imageGenerator: 'google',
  videoGenerator: 'google',
  scriptFile: null,
  novelFile: null,
  photoFile: null,
  referenceVideoFile: null,
};

export default function App() {
  const { theme } = useTheme();
  const { showSuccess, showError, showInfo } = useToast();

  const [activeView, setActiveView] = useState('wizard');
  const [currentStep, setCurrentStep] = useState(STEP_INTAKE);
  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [apiKey, setApiKey] = useState(localStorage.getItem('vimax_api_key') || '');

  const [userId, setUserId] = useState('');
  const [userHistory, setUserHistory] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [userBatches, setUserBatches] = useState([]);

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [scenes, setScenes] = useState([]);

  const wsRef = useRef(null);
  const heartbeatRef = useRef(null);
  const reconnectRef = useRef(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    const storedId = localStorage.getItem('vimax_user_id');
    const id = storedId || generateUserId();
    if (!storedId) localStorage.setItem('vimax_user_id', id);
    setUserId(id);
    loadUserData(id);
  }, []);

  useEffect(() => {
    if (apiKey) localStorage.setItem('vimax_api_key', apiKey);
    else localStorage.removeItem('vimax_api_key');
  }, [apiKey]);

  const loadUserData = async (uid) => {
    try {
      await upsertUser(uid);
      const [jobs, batches] = await Promise.all([
        getUserJobs(uid, 50),
        getUserBatches(uid),
      ]);
      setUserHistory(jobs);
      setUserBatches(batches);
      if (jobs.length > 0) {
        const ratings = jobs.filter(j => j.rating).map(j => j.rating);
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        setUserStats({ total_generations: jobs.length, average_rating: avgRating });
      }
    } catch {
      setUserHistory([]);
      setUserBatches([]);
      setUserStats({ total_generations: 0, average_rating: 0 });
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const maxAttempts = 5;

    const connect = () => {
      if (reconnectAttempts.current >= maxAttempts) {
        setWsStatus('failed');
        return;
      }
      setWsStatus('connecting');
      const ws = new WebSocket(`ws://localhost:8000/ws/job/${jobId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
        reconnectAttempts.current = 0;
        heartbeatRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }));
        }, 25000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ping') ws.send(JSON.stringify({ type: 'pong' }));
          else if (data.type !== 'pong') {
            setJobStatus(data);
            if (Array.isArray(data.scenes)) setScenes(data.scenes);
            if (data.status === 'completed') {
              setCurrentStep(STEP_RESULT);
              showSuccess('Your video is ready!');
              loadUserData(userId);
            }
          }
        } catch {}
      };

      ws.onclose = (event) => {
        setWsStatus('disconnected');
        clearInterval(heartbeatRef.current);
        if (!event.wasClean && reconnectAttempts.current < maxAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current - 1), 30000);
          reconnectRef.current = setTimeout(connect, delay);
        } else if (reconnectAttempts.current >= maxAttempts) {
          setWsStatus('failed');
        }
      };

      ws.onerror = () => setWsStatus('error');
    };

    connect();

    return () => {
      wsRef.current?.close();
      clearInterval(heartbeatRef.current);
      clearTimeout(reconnectRef.current);
    };
  }, [jobId]);

  const pollRef = useRef(null);

  useEffect(() => {
    if (wsStatus !== 'failed' || !jobId) return;
    const poll = async () => {
      try {
        const apiBase = getApiBaseUrl();
        const res = await fetch(`${apiBase}/job/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJobStatus(data);
          if (Array.isArray(data.scenes)) setScenes(data.scenes);
          if (data.status === 'completed') {
            clearInterval(pollRef.current);
            setCurrentStep(STEP_RESULT);
            showSuccess('Your video is ready!');
            loadUserData(userId);
          } else if (data.status === 'failed') {
            clearInterval(pollRef.current);
          }
        }
      } catch {}
    };
    pollRef.current = setInterval(poll, 5000);
    poll();
    return () => clearInterval(pollRef.current);
  }, [wsStatus, jobId, userId]);

  const updateForm = (updates) => setFormData(prev => ({ ...prev, ...updates }));

  const handleEnhance = async (text) => {
    if (!text || text.trim().length < 10) {
      showError('Please enter at least 10 characters before enhancing.');
      return;
    }
    setIsEnhancing(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
      if (anonKey) {
        headers['Authorization'] = `Bearer ${anonKey}`;
        headers['Apikey'] = anonKey;
      } else if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
      const response = await fetch(getEnhanceTextUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: text.trim(), pipeline_type: formData.pipeline }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Enhancement failed.');
      }
      if (formData.pipeline === 'idea2video' || formData.pipeline === 'cameo') {
        updateForm({ idea: data.enhanced_text });
      } else {
        updateForm({ script: data.enhanced_text });
      }
      showSuccess('Text enhanced successfully!');
    } catch (err) {
      showError(err.message || 'Enhancement failed. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleIntakeComplete = (result) => {
    const pipeline = result.pipeline || 'idea2video';
    updateForm({
      idea: result.idea || '',
      pipeline,
      style: result.style || 'Cinematic',
    });
    try { trackPipelineSelection({ userId, pipelineType: pipeline, source: 'ai_assistant' }); } catch {}
    setCurrentStep(STEP_CONTENT);
  };

  const handleTemplateSelect = async (template) => {
    updateForm({
      pipeline: template.pipeline_type,
      style: template.style,
      quality: template.quality,
      idea: template.pipeline_type !== 'script2video' ? template.sample_idea : '',
      script: template.pipeline_type === 'script2video' ? template.sample_idea : '',
    });
    try { await incrementTemplateUsage(template.id); } catch {}
    setActiveView('wizard');
    setCurrentStep(STEP_CONTENT);
  };

  const handleHistoryReuse = (item) => {
    updateForm({
      pipeline: item.pipeline_type || 'idea2video',
      idea: item.idea || item.input_idea || '',
      script: item.script || item.input_script || '',
      style: item.style || 'Cinematic',
      quality: item.quality || 'standard',
    });
    setActiveView('wizard');
    setCurrentStep(STEP_CONTENT);
  };

  const handleGenerate = async () => {
    const form = new FormData();
    form.append('user_id', userId);
    form.append('pipeline_type', formData.pipeline);
    form.append('idea', formData.idea);
    form.append('script', formData.script);
    form.append('user_requirement', formData.requirement);
    form.append('style', formData.style);
    form.append('image_generator', formData.imageGenerator);
    form.append('video_generator', formData.videoGenerator);
    form.append('quality', formData.quality);
    form.append('resolution', formData.resolution);
    form.append('format', formData.format);
    if (formData.scriptFile) form.append('script_file', formData.scriptFile);
    if (formData.novelFile) form.append('novel_file', formData.novelFile);
    if (formData.photoFile) form.append('photo_file', formData.photoFile);
    if (formData.referenceVideoFile) form.append('reference_video', formData.referenceVideoFile);

    const headers = {};
    const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    if (anonKey) {
      headers['Authorization'] = `Bearer ${anonKey}`;
      headers['Apikey'] = anonKey;
    } else if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    try {
      showInfo('Starting video generation...', 3000);
      const response = await axios.post(getGenerateVideoUrl(), form, { headers });
      const newJobId = response.data.job_id;
      setJobId(newJobId);
      setJobStatus({ status: 'processing', progress: 0, message: 'Starting...' });
      setCurrentStep(STEP_GENERATION);
      try {
        await insertJob({
          id: newJobId,
          user_id: userId,
          pipeline_type: formData.pipeline,
          idea: formData.idea,
          script: formData.script,
          style: formData.style,
          quality: formData.quality,
          resolution: formData.resolution,
          status: 'processing',
        });
      } catch {}
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const message = typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map(d => d.msg || d).join('; ')
          : 'Failed to start generation. Please check your API key and try again.';
      showError(message);
    }
  };

  const handleSubmitFeedback = async ({ rating, comments, followUpAnswer }) => {
    try {
      await insertFeedback({
        job_id: jobId,
        user_id: userId,
        rating,
        comments,
        follow_up_answer: followUpAnswer || '',
      });
    } catch {}
  };

  const handleNewVideo = () => {
    setCurrentStep(STEP_INTAKE);
    setFormData({ ...DEFAULT_FORM });
    setJobId(null);
    setJobStatus(null);
    setScenes([]);
    setActiveView('wizard');
    setShowAIAssistant(false);
  };

  const handlePipelineSelect = (pipelineValue) => {
    setFormData(prev => ({
      ...prev,
      pipeline: pipelineValue,
      idea: '',
      script: '',
      requirement: '',
      scriptFile: null,
      novelFile: null,
      photoFile: null,
      referenceVideoFile: null,
    }));
    try { trackPipelineSelection({ userId, pipelineType: pipelineValue, source: 'card' }); } catch {}
    setCurrentStep(STEP_CONTENT);
  };

  const canProceedFromContent = () => {
    const { pipeline, idea, script, photoFile } = formData;
    if (pipeline === 'idea2video') return idea.trim().length > 10;
    if (pipeline === 'script2video') return script.trim().length > 20 || formData.scriptFile;
    if (pipeline === 'novel2video') return script.trim().length > 20 || formData.novelFile || formData.scriptFile;
    if (pipeline === 'cameo') return idea.trim().length > 5 && !!photoFile;
    return true;
  };

  const renderWizardContent = () => {
    switch (currentStep) {
      case STEP_INTAKE:
        if (showAIAssistant) {
          return (
            <IntakeStep
              onComplete={handleIntakeComplete}
              onSkip={() => { setShowAIAssistant(false); setCurrentStep(STEP_CONTENT); }}
            />
          );
        }
        return (
          <PipelineSelectStep
            onSelect={handlePipelineSelect}
            onUseAI={() => setShowAIAssistant(true)}
          />
        );
      case STEP_CONTENT:
        return <ContentStep formData={formData} onUpdate={updateForm} onEnhance={handleEnhance} isEnhancing={isEnhancing} onError={showError} />;
      case STEP_STYLE:
        return <StyleStep formData={formData} onUpdate={updateForm} />;
      case STEP_GENERATION:
        return (
          <GenerationStep
            jobStatus={jobStatus}
            jobId={jobId}
            scenes={scenes}
            wsStatus={wsStatus}
            onCancel={handleNewVideo}
          />
        );
      case STEP_RESULT:
        return (
          <ResultStep
            jobId={jobId}
            scenes={scenes}
            onStartNew={handleNewVideo}
            onSubmitFeedback={handleSubmitFeedback}
          />
        );
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (currentStep === STEP_INTAKE) return null;
    if (currentStep === STEP_GENERATION) return null;
    if (currentStep === STEP_RESULT) return null;

    const isLast = currentStep === STEP_STYLE;

    return (
      <div className="wizard-footer">
        <div className="wizard-footer-left">
          {currentStep > STEP_INTAKE && currentStep < STEP_GENERATION && (
            <button
              className="btn-back"
              onClick={() => setCurrentStep(s => Math.max(STEP_INTAKE + 1, s - 1))}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M8.5 3L3.5 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}
        </div>
        <div className="wizard-footer-right">
          {isLast ? (
            <button
              className="btn-generate"
              onClick={handleGenerate}
              disabled={!canProceedFromContent()}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 9L3 2.5v13L15 9Z" fill="currentColor" />
              </svg>
              Generate Video
            </button>
          ) : (
            <button
              className="btn-next"
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={currentStep === STEP_CONTENT && !canProceedFromContent()}
            >
              Continue
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.5 3L10.5 7l-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderView = () => {
    if (activeView === 'templates') {
      return (
        <div className="app-content animate-fade-in">
          <TemplateLibrary onSelect={handleTemplateSelect} />
        </div>
      );
    }

    if (activeView === 'history') {
      return (
        <div className="app-content animate-fade-in">
          <HistoryView history={userHistory} onReuse={handleHistoryReuse} />
        </div>
      );
    }

    if (activeView === 'batches') {
      return (
        <div className="app-content animate-fade-in">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>Batches</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
              {userBatches.length} batch{userBatches.length !== 1 ? 'es' : ''}
            </p>
            {userBatches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-16) 0', color: 'var(--text-tertiary)' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 'var(--space-3)', display: 'block', margin: '0 auto var(--space-3)' }}>
                  <rect x="6" y="12" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M14 12V9a2 2 0 012-2h16a2 2 0 012 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)' }}>No batches yet</p>
              </div>
            ) : (
              userBatches.map(batch => (
                <div key={batch.id || batch.batch_id} style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>{batch.name || 'Unnamed Batch'}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{batch.status}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {new Date(batch.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="wizard-container">
        <div className="api-key-bar">
          <label htmlFor="apiKey">API Key</label>
          <input
            id="apiKey"
            type="password"
            className="api-key-input"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key (optional in dev mode)"
          />
        </div>

        {currentStep !== STEP_INTAKE && currentStep !== STEP_RESULT && (
          <WizardProgress
            currentStep={currentStep}
            onStepClick={(s) => {
              if (s < currentStep && s >= STEP_CONTENT) setCurrentStep(s);
            }}
          />
        )}

        <div className="app-content">
          <div className="wizard-body">
            {renderWizardContent()}
          </div>
        </div>

        {renderFooter()}
      </div>
    );
  };

  return (
    <ViMaxLayout currentView={activeView} onViewChange={setActiveView}>
      <div className="app-layout">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          userStats={userStats}
          historyCount={userHistory.length}
          batchCount={userBatches.length}
          onNewVideo={handleNewVideo}
        />
        <main className="app-main">
          {renderView()}
        </main>
      </div>
    </ViMaxLayout>
  );
}
