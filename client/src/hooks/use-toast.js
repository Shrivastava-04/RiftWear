// client/src/hooks/use-toast.js
import * as React from "react";

// Removed 'import type' and directly import the components needed for runtime.
// If ToastActionElement and ToastProps are only types, they should be removed.
// Assuming ToastProps is an object that describes the props for the Toast component,
// and ToastActionElement is a ReactNode, we'll keep the conceptual structure
// but remove explicit type imports.
// For the purpose of conversion, we'll assume ToastProps and ToastActionElement
// refer to the actual React components or elements that are rendered.
// If they are purely type definitions, they would be removed entirely.

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// Removed type definition for ToasterToast.
// The structure is implicitly defined by how it's used.

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
}; // 'as const' is valid JS

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Removed type definitions for ActionType, Action, and State.
// The reducer function's parameters and return value will implicitly define their shape.

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  // Removed type annotation for toastId
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Removed type annotations for state and action, and return type.
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// Removed type annotation for listeners array.
const listeners = [];

// Removed type annotation for memoryState.
let memoryState = { toasts: [] };

function dispatch(action) {
  // Removed type annotation for action
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Removed type definition for Toast.
function toast({ ...props }) {
  // Removed type annotation for props
  const id = genId();

  const update = (
    props // Removed type annotation for props
  ) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  // Removed type annotation for useState
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]); // Dependency array should include state if setState depends on it, otherwise it can be empty or omit state if it's always the latest. Keeping it as is for minimal change, but typically it would be `[]` if `setState` is just for re-rendering with the latest `memoryState`.

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }), // Removed type annotation for toastId
  };
}

export { useToast, toast };
