import { render, screen } from '@testing-library/react';
import WelcomeSection from './WelcomeSection';

describe('WelcomeSection', () => {
  it('renders the welcome message', () => {
    render(<WelcomeSection />);
    expect(screen.getByText(/Welcome to the Food Recognition App!/i)).toBeInTheDocument();
  });

  it('renders the app description', () => {
    render(<WelcomeSection />);
    expect(screen.getByText(/Easily recognize your meals, track your nutrition, and achieve your health goals./i)).toBeInTheDocument();
  });
});