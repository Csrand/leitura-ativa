import { useSyncExternalStore } from 'react'

function createStore(createState) {
  const listeners = new Set()
  let state

  function subscribe(cb) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }

  function getState() {
    return state
  }

  function setState(partial) {
    const next = typeof partial === 'function' ? partial(state) : { ...state, ...partial }
    if (next !== state) {
      state = next
      listeners.forEach((l) => l())
    }
  }

  function useStore(selector) {
    return useSyncExternalStore(subscribe, () => {
      const s = selector ? selector(state) : state
      return s
    })
  }

  state = createState(setState, getState)
  useStore.getState = getState
  useStore.setState = setState
  useStore.subscribe = subscribe

  return useStore
}

export { createStore }
