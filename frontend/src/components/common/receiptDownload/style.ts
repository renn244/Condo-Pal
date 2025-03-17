import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    page: { padding: 20, fontFamily: "Helvetica" },
    header: { fontSize: 14, marginBottom: 10, fontWeight: "bold" },
    section: { marginBottom: 10, padding: 10, border: "1px solid hsl(210 40% 96.1%)", borderRadius: 5, backgroundColor: "hsl(210 40% 96.1%)" },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    text: { fontSize: 12 },
    separator: { width: '100%',  height: 1, backgroundColor: "hsl(214.3 31.8% 91.4%)", paddingLeft: 30, paddingRight: 30, marginTop: 8, marginBottom: 8 },
    bold: { fontSize: 12, fontWeight: "bold" },
    amount: { fontSize: 12, fontWeight: "bold", color: "#007bff" }
});