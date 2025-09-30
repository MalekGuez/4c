"use client";

import { useState } from 'react';
import { CashShopItem } from '../../data/cashShopData';
import { apiRequest, API_ENDPOINTS, BuyItemRequest, BuyItemResponse } from '../../services/api';
import styles from './purchaseModal.module.css';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: CashShopItem | null;
  quantity: number;
  totalPrice: number;
  onPurchaseSuccess?: () => void;
  userMoonstones?: number;
}

export default function PurchaseModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  item, 
  quantity, 
  totalPrice,
  onPurchaseSuccess,
  userMoonstones = 0
}: PurchaseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error when modal closes
  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !item) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const maxQuantity = 250;
      
      const maxStacks = Math.floor(maxQuantity / item.bCount);
      const actualQuantity = Math.min(quantity, maxStacks);
      const actualTotalQuantity = item.bCount * actualQuantity;
      const actualTotalPrice = item.dwMoney * actualQuantity;

      // Check if user has enough moonstones
      if (actualTotalPrice > userMoonstones) {
        setError(`Insufficient moonstones! You have ${userMoonstones.toLocaleString()}ms but need ${actualTotalPrice.toLocaleString()}ms.`);
        setIsLoading(false);
        return;
      }

      if (actualQuantity < quantity) {
        setError(`Maximum quantity per purchase is 250 items. Adjusted to ${actualQuantity} stacks (${actualTotalQuantity} items) for ${actualTotalPrice.toLocaleString()}ms.`);
      }

      const buyRequest: BuyItemRequest = {
        itemId: item.wID,
        quantity: actualTotalQuantity,
        totalPrice: actualTotalPrice
      };

      const response = await apiRequest<BuyItemResponse>(API_ENDPOINTS.BUY_ITEM, {
        method: 'POST',
        body: JSON.stringify(buyRequest)
      });

      if (response.success) {
        onConfirm();
        onPurchaseSuccess?.();
        onClose();
      } else {
        setError(response.error || 'Purchase failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Purchase error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Confirm Purchase</h3>
        </div>
        
        <div className={styles.content}>
          {(() => {
            const totalQuantity = item.bCount * quantity;
            const maxQuantity = 250;
            const maxStacks = Math.floor(maxQuantity / item.bCount);
            const actualQuantity = Math.min(quantity, maxStacks);
            const actualTotalQuantity = item.bCount * actualQuantity;
            const actualTotalPrice = item.dwMoney * actualQuantity;
            
            return (
              <p>
                By making this purchase, you confirm the acquisition of <strong>{item.szName}</strong> x {actualQuantity} for a total of <strong className={styles.totalPrice}>{actualTotalPrice.toLocaleString()}ms</strong>.
                {actualQuantity < quantity && (
                  <span className={styles.warningText}>
                    <br />(Adjusted from {quantity} stacks due to 250 item limit)
                  </span>
                )}
              </p>
            );
          })()}
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>
        
        <div className={styles.actions}>
           <button 
             className={styles.cancelButton}
             onClick={handleClose}
             disabled={isLoading}
           >
             Cancel
           </button>
          <button 
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}
