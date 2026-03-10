import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const C = {
  coal: '#0D0D0D', ash: '#1A1A1A', smoke: '#2D2D2D',
  bone: '#F5F0E8', muted: '#888880', fire: '#FF4500', ember: '#FF8C00',
};

// We will use a dynamic style generator based on config instead of a static one.
const s = StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', padding: 40, fontFamily: 'Helvetica' },
});

function getStyles(config?: any) {
  const base = config?.fontSize || 10;
  const ratio = base / 10;
  
  return StyleSheet.create({
    page: { backgroundColor: '#FFFFFF', padding: config?.margins || 40, fontFamily: 'Helvetica' },
    header: { marginBottom: 15 * ratio, borderBottomWidth: 2, borderBottomColor: '#000000', paddingBottom: 10 * ratio, alignItems: 'center' },
    name: { fontSize: 24 * ratio, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1 },
    role: { fontSize: 12 * ratio, color: '#444444', marginTop: 4 * ratio, fontFamily: 'Helvetica' },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 * ratio, marginTop: 6 * ratio },
    contactItem: { fontSize: 9 * ratio, color: '#555555' },
    
    sectionTitle: { fontSize: 11 * ratio, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginTop: (config?.sectionSpacing || 15) * ratio, marginBottom: 8 * ratio, borderBottomWidth: 1, borderBottomColor: '#DDDDDD', paddingBottom: 1 * ratio },
    summary: { fontSize: 10 * ratio, lineHeight: 1.4, color: '#333333', marginBottom: 10 * ratio },
    
    expItem: { marginBottom: 12 * ratio },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 * ratio, alignItems: 'baseline' },
    company: { fontSize: 10 * ratio, fontFamily: 'Helvetica-Bold', color: '#000000' },
    period: { fontSize: 9 * ratio, color: '#666666' },
    jobTitle: { fontSize: 10 * ratio, fontFamily: 'Helvetica-Oblique', color: '#333333', marginBottom: 4 * ratio },
    bulletPoint: { flexDirection: 'row', marginBottom: 2 * ratio, paddingLeft: 10 * ratio },
    bullet: { width: 8 * ratio, fontSize: 10 * ratio },
    bulletText: { flex: 1, fontSize: 10 * ratio, lineHeight: 1.4, color: '#444444' },
    
    eduItem: { marginBottom: 8 * ratio },
    institution: { fontSize: 10 * ratio, fontFamily: 'Helvetica-Bold' },
    degree: { fontSize: 10 * ratio, color: '#333333' },
    
    certItem: { marginBottom: 6 * ratio },
    certName: { fontSize: 10 * ratio, fontFamily: 'Helvetica-Bold' },
    certIssuer: { fontSize: 10 * ratio, color: '#444444', fontStyle: 'italic' },
    
    skillsContainer: { flexDirection: 'column', gap: 4 * ratio },
    skillCategoryRow: { flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' },
    skillCategoryName: { fontSize: 10 * ratio, fontFamily: 'Helvetica-Bold', marginRight: 4 * ratio },
    skillItems: { fontSize: 10 * ratio, color: '#444444', flex: 1, lineHeight: 1.3 },
    
    techStack: { fontSize: 9 * ratio, color: '#666666', marginTop: 4 * ratio, fontFamily: 'Helvetica-Oblique' },
  });
}

export function CVDoc({ data, config }: { data: any; config?: any }) {
  const { full_name, current_role, summary, experience, education, skills, projects, certifications, contact } = data;
  const styles = getStyles(config);

  return (
    <Document title={`CV - ${full_name}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{full_name}</Text>
          {current_role && <Text style={styles.role}>{current_role}</Text>}
          
          {contact && (
            <View style={styles.contactRow}>
              {contact.email && <Text style={styles.contactItem}>{contact.email}</Text>}
              {contact.phone && <Text style={styles.contactItem}>|  {contact.phone}</Text>}
              {contact.location && <Text style={styles.contactItem}>|  {contact.location}</Text>}
              {contact.linkedin && <Text style={styles.contactItem}>|  {contact.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}</Text>}
              {contact.github && <Text style={styles.contactItem}>|  {contact.github.replace(/^(https?:\/\/)?(www\.)?/, '')}</Text>}
            </View>
          )}
        </View>

        {summary && (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{summary}</Text>
          </View>
        )}

        {skills && skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill: any, i: number) => {
                if (typeof skill === 'string') {
                  return <Text key={i} style={styles.skillItems}>{skill}</Text>;
                }
                return (
                  <View key={i} style={styles.skillCategoryRow}>
                    <Text style={styles.skillCategoryName}>{skill.category}:</Text>
                    <Text style={styles.skillItems}>{Array.isArray(skill.items) ? skill.items.join(', ') : skill.items}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experience.map((exp: any, i: number) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{exp.company} <Text style={styles.jobTitle}>- {exp.role}</Text></Text>
                  <Text style={styles.period}>{exp.period}</Text>
                </View>
                {exp.points?.map((point: string, j: number) => (
                  <View key={j} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {education && education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, i: number) => (
              <View key={i} style={styles.eduItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.institution}>{edu.institution}</Text>
                  <Text style={styles.period}>{edu.period}</Text>
                </View>
                <Text style={styles.degree}>{edu.degree}</Text>
                {edu.points?.map((point: string, j: number) => (
                  <View key={j} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {certifications && certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications & Achievements</Text>
            {certifications.map((cert: any, i: number) => (
              <View key={i} style={styles.certItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.period}>{cert.date}</Text>
                </View>
                <Text style={styles.certIssuer}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}

        {projects && projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj: any, i: number) => (
              <View key={i} style={styles.expItem}>
                <Text style={styles.company}>{proj.name}</Text>
                <Text style={styles.bulletText}>{proj.description}</Text>
                {proj.tech_stack && proj.tech_stack.length > 0 && (
                  <Text style={styles.techStack}>
                    Tech Stack: {proj.tech_stack.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function generateCVPDF(data: any, config?: any): Promise<Buffer> {
  const blob = await pdf(<CVDoc data={data} config={config} />).toBlob();
  return Buffer.from(await blob.arrayBuffer());
}

