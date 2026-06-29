import { render, screen } from '@testing-library/react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import type { Summary } from '@/lib/types';

const makeSummary = (overrides: Partial<Summary> = {}): Summary => ({
  totalSaved: 150_000,
  target: 230_000,
  gap: 80_000,
  progressPct: 65.2,
  monthsCovered: 5,
  ...overrides,
});

describe('SummaryCards', () => {
  it('renders Total Saved card', () => {
    render(<SummaryCards summary={makeSummary()} />);
    expect(screen.getByText('Total Saved')).toBeInTheDocument();
    expect(screen.getByText(/150,000/)).toBeInTheDocument();
  });

  it('renders Target card', () => {
    render(<SummaryCards summary={makeSummary()} />);
    expect(screen.getByText('Target')).toBeInTheDocument();
    expect(screen.getByText(/230,000/)).toBeInTheDocument();
  });

  it('shows Gap label and amount when underfunded', () => {
    render(<SummaryCards summary={makeSummary({ gap: 80_000 })} />);
    expect(screen.getByText('Gap')).toBeInTheDocument();
    expect(screen.getByText(/80,000/)).toBeInTheDocument();
  });

  it('shows Overfunded label when gap is negative', () => {
    render(<SummaryCards summary={makeSummary({ gap: -10_000 })} />);
    expect(screen.getByText('Overfunded')).toBeInTheDocument();
    expect(screen.getByText(/10,000/)).toBeInTheDocument();
  });

  it('renders Months Covered card', () => {
    render(<SummaryCards summary={makeSummary({ monthsCovered: 5 })} />);
    expect(screen.getByText('Months Covered')).toBeInTheDocument();
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('shows progress percentage', () => {
    render(<SummaryCards summary={makeSummary({ progressPct: 65.2 })} />);
    expect(screen.getByText(/65\.2%/)).toBeInTheDocument();
  });

  it('shows 0 values correctly', () => {
    render(
      <SummaryCards
        summary={makeSummary({ totalSaved: 0, target: 0, gap: 0, progressPct: 0, monthsCovered: 0 })}
      />,
    );
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });
});
