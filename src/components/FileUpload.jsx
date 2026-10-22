import React, { useState, useRef } from 'react';
import { Upload, FileArchive, FileCode, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { parseZipArchive, parseJsonFiles } from '../utils/instagramParser';

export default function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setError(null);
    setIsLoading(true);

    try {
      const fileList = Array.from(files);
      const isZip = fileList.some((f) => f.name.toLowerCase().endsWith('.zip'));

      let result;
      if (isZip) {
        const zipFile = fileList.find((f) => f.name.toLowerCase().endsWith('.zip'));
        result = await parseZipArchive(zipFile);
      } else {
        result = await parseJsonFiles(fileList);
      }

      onDataLoaded(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to parse file. Please verify the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col gap-6">
      {/* Hero Text */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Who Doesn't Follow You Back?
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Upload your official Instagram export archive or JSON files to find non-mutuals.
        </p>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-pink-500 bg-pink-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,.json"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-instagram-pink/20 to-instagram-purple/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-inner">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-slate-200 text-base">
              {isLoading ? 'Analyzing Instagram data...' : 'Tap or drop your Instagram data here'}
            </p>
            <p className="text-xs text-slate-400">
              Supports raw <span className="text-slate-300 font-mono">.ZIP</span> archive or{' '}
              <span className="text-slate-300 font-mono">followers_1.json</span> &{' '}
              <span className="text-slate-300 font-mono">following.json</span>
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <FileArchive className="w-3.5 h-3.5" /> Full Zip
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5" /> JSON files
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
          <p className="font-semibold mb-1">Upload Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Step by Step Guide Accordion */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-slate-300 hover:text-white transition"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-pink-400" />
            How do I get my Instagram data?
          </span>
          {showInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showInstructions && (
          <div className="px-4 pb-4 pt-1 text-xs text-slate-400 space-y-2.5 border-t border-slate-800/60">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                In the Instagram app, go to your profile, tap the menu (☰) &rarr;{' '}
                <strong className="text-slate-300">Accounts Center</strong>.
              </li>
              <li>
                Tap <strong className="text-slate-300">Your information and permissions</strong> &rarr;{' '}
                <strong className="text-slate-300">Download your information</strong>.
              </li>
              <li>
                Tap <strong className="text-slate-300">Download or transfer information</strong> &rarr; choose{' '}
                <strong className="text-slate-300">Some of your information</strong>.
              </li>
              <li>
                Scroll down and check only <strong className="text-slate-300">Followers and following</strong>.
              </li>
              <li>
                Select <strong className="text-slate-300">Download to device</strong>, then set Format to{' '}
                <strong className="text-pink-400 font-semibold">JSON</strong> (Date range: All time).
              </li>
              <li>
                Instagram will notify you when it's ready. Download the{' '}
                <strong className="text-slate-300">.zip</strong> and upload it here.
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
