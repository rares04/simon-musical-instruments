import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Order } from '@/payload-types'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#3d3528',
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 9,
    color: '#8b8578',
    marginBottom: 15,
  },
  companyAddress: {
    fontSize: 9,
    color: '#5a5347',
    lineHeight: 1.5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0d9ce',
    marginVertical: 20,
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#3d3528',
    marginBottom: 10,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoBlock: {
    width: '48%',
  },
  label: {
    fontSize: 9,
    color: '#8b8578',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 11,
    color: '#3d3528',
    lineHeight: 1.5,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0ebe3',
    padding: 10,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#3d3528',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0d9ce',
    padding: 10,
    fontSize: 10,
  },
  colItem: {
    width: '60%',
  },
  colQty: {
    width: '10%',
    textAlign: 'center',
  },
  colPrice: {
    width: '15%',
    textAlign: 'right',
  },
  colTotal: {
    width: '15%',
    textAlign: 'right',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    width: '60%',
    textAlign: 'right',
    fontSize: 10,
    color: '#5a5347',
    marginRight: 20,
  },
  summaryValue: {
    width: '15%',
    textAlign: 'right',
    fontSize: 10,
    color: '#3d3528',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#3d3528',
  },
  totalLabel: {
    width: '60%',
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#3d3528',
    marginRight: 20,
  },
  totalValue: {
    width: '15%',
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#6b5c4c',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#8b8578',
    borderTopWidth: 1,
    borderTopColor: '#e0d9ce',
    paddingTop: 15,
  },
})

interface InvoicePDFProps {
  order: Order
}

export function InvoicePDF({ order }: InvoicePDFProps) {
  const invoiceDate = order.paidAt
    ? new Date(order.paidAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>Simon Musical Instruments</Text>
          <Text style={styles.companyTagline}>HANDCRAFTED IN REGHIN, TRANSYLVANIA</Text>
          <Text style={styles.companyAddress}>
            Strada 1 Decembrie 1918, nr. 8{'\n'}
            Reghin, 545300, Romania{'\n'}
            paul.simon@simoninstruments.com{'\n'}
            +40 744 960 722
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>INVOICE</Text>

        {/* Invoice Info */}
        <View style={styles.invoiceInfo}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Invoice Number</Text>
            <Text style={styles.value}>{order.orderNumber}</Text>

            <Text style={[styles.label, { marginTop: 15 }]}>Invoice Date</Text>
            <Text style={styles.value}>{invoiceDate}</Text>

            <Text style={[styles.label, { marginTop: 15 }]}>Payment Status</Text>
            <Text style={styles.value}>{order.status.toUpperCase()}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.value}>
              {order.contactInfo?.firstName} {order.contactInfo?.lastName}
              {'\n'}
              {order.shippingAddress?.street}
              {order.shippingAddress?.apartment && `\n${order.shippingAddress.apartment}`}
              {'\n'}
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
              {order.shippingAddress?.zip}
              {'\n'}
              {order.shippingAddress?.country}
              {'\n\n'}
              {order.contactInfo?.email}
              {'\n'}
              {order.contactInfo?.phone}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colItem}>Item</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Price</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {order.items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colItem}>{item.title}</Text>
              <Text style={styles.colQty}>1</Text>
              <Text style={styles.colPrice}>€{item.price.toLocaleString()}</Text>
              <Text style={styles.colTotal}>€{item.price.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>€{order.subtotal.toLocaleString()}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping:</Text>
          <Text style={styles.summaryValue}>€{order.shipping.toLocaleString()}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Insurance (2%):</Text>
          <Text style={styles.summaryValue}>€{order.insurance.toLocaleString()}</Text>
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalValue}>€{order.total.toLocaleString()}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your purchase</Text>
          <Text style={{ marginTop: 5 }}>
            Each instrument is handcrafted with naturally-cured wood and traditional varnish
          </Text>
          <Text style={{ marginTop: 5 }}>Payment ID: {order.paymentIntentId}</Text>
        </View>
      </Page>
    </Document>
  )
}

const summaryRow = styles.summaryRow
