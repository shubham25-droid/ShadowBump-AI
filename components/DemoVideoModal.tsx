'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, ExternalLink, Video, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVideoUrl?: string;
}

export default function DemoVideoModal({
  isOpen,
  onClose,
  defaultVideoUrl = '',
}: DemoVideoModalProps) {
  // Check if env variable or prop exists
  const envUrl = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || defaultVideoUrl;
  const [videoUrl, setVideoUrl] = useState(envUrl);
  const [inputUrl, setInputUrl] = useState(envUrl);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Convert regular YouTube / Loom URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      // YouTube
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else {
          const params = new URLSearchParams(new URL(url).search);
          videoId = params.get('v') || '';
        }
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0` : '';
      }
      // Loom
      if (url.includes('loom.com/share/')) {
        const id = url.split('loom.com/share/')[1]?.split('?')[0];
        return id ? `https://www.loom.com/embed/${id}?autoplay=1` : '';
      }
      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);

  const scriptOutline = [
    {
      time: '0:00 - 0:25',
      title: 'The Problem',
      desc: 'Show silent breaking changes in Zod v3 to v4. Compiles fine, standard tests pass, but production API breaks due to deprecated error map.',
    },
    {
      time: '0:25 - 1:00',
      title: 'Twin Differential Execution',
      desc: 'Navigate to Workspace, trigger analysis. Show real parallel Node.js child processes executing in 36ms with 5 identical JSON vectors.',
    },
    {
      time: '1:00 - 1:30',
      title: 'Deterministic AST Evidence',
      desc: 'Review Results. Highlight how 3 regressions were caught by mathematical AST diffing before AI even touched the data.',
    },
    {
      time: '1:30 - 2:00',
      title: 'NVIDIA Nemotron via Nebius',
      desc: 'Show AI explanation explaining root cause and outputting exact before/after code diff for clean migration.',
    },
    {
      time: '2:00 - 2:15',
      title: 'Summary & Reproducibility',
      desc: 'Copy standalone terminal command to prove reproducible evidence.',
    },
  ];

  const handleCopyScript = () => {
    const text = scriptOutline.map(s => `[${s.time}] ${s.title}: ${s.desc}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-ink-primary/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-card border border-line rounded-card shadow-panel overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-hero/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-md bg-accent/10 border border-accent/20 text-accent">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-ink-primary text-base">
                ShadowBump AI - Product Demonstration
              </h2>
              <p className="text-xs text-ink-secondary">
                2-Minute Differential Testing & NVIDIA Nemotron AI Walkthrough
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-button text-ink-muted hover:text-ink-primary hover:bg-panelHover transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {embedUrl ? (
            /* Video Player Embed */
            <div className="relative w-full rounded-card overflow-hidden border border-line bg-black shadow-panel aspect-video">
              <iframe
                src={embedUrl}
                title="ShadowBump AI Demo Video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            /* Interactive Demo Hub & Recording Guide */
            <div className="space-y-5">
              <div className="p-5 rounded-card border border-tech/30 bg-hero/40 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-tech uppercase font-bold tracking-wider">
                      Demo Video Integration
                    </span>
                    <h3 className="font-heading font-bold text-ink-primary text-sm sm:text-base">
                      Attach or Embed Your Hackathon Video
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-ink-secondary px-2.5 py-1 rounded-full bg-card border border-line font-mono">
                    <Sparkles className="h-3 w-3 text-accent" />
                    <span>2-Min Recommended</span>
                  </div>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Paste a <strong>YouTube</strong> or <strong>Loom</strong> link below to preview the embedded player immediately, or configure <code className="text-tech font-mono">NEXT_PUBLIC_DEMO_VIDEO_URL</code> in your environment variables.
                </p>

                {/* URL Input Form */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="https://youtu.be/... or https://www.loom.com/share/..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs font-mono rounded-button border border-line bg-card text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <button
                    onClick={() => setVideoUrl(inputUrl)}
                    disabled={!inputUrl}
                    className="px-4 py-2 rounded-button bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    Load Video
                  </button>
                </div>
              </div>

              {/* Recommended 2-Minute Demo Script for Judges */}
              <div className="border border-line rounded-card bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-ink-primary text-sm">
                      Recommended 2-Minute Presentation Script
                    </h4>
                    <p className="text-[11px] text-ink-secondary">
                      Optimized for Nebius x NVIDIA Hackathon judging criteria
                    </p>
                  </div>
                  <button
                    onClick={handleCopyScript}
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-button text-xs font-mono border border-line bg-panel hover:bg-panelHover text-ink-primary transition-colors"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="h-3 w-3 text-status-success" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-ink-secondary" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {scriptOutline.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-card border border-line/80 bg-hero/20 hover:bg-hero/50 transition-colors flex items-start space-x-3"
                    >
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-line text-tech shrink-0">
                        {item.time}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-ink-primary">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-ink-secondary leading-relaxed">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-line bg-hero/40 flex items-center justify-between text-xs text-ink-secondary">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-status-success" />
            <span className="font-mono text-[11px]">Live Vercel Sandbox Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-button text-xs font-semibold bg-panel hover:bg-panelHover border border-line text-ink-primary transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
