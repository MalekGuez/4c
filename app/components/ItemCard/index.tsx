"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { CashShopItem } from '../../data/cashShopData';
import PurchaseModal from '../PurchaseModal';
import SuccessModal from '../SuccessModal';
import LazyImage from '../LazyImage';
import styles from './itemCard.module.css';

interface ItemCardProps {
  item: CashShopItem;
  onQuantityChange?: (itemId: number, quantity: number, totalPrice: number) => void;
  onPurchaseSuccess?: () => void;
  userMoonstones?: number;
}

export default function ItemCard({ item, onQuantityChange, onPurchaseSuccess, userMoonstones }: ItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{item: CashShopItem, quantity: number, totalPrice: number} | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
      const totalPrice = item.dwMoney * newQuantity;
      onQuantityChange?.(item.wID, newQuantity, totalPrice);
    }
  };

  const totalPrice = item.dwMoney * quantity;

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    console.log(`Purchasing ${item.szName} x ${quantity} for ${totalPrice}ms`);
  };

  const handlePurchaseSuccess = (purchasedItem: CashShopItem, purchasedQuantity: number, purchasedTotalPrice: number) => {
    setSuccessData({ item: purchasedItem, quantity: purchasedQuantity, totalPrice: purchasedTotalPrice });
    setShowSuccessModal(true);
    onPurchaseSuccess?.();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  return (
    <div className={styles.itemCard}>
      <div className={styles.contentContainer}>
        <div className={styles.itemIcon}>
          <LazyImage
            src={`/images/icons/items/${item.wItemId}.jpg`}
            alt={item.szName}
            width={64}
            height={64}
            className={styles.iconImage}
          />
        </div>
        
        <div className={styles.itemName}>
          {item.szName}
        </div>
      </div>
      
      <div className={styles.controlsContainer}>
        <div className={styles.quantityControls}>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value) || 1;
              if (newQuantity >= 1 && newQuantity <= 100) {
                handleQuantityChange(newQuantity);
              }
            }}
            className={styles.quantityInput}
            min="1"
            max="100"
          />
          <button 
            className={`${styles.quantityBtn} ${styles.up}`}
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 100}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className={`${styles.quantityBtn} ${styles.down}`}
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <button 
          className={styles.priceButton}
          onClick={handlePurchase}
        >
          <span className={styles.priceText}>{totalPrice.toLocaleString()} MS</span>
        </button>
      </div>

          {mounted && createPortal(
            <>
              <PurchaseModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                onConfirm={handleConfirmPurchase}
                item={item}
                quantity={quantity}
                totalPrice={totalPrice}
                onPurchaseSuccess={handlePurchaseSuccess}
                userMoonstones={userMoonstones}
              />
              <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccessModal}
                item={successData?.item || null}
                quantity={successData?.quantity || 0}
                totalPrice={successData?.totalPrice || 0}
              />
            </>,
            document.body
          )}
    </div>
  );
}
