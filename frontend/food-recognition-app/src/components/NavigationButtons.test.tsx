import { render, screen, fireEvent } from '@testing-library/react';
import NavigationButtons from './NavigationButtons';

describe('NavigationButtons', () => {
  const mockHandlers = {
    onRegister: jest.fn(),
    onLogin: jest.fn(),
    onExplore: jest.fn(),
  };

  it('renders all buttons', () => {
    render(<NavigationButtons {...mockHandlers} />);
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore as Guest/i)).toBeInTheDocument();
  });

  it('triggers the register handler', () => {
    render(<NavigationButtons {...mockHandlers} />);
    fireEvent.click(screen.getByText(/Register/i));
    expect(mockHandlers.onRegister).toHaveBeenCalled();
  });

  it('triggers the login handler', () => {
    render(<NavigationButtons {...mockHandlers} />);
    fireEvent.click(screen.getByText(/Log In/i));
    expect(mockHandlers.onLogin).toHaveBeenCalled();
  });

  it('triggers the explore handler', () => {
    render(<NavigationButtons {...mockHandlers} />);
    fireEvent.click(screen.getByText(/Explore as Guest/i));
    expect(mockHandlers.onExplore).toHaveBeenCalled();
  });
});
