"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "uploading" | "generating" | "done" | "error";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const file = e.clipboardData.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = useCallback(async () => {
    if (!image) return;

    setStatus("generating");
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setCode(data.code);
      setStatus("done");

      // Scroll to code after a short delay for render
      setTimeout(() => {
        codeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }, [image]);

  const handleReset = useCallback(() => {
    setImage(null);
    setCode(null);
    setStatus("idle");
    setError(null);
  }, []);

  const copyCode = useCallback(() => {
    if (code) navigator.clipboard.writeText(code);
  }, [code]);

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-100">
            Content Pipeline
          </h1>
          <p className="text-sm text-neutral-500">
            Import a screenshot. Get clean HTML+CSS back.
          </p>
        </div>

        {/* Drop zone */}
        {!image && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onPaste={handlePaste}
            tabIndex={0}
            className="w-full border border-dashed border-neutral-800 rounded-xl p-12 sm:p-16 flex flex-col items-center gap-4 cursor-pointer hover:border-neutral-600 transition-colors focus:outline-none focus:border-neutral-500"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <svg
              className="w-8 h-8 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <p className="text-sm text-neutral-500">
              Drop a screenshot, paste, or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        )}

        {/* Preview + Generate */}
        {image && status !== "done" && (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-neutral-800">
              <img
                src={image}
                alt="Screenshot preview"
                className="w-full h-auto object-contain"
              />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 text-sm backdrop-blur-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === "generating"}
              className="px-6 py-2.5 rounded-lg bg-neutral-100 text-neutral-950 text-sm font-medium hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {status === "generating" ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating…
                </span>
              ) : (
                "Generate Code"
              )}
            </button>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="w-full max-w-sm text-center space-y-3">
            <p className="text-sm text-red-400/80">{error}</p>
            <button
              onClick={handleReset}
              className="text-sm text-neutral-500 hover:text-neutral-300 underline underline-offset-2 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Code Output */}
        {status === "done" && code && (
          <div ref={codeRef} className="w-full space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-neutral-400">Generated HTML</h2>
              <button
                onClick={copyCode}
                className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors"
              >
                Copy code
              </button>
            </div>
            <pre className="w-full max-h-[500px] overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-xs leading-relaxed text-neutral-300">
              <code>{code}</code>
            </pre>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-neutral-800 text-neutral-400 text-sm hover:text-neutral-200 hover:border-neutral-600 transition-all"
              >
                New Import
              </button>
              <button
                onClick={copyCode}
                className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-950 text-sm font-medium hover:bg-neutral-200 transition-all"
              >
                Copy &amp; Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}