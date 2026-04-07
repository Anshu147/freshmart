import jsPDF from 'jspdf';

const statusColors = {
  paid: { bg: [34, 197, 94], text: 'PAID' },
  pending: { bg: [234, 179, 8], text: 'PENDING' },
  failed: { bg: [239, 68, 68], text: 'FAILED' },
};

export function generateInvoice(order) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 20;

  // Header bar
  doc.setFillColor(12, 131, 31);
  doc.rect(0, 0, pageW, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FreshCart', margin, 26);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('TAX INVOICE', pageW - margin, 26, { align: 'right' });
  doc.setFontSize(8);
  doc.text('Online Grocery Delivery', pageW - margin, 34, { align: 'right' });

  y = 52;

  // Order info section
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.text('Order ID:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.text(order.orderId, margin + 25, y);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Date:', pageW - 70, y);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.text(new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), pageW - margin, y, { align: 'right' });

  y += 12;

  // Payment status badge
  const ps = statusColors[order.paymentStatus] || statusColors.pending;
  doc.setFillColor(...ps.bg);
  doc.roundedRect(margin, y - 4, 35, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(ps.text, margin + 17.5, y + 2.5, { align: 'center' });

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Order Status:', pageW - 70, y);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text((order.orderStatus || 'pending').toUpperCase(), pageW - margin, y, { align: 'right' });

  y += 16;

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // Bill To
  doc.setTextColor(12, 131, 31);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', margin, y);
  y += 7;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(order.shippingAddress?.name || 'Customer', margin, y);
  y += 6;

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  if (order.shippingAddress?.phone) {
    doc.text(`Phone: ${order.shippingAddress.phone}`, margin, y);
    y += 5;
  }
  if (order.shippingAddress?.address) {
    const addrLines = doc.splitTextToSize(order.shippingAddress.address + ', ' + order.shippingAddress.city + ' - ' + order.shippingAddress.pincode, contentW);
    doc.text(addrLines, margin, y);
    y += addrLines.length * 5;
  }

  y += 8;

  // Table header
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, contentW, 10, 'F');
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', margin + 4, y + 7);
  doc.text('VARIANT', margin + 80, y + 7);
  doc.text('QTY', margin + 115, y + 7, { align: 'center' });
  doc.text('PRICE', margin + 140, y + 7, { align: 'right' });
  doc.text('TOTAL', pageW - margin - 4, y + 7, { align: 'right' });
  y += 14;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);

  (order.items || []).forEach((item, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    if (i % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y - 3, contentW, 12, 'F');
    }

    const name = doc.splitTextToSize(item.name || '', 65);
    doc.text(name[0], margin + 4, y + 4);
    doc.text(item.variant || '', margin + 80, y + 4);
    doc.text(String(item.qty || 0), margin + 115, y + 4, { align: 'center' });
    doc.text(`Rs.${item.price || 0}`, margin + 140, y + 4, { align: 'right' });
    doc.text(`Rs.${(item.price || 0) * (item.qty || 0)}`, pageW - margin - 4, y + 4, { align: 'right' });

    y += 12;
  });

  y += 4;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // Totals
  const totals = [
    { label: 'Subtotal', value: `Rs.${order.subtotal || 0}` },
    { label: 'Shipping', value: order.shipping === 0 ? 'FREE' : `Rs.${order.shipping || 0}` },
  ];

  totals.forEach(t => {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(t.label, pageW - 65, y);
    doc.setTextColor(30, 30, 30);
    doc.text(t.value, pageW - margin - 4, y, { align: 'right' });
    y += 7;
  });

  y += 2;
  doc.setDrawColor(220, 220, 220);
  doc.line(pageW - 70, y, pageW - margin, y);
  y += 8;

  doc.setTextColor(12, 131, 31);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total', pageW - 65, y);
  doc.text(`Rs.${order.totalAmount || 0}`, pageW - margin - 4, y, { align: 'right' });
  y += 14;

  // Footer
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  doc.setTextColor(160, 160, 160);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated invoice and does not require a signature.', margin, y);
  doc.text('FreshCart - Online Grocery Delivery | Thank you for shopping!', pageW - margin, y, { align: 'right' });

  // Save
  doc.save(`FreshCart_Invoice_${order.orderId}.pdf`);
}
