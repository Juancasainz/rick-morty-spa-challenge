import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Image } from "@/shared/ui";

describe("Image component", () => {
  it("renders with provided src", () => {
    render(<Image src="https://example.com/test.png" alt="test image" />);

    const img = screen.getByRole('img', { name: "test image" }) as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://example.com/test.png");
  });

  it("falls back to placeholder when src is null", () => {
    render(<Image src={null} alt="placeholder test" />);

    const img = screen.getByAltText("placeholder test") as HTMLImageElement;

    expect(img.src).toContain("CharacterPlaceHolder.png");
  });

  it("falls back to placeholder when src is empty string", () => {
    render(<Image src="   " alt="empty src test" />);

    const img = screen.getByAltText("empty src test") as HTMLImageElement;

    expect(img.src).toContain("CharacterPlaceHolder.png");
  });

  it("calls onError handler when image fails", () => {
    const onErrorMock = vi.fn();

    render(
      <Image
        src="broken-url.png"
        alt="error test"
        onError={onErrorMock}
      />
    );

    const img = screen.getByAltText("error test");

    fireEvent.error(img);

    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });
});