import React from "react";

export default function FontAndColorSamples() {
  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6 space-y-6">
      {/* Color Palette Demo */}
      <div className="mb-8">
        <h2 className="text-title mb-2">Color Palette Demo</h2>
        <div className="flex gap-4 mb-4">
          <div className="w-24 h-12 rounded bg-brand-50 border flex items-center justify-center text-xs text-brand-300">brand-50</div>
          <div className="w-24 h-12 rounded bg-brand-300 border flex items-center justify-center text-xs text-brand-50">brand-300</div>
        </div>
        <div className="flex gap-4">
          <div className="w-32 h-12 rounded bg-background border flex items-center justify-center text-xs text-foreground">background</div>
          <div className="w-32 h-12 rounded bg-primary border flex items-center justify-center text-xs text-primary-foreground">primary</div>
          <div className="w-32 h-12 rounded bg-secondary border flex items-center justify-center text-xs text-secondary-foreground">secondary</div>
          <div className="w-32 h-12 rounded bg-accent border flex items-center justify-center text-xs text-accent-foreground">accent</div>
          <div className="w-32 h-12 rounded bg-card border flex items-center justify-center text-xs text-card-foreground">card</div>
        </div>
      </div>
      {/* Font Style Demo */}
      <div className="mb-8">
        <h2 className="text-title mb-2">Font Style Demo</h2>
        <div className="space-y-2">
          <div>
            <span className="block text-display">Header 1 / Display (text-display)</span>
          </div>
          <div>
            <span className="block text-title">Header 2 / Title (text-title)</span>
          </div>
          <div>
            <span className="block text-subtitle">Subtitle (text-subtitle)</span>
          </div>
          <div>
            <span className="block text-body">Body (text-body)</span>
          </div>
          <div>
            <span className="block text-caption">Caption / Secondary (text-caption)</span>
          </div>
          <div>
            <span className="block text-code">Code / Mono (text-code)</span>
          </div>
        </div>
      </div>
    </div>
  );
} 