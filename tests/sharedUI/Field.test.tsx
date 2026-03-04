import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Field } from '@/shared/ui';

describe("Field", () => {
  it("renders a label and input", () => {
    render(<Field label="name" value="Rick" />);
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('Rick')).toBeInTheDocument();
  });

  it("should not render value if passed null", () => {
    render(<Field label="name" value={null} />);
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
})