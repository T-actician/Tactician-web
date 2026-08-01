import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { SiteContent } from "@/types/content";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: "#111827",
    lineHeight: 1.4,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  role: {
    fontSize: 12,
    color: "#1c5ce0",
    marginTop: 2,
    fontFamily: "Helvetica-Bold",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 10,
  },
  contactItem: {
    fontSize: 9.5,
    color: "#374151",
  },
  divider: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#1c5ce0",
    marginTop: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    color: "#1c5ce0",
    marginBottom: 6,
    marginTop: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 10,
    color: "#1f2937",
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  itemTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  itemSubtitle: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 2,
  },
  itemPeriod: {
    fontSize: 9.5,
    color: "#4b5563",
  },
  itemBlock: {
    marginBottom: 9,
  },
  bullet: {
    fontSize: 10,
    color: "#1f2937",
    marginBottom: 2,
  },
  keywordRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  keywordPill: {
    fontSize: 9,
    color: "#111827",
  },
});

function splitToBullets(text: string): string[] {
  if (!text) return [];
  // Support plain text and simple HTML from the rich text editor
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

export default function CVDocument({ content }: { content: SiteContent }) {
  const { hero, about, contact, skills, tools, experience, cv, testimonials } = content;
  const fullName = `${hero.firstName} ${hero.lastName}`.trim();

  const keywordSet = new Set<string>([
    ...skills.map((s) => s.name),
    ...tools.map((t) => t.name),
    ...about.tags,
    ...(cv.keywords || []),
  ]);

  return (
    <Document
      title={`${fullName} - CV`}
      author={fullName}
      subject={hero.role}
      keywords={Array.from(keywordSet).join(", ")}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.role}>{hero.role}</Text>
        <View style={styles.contactRow}>
          {contact.email && <Text style={styles.contactItem}>{contact.email}</Text>}
          {contact.phone && <Text style={styles.contactItem}>{contact.phone}</Text>}
          {contact.location && <Text style={styles.contactItem}>{contact.location}</Text>}
        </View>
        <View style={styles.divider} />

        {/* Professional Summary */}
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text style={styles.paragraph}>{cv.summary || about.description || hero.description}</Text>

        {/* Core Skills / Keywords - plain text list for ATS parsing */}
        {(skills.length > 0 || tools.length > 0 || (cv.keywords || []).length > 0) && (
          <>
            <Text style={styles.sectionTitle}>Core Skills &amp; Technologies</Text>
            <Text style={styles.paragraph}>{Array.from(keywordSet).join("  •  ")}</Text>
          </>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.itemBlock}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemTitle}>{exp.role}</Text>
                  <Text style={styles.itemPeriod}>
                    {exp.period}
                    {exp.current ? " - Present" : ""}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {splitToBullets(exp.description).map((line, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {line}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Education</Text>
            {cv.education.map((edu) => (
              <View key={edu.id} style={styles.itemBlock}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemPeriod}>{edu.period}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                {edu.description && <Text style={styles.paragraph}>{edu.description}</Text>}
              </View>
            ))}
          </>
        )}

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {cv.certifications.map((c) => (
              <View key={c.id} style={styles.itemRow}>
                <Text style={styles.itemTitle}>
                  {c.name} <Text style={styles.itemSubtitle}>— {c.issuer}</Text>
                </Text>
                <Text style={styles.itemPeriod}>{c.year}</Text>
              </View>
            ))}
          </>
        )}

        {/* Selected testimonial as a professional reference note, if available */}
        {testimonials.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Professional Reference</Text>
            <Text style={styles.paragraph}>
              &quot;{testimonials[0].quote}&quot; — {testimonials[0].name}, {testimonials[0].role} at{" "}
              {testimonials[0].company}
            </Text>
          </>
        )}
      </Page>
    </Document>
  );
}
