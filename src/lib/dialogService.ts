// ─── Dialog Service ──────────────────────────────────────────────────────────
// Imperative dialog API that works anywhere (inside or outside React).
//
// Usage:
//   import { DialogService } from "@/lib/dialogService";
//
//   await DialogService.alert({ title: "Done", description: "Record saved." });
//   const ok = await DialogService.confirm({ title: "Delete?", description: "This cannot be undone." });
//   const value = await DialogService.prompt({ title: "Rename", description: "Enter a new name", defaultValue: "Untitled" });
// ─────────────────────────────────────────────────────────────────────────────

export type DialogVariant = "alert" | "confirm" | "prompt";

export interface DialogOptions {
  title: string;
  description?: string;
  /** Label for the primary action button (default: "OK") */
  confirmLabel?: string;
  /** Label for the cancel/dismiss button (default: "Cancel") */
  cancelLabel?: string;
  /** For prompt dialogs – the initial input value */
  defaultValue?: string;
  /** For prompt dialogs – placeholder text */
  placeholder?: string;
  /** Visual intent: controls icon, accent color, and confirm button style */
  intent?: "default" | "danger" | "warning" | "info" | "success";
}

export interface DialogEntry<T = unknown> {
  id: string;
  variant: DialogVariant;
  options: DialogOptions;
  resolve: (value: T) => void;
}

type Listener = (dialogs: DialogEntry[]) => void;

let nextId = 0;
let stack: DialogEntry[] = [];
let listener: Listener | null = null;

function emit() {
  listener?.([ ...stack ]);
}

function push<T>(variant: DialogVariant, options: DialogOptions): Promise<T> {
  return new Promise<T>((resolve) => {
    const entry: DialogEntry<T> = {
      id: `dialog-${++nextId}`,
      variant,
      options,
      resolve,
    };
    stack = [...stack, entry as DialogEntry];
    emit();
  });
}

function dismiss(id: string) {
  stack = stack.filter((d) => d.id !== id);
  emit();
}

export const DialogService = {
  /** Show an informational alert. Resolves when the user clicks OK. */
  alert(options: DialogOptions): Promise<void> {
    return push<void>("alert", options);
  },

  /** Show a confirm dialog. Resolves `true` (confirm) or `false` (cancel). */
  confirm(options: DialogOptions): Promise<boolean> {
    return push<boolean>("confirm", options);
  },

  /** Show a prompt dialog. Resolves with the string value or `null` if cancelled. */
  prompt(options: DialogOptions & { defaultValue?: string; placeholder?: string }): Promise<string | null> {
    return push<string | null>("prompt", options);
  },

  /** @internal – used by the React renderer */
  subscribe(fn: Listener) {
    listener = fn;
    return () => { listener = null; };
  },

  /** @internal – used by the React renderer */
  getStack(): DialogEntry[] {
    return stack;
  },

  /** @internal – resolve + remove a dialog from the stack */
  dismiss,
};
