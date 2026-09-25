import Header from "@/components/layout/Header";
import StepIndicator from "@/components/layout/StepIndicator";
import { useEventStore } from "@/store/useEventStore";
import EventDetailsForm from "@/components/form/EventDetailsForm";
import TemplatePicker from "@/components/template-selector/TemplatePicker";
import PreviewEditor from "@/components/preview/PreviewEditor";
import ExportPanel from "@/components/export/ExportPanel";

export default function CreatorPage() {
  const step = useEventStore((s) => s.ui.step);
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      <div className="pt-20 pb-4 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto py-4">
          <StepIndicator current={step} />
        </div>
      </div>
      <main className="flex-1">
        {step === "form"     && <EventDetailsForm />}
        {step === "template" && <TemplatePicker />}
        {step === "preview"  && <PreviewEditor />}
        {step === "export"   && <ExportPanel />}
      </main>
    </div>
  );
}
