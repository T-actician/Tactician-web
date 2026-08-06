import React from "react";
import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from "@react-pdf/renderer";
import { SiteContent, Project } from "@/types/content";

const NAVY = "#1c3f6e";
const INK = "#1f2937";
const MUTED = "#4b5563";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK,
    lineHeight: 1.5,
  },
  name: {
    fontSize: 28,
    fontFamily: "Times-Bold",
    color: "#111827",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIconBox: {
    width: 11,
    height: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  contactText: {
    fontSize: 9,
    color: MUTED,
    lineHeight: 1,
  },
  topDivider: {
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
    marginTop: 14,
    marginBottom: 14,
  },
  sectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  sectionLine: {
    flex: 1,
    borderBottomWidth: 0.75,
    borderBottomColor: NAVY,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 1,
    marginHorizontal: 9,
    textTransform: "uppercase",
  },
  subSectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  subSectionLine: {
    width: 14,
    borderBottomWidth: 0.75,
    borderBottomColor: NAVY,
  },
  subSectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 0.75,
    marginHorizontal: 6,
    textTransform: "uppercase",
  },
  summaryText: {
    fontSize: 10,
    color: "#374151",
    textAlign: "center",
    lineHeight: 1.6,
    paddingHorizontal: 6,
  },
  columns: {
    flexDirection: "row",
    marginTop: 10,
  },
  leftCol: {
    width: "35%",
    paddingRight: 16,
  },
  vDivider: {
    width: 1,
    backgroundColor: "#d1d5db",
  },
  rightCol: {
    width: "63%",
    paddingLeft: 16,
  },
  subSection: {
    marginBottom: 18,
  },
  itemTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  itemLink: {
    fontSize: 9,
    color: NAVY,
    marginTop: 1,
  },
  itemMeta: {
    fontSize: 8.5,
    color: MUTED,
    marginTop: 1,
  },
  eduBlock: {
    marginBottom: 10,
  },
  bulletLine: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bulletMark: {
    fontSize: 9,
    color: NAVY,
    width: 9,
  },
  bulletText: {
    fontSize: 9,
    color: "#374151",
    flex: 1,
    lineHeight: 1.5,
  },
  plainText: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.5,
  },
  subCategoryLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
    marginTop: 8,
  },
  tagText: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 4,
  },
  expBlock: {
    marginBottom: 14,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  expTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexShrink: 1,
    paddingRight: 8,
  },
  expDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: NAVY,
    marginRight: 6,
    marginTop: 3,
  },
  expPeriod: {
    fontSize: 8.5,
    color: MUTED,
    textAlign: "right",
    width: 105,
  },
  expCompany: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginLeft: 12,
    marginBottom: 4,
    marginTop: 1,
  },
  expBullets: {
    marginLeft: 12,
  },
  projectBlock: {
    marginBottom: 12,
  },
  projectSummary: {
    fontSize: 9,
    color: "#374151",
    marginTop: 2,
    marginBottom: 4,
    lineHeight: 1.5,
  },
  threeCol: {
    flexDirection: "row",
    marginTop: 4,
  },
  threeColItem: {
    flex: 1,
    paddingRight: 8,
  },
  threeColTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 5,
  },
});

// --- Minimal line-style icons (react-pdf renders real SVG, not DOM icon fonts) ---
function IconPin() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"
        stroke={NAVY}
        strokeWidth={2}
        fill="none"
      />
      <Circle cx={12} cy={10} r={2.4} fill={NAVY} />
    </Svg>
  );
}
function IconPhone() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
        fill={NAVY}
      />
    </Svg>
  );
}
function IconMail() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
        stroke={NAVY}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M2 6l10 7 10-7" stroke={NAVY} strokeWidth={2} fill="none" />
    </Svg>
  );
}
function IconLinkedin() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M4.5 3.5A2.5 2.5 0 1 0 4.5 8.5 2.5 2.5 0 0 0 4.5 3.5zM2.5 10h4V21h-4V10zM9.5 10h3.8v1.5h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.6 4.78 6V21h-4v-5.1c0-1.22-.02-2.8-1.7-2.8-1.7 0-1.96 1.33-1.96 2.7V21h-4V10z"
        fill={NAVY}
      />
    </Svg>
  );
}
function IconGithub() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.32 9.32 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"
        fill={NAVY}
      />
    </Svg>
  );
}

function splitToBullets(text: string): string[] {
  if (!text) return [];
  const plain = text
    .replace(/<\/(p|li|div|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
  return plain
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeaderWrap} minPresenceAhead={50}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function SubSectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.subSectionHeaderWrap} minPresenceAhead={50}>
      <View style={styles.subSectionLine} />
      <Text style={styles.subSectionTitle}>{title}</Text>
      <View style={styles.subSectionLine} />
    </View>
  );
}

function BulletBlock({ text }: { text: string }) {
  const bullets = splitToBullets(text);
  if (bullets.length === 0) return null;
  return (
    <View>
      {bullets.map((b, i) => (
        <View key={i} style={styles.bulletLine} wrap={false}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

function TagBlock({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View>
      {items.map((s, i) => (
        <Text key={i} style={styles.tagText}>
          • {s}
        </Text>
      ))}
    </View>
  );
}

// De-duplicates while preserving order, case-insensitive
function mergeUnique(base: string[], extra: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of [...base, ...extra]) {
    const key = item.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
  }
  return out;
}

function formatPeriod(period: string, current: boolean): string {
  if (!period) return current ? "Present" : "";
  if (current && !/present/i.test(period)) return `${period} - Present`;
  return period;
}

function ExperienceEntry({ exp }: { exp: SiteContent["experience"][number] }) {
  return (
    <View style={styles.expBlock} wrap={false}>
      <View style={styles.expHeaderRow}>
        <View style={styles.expTitleRow}>
          <View style={styles.expDot} />
          <Text style={styles.itemTitle}>{exp.role}</Text>
        </View>
        <Text style={styles.expPeriod}>{formatPeriod(exp.period, exp.current)}</Text>
      </View>
      <Text style={styles.expCompany}>{exp.company}</Text>
      <View style={styles.expBullets}>
        <BulletBlock text={exp.description} />
      </View>
    </View>
  );
}

function ProjectEntry({ project }: { project: Project }) {
  return (
    <View style={styles.projectBlock} wrap={false}>
      <Text style={styles.itemTitle}>{project.title}</Text>
      {project.summary && <Text style={styles.projectSummary}>{project.summary}</Text>}
      <BulletBlock text={project.results || project.implementation} />
    </View>
  );
}

export default function CVDocument({
  content,
  projects,
}: {
  content: SiteContent;
  projects: Project[];
}) {
  const { hero, contact, experience, cv, socials, skills, tools } = content;
  const fullName = `${hero.firstName} ${hero.lastName}`.trim();

  const linkedin = socials.find((s) => s.platform === "linkedin")?.url;
  const github = socials.find((s) => s.platform === "github")?.url;

  // Technical Skills default from the live site's Skills/Tools sections;
  // anything added in the CV editor is appended on top, not a replacement.
  let engineeringSkills = mergeUnique(
    skills.map((s) => s.name),
    cv.engineeringSkills
  );
  let softwareTools = mergeUnique(
    tools.map((t) => t.name),
    cv.softwareTools
  );

  // If the admin has explicitly picked which skills to show for this CV,
  // narrow both lists down to that whitelist.
  if (cv.selectedSkillNames && cv.selectedSkillNames.length > 0) {
    const selected = new Set(cv.selectedSkillNames.map((s) => s.toLowerCase()));
    engineeringSkills = engineeringSkills.filter((s) => selected.has(s.toLowerCase()));
    softwareTools = softwareTools.filter((s) => selected.has(s.toLowerCase()));
  }

  const keywordSet = new Set<string>([...engineeringSkills, ...softwareTools, ...cv.softSkills, ...(cv.keywords || [])]);

  const cvProjects = projects.filter((p) => p.status === "published" && p.includeInCV);
  const includedCertifications = cv.certifications.filter((c) => c.included !== false);

  return (
    <Document
      title={`${fullName} - CV`}
      author={fullName}
      subject={hero.role}
      keywords={Array.from(keywordSet).join(", ")}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{fullName.toUpperCase()}</Text>
        <View style={styles.contactRow}>
          {contact.location && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <IconPin />
              </View>
              <Text style={styles.contactText}>{contact.location}</Text>
            </View>
          )}
          {contact.phone && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <IconPhone />
              </View>
              <Text style={styles.contactText}>{contact.phone}</Text>
            </View>
          )}
          {contact.email && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <IconMail />
              </View>
              <Text style={styles.contactText}>{contact.email}</Text>
            </View>
          )}
          {linkedin && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <IconLinkedin />
              </View>
              <Text style={styles.contactText}>{linkedin.replace(/^https?:\/\//, "")}</Text>
            </View>
          )}
          {github && (
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <IconGithub />
              </View>
              <Text style={styles.contactText}>{github.replace(/^https?:\/\//, "")}</Text>
            </View>
          )}
        </View>
        <View style={styles.topDivider} />

        {/* Professional Summary */}
        <SectionHeader title="Professional Summary" />
        <Text style={styles.summaryText}>{cv.summary}</Text>

        {/* Two-column body */}
        <View style={styles.columns}>
          {/* LEFT COLUMN */}
          <View style={styles.leftCol}>
            {cv.education.length > 0 && (
              <View style={styles.subSection}>
                <View wrap={false}>
                  <SubSectionHeader title="Education" />
                  <View style={styles.eduBlock}>
                    <Text style={styles.itemTitle}>{cv.education[0].degree}</Text>
                    <Text style={styles.itemLink}>{cv.education[0].institution}</Text>
                    <Text style={styles.itemMeta}>{cv.education[0].period}</Text>
                    {cv.education[0].description && (
                      <Text style={styles.itemMeta}>{cv.education[0].description}</Text>
                    )}
                  </View>
                </View>
                {cv.education.slice(1).map((edu) => (
                  <View key={edu.id} style={styles.eduBlock} wrap={false}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={styles.itemLink}>{edu.institution}</Text>
                    <Text style={styles.itemMeta}>{edu.period}</Text>
                    {edu.description && <Text style={styles.itemMeta}>{edu.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {engineeringSkills.length > 0 && (
              <View style={styles.subSection} wrap={false}>
                <SubSectionHeader title="Technical Skills" />
                <TagBlock items={engineeringSkills} />
              </View>
            )}

            {cv.softSkills.length > 0 && (
              <View style={styles.subSection} wrap={false}>
                <SubSectionHeader title="Soft Skills" />
                <TagBlock items={cv.softSkills} />
              </View>
            )}

            {cv.languages.length > 0 && (
              <View style={styles.subSection} wrap={false}>
                <SubSectionHeader title="Languages" />
                <TagBlock items={cv.languages} />
              </View>
            )}

            {cv.interests.length > 0 && (
              <View style={styles.subSection} wrap={false}>
                <SubSectionHeader title="Interests" />
                <TagBlock items={cv.interests} />
              </View>
            )}

            {(cv.strengths.length > 0 || cv.values.length > 0) && (
              <View style={styles.subSection} wrap={false}>
                <SubSectionHeader title="Additional Information" />
                {cv.strengths.length > 0 && (
                  <>
                    <Text style={styles.subCategoryLabel}>Strengths</Text>
                    <TagBlock items={cv.strengths} />
                  </>
                )}
                {cv.values.length > 0 && (
                  <>
                    <Text style={styles.subCategoryLabel}>Values</Text>
                    <TagBlock items={cv.values} />
                  </>
                )}
              </View>
            )}
          </View>

          <View style={styles.vDivider} />

          {/* RIGHT COLUMN */}
          <View style={styles.rightCol}>
            {experience.length > 0 && (
              <View style={styles.subSection}>
                <View wrap={false}>
                  <SubSectionHeader title="Work Experience" />
                  <ExperienceEntry exp={experience[0]} />
                </View>
                {experience.slice(1).map((exp) => (
                  <ExperienceEntry key={exp.id} exp={exp} />
                ))}
              </View>
            )}

            {cvProjects.length > 0 && (
              <View style={styles.subSection}>
                <View wrap={false}>
                  <SubSectionHeader title="Projects" />
                  <ProjectEntry project={cvProjects[0]} />
                </View>
                {cvProjects.slice(1).map((p) => (
                  <ProjectEntry key={p.id} project={p} />
                ))}
              </View>
            )}

            {includedCertifications.length > 0 && (
              <View style={styles.subSection} wrap={false}>
                <SubSectionHeader title="Certifications" />
                {includedCertifications.map((c) => (
                  <View key={c.id} style={styles.expHeaderRow}>
                    <Text style={[styles.plainText, { flexShrink: 1, paddingRight: 8 }]}>
                      {c.name} — {c.issuer}
                    </Text>
                    <Text style={styles.itemMeta}>{c.year}</Text>
                  </View>
                ))}
              </View>
            )}

          </View>
        </View>
      </Page>
    </Document>
  );
}
