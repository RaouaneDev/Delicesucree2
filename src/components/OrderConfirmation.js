import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Button, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Confetti from 'react-confetti';
import { QRCodeCanvas } from 'qrcode.react';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef();
  const qrRef = useRef();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  if (!state || !state.orderDetails) {
    navigate('/');
    return null;
  }

  const { items, customerInfo, deliveryDateTime } = state.orderDetails;
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const orderNumber = `CMD${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };

  const orderData = {
    orderNumber,
    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
    deliveryDateTime: formatDate(deliveryDateTime),
    total: `${totalPrice.toFixed(2)}€`
  };

  const downloadPDF = async () => {
    const content = pdfRef.current;
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    // Ajouter le contenu principal
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    // Ajouter le QR code
    const qrCanvas = qrRef.current;
    if (qrCanvas) {
      const qrData = qrCanvas.toDataURL('image/png');
      pdf.addImage(qrData, 'PNG', 10, pdfHeight - 50, 40, 40);
      pdf.setFontSize(10);
      pdf.text('Scannez ce QR code pour voir les détails de votre commande', 55, pdfHeight - 30);
    }

    pdf.save(`commande-${orderNumber}.pdf`);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      flex: 1
    }}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
        />
      )}
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 8,
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }} ref={pdfRef}>
            {/* En-tête */}
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                  Merci pour votre commande !
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Nous avons bien reçu votre commande et nous la préparons avec soin.
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  N° de commande : {orderNumber}
                </Typography>
              </Box>
            </motion.div>

            <Divider sx={{ my: 3 }} />

            {/* Informations client */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Informations de livraison
                </Typography>
                <Typography>
                  {customerInfo.firstName} {customerInfo.lastName}
                </Typography>
                <Typography>{customerInfo.address}</Typography>
                <Typography>{customerInfo.phone}</Typography>
                <Typography sx={{ mt: 2 }}>
                  Livraison prévue le : {formatDate(deliveryDateTime)}
                </Typography>
              </Box>
            </motion.div>

            <Divider sx={{ my: 3 }} />

            {/* Résumé de la commande */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Détails de la commande
                </Typography>
                {items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>
                      {item.quantity}x {item.name}
                    </Typography>
                    <Typography>{(item.price * item.quantity).toFixed(2)}€</Typography>
                  </Box>
                ))}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 2,
                  pt: 2,
                  borderTop: '2px solid',
                  borderColor: 'primary.main'
                }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">{totalPrice.toFixed(2)}€</Typography>
                </Box>
              </Box>
            </motion.div>
          </Paper>

          {/* QR Code caché */}
          <div style={{ display: 'none' }}>
            <QRCodeCanvas
              id="qr-code"
              value={JSON.stringify(orderData)}
              size={1000}
              level="H"
              includeMargin={true}
              ref={qrRef}
            />
          </div>

          {/* Boutons */}
          <motion.div 
            variants={itemVariants}
            style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}
          >
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Retour à l'accueil
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={downloadPDF}
              startIcon={<DownloadIcon />}
              sx={{ mt: 2 }}
            >
              Télécharger le PDF
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OrderConfirmation;
