"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We will get back to you soon.",
      });

      (e.target as HTMLFormElement).reset();
    } catch {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" name="firstName" placeholder="Jane" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" name="lastName" placeholder="Smith" required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email Address</Label>
          <Input id="contact-email" name="email" type="email" placeholder="jane@university.edu" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Contact Number</Label>
          <Input id="contact-phone" name="phone" type="tel" placeholder="+91 98765 43210" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <select
          id="subject"
          name="subject"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          required
        >
          <option value="">Select a topic…</option>
          <option value="Manuscript Submission">Manuscript Submission</option>
          <option value="Peer Review">Peer Review</option>
          <option value="Account / Login">Account / Login</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Describe your enquiry in detail…"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
          required
        />
      </div>

      <Button type="submit" className="w-full h-11 gap-2" disabled={isSubmitting}>
        <Mail className="w-4 h-4" /> {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
