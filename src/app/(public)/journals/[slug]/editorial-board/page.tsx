import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronLeft, Mail, Globe, BookOpen, Award, Users } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const journal = await prisma.journal.findUnique({
    where: { slug: params.slug },
    select: { title: true },
  });
  if (!journal) return { title: "Not Found" };
  return {
    title: `Editorial Board | ${journal.title}`,
    description: `Meet the editorial board members of ${journal.title}.`,
  };
}

export default async function EditorialBoardPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const journal = await prisma.journal.findUnique({
    where: { slug: params.slug },
    include: {
      editorInChief: true,
      editorialBoard: {
        include: { user: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!journal) notFound();

  // Group editorial board members by role
  const roleOrder = [
    "EDITOR_IN_CHIEF",
    "ASSOCIATE_EDITOR",
    "SECTION_EDITOR",
    "EDITORIAL_BOARD",
    "ADVISORY_BOARD",
  ];
  const roleLabelMap: Record<string, string> = {
    EDITOR_IN_CHIEF: "Editor-in-Chief",
    ASSOCIATE_EDITOR: "Associate Editor",
    SECTION_EDITOR: "Section Editor",
    EDITORIAL_BOARD: "Editorial Board Member",
    ADVISORY_BOARD: "Advisory Board Member",
  };

  const grouped = journal.editorialBoard.reduce(
    (acc, member) => {
      const key = member.role.toUpperCase().replace(/ /g, "_");
      if (!acc[key]) acc[key] = [];
      acc[key].push(member);
      return acc;
    },
    {} as Record<string, typeof journal.editorialBoard>
  );

  const groupKeys = [
    ...roleOrder.filter((r) => grouped[r]),
    ...Object.keys(grouped).filter((k) => !roleOrder.includes(k)),
  ];

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-[var(--brand-900)] text-white pt-16 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-800)] via-[var(--brand-900)] to-[var(--brand-900)]" />
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top right, white 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href={`/journals/${journal.slug}`}
            className="inline-flex items-center text-[var(--brand-300)] hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to {journal.title}
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-[var(--brand-300)] text-xs font-bold uppercase tracking-widest mb-1">
                {journal.title}
              </p>
              <h1 className="text-4xl font-editorial font-bold text-white">
                Editorial Board
              </h1>
            </div>
          </div>
          <p className="text-[var(--brand-200)] max-w-2xl text-base leading-relaxed mt-4">
            Our editorial board comprises leading experts committed to upholding
            the highest standards of academic integrity and scientific rigor.
          </p>
        </div>
      </div>

      {/* Editor-in-Chief standalone card */}
      {journal.editorInChief && !journal.editorialBoard.some(b => b.userId === journal.editorInChiefId) && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-700)] px-8 py-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-300)]">
                Editor-in-Chief
              </span>
            </div>
            <div className="p-8 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--brand-100)] to-[var(--brand-200)] flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="text-2xl font-editorial font-bold text-[var(--brand-700)]">
                  {journal.editorInChief.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-1">
                  {journal.editorInChief.name}
                </h2>
                {journal.editorInChief.designation && (
                  <p className="text-[var(--brand-600)] font-semibold text-sm mb-2">
                    {journal.editorInChief.designation}
                  </p>
                )}
                {journal.editorInChief.affiliation && (
                  <p className="text-[var(--muted)] text-sm mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[var(--brand-400)]" />
                    {journal.editorInChief.affiliation}
                  </p>
                )}
                {journal.editorInChief.bio && (
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-2xl">
                    {journal.editorInChief.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {journal.editorInChief.expertise?.map((exp) => (
                    <span
                      key={exp}
                      className="text-xs bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-200)] px-3 py-1 rounded-full font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-4">
                  {journal.editorInChief.email && (
                    <a
                      href={`mailto:${journal.editorInChief.email}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Contact
                    </a>
                  )}
                  {journal.editorInChief.orcid && (
                    <a
                      href={`https://orcid.org/${journal.editorInChief.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      ORCID
                    </a>
                  )}
                  {journal.editorInChief.institutionalProfile && (
                    <a
                      href={journal.editorInChief.institutionalProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Board sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-8">
        {groupKeys.length === 0 && (
          <div className="text-center py-20 text-[var(--muted)]">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">Editorial board is being updated.</p>
            <p className="text-sm mt-2">Check back soon for the full listing.</p>
          </div>
        )}

        {groupKeys.map((roleKey) => {
          const members = grouped[roleKey];
          const label =
            roleLabelMap[roleKey] ||
            roleKey
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div key={roleKey}>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-[var(--brand-500)]" />
                <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)]">
                  {label}s
                </h2>
                <span className="ml-2 text-xs bg-[var(--brand-100)] text-[var(--brand-700)] px-2 py-0.5 rounded-full font-semibold">
                  {members.length}
                </span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow p-6 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--brand-100)] to-[var(--brand-200)] flex items-center justify-center flex-shrink-0 shadow-inner group-hover:from-[var(--brand-200)] group-hover:to-[var(--brand-300)] transition-all">
                        <span className="text-xl font-editorial font-bold text-[var(--brand-700)]">
                          {member.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[var(--brand-900)] text-base leading-tight mb-0.5 truncate">
                          {member.user.name}
                        </h3>
                        {member.user.designation && (
                          <p className="text-xs font-semibold text-[var(--brand-600)] mb-1 truncate">
                            {member.user.designation}
                          </p>
                        )}
                        {member.user.affiliation && (
                          <p className="text-xs text-[var(--muted)] leading-snug">
                            {member.user.affiliation}
                          </p>
                        )}
                      </div>
                    </div>

                    {member.user.expertise && member.user.expertise.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {member.user.expertise.slice(0, 3).map((exp) => (
                          <span
                            key={exp}
                            className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                        {member.user.expertise.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium py-0.5">
                            +{member.user.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-[var(--border)] flex gap-3">
                      {member.user.orcid && (
                        <a
                          href={`https://orcid.org/${member.user.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-[var(--brand-600)] hover:text-[var(--brand-800)] flex items-center gap-1 transition-colors"
                        >
                          <Globe className="w-3 h-3" /> ORCID
                        </a>
                      )}
                      {member.user.institutionalProfile && (
                        <a
                          href={member.user.institutionalProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-[var(--brand-600)] hover:text-[var(--brand-800)] flex items-center gap-1 transition-colors"
                        >
                          <Globe className="w-3 h-3" /> Profile
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
