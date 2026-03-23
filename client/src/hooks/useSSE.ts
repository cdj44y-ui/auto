/**
 * P-08: SSE 실시간 통신 훅
 * EventSource를 통해 서버 이벤트를 수신
 */
import { useEffect, useRef, useCallback, useState } from "react";

type SSEHandler = (data: unknown) => void;

export function useSSE(options?: { enabled?: boolean }) {
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const handlersRef = useRef<Map<string, SSEHandler[]>>(new Map());

  const subscribe = useCallback((event: string, handler: SSEHandler) => {
    const handlers = handlersRef.current.get(event) || [];
    handlers.push(handler);
    handlersRef.current.set(event, handlers);

    return () => {
      const arr = handlersRef.current.get(event);
      if (arr) {
        const idx = arr.indexOf(handler);
        if (idx !== -1) arr.splice(idx, 1);
      }
    };
  }, []);

  useEffect(() => {
    if (options?.enabled === false) return;

    const es = new EventSource("/api/sse", { withCredentials: true });
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    // 기본 메시지 핸들러
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const handlers = handlersRef.current.get("message") || [];
        handlers.forEach(h => h(data));
      } catch { /* ignore */ }
    };

    // 커스텀 이벤트 핸들러
    const eventTypes = ["attendance", "notification", "alert", "payroll"];
    for (const type of eventTypes) {
      es.addEventListener(type, (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const handlers = handlersRef.current.get(type) || [];
          handlers.forEach(h => h(data));
        } catch { /* ignore */ }
      });
    }

    return () => {
      es.close();
      setConnected(false);
    };
  }, [options?.enabled]);

  return { connected, subscribe };
}
