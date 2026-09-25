import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventStore } from "@/store/useEventStore";
import { EventInputSchema, type EventInputForm } from "@/utils/validation";
import { generateContent } from "@/api/generateContent";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import AISettingsModal from "@/components/settings/AISettingsModal";
import { loadAISettings, toAIOptions } from "@/store/aiSettings";
import type { EventInput } from "@/types";

const CATEGORY_OPTIONS = [
  { value: "hackathon",   label: "Hackathon" },
  { value: "workshop",    label: "Workshop" },
  { value: "seminar",     label: "Seminar" },
  { value: "cultural",    label: "Cultural Festival" },
  { value: "competition", label: "Competition" },
  { value: "formal",      label: "Formal Event" },
];

function generateId() { return Math.random().toString(36).slice(2); }

export default function EventDetailsForm() {
  const { setEventInput, setGenerated, setStep, setGenerating, setGenerationError, ui } = useEventStore();
  const [useMock, setUseMock] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<EventInputForm>({
    resolver: zodResolver(EventInputSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      category: "hackathon",
      schedule: [],
      sponsors: [],
      prizes: [],
      speakers: [],
    },
  });

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({ control, name: "schedule" });
  const { fields: sponsorFields, append: appendSponsor, remove: removeSponsor } = useFieldArray({ control, name: "sponsors" });
  const { fields: prizeFields, append: appendPrize, remove: removePrize } = useFieldArray({ control, name: "prizes" });
  const { fields: speakerFields, append: appendSpeaker, remove: removeSpeaker } = useFieldArray({ control, name: "speakers" });

  const MOCK_GENERATED = {
    headline: "Build. Break. Innovate.",
    tagline: "48 hours of relentless hacking, learning, and collaboration.",
    about: "HackFest 2025 is the premier student hackathon hosted by the IEEE Student Chapter. Teams of up to 4 will compete to build innovative solutions across AI, sustainability, and fintech tracks.",
    objectives: ["Learn new technologies under pressure", "Build real-world prototypes", "Network with industry mentors", "Win exciting prizes"],
    sectionHeadings: { hero: "Welcome to HackFest", about: "About the Event", schedule: "Event Timeline", prizes: "Prizes & Awards", registration: "Join Us" },
    suggestedTheme: "indigo" as const,
    missingFields: [],
  };

  const FIELD_LABELS: Record<string, string> = {
    eventName: "Event Name", clubName: "Club / Organization Name", category: "Event Category",
    startDate: "Start Date & Time", description: "Event Description", registrationUrl: "Registration URL",
    onlineLink: "Online Meeting Link", venue: "Venue",
  };

  const onInvalid = (errs: Record<string, any>) => {
    const collect: string[] = [];
    const walk = (obj: any, prefix = "") => {
      for (const key of Object.keys(obj ?? {})) {
        const val = obj[key];
        if (val && typeof val === "object" && "message" in val && typeof val.message === "string") {
          const label = FIELD_LABELS[key] ?? key;
          collect.push(label + ": " + val.message);
        } else if (val && typeof val === "object") {
          walk(val, prefix + key + ".");
        }
      }
    };
    walk(errs);
    setFormError(
      collect.length
        ? "Please fix these before continuing — " + collect.slice(0, 4).join("; ") + (collect.length > 4 ? " …" : "")
        : "Please check the highlighted fields and try again."
    );
    // scroll to the top so the message is visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: EventInputForm) => {
    setFormError(null);
    setEventInput(data as EventInput);
    setGenerating(true);
    setGenerationError(null);
    try {
      let generated;
      if (useMock) {
        await new Promise((r) => setTimeout(r, 1200));
        generated = MOCK_GENERATED;
      } else {
        const aiOptions = toAIOptions(loadAISettings());
        const result = await generateContent(data as EventInput, aiOptions);
        generated = result.generated;
      }
      setGenerated(generated);
      setStep("template");
    } catch (e: any) {
      setGenerationError(e.message ?? "AI generation failed. Try enabling mock mode.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Tell us about your event</h1>
      <p className="text-slate-400 mb-8">Fill in the details below and we will generate your event website.</p>

      {formError && (
        <Alert variant="error" title="Missing or invalid fields" className="mb-6" onDismiss={() => setFormError(null)}>
          {formError}
        </Alert>
      )}

      {ui.generationError && (
        <Alert variant="error" title="Generation failed" className="mb-6" onDismiss={() => setGenerationError(null)}>
          {ui.generationError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8" noValidate>
        {/* Basic Details */}
        <Card>
          <h2 className="text-lg font-semibold mb-5">Basic Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Event Name" required error={errors.eventName?.message} {...register("eventName")} placeholder="HackFest 2025" />
            <Input label="Club / Organization Name" required error={errors.clubName?.message} {...register("clubName")} placeholder="IEEE Student Chapter" />
            <Select label="Event Category" required options={CATEGORY_OPTIONS} error={errors.category?.message} {...register("category")} />
            <Input label="Start Date & Time" type="datetime-local" required error={errors.startDate?.message} {...register("startDate")} />
            <Input label="End Date & Time (optional)" type="datetime-local" error={errors.endDate?.message} {...register("endDate")} />
            <Input label="Venue (optional)" error={errors.venue?.message} {...register("venue")} placeholder="Main Auditorium, Block A" />
          </div>
          <div className="mt-4">
            <Input label="Online Meeting Link (optional)" hint="A web address like meet.google.com — https:// is added for you" error={errors.onlineLink?.message} {...register("onlineLink")} placeholder="meet.google.com/abc-defg" />
          </div>
          <div className="mt-4">
            <Textarea label="Event Description" required error={errors.description?.message} {...register("description")} placeholder="Describe your event in a few sentences..." rows={4} />
          </div>
          <div className="mt-4">
            <Input label="Registration URL (optional)" hint="A web address like forms.gle/abc — https:// is added for you" error={errors.registrationUrl?.message} {...register("registrationUrl")} placeholder="forms.gle/yourform" />
          </div>
        </Card>

        {/* Schedule */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Schedule (optional)</h2>
            <Button type="button" variant="secondary" size="sm" onClick={() => appendSchedule({ id: generateId(), time: "", title: "", description: "" })}>+ Add Item</Button>
          </div>
          <div className="space-y-3">
            {scheduleFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[120px_1fr_auto] gap-2 items-start">
                <input {...register(`schedule.${i}.time`)} placeholder="10:00 AM" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input {...register(`schedule.${i}.title`)} placeholder="Session title" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="button" onClick={() => removeSchedule(i)} className="text-slate-500 hover:text-rose-400 text-lg mt-0.5">×</button>
                <input {...register(`schedule.${i}.id`)} type="hidden" />
              </div>
            ))}
            {scheduleFields.length === 0 && <p className="text-sm text-slate-500">No schedule items yet. Click + Add Item.</p>}
          </div>
        </Card>

        {/* Prizes */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Prizes (optional)</h2>
            <Button type="button" variant="secondary" size="sm" onClick={() => appendPrize({ id: generateId(), rank: "", amount: "", description: "" })}>+ Add Prize</Button>
          </div>
          <div className="space-y-3">
            {prizeFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[100px_120px_1fr_auto] gap-2 items-start">
                <input {...register(`prizes.${i}.rank`)} placeholder="1st Place" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input {...register(`prizes.${i}.amount`)} placeholder="₹50,000" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input {...register(`prizes.${i}.description`)} placeholder="Description..." className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="button" onClick={() => removePrize(i)} className="text-slate-500 hover:text-rose-400 text-lg">×</button>
                <input {...register(`prizes.${i}.id`)} type="hidden" />
              </div>
            ))}
            {prizeFields.length === 0 && <p className="text-sm text-slate-500">No prizes added yet.</p>}
          </div>
        </Card>

        {/* Speakers */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Speakers / Judges (optional)</h2>
            <Button type="button" variant="secondary" size="sm" onClick={() => appendSpeaker({ id: generateId(), name: "", title: "", bio: "" })}>+ Add Speaker</Button>
          </div>
          <div className="space-y-3">
            {speakerFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                <input {...register(`speakers.${i}.name`)} placeholder="Speaker name" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input {...register(`speakers.${i}.title`)} placeholder="Title / Role" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="button" onClick={() => removeSpeaker(i)} className="text-slate-500 hover:text-rose-400 text-lg">×</button>
                <input {...register(`speakers.${i}.id`)} type="hidden" />
              </div>
            ))}
            {speakerFields.length === 0 && <p className="text-sm text-slate-500">No speakers added yet.</p>}
          </div>
        </Card>

        {/* Sponsors */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Sponsors (optional)</h2>
            <Button type="button" variant="secondary" size="sm" onClick={() => appendSponsor({ id: generateId(), name: "", tier: undefined, logoUrl: "", websiteUrl: "" })}>+ Add Sponsor</Button>
          </div>
          <div className="space-y-3">
            {sponsorFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[1fr_120px_auto] gap-2 items-start">
                <input {...register(`sponsors.${i}.name`)} placeholder="Sponsor name" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <select {...register(`sponsors.${i}.tier`)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Tier</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                  <option value="partner">Partner</option>
                </select>
                <button type="button" onClick={() => removeSponsor(i)} className="text-slate-500 hover:text-rose-400 text-lg">×</button>
                <input {...register(`sponsors.${i}.id`)} type="hidden" />
              </div>
            ))}
            {sponsorFields.length === 0 && <p className="text-sm text-slate-500">No sponsors added yet.</p>}
          </div>
        </Card>

        {/* Contact */}
        <Card>
          <h2 className="text-lg font-semibold mb-5">Contact Information (optional)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email" type="email" error={errors.contact?.email?.message} {...register("contact.email")} placeholder="events@college.edu" />
            <Input label="Phone" {...register("contact.phone")} placeholder="+91 9876543210" />
            <Input label="Website" error={errors.contact?.website?.message} {...register("contact.website")} placeholder="club.college.edu" />
            <Input label="Twitter / X" {...register("contact.twitter")} placeholder="@clubhandle" />
            <Input label="Instagram" {...register("contact.instagram")} placeholder="@clubhandle" />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
              <input type="checkbox" checked={useMock} onChange={(e) => setUseMock(e.target.checked)} className="rounded" />
              Use mock AI (no API key needed)
            </label>
            <button type="button" onClick={() => setShowSettings(true)} className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300">
              <span aria-hidden>⚙️</span> AI Settings
            </button>
          </div>
          <Button type="submit" size="lg" loading={ui.isGenerating}>
            {ui.isGenerating ? "Generating…" : "Generate My Event Site →"}
          </Button>
        </div>
      </form>

      <AISettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
