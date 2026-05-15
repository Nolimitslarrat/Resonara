import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmissionSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
      </div>
      
      <h1 className="text-3xl font-editorial font-bold text-[var(--brand-800)] mb-4">Submission Successful!</h1>
      
      <p className="text-slate-600 mb-8 leading-relaxed">
        Your manuscript has been successfully submitted to NexScholar. Our editorial team will review your submission shortly. You will receive an email confirmation and can track the status of your manuscript from your Author Dashboard.
      </p>

      <div className="flex justify-center gap-4">
        <Link href="/dashboard">
          <Button className="bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white">
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/manuscripts/submit">
          <Button variant="outline" className="gap-2">
            Submit Another <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
