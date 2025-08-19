import { create } from 'zustand';

// A module-level variable to hold the timer ID. This is not part of the
// store's state because we don't need to react to the timer itself.
let interactionClearTimer: ReturnType<typeof setTimeout> | null = null;

interface AssistantState {
  message: string | null;
  targetElement: HTMLElement | null;
  setInteraction: (message: string | null, element: HTMLElement | null) => void;
  isEnabled: boolean;
  toggleAssistant: () => void;
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  message: null,
  targetElement: null,
  isEnabled: true,
  toggleAssistant: () =>
    set((state) => {
      // If we are disabling the assistant, clear any active interaction immediately.
      if (state.isEnabled) {
        if (interactionClearTimer) clearTimeout(interactionClearTimer);
        interactionClearTimer = null;
        return { isEnabled: false, message: null, targetElement: null };
      }
      // Otherwise, we are enabling it.
      return { isEnabled: true };
    }),
  setInteraction: (message, targetElement) => {
    if (!get().isEnabled) return;

    // If there's a pending timer to clear the interaction, cancel it.
    if (interactionClearTimer) {
      clearTimeout(interactionClearTimer);
      interactionClearTimer = null;
    }

    if (message && targetElement) {
      // If a new interaction is being set, update the state immediately.
      set({ message, targetElement });
    } else {
      // If the interaction is being cleared, set a delay before it happens.
      interactionClearTimer = setTimeout(() => {
        set({ message: null, targetElement: null });
      }, 500); // 500ms delay
    }
  },
}));