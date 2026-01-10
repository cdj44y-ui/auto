import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not already installed and user hasn't dismissed it recently
      const hasDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!hasDismissed) {
        setShowInstallModal(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (offlineReady) {
      toast.success('앱이 오프라인에서 사용할 준비가 되었습니다.');
    }
  }, [offlineReady]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallModal(false);
      toast.success('앱 설치가 시작되었습니다.');
    }
  };

  const handleDismiss = () => {
    setShowInstallModal(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const closeUpdateModal = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      {/* Install Prompt Dialog */}
      <Dialog open={showInstallModal} onOpenChange={setShowInstallModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>앱으로 설치하기</DialogTitle>
            <DialogDescription>
              홈 화면에 앱을 설치하여 더 빠르고 편리하게 근태관리를 이용해보세요.
              푸시 알림을 통해 중요 일정을 놓치지 않을 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="default" onClick={handleInstallClick} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              지금 설치
            </Button>
            <Button type="button" variant="ghost" onClick={handleDismiss} className="w-full sm:w-auto">
              나중에
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Prompt Dialog */}
      <Dialog open={needRefresh} onOpenChange={setNeedRefresh}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새로운 버전 업데이트</DialogTitle>
            <DialogDescription>
              새로운 기능과 성능 개선이 포함된 업데이트가 있습니다.
              지금 업데이트하여 최신 버전을 사용해보세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => updateServiceWorker(true)} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              업데이트 및 새로고침
            </Button>
            <Button variant="ghost" onClick={closeUpdateModal} className="w-full">
              나중에
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
