import { useEffect, useRef, useState } from "react";

type Props = {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
};

/** Live camera modal. Falls back to the file picker if the camera can't start. */
export function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setError("Camera not available. Use the upload option instead.");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const snap = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob);
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Camera">
      <div className="w-full max-w-lg rounded-[28px] bg-foreground p-3 ring-1 ring-background/10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-background/5">
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
          {error && (
            <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-background/80">{error}</p>
          )}
          <span className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-primary/70" />
          <span className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-primary/70" />
          <span className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-primary/70" />
          <span className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-primary/70" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 px-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-background/70 hover:text-background"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={snap}
            disabled={!!error}
            className="rounded-full bg-primary px-6 py-2.5 font-display font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            Capture photo
          </button>
        </div>
      </div>
    </div>
  );
}
