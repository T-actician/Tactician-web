import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { SiteContent, Project } from "@/types/content";

const NAVY = "#1c3f6e";
const INK = "#1f2937";
const MUTED = "#4b5563";

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 36,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: INK,
    lineHeight: 1.35,
  },
  name: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "center",
    letterSpacing: 1,
  },
  role: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    letterSpacing: 2,
    marginTop: 4,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 14,
  },
  contactItem: {
    fontSize: 8.5,
    color: MUTED,
  },
  topDivider: {
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
    marginTop: 12,
    marginBottom: 12,
  },
  sectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  sectionLine: {
    flex: 1,
    borderBottomWidth: 0.75,
    borderBottomColor: NAVY,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 1,
    marginHorizontal: 8,
    textTransform: "uppercase",
  },
  summaryText: {
    fontSize: 9.5,
    color: "#374151",
    textAlign: "center",
    lineHeight: 1.5,
  },
  columns: {
    flexDirection: "row",
    marginTop: 8,
  },
  leftCol: {
    width: "34%",
    paddingRight: 14,
  },
  vDivider: {
    width: 1,
    backgroundColor: "#d1d5db",
  },
  rightCol: {
    width: "64%",
    paddingLeft: 14,
  },
  subSection: {
    marginBottom: 14,
  },
  subSectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  subSectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 0.5,
  },
  itemTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  itemLink: {
    fontSize: 8.5,
    color: NAVY,
    marginBottom: 2,
  },
  itemMeta: {
    fontSize: 8,
    color: MUTED,
    marginBottom: 2,
  },
  bulletList: {
    marginBottom: 10,
  },
  bulletLine: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletMark: {
    fontSize: 8.5,
    color: NAVY,
    width: 8,
  },
  bulletText: {
    fontSize: 8.5,
    color: "#374151",
    flex: 1,
  },
  subCategoryLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 3,
    marginTop: 6,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 2,
  },
  tagText: {
    fontSize: 8.5,
    color: "#374151",
    marginBottom: 3,
  },
  expBlock: {
    marginBottom: 12,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  expTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  expPeriod: {
    fontSize: 8,
    color: MUTED,
  },
  expCompany: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginLeft: 12,
    marginBottom: 3,
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
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 4,
  },
  footer: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 8.5,
    fontStyle: "italic",
    color: MUTED,
  },
});

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
    <View style={styles.sectionHeaderWrap}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.tagRow}>
      {items.map((item, i) => (
        <Text key={i} style={styles.tagText}>
          • {item}
          {i < items.length - 1 ? "   " : ""}
        </Text>
      ))}
    </View>
  );
}

function BulletBlock({ text }: { text: string }) {
  const bullets = splitToBullets(text);
  if (bullets.length === 0) return null;
  return (
    <View>
      {bullets.map((b, i) => (
        <View key={i} style={styles.bulletLine}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
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
  const { hero, contact, experience, cv, socials } = content;
  const fullName = `${hero.firstName} ${hero.lastName}`.trim();

  const linkedin = socials.find((s) => s.platform === "linkedin")?.url;
  const github = socials.find((s) => s.platform === "github")?.url;

  const keywordSet = new Set<string>([
    ...cv.engineeringSkills,
    ...cv.softwareTools,
    ...cv.softSkills,
    ...(cv.keywords || []),
  ]);

  const cvProjects = projects.filter((p) => p.status === "published").slice(0, 3);

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
        <Text style={styles.role}>{hero.role.toUpperCase()}</Text>
        <View style={styles.contactRow}>
          {contact.location && <Text style={styles.contactItem}>{contact.location}</Text>}
          {contact.phone && <Text style={styles.contactItem}>{contact.phone}</Text>}
          {contact.email && <Text style={styles.contactItem}>{contact.email}</Text>}
          {linkedin && <Text style={styles.contactItem}>{linkedin.replace(/^https?:\/\//, "")}</Text>}
          {github && <Text style={styles.contactItem}>{github.replace(/^https?:\/\//, "")}</Text>}
        </View>
        <View style={styles.topDivider} />

        {/* Professional Summary */}
        <SectionHeader title="Professional Summary" />
        <Text style={styles.summaryText}>{cv.summary}</Text>

        {/* Two-column body */}
        <View style={styles.columns}>
          {/* LEFT COLUMN */}
          <View style={styles.leftCol}>
            {/* Education */}
            {cv.education.length > 0 && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>EDUCATION</Text>
                </View>
                {cv.education.map((edu) => (
                  <View key={edu.id} style={{ marginBottom: 8 }}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={styles.itemLink}>{edu.institution}</Text>
                    <Text style={styles.itemMeta}>{edu.period}</Text>
                    {edu.description && <Text style={styles.itemMeta}>{edu.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Technical Skills */}
            {(cv.engineeringSkills.length > 0 || cv.softwareTools.length > 0) && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>TECHNICAL SKILLS</Text>
                </View>
                {cv.engineeringSkills.length > 0 && (
                  <>
                    <Text style={styles.subCategoryLabel}>Engineering</Text>
                    {cv.engineeringSkills.map((s, i) => (
                      <Text key={i} style={styles.tagText}>
                        • {s}
                      </Text>
                    ))}
                  </>
                )}
                {cv.softwareTools.length > 0 && (
                  <>
                    <Text style={styles.subCategoryLabel}>Software &amp; Tools</Text>
                    {cv.softwareTools.map((s, i) => (
                      <Text key={i} style={styles.tagText}>
                        • {s}
                      </Text>
                    ))}
                  </>
                )}
              </View>
            )}

            {/* Soft Skills */}
            {cv.softSkills.length > 0 && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>SOFT SKILLS</Text>
                </View>
                {cv.softSkills.map((s, i) => (
                  <Text key={i} style={styles.tagText}>
                    • {s}
                  </Text>
                ))}
              </View>
            )}

            {/* Languages */}
            {cv.languages.length > 0 && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>LANGUAGES</Text>
                </View>
                {cv.languages.map((s, i) => (
                  <Text key={i} style={styles.tagText}>
                    • {s}
                  </Text>
                ))}
              </View>
            )}

            {/* Interests */}
            {cv.interests.length > 0 && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>INTERESTS</Text>
                </View>
                {cv.interests.map((s, i) => (
                  <Text key={i} style={styles.tagText}>
                    • {s}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.vDivider} />

          {/* RIGHT COLUMN */}
          <View style={styles.rightCol}>
            {/* Work Experience */}
            {experience.length > 0 && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>WORK EXPERIENCE</Text>
                </View>
                {experience.map((exp) => (
                  <View key={exp.id} style={styles.expBlock}>
                    <View style={styles.expHeaderRow}>
                      <View style={styles.expTitleRow}>
                        <View style={styles.expDot} />
                        <Text style={styles.itemTitle}>{exp.role}</Text>
                      </View>
                      <Text style={styles.expPeriod}>
                        {exp.period}
                        {exp.current ? " - Present" : ""}
                      </Text>
                    </View>
                    <Text style={styles.expCompany}>{exp.company}</Text>
                    <View style={{ marginLeft: 12 }}>
                      <BulletBlock text={exp.description} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {cvProjects.length > 0 && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>PROJECTS</Text>
                </View>
                {cvProjects.map((p) => (
                  <View key={p.id} style={{ marginBottom: 10 }}>
                    <Text style={styles.itemTitle}>{p.title}</Text>
                    {p.summary && <Text style={[styles.bulletText, { marginBottom: 3 }]}>{p.summary}</Text>}
                    <BulletBlock text={p.results || p.implementation} />
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {cv.certifications.length > 0 && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>CERTIFICATIONS</Text>
                </View>
                {cv.certifications.map((c) => (
                  <View key={c.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                    <Text style={styles.bulletText}>
                      {c.name} — {c.issuer}
                    </Text>
                    <Text style={styles.itemMeta}>{c.year}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Additional Information */}
            {(cv.interests.length > 0 || cv.strengths.length > 0 || cv.values.length > 0) && (
              <View style={styles.subSection}>
                <View style={styles.subSectionTitleWrap}>
                  <Text style={styles.subSectionTitle}>ADDITIONAL INFORMATION</Text>
                </View>
                <View style={styles.threeCol}>
                  {cv.interests.length > 0 && (
                    <View style={styles.threeColItem}>
                      <Text style={styles.threeColTitle}>Activities &amp; Interests</Text>
                      {cv.interests.map((s, i) => (
                        <Text key={i} style={styles.tagText}>
                          • {s}
                        </Text>
                      ))}
                    </View>
                  )}
                  {cv.strengths.length > 0 && (
                    <View style={styles.threeColItem}>
                      <Text style={styles.threeColTitle}>Strengths</Text>
                      {cv.strengths.map((s, i) => (
                        <Text key={i} style={styles.tagText}>
                          • {s}
                        </Text>
                      ))}
                    </View>
                  )}
                  {cv.values.length > 0 && (
                    <View style={styles.threeColItem}>
                      <Text style={styles.threeColTitle}>Values</Text>
                      {cv.values.map((s, i) => (
                        <Text key={i} style={styles.tagText}>
                          • {s}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
