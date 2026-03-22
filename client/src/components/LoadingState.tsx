export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-500 mt-3">불러오는 중...</p>
    </div>
  );
}
