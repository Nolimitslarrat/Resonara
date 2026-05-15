"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronRight, FileText, Upload, Users, BookOpen } from "lucide-react";
import { submitManuscript } from "@/app/actions/manuscript";

interface Props {
  journals: { id: string; title: string; slug: string }[];
  categories: { id: string; name: string }[];
  defaultJournalId?: string;
}

export function SubmissionWizard({ journals, categories, defaultJournalId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [journalId, setJournalId] = useState(defaultJournalId || "");
  const [categoryId, setCategoryId] = useState("");
  
  const [coAuthors, setCoAuthors] = useState<{name: string, email: string, affiliation: string}[]>([]);
  const [caName, setCaName] = useState("");
  const [caEmail, setCaEmail] = useState("");
  const [caAffiliation, setCaAffiliation] = useState("");
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addCoAuthor = () => {
    if (!caName || !caEmail) return;
    setCoAuthors([...coAuthors, { name: caName, email: caEmail, affiliation: caAffiliation }]);
    setCaName(""); setCaEmail(""); setCaAffiliation("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("File is too large. Max 50MB allowed.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeCoAuthor = (index: number) => {
    setCoAuthors(coAuthors.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !abstract || !journalId) return;
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("keywords", keywords);
    formData.append("journalId", journalId);
    if (categoryId) formData.append("categoryId", categoryId);
    formData.append("coAuthors", JSON.stringify(coAuthors));
    
    if (file) {
      formData.append("file", file);
    }
    
    const result = await submitManuscript(formData);
    
    if (result.success) {
      router.push(`/dashboard/manuscripts/${result.manuscriptId}/success`);
    } else {
      setIsSubmitting(false);
      alert("Error submitting manuscript: " + result.error);
    }
  };

  const steps = [
    { id: 1, name: "Article Details", icon: FileText },
    { id: 2, name: "Target Journal", icon: BookOpen },
    { id: 3, name: "Authors", icon: Users },
    { id: 4, name: "Files", icon: Upload },
    { id: 5, name: "Review", icon: Check },
  ];

  return (
    <div className="bg-white border border-slate-200 shadow-sm">
      {/* Wizard Header */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => s.id < step ? setStep(s.id) : null}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 min-w-[140px] text-sm font-semibold transition-colors border-b-2 ${
              step === s.id 
                ? "border-[var(--brand-600)] text-[var(--brand-800)] bg-slate-50" 
                : step > s.id 
                  ? "border-transparent text-[var(--brand-600)] cursor-pointer hover:bg-slate-50" 
                  : "border-transparent text-slate-400 cursor-not-allowed"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step > s.id ? "bg-[var(--brand-600)] text-white" : step === s.id ? "bg-[var(--brand-100)] text-[var(--brand-700)]" : "bg-slate-100"
            }`}>
              {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
            </div>
            {s.name}
          </button>
        ))}
      </div>

      {/* Wizard Content */}
      <div className="p-6 sm:p-10 min-h-[400px]">
        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Manuscript Title *</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter the full title of your manuscript" 
                className="font-editorial text-lg h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Abstract *</label>
              <textarea 
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows={8}
                className="w-full border border-slate-300 rounded-sm p-3 focus:outline-none focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)] text-sm"
                placeholder="Enter your abstract (max 300 words)"
              />
              <p className="text-xs text-slate-500 mt-1">Provide a concise summary of the research objectives, methodology, and key findings.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Keywords</label>
              <Input 
                value={keywords} 
                onChange={(e) => setKeywords(e.target.value)} 
                placeholder="e.g. machine learning, clinical trials, quantum physics (comma separated)" 
              />
            </div>
          </div>
        )}

        {/* Step 2: Journal Selection */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Select Target Journal *</label>
              <select 
                value={journalId}
                onChange={(e) => setJournalId(e.target.value)}
                className="w-full border border-slate-300 rounded-sm p-3 focus:outline-none focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)] bg-white text-sm"
              >
                <option value="">-- Select a Journal --</option>
                {journals.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Subject Area / Category</label>
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-slate-300 rounded-sm p-3 focus:outline-none focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)] bg-white text-sm"
              >
                <option value="">-- Optional --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Authors */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm">
              <p className="text-sm text-slate-700">You are automatically added as the Corresponding Author based on your logged-in account. You may add additional co-authors below.</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2">Add Co-Author</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                <Input placeholder="Full Name" value={caName} onChange={(e) => setCaName(e.target.value)} />
                <Input placeholder="Email Address" type="email" value={caEmail} onChange={(e) => setCaEmail(e.target.value)} />
                <Input placeholder="Institution / Affiliation" value={caAffiliation} onChange={(e) => setCaAffiliation(e.target.value)} />
              </div>
              <Button type="button" onClick={addCoAuthor} variant="outline" size="sm" disabled={!caName || !caEmail}>
                Add Author
              </Button>
            </div>

            {coAuthors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Co-Author List</h3>
                <div className="border border-slate-200 rounded-sm divide-y divide-slate-100">
                  {coAuthors.map((ca, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <div className="font-semibold text-sm">{ca.name}</div>
                        <div className="text-xs text-slate-500">{ca.email} • {ca.affiliation}</div>
                      </div>
                      <button onClick={() => removeCoAuthor(idx)} className="text-red-500 text-xs font-semibold hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Files */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in-up text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[var(--brand-600)]" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Upload Manuscript Files</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Please upload your main manuscript file (PDF or DOCX). You can also include supplementary files in a ZIP archive.
            </p>
            <div 
              className={`border-2 border-dashed p-8 rounded-sm transition-colors max-w-lg mx-auto ${
                file ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-slate-50 hover:border-[var(--brand-400)]"
              }`}
            >
              <input 
                type="file" 
                id="manuscript-file" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.zip"
              />
              <label htmlFor="manuscript-file" className="cursor-pointer">
                <Button type="button" variant="outline" className="bg-white pointer-events-none">
                  {file ? "Change File" : "Browse Files"}
                </Button>
              </label>
              <p className="text-xs text-slate-400 mt-2">PDF, DOCX, ZIP allowed. Max 50MB.</p>
            </div>
            
            {file && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold bg-white px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                  <Check className="w-4 h-4" /> {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
                <p className="text-[10px] text-slate-400">File attached and ready for submission</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm">
              <h3 className="text-lg font-editorial font-bold text-[var(--brand-800)] mb-4 pb-2 border-b border-slate-200">Review Submission</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700 block">Title</span>
                  <span className="text-slate-900 font-editorial text-lg">{title || "—"}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Target Journal</span>
                  <span className="text-slate-900">{journals.find(j => j.id === journalId)?.title || "—"}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Abstract</span>
                  <span className="text-slate-600 italic block">{abstract || "—"}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Authors</span>
                  <span className="text-slate-900">You (Corresponding Author){coAuthors.length > 0 ? `, plus ${coAuthors.length} co-author(s)` : ""}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm text-sm text-amber-800">
              <strong className="block mb-1">Declaration</strong>
              I confirm that this manuscript is original, has not been published before, and is not currently being considered for publication elsewhere. I have obtained all necessary permissions for reproduction of any copyrighted work.
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer */}
      <div className="border-t border-slate-200 p-6 bg-slate-50 flex justify-between items-center">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setStep(step - 1)} 
          disabled={step === 1 || isSubmitting}
          className="bg-white"
        >
          Back
        </Button>
        
        {step < 5 ? (
          <Button 
            type="button" 
            onClick={() => setStep(step + 1)}
            className="bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white gap-2"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting || !title || !abstract || !journalId}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8"
          >
            {isSubmitting ? "Submitting..." : "Submit Manuscript"}
          </Button>
        )}
      </div>
    </div>
  );
}
