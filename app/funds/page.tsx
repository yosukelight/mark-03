import { FundList } from '@/components/funds/FundList';

export default function FundsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Funds</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your cash, investments, and savings
        </p>
      </div>
      <FundList />
    </div>
  );
}
