import { render, screen } from '@testing-library/react';
import { ProgressBar } from '@/components/dashboard/ProgressBar';

describe('ProgressBar', () => {
  it('renders with correct aria attributes', () => {
    render(<ProgressBar progressPct={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows the formatted percentage', () => {
    render(<ProgressBar progressPct={75} />);
    expect(screen.getByText('75.0%')).toBeInTheDocument();
  });

  it('shows default label when none provided', () => {
    render(<ProgressBar progressPct={25} />);
    expect(screen.getByText('Progress to target')).toBeInTheDocument();
  });

  it('shows custom label', () => {
    render(<ProgressBar progressPct={25} label="My progress" />);
    expect(screen.getByText('My progress')).toBeInTheDocument();
  });

  it('clamps progress below 0 to 0', () => {
    render(<ProgressBar progressPct={-10} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('clamps progress above 100 to 100', () => {
    render(<ProgressBar progressPct={150} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
  });

  it('applies green colour at 100%', () => {
    const { container } = render(<ProgressBar progressPct={100} />);
    const fill = container.querySelector('.bg-green-500');
    expect(fill).toBeInTheDocument();
  });

  it('applies red colour below 50%', () => {
    const { container } = render(<ProgressBar progressPct={30} />);
    const fill = container.querySelector('.bg-red-400');
    expect(fill).toBeInTheDocument();
  });

  it('applies amber colour at 50–74%', () => {
    const { container } = render(<ProgressBar progressPct={60} />);
    const fill = container.querySelector('.bg-amber-400');
    expect(fill).toBeInTheDocument();
  });

  it('applies blue colour at 75–99%', () => {
    const { container } = render(<ProgressBar progressPct={80} />);
    const fill = container.querySelector('.bg-blue-500');
    expect(fill).toBeInTheDocument();
  });
});
