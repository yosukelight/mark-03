import { FundList } from '@/components/funds/FundList';

export default function FundsPage() {
  return (
    <div className="animate-fade-in-up space-y-5">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">Funds</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your cash, investments, and savings
        </p>
      </div>
      <FundList />
    </div>
  );
}
