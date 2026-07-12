import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickAddContribution } from '@/components/contributions/QuickAddContribution';
import { useStore } from '@/lib/store';

beforeEach(() => {
  act(() => {
    useStore.getState().resetAll();
  });
  localStorage.clear();
});

function seedFund(balance = 10_000) {
  act(() => {
    useStore.getState().addFund({
      name: 'BDO Savings',
      type: 'cash',
      balance,
      expectedReturnPct: 0.5,
    });
  });
  return useStore.getState().funds[0].id;
}

describe('QuickAddContribution', () => {
  it('opens the dialog from the trigger button', () => {
    seedFund();
    render(<QuickAddContribution />);
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows a message instead of the form when there are no funds', () => {
    render(<QuickAddContribution />);
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/at least one fund/i)).toBeInTheDocument();
    expect(within(dialog).queryByLabelText(/amount \(php\)/i)).not.toBeInTheDocument();
  });

  it('adds a contribution and increments the fund balance by default', async () => {
    const fundId = seedFund(10_000);
    render(<QuickAddContribution />);
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    const dialog = screen.getByRole('dialog');

    await userEvent.type(within(dialog).getByLabelText(/amount \(php\)/i), '2500');
    fireEvent.click(within(dialog).getByRole('button', { name: /log contribution/i }));

    await waitFor(() => {
      expect(useStore.getState().contributions).toHaveLength(1);
    });
    const contribution = useStore.getState().contributions[0];
    expect(contribution.fundId).toBe(fundId);
    expect(contribution.amount).toBe(2_500);
    expect(useStore.getState().funds[0].balance).toBe(12_500);
  });

  it('leaves the fund balance unchanged when the checkbox is unchecked', async () => {
    seedFund(10_000);
    render(<QuickAddContribution />);
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    const dialog = screen.getByRole('dialog');

    await userEvent.type(within(dialog).getByLabelText(/amount \(php\)/i), '2500');
    await userEvent.click(within(dialog).getByLabelText(/add amount to the fund/i));
    fireEvent.click(within(dialog).getByRole('button', { name: /log contribution/i }));

    await waitFor(() => {
      expect(useStore.getState().contributions).toHaveLength(1);
    });
    expect(useStore.getState().funds[0].balance).toBe(10_000);
  });

  it('closes the dialog after a successful submit', async () => {
    seedFund();
    render(<QuickAddContribution />);
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    const dialog = screen.getByRole('dialog');

    await userEvent.type(within(dialog).getByLabelText(/amount \(php\)/i), '100');
    fireEvent.click(within(dialog).getByRole('button', { name: /log contribution/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('does not add a contribution when validation fails', async () => {
    seedFund();
    render(<QuickAddContribution />);
    fireEvent.click(screen.getByRole('button', { name: /log contribution/i }));
    const dialog = screen.getByRole('dialog');

    fireEvent.click(within(dialog).getByRole('button', { name: /log contribution/i }));

    await waitFor(() => {
      expect(within(dialog).getByText(/greater than 0/i)).toBeInTheDocument();
    });
    expect(useStore.getState().contributions).toHaveLength(0);
  });
});
