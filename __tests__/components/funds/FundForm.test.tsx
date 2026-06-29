import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FundForm } from '@/components/funds/FundForm';
import type { Fund } from '@/lib/types';

const mockSubmit = jest.fn();
const mockCancel = jest.fn();

beforeEach(() => {
  mockSubmit.mockClear();
  mockCancel.mockClear();
});

function renderForm(initialValues?: Partial<Fund>) {
  return render(
    <FundForm
      initialValues={initialValues}
      onSubmit={mockSubmit}
      onCancel={mockCancel}
    />,
  );
}

describe('FundForm', () => {
  it('renders all form fields', () => {
    renderForm();
    expect(screen.getByLabelText(/fund name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current balance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expected annual return/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders Save button by default', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders custom submit label', () => {
    render(
      <FundForm onSubmit={mockSubmit} onCancel={mockCancel} submitLabel="Add fund" />,
    );
    expect(screen.getByRole('button', { name: /add fund/i })).toBeInTheDocument();
  });

  it('pre-fills with initialValues', () => {
    renderForm({ name: 'BDO UITF', balance: 50_000, expectedReturnPct: 7 });
    expect(screen.getByLabelText(/fund name/i)).toHaveValue('BDO UITF');
    expect(screen.getByLabelText(/current balance/i)).toHaveValue(50_000);
    expect(screen.getByLabelText(/expected annual return/i)).toHaveValue(7);
  });

  it('shows validation error when name is empty', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for negative balance', async () => {
    renderForm({ name: 'Fund A' });
    const balanceInput = screen.getByLabelText(/current balance/i);
    await userEvent.clear(balanceInput);
    await userEvent.type(balanceInput, '-100');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/non-negative/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for return > 100', async () => {
    renderForm({ name: 'Fund A', balance: 1000 });
    const returnInput = screen.getByLabelText(/expected annual return/i);
    await userEvent.clear(returnInput);
    await userEvent.type(returnInput, '150');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/between 0 and 100/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct values on valid submission', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/fund name/i), 'MP2 Fund');
    await userEvent.clear(screen.getByLabelText(/current balance/i));
    await userEvent.type(screen.getByLabelText(/current balance/i), '100000');
    await userEvent.clear(screen.getByLabelText(/expected annual return/i));
    await userEvent.type(screen.getByLabelText(/expected annual return/i), '7');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'MP2 Fund',
          balance: 100_000,
          expectedReturnPct: 7,
          type: 'cash', // default
        }),
      );
    });
  });

  it('calls onCancel when Cancel is clicked', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('accepts zero balance as valid', async () => {
    renderForm({ name: 'Empty Fund' });
    const balanceInput = screen.getByLabelText(/current balance/i);
    await userEvent.clear(balanceInput);
    await userEvent.type(balanceInput, '0');
    const returnInput = screen.getByLabelText(/expected annual return/i);
    await userEvent.clear(returnInput);
    await userEvent.type(returnInput, '0');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Empty Fund', balance: 0, expectedReturnPct: 0 }),
      );
    });
  });

  it('trims whitespace from name', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/fund name/i), '  My Fund  ');
    await userEvent.clear(screen.getByLabelText(/current balance/i));
    await userEvent.type(screen.getByLabelText(/current balance/i), '1000');
    await userEvent.clear(screen.getByLabelText(/expected annual return/i));
    await userEvent.type(screen.getByLabelText(/expected annual return/i), '5');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'My Fund' }),
      );
    });
  });
});
