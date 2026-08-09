import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Loader2, ExternalLink } from 'lucide-react';
import { authAPI } from '@shared/api';

// 开发环境admin后台URL，生产环境可通过环境变量配置
const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL as string) || 'http://localhost:3000';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const res = await authAPI.checkAdminAccess();
    if (res.success && res.data) {
      setHasAccess(res.data.hasAccess);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="mt-3 text-sm text-on-surface-variant">正在验证管理权限...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <div className="bg-error/10 p-5 rounded-full mb-5">
          <ShieldCheck className="text-error" size={40} />
        </div>
        <h2 className="text-lg font-bold text-on-surface mb-2">无访问权限</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          您的账号没有后台管理权限，请联系管理员开通。
        </p>
        <button
          onClick={onBack}
          className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold shadow-md"
        >
          返回个人中心
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* 浮动返回按钮 */}
      <button
        onClick={onBack}
        className="fixed top-3 left-3 z-[60] w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors shadow-lg"
        title="返回个人中心"
      >
        <ArrowLeft size={20} />
      </button>

      {/* iframe 全屏 */}
      {iframeError ? (
        <div className="flex flex-col items-center justify-center h-full px-8 text-center">
          <div className="bg-surface-container p-5 rounded-full mb-5">
            <ExternalLink className="text-on-surface-variant" size={40} />
          </div>
          <h2 className="text-base font-bold text-on-surface mb-2">无法内嵌加载</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            后台页面可能不支持内嵌显示，请点击下方按钮在新窗口中打开。
          </p>
          <a
            href={ADMIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold shadow-md flex items-center gap-2"
          >
            <ExternalLink size={16} />
            在新窗口打开后台
          </a>
        </div>
      ) : (
        <>
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="mt-3 text-sm text-on-surface-variant">正在加载后台系统...</p>
            </div>
          )}
          <iframe
            src={ADMIN_URL}
            className="w-full h-full border-0"
            title="后台管理系统"
            onLoad={() => setLoading(false)}
            onError={() => { setIframeError(true); setLoading(false); }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </>
      )}
    </div>
  );
}
