import { describe, it, expect, beforeEach } from "vitest";
import { useEventStore } from "@/store/useEventStore";

describe("useEventStore", () => {
  beforeEach(() => {
    useEventStore.getState().reset();
  });

  it("starts on the form step", () => {
    expect(useEventStore.getState().ui.step).toBe("form");
  });

  it("sets a theme based on category when event input is set", () => {
    useEventStore.getState().setEventInput({
      eventName: "Fest", clubName: "Club", category: "cultural",
      startDate: "2025-01-01T10:00", description: "desc",
    });
    expect(useEventStore.getState().theme.id).toBe("rose");
  });

  it("toggles a section on and off", () => {
    const before = useEventStore.getState().sections.find((s) => s.id === "speakers")!.enabled;
    useEventStore.getState().toggleSection("speakers");
    const after = useEventStore.getState().sections.find((s) => s.id === "speakers")!.enabled;
    expect(after).toBe(!before);
  });

  it("configures default sections when selecting a template", () => {
    useEventStore.getState().setTemplate("hackathon");
    const prizes = useEventStore.getState().sections.find((s) => s.id === "prizes")!;
    expect(prizes.enabled).toBe(true);
  });

  it("resets to initial state", () => {
    useEventStore.getState().setStep("export");
    useEventStore.getState().reset();
    expect(useEventStore.getState().ui.step).toBe("form");
    expect(useEventStore.getState().eventInput).toBeNull();
  });
});