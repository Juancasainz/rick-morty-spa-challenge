import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../../src/features/rickmorty/pages/home/components/Pagination";
import { act } from "react";

const setSpMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>(
        "react-router-dom"
    );

    return {
        ...actual,
        useSearchParams: () => [
            new URLSearchParams("page=2"),
            setSpMock,
        ],
    };
});

describe("Pagination", () => {
    beforeEach(() => {
        setSpMock.mockClear();
    });

    it("renders current page info", () => {
        render(<Pagination page={2} pages={10} />);

        expect(screen.getByText("Page 2 / 10")).toBeInTheDocument();
    });

    it("clicking Next updates page param", async () => {
        const user = userEvent.setup();

        render(<Pagination page={2} pages={10} />);

        await user.click(screen.getByRole("button", { name: /next/i }));

        expect(setSpMock).toHaveBeenCalledTimes(1);

        const calledWith = setSpMock.mock.calls[0][0];
        expect(calledWith.get("page")).toBe("3");
    });

    it("clicking Prev updates page param", async () => {
        const user = userEvent.setup();

        render(<Pagination page={2} pages={10} />);

        await user.click(screen.getByRole("button", { name: /prev/i }));

        const calledWith = setSpMock.mock.calls[0][0];
        expect(calledWith.get("page")).toBe("1");
    });

    it("disables Prev on first page", () => {
        render(<Pagination page={1} pages={10} />);

        expect(
            screen.getByRole("button", { name: /prev/i })
        ).toBeDisabled();
    });

    it("disables Next on last page", () => {
        render(<Pagination page={10} pages={10} />);

        expect(
            screen.getByRole("button", { name: /next/i })
        ).toBeDisabled();
    });

    it("locks buttons temporarily after click", () => {
        vi.useFakeTimers();

        render(<Pagination page={2} pages={10} />);

        const nextBtn = screen.getByRole("button", { name: /next/i });

        fireEvent.click(nextBtn);

        expect(nextBtn).toBeDisabled();

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(nextBtn).not.toBeDisabled();

        vi.useRealTimers();
    });
});