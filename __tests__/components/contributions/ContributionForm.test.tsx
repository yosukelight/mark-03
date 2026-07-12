import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContributionForm } from '@/components/contributions/ContributionForm';
import { todayISO } from '@/lib/contributions';
import type { Fund } from '@/lib/types';

const funds: Fund[] = [
  {
    id: 'fund-1',
    name: 'BDO Savings',
    type: 'cash',
    balance: 50_000,
    expectedReturnPct: 0.5,
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'fund-2',
    name: 'Pag-IBIG MP2',
    type: 'mp2',
    balance: 30_000,
    expectedReturnPct: 7,
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const mockSubmit = jest.fn();
const mockCancel = jest.fn();

beforeEach(() => {
  mockSubmit.mockClear();
  mockCancel.mockClear();
});

function renderForm() {
  return render(<ContributionForm funds={funds} onSubmit={mockSubmit} onCancel={mockCancel} />);
}

describe('ContributionForm', () => {
  it('renders all form fields', () => {
    renderForm();
    expect(screen.getByLabelText(/^fund$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount \(php\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/add amount to the fund/i)).toBeInTheDocument();
  });

  it('defaults the date to today', () => {
    renderForm();
    expect(screen.getByLabelText(/date/i)).toHaveValue(todayISO());
  });

  it('defaults the balance checkbox to checked', () => {
    renderForm();
    expect(screen.getByLabelText(/add amount to the fund/i)).toBeChecked();
  });

  it('pre-selects the first fund', () => {
    renderForm();
    // Radix Select renders the value in the trigger and a hidden native select
    expect(screen.getAllByText('BDO Savings').length).toBeGreaterThanOrEqual(1);
  });

  it('shows a validation error when amount is empty', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    await waitFor(() => {
      expect(screen.getByText(/greater than 0/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('rejects a zero amount', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/amount \(php\)/i), '0');
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    await waitFor(() => {
      expect(screen.getByText(/greater than 0/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('rejects a negative amount', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/amount \(php\)/i), '-500');
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    await waitFor(() => {
      expect(screen.getByText(/greater than 0/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('shows a validation error when date is cleared', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/amount \(php\)/i), '1000');
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    await waitFor(() => {
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits valid values with applyToBalance true by default', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/amount \(php\)/i), '5000');
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2026-07-01' } });
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        fundId: 'fund-1',
        amount: 5_000,
        date: '2026-07-01',
        notes: undefined,
        applyToBalance: true,
      });
    });
  });

  it('submits applyToBalance false when unchecked', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/amount \(php\)/i), '2500');
    await userEvent.click(screen.getByLabelText(/add amount to the fund/i));
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ applyToBalance: false }),
      );
    });
  });

  it('trims notes and omits them when empty', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/amount \(php\)/i), '1000');
    await userEvent.type(screen.getByLabelText(/notes/i), '  13th month pay  ');
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ notes: '13th month pay' }),
      );
    });
  });

  it('renders a custom submit label', () => {
    render(
      <ContributionForm
        funds={funds}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        submitLabel="Save deposit"
      />,
    );
    expect(screen.getByRole('button', { name: /save deposit/i })).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
