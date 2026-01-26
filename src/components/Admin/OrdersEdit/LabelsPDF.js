"use client";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { width: 595, height: 842, paddingTop: 15, paddingLeft: 11, paddingRight: 11, flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },
    labelsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", gap: 7 },
    label: { width: 180, height: 128, padding: 8, marginRight: 5, marginBottom: 3, flexDirection: "column", justifyContent: "flex-start", alignItems: "center" },
    productName: { fontWeight: "bold", fontSize: 11, textAlign: "center" },
    variation: { fontSize: 9, color: "#555", textAlign: "center", lineHeight: 1.2, maxWidth: 170 },
    price: { fontSize: 9, marginTop: 2 },
    barcode: { marginTop: 2, width: 130, height: 40 },
    fnsku: { marginTop: 2, fontSize: 10, textAlign: "center", lineHeight: 1.0 },
});

export default function LabelsPDF({ items, barcodes }) {
    const flatLabels = [];
    items.forEach((item) => {
        item.colors?.forEach((c) => {
            for (let i = 0; i < (c.units || c.quantity || 1); i++) {
                flatLabels.push({ ...item, colorObj: c });
            }
        });
    });

    const pages = [];
    const maxLabelsPerPage = 18;
    for (let i = 0; i < flatLabels.length; i += maxLabelsPerPage) {
        pages.push(flatLabels.slice(i, i + maxLabelsPerPage));
    }

    return (
        <Document>
            {pages.map((pageEntries, idx) => (
                <Page size="A4" style={styles.page} key={idx}>
                    <View style={styles.labelsContainer}>
                        {pageEntries.map((entry, i) => (
                            <View key={`${entry.colorObj.FNSKU}-${i}`} style={styles.label}>
                                <Text style={styles.productName}>{entry.productName}</Text>
                                {entry.colorObj.color && <Text style={styles.variation}>{entry.colorObj.color}</Text>}
                                <Text style={styles.price}>MRP: ₹{entry.colorObj.pricePerItem}</Text>
                                {barcodes[entry.colorObj.FNSKU] && <Image src={barcodes[entry.colorObj.FNSKU]} style={styles.barcode} />}
                                <Text style={styles.fnsku}>{entry.colorObj.FNSKU}</Text>
                            </View>
                        ))}
                    </View>
                </Page>
            ))}
        </Document>
    );
}
