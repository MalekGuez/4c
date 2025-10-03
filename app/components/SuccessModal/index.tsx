"use client";

import Image from 'next/image';
import { CashShopItem } from '../../data/cashShopData';
import styles from './successModal.module.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CashShopItem | null;
  quantity: number;
  totalPrice: number;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  item, 
  quantity, 
  totalPrice 
}: SuccessModalProps) {
  if (!isOpen || !item) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Purchase Successful!</h3>
        </div>
        
        <div className={styles.content}>
          <div className={styles.itemInfo}>
            <div className={styles.itemImageContainer}>
              <Image
                src={`/images/icons/items/${item.wItemId}.jpg`}
                alt={item.szName}
                width={48}
                height={48}
                className={styles.itemImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/icons/items/default.jpg';
                }}
              />
            </div>
            
            <div className={styles.itemDetails}>
              <h4 className={styles.itemName}>{item.szName}</h4>
              <p className={styles.purchaseDetails}>
                Quantity: <strong>{quantity}</strong><br/>
                Total Cost: <strong className={styles.totalPrice}>{totalPrice.toLocaleString()}ms</strong>
              </p>
            </div>
          </div>
          
          <div className={styles.successMessage}>
            <p>Your purchase has been completed successfully!</p>
            <p className={styles.instructionText}>
              Please check your <strong>Cash Deposit in game</strong> to collect your items.
            </p>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.okButton}
            onClick={handleClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
