import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("smoke", () => {
  it("renders without crashing", () => {
    render(<div>Hello</div>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});