"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import styles from "./donate.module.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { API_CONFIG } from "../config/api";

interface DonationTier {
  price: number;
  moonstones: number;
  label: string;
}

const donationTiers: DonationTier[] = [
  { price: 5, moonstones: 90, label: "5€ - 90 Moonstones" },
  { price: 10, moonstones: 210, label: "10€ - 210 Moonstones" },
  { price: 25, moonstones: 650, label: "25€ - 650 Moonstones" },
  { price: 50, moonstones: 1600, label: "50€ - 1600 Moonstones" },
  { price: 100, moonstones: 3600, label: "100€ - 3600 Moonstones" },
  { price: 250, moonstones: 10220, label: "250€ - 10220 Moonstones" },
];

export default function DonatePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<DonationTier>(donationTiers[0]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tier = donationTiers.find(t => t.price === parseInt(e.target.value));
    if (tier) {
      setSelectedTier(tier);
    }
  };

  const createPaymentRecord = async (paypalOrderId: string, paypalDetails: any) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Access token required - Please log in again');
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_CONFIG.BASE_URL}/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          amount: selectedTier.price,
          orderId: paypalOrderId,
          paypalOrderId: paypalOrderId,
          moonstones: selectedTier.moonstones,
          paypalDetails: paypalDetails,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to create payment record");
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - Server took too long to respond');
      }
      throw error;
    }
  };

  const updateMoonstones = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Access token required');
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_CONFIG.BASE_URL}/update-ms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          moonstones: selectedTier.moonstones,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to update moonstones");
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - Server took too long to respond');
      }
      throw error;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.donateBox}>
        <h1 className={styles.title}>Donate</h1>
        <p className={styles.subtitle}>
          Help us keep the servers running and get Moonstones in return!
        </p>

        <div className={styles.tierSelector}>
          <label htmlFor="donation-tier" className={styles.label}>
            Select Amount:
          </label>
          <select
            id="donation-tier"
            value={selectedTier.price}
            onChange={handleTierChange}
            className={styles.dropdown}
            disabled={processing}
          >
            {donationTiers.map((tier) => (
              <option key={tier.price} value={tier.price}>
                {tier.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectedInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Amount:</span>
            <span className={styles.infoValue}>{selectedTier.price}€</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>You will receive:</span>
            <span className={styles.infoValue}>
              {selectedTier.moonstones} Moonstones
            </span>
          </div>
        </div>

        <div className={styles.paypalContainer}>
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
              currency: "EUR",
              intent: "capture",
              disableFunding: "bancontact,blik,eps,giropay,ideal,mercadopago,mybank,p24,sepa,sofort,venmo",
              enableFunding: "card",
            }}
          >
            <PayPalButtons
                disabled={processing}
                style={{
                  layout: "vertical",
                  color: "gold",
                  shape: "rect",
                  label: "paypal",
                  height: 55,
                }}
              createOrder={async (data, actions) => {
                try {
                  const token = localStorage.getItem('authToken');
                  
                  const verifyResponse = await fetch(`${API_CONFIG.BASE_URL}/verify`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    credentials: 'include' // Use cookies (production)
                  });

                  if (!verifyResponse.ok) {
                    alert('Your session has expired. Please log in again before making a payment.');
                    router.push('/login');
                    throw new Error('Authentication expired');
                  }

                  // Create PayPal order
                  const order = await actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "EUR",
                          value: selectedTier.price.toString(),
                        },
                        description: `${selectedTier.moonstones} Moonstones - Virtual Currency`,
                        custom_id: user.id.toString(),
                      },
                    ],
                    intent: "CAPTURE",
                    application_context: {
                      brand_name: "4Chaos",
                      locale: "fr-FR",
                      shipping_preference: "NO_SHIPPING",
                      user_action: "PAY_NOW",
                    },
                  });
                  
                  return order;
                } catch (error) {
                  throw error;
                }
              }}
              onApprove={async (data, actions) => {
                setProcessing(true);
                let paymentRecorded = false;
                let paypalOrderId = '';
                
                try {
                  if (!actions.order) {
                    throw new Error("Order actions not available");
                  }

                  const details = await actions.order.capture();
                  paypalOrderId = details.id || '';

                  await createPaymentRecord(paypalOrderId, details);
                  paymentRecorded = true;

                  await updateMoonstones();

                  setProcessing(false);
                  setShowSuccessModal(true);
                } catch (error) {
                  setProcessing(false);
                  const errorMessage = error instanceof Error ? error.message : "Unknown error";
                  
                  if (paymentRecorded) {
                    alert(
                      `Payment was successfully received, but there was an error crediting your Moonstones.\n\n` +
                      `Your payment has been recorded (Transaction ID: ${paypalOrderId}).\n\n` +
                      `Please contact support and they will credit your Moonstones manually.`
                    );
                  } else {
                    alert(
                      `Payment error: ${errorMessage}\n\n` +
                      `If you were charged, please contact support with your PayPal transaction details.`
                    );
                  }
                }
              }}
              onCancel={() => {
                setProcessing(false);
              }}
              onError={(err) => {
                setProcessing(false);
                alert("An error occurred with PayPal. Please try again.");
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>

      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSuccessModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Thanks for your support!</h2>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.moonstonesAwarded}>
                {selectedTier.moonstones} Moonstones have been added to your account.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/cash-shop");
                }}
              >
                Go to Cash Shop
              </button>
              <button
                className={styles.closeButtonSecondary}
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
