import { create } from 'zustand'

export const useReadingStore = create((set, get) => ({
  phase: 'idle',
  mode: null,
  book: null,
  readingSeconds: 0,
  readingTimeLimit: 0,
  reflectionSeconds: 0,
  reflectionTarget: 0,
  reflectionText: '',
  startTime: null,
  intervalId: null,

  startSession: (mode, book, readingTimeLimit) => {
    const id = setInterval(() => {
      get().tick()
    }, 1000)

    set({
      phase: 'reading',
      mode,
      book,
      readingSeconds: 0,
      readingTimeLimit,
      reflectionSeconds: 0,
      reflectionTarget: 0,
      reflectionText: '',
      startTime: Date.now(),
      intervalId: id,
    })
  },

  tick: () => {
    const { phase, readingTimeLimit } = get()
    if (phase !== 'reading') return

    const newSeconds = get().readingSeconds + 1
    if (readingTimeLimit > 0 && newSeconds >= readingTimeLimit) {
      get().finishReading()
      return
    }

    set({ readingSeconds: newSeconds })
  },

  finishReading: () => {
    const { intervalId, readingSeconds } = get()
    if (intervalId) clearInterval(intervalId)

    const reflectionTarget = Math.round(readingSeconds * 0.2)

    const id = setInterval(() => {
      const state = get()
      if (state.reflectionSeconds >= state.reflectionTarget) {
        clearInterval(id)
        set({ intervalId: null, phase: 'writing' })
        return
      }
      set({ reflectionSeconds: state.reflectionSeconds + 1 })
    }, 1000)

    set({
      phase: 'reflecting',
      reflectionTarget,
      intervalId: id,
    })
  },

  finishReflecting: () => {
    const { intervalId } = get()
    if (intervalId) clearInterval(intervalId)
    set({ intervalId: null, phase: 'writing' })
  },

  setReflectionText: (text) => {
    set({ reflectionText: text })
  },

  reset: () => {
    const { intervalId } = get()
    if (intervalId) clearInterval(intervalId)
    set({
      phase: 'idle',
      mode: null,
      book: null,
      readingSeconds: 0,
      readingTimeLimit: 0,
      reflectionSeconds: 0,
      reflectionTarget: 0,
      reflectionText: '',
      startTime: null,
      intervalId: null,
    })
  },

  cleanup: () => {
    const { intervalId } = get()
    if (intervalId) clearInterval(intervalId)
  },
}))
