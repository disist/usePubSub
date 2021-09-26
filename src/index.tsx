import React, { createContext, useCallback, useMemo, useContext, useEffect, useRef } from "react";

type ListenerType = (value: any) => void

type PubSubType = {
    [topic: string]: Array<ListenerType>
}

type PubSubContextType = {
    publish: (topic: string, value?: any) => void
    addListener: (topic: string, fn: ListenerType) => void,
    removeListener: (topic: string, fn: ListenerType) => void
}

const PubSubContext = createContext<PubSubContextType>({} as PubSubContextType);

export const usePubSub = () => {
  return useContext(PubSubContext);
};

export const usePubSubListen = (topic: string, fn: ListenerType) => {
  const { addListener, removeListener } = usePubSub()
  const fnRef = useRef<ListenerType>()

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  useEffect(() => {
    addListener(topic, fnRef.current!)

    return () => {
      removeListener(topic, fnRef.current!)
    }
  }, [addListener, removeListener, topic])
}

export const PubSubProvider = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
    const pubSub: PubSubType = useMemo(() => ({}), [])

    const publish = useCallback((topic: string, value?: any) => {
        if (!pubSub[topic]) {
            return
        }
        pubSub[topic].forEach(fn => fn(value))
    }, [pubSub])

    const addListener = useCallback((topic: string, fn: ListenerType) => {
        if (!pubSub[topic]) {
            pubSub[topic] = []
        }
        pubSub[topic].push(fn)
    }, [pubSub])

    const removeListener = useCallback((topic: string, fn: ListenerType) => {
        if (!pubSub[topic] || !pubSub[topic].length) {
            return
        }
        pubSub[topic] = pubSub[topic].filter(listener => listener !== fn)
    }, [pubSub])

  return (
    <PubSubContext.Provider
      value={{
        publish,
        addListener,
        removeListener
      }}
    >
      {children}
    </PubSubContext.Provider>
  );
};