import { Spinner } from '@/shared/ui'
import { render, screen } from '@testing-library/react'
import { it, expect, describe } from 'vitest'

describe('Spinner', () => {
    it("renders loading spinner", () => {
        render(<Spinner />);
        expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
});
})