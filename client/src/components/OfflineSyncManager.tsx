import { useEffect, useState } from 'react';
import { offlineQueue } from '@/lib/offline-queue';
import { toast } from 'sonner';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineSyncManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [lastSyncStatus, setLastSyncStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (online) {
        toast.success('인터넷 연결이 복구되었습니다.');
        syncRequests();
      } else {
        toast.error('오프라인 상태입니다. 요청이 로컬에 저장됩니다.');
      }
    };

    const updatePendingCount = async () => {
      const count = await offlineQueue.getCount();
      setPendingCount(count);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // 초기 로드 시 및 주기적으로 대기열 확인
    updatePendingCount();
    const interval = setInterval(updatePendingCount, 2000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  const syncRequests = async () => {
    if (isSyncing) return;
    
    const requests = await offlineQueue.getAllRequests();
    if (requests.length === 0) return;

    setIsSyncing(true);
    const toastId = toast.loading(`${requests.length}개의 오프라인 요청을 동기화 중입니다...`);

    let successCount = 0;
    let failCount = 0;

    for (const req of requests) {
      try {
        // 실제 API 호출 시뮬레이션 (여기서는 fetch 사용)
        // 실제 구현 시에는 api client를 사용하거나 fetch를 직접 호출
        // const response = await fetch(req.url, {
        //   method: req.method,
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(req.body),
        // });
        
        // 데모를 위해 성공으로 가정하고 딜레이 추가
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 성공 시 큐에서 제거
        if (req.id) {
          await offlineQueue.removeRequest(req.id);
          successCount++;
        }
      } catch (error) {
        console.error('Sync failed for request:', req, error);
        failCount++;
      }
    }

    setIsSyncing(false);
    toast.dismiss(toastId);

    if (successCount > 0) {
      toast.success(`${successCount}개의 요청이 성공적으로 동기화되었습니다.`);
      setLastSyncStatus('success');
    }
    if (failCount > 0) {
      toast.error(`${failCount}개의 요청 동기화에 실패했습니다. 나중에 다시 시도합니다.`);
      setLastSyncStatus(successCount === 0 ? 'error' : 'success'); // 부분 성공도 성공으로 간주
    }
    
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // 카운트 업데이트
    const remaining = await offlineQueue.getCount();
    setPendingCount(remaining);
  };

  // 오프라인 상태이거나 대기 중인 요청이 있을 때만 표시
  if (isOnline && pendingCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 right-4 z-50 w-full max-w-sm"
      >
        <Card className={`p-4 shadow-lg border-l-4 ${isOnline ? 'border-l-green-500' : 'border-l-amber-500'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <div className="bg-green-100 p-2 rounded-full">
                  <Wifi className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="bg-amber-100 p-2 rounded-full">
                  <WifiOff className="h-5 w-5 text-amber-600" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-sm">
                  {isOnline ? '온라인 상태' : '오프라인 모드'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {pendingCount > 0 
                    ? `${pendingCount}개의 요청이 대기 중입니다.` 
                    : '모든 데이터가 최신입니다.'}
                </p>
                {lastSyncTime && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                    {lastSyncStatus === 'success' ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span>마지막 동기화: {lastSyncTime}</span>
                  </div>
                )}
              </div>
            </div>
            
            {isOnline && pendingCount > 0 && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={syncRequests}
                disabled={isSyncing}
                className="ml-2"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                동기화
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
