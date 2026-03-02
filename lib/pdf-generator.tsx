import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { RoastReport } from '@/types/roast';

const C = {
  coal: '#0D0D0D', ash: '#1A1A1A', smoke: '#2D2D2D',
  bone: '#F5F0E8', muted: '#888880', fire: '#FF4500', ember: '#FF8C00',
};

const s = StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#000000', paddingBottom: 10 },
  name: { fontSize: 24, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1 },
  contactInfo: { fontSize: 9, color: '#666666', marginTop: 4, flexDirection: 'row', gap: 10 },
  sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginTop: 20, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#EEEEEE', paddingBottom: 2 },
  content: { fontSize: 10, lineHeight: 1.5, color: '#333333' },
});

function CVDoc({ name, content, targetRole }: { name: string; content: string; targetRole?: string }) {
  return (
    <Document title={`CV - ${name}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{name}</Text>
          {targetRole && <Text style={{ fontSize: 12, color: '#444444', marginTop: 2 }}>{targetRole}</Text>}
        </View>

        <View>
          <Text style={s.content}>{content}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateCVPDF(name: string, content: string, targetRole?: string): Promise<Buffer> {
  const blob = await pdf(<CVDoc name={name} content={content} targetRole={targetRole} />).toBlob();
  return Buffer.from(await blob.arrayBuffer());
}

