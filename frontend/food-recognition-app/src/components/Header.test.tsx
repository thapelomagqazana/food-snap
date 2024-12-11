import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  it('renders the app logo and tagline', () => {
    render(<Header />);
    expect(screen.getByText(/FoodTrack/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Nutrition Companion/i)).toBeInTheDocument();
  });
});
