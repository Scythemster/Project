import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

describe("UI components forward refs (react-hook-form compatibility)", () => {
  it("Input forwards its ref to the native input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Event Name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("Textarea forwards its ref to the native textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Description" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("Select forwards its ref to the native select element", () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select label="Category" ref={ref} options={[{ value: "a", label: "A" }]} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it("Input captures typed text on its underlying element", async () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Event Name" ref={ref} />);
    const el = screen.getByLabelText(/event name/i);
    await userEvent.type(el, "Hack Fest 2026");
    expect(ref.current?.value).toBe("Hack Fest 2026");
  });

  it("shows a required asterisk when required", () => {
    render(<Input label="Event Name" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});