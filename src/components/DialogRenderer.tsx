import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle, Info, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogService, type DialogEntry } from "@/lib/dialogService";
import { Button } from "@/components/ui";

const intentConfig = {
  default: { icon: null, accent: "text-stone-600", bg: "", buttonVariant: "default" as const },
  danger:  { icon: ShieldAlert,   accent: "text-red-600",    bg: "bg-red-50",    buttonVariant: "danger" as const },
  warning: { icon: AlertTriangle, accent: "text-amber-600",  bg: "bg-amber-50",  buttonVariant: "default" as const },
  info:    { icon: Info,          accent: "text-blue-600",   bg: "bg-blue-50",   buttonVariant: "default" as const },
  success: { icon: CheckCircle,   accent: "text-green-600",  bg: "bg-green-50",  buttonVariant: "default" as const },
} as const;

// ─── DialogRenderer ──────────────────────────────────────────────────────────
// Mounts once at the app root. Subscribes to DialogService and renders a stack
// of modal dialogs, each with its own backdrop + animated panel.
// ─────────────────────────────────────────────────────────────────────────────

export function DialogRenderer() {
  const [dialogs, setDialogs] = useState<DialogEntry[]>([]);

  useEffect(() => {
    setDialogs(DialogService.getStack());
    return DialogService.subscribe(setDialogs);
  }, []);

  if (dialogs.length === 0) return null;

  return (
    <div className="fixed inset-0 z-9999" aria-live="assertive">
      {dialogs.map((entry, index) => (
        <DialogModal key={entry.id} entry={entry} isTop={index === dialogs.length - 1} />
      ))}
    </div>
  );
}

// ─── Individual dialog modal ─────────────────────────────────────────────────

function DialogModal({ entry, isTop }: { entry: DialogEntry; isTop: boolean }) {
  const { id, variant, options } = entry;
  const {
    title,
    description,
    confirmLabel = "OK",
    cancelLabel = "Cancel",
    defaultValue = "",
    placeholder,
    intent = "default",
  } = options;

  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Auto-focus the input for prompts, or the confirm button otherwise
  useEffect(() => {
    if (!isTop) return;
    const timer = setTimeout(() => {
      if (variant === "prompt") {
        inputRef.current?.focus();
        inputRef.current?.select();
      } else {
        confirmRef.current?.focus();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [isTop, variant]);

  // Keyboard handling
  useEffect(() => {
    if (!isTop) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleCancel();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const resolve = useCallback(
    (value: unknown) => {
      (entry as DialogEntry<unknown>).resolve(value);
      DialogService.dismiss(id);
    },
    [entry, id],
  );

  function handleConfirm() {
    if (variant === "alert") resolve(undefined);
    else if (variant === "confirm") resolve(true);
    else resolve(inputValue);
  }

  function handleCancel() {
    if (variant === "alert") resolve(undefined);
    else if (variant === "confirm") resolve(false);
    else resolve(null);
  }

  const config = intentConfig[intent];
  const IntentIcon = config.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-150"
        onClick={handleCancel}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-desc` : undefined}
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-stone-200/60",
          "animate-in zoom-in-95 fade-in duration-150",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            {IntentIcon && (
              <div className={cn("shrink-0 rounded-lg p-2", config.bg)}>
                <IntentIcon className={cn("h-5 w-5", config.accent)} />
              </div>
            )}
            <h2 id={`${id}-title`} className="text-lg font-semibold text-stone-800">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-4 space-y-4">
          {description && (
            <p id={`${id}-desc`} className="text-sm text-stone-600 leading-relaxed">
              {description}
            </p>
          )}

          {variant === "prompt" && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
              className={cn(
                "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400",
                "placeholder:text-stone-400",
              )}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 pb-6">
          {variant !== "alert" && (
            <Button variant="outline" size="sm" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button
            ref={confirmRef}
            variant={config.buttonVariant}
            size="sm"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
