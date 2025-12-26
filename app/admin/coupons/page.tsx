'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService } from '@/app/services/api';
import styles from './coupons.module.css';

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    items: [{ wID: '', itemCount: '1' }],
    maxUses: '',
    isActive: true,
    expiryDate: ''
  });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    loadCoupons();
  }, [router]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCoupons();
      
      if (response.success && response.coupons) {
        setCoupons(response.coupons);
      } else {
        setError(response.error || 'Failed to load coupons');
      }
    } catch (err) {
      setError('An error occurred while loading coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = () => {
    setSelectedCoupon(null);
    setFormData({
      code: '',
      description: '',
      items: [{ wID: '', itemCount: '1' }],
      maxUses: '',
      isActive: true,
      expiryDate: ''
    });
    setShowCreateForm(true);
  };

  const addItemField = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: '', itemCount: '1' }]
    });
  };

  const removeItemField = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      });
    }
  };

  const updateItemField = (index: number, field: 'wID' | 'itemCount', value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!formData.code.trim()) {
      setError('Coupon code is required');
      return;
    }

    if (!formData.items || formData.items.length === 0) {
      setError('At least one item is required');
      return;
    }

    // Validate all items have wID (cash shop ID)
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      const wIDStr = item.wID?.toString().trim() || '';
      
      if (!wIDStr) {
        setError(`Item ${i + 1}: Cash Shop ID (wID) is required`);
        return;
      }
      
      const wIDNum = parseInt(wIDStr);
      if (isNaN(wIDNum) || wIDNum <= 0) {
        setError(`Item ${i + 1}: Cash Shop ID (wID) must be a valid positive number`);
        return;
      }
      
      const itemCountStr = (item.itemCount || '1').toString().trim();
      const itemCountNum = parseInt(itemCountStr);
      if (isNaN(itemCountNum) || itemCountNum <= 0) {
        setError(`Item ${i + 1}: Item count must be a valid positive number`);
        return;
      }
    }

    try {
      // Prepare items array with proper validation
      const itemsArray = formData.items
        .filter(item => item.wID && item.wID.toString().trim())
        .map(item => ({
          wID: parseInt(item.wID.toString().trim()),
          itemCount: parseInt((item.itemCount || '1').toString().trim()) || 1
        }));

      if (itemsArray.length === 0) {
        setError('At least one valid item is required');
        return;
      }

      const couponData = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || undefined,
        items: itemsArray,
        maxUses: formData.maxUses && formData.maxUses.toString().trim() 
          ? parseInt(formData.maxUses.toString().trim()) 
          : undefined,
        isActive: formData.isActive,
        expiryDate: formData.expiryDate && formData.expiryDate.trim() 
          ? formData.expiryDate.trim() 
          : undefined
      };

      console.log('Creating coupon with data:', couponData); // Debug log

      const response = await adminService.createCoupon(couponData);
      
      if (response.success) {
        alert('Coupon created successfully!');
        setShowCreateForm(false);
        setFormData({
          code: '',
          description: '',
          items: [{ wID: '', itemCount: '1' }],
          maxUses: '',
          isActive: true,
          expiryDate: ''
        });
        await loadCoupons();
      } else {
        console.error('Create coupon failed:', response);
        setError(response.error || 'Failed to create coupon');
      }
    } catch (err: any) {
      console.error('Create coupon error:', err);
      setError(err.message || err.error || 'Failed to create coupon. Please check the console for details.');
    }
  };

  const handleViewHistory = async (couponId: number) => {
    try {
      const response = await adminService.getCouponHistory(couponId);
      if (response.success && response.history) {
        setHistory(response.history);
        setSelectedCoupon(coupons.find(c => c.id === couponId));
        setShowHistory(true);
      } else {
        setError(response.error || 'Failed to load coupon history');
      }
    } catch (err) {
      setError('Failed to load coupon history');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiry';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/News.png"
          alt="Coupon Management"
          width={238}
          height={61}
          className={styles.titleImage}
        />
        <div className={styles.bar}>
          <Image
            src="/images/titles/Bar.png"
            alt="Bar"
            width={500}
            height={50}
            className={styles.barImage}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button 
            onClick={handleCreateCoupon}
            className={styles.createButton}
          >
            Create New Coupon
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className={styles.createForm}>
            <h3>Create New Coupon</h3>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="code">Coupon Code *</label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="WELCOME2024"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description (optional)</label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Welcome bonus item"
                />
              </div>

              <div className={styles.itemsSection}>
                <div className={styles.itemsHeader}>
                  <label>Items *</label>
                  <button
                    type="button"
                    onClick={addItemField}
                    className={styles.addItemButton}
                  >
                    + Add Item
                  </button>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`wID-${index}`}>Cash Shop ID (wID) *</label>
                      <input
                        type="number"
                        id={`wID-${index}`}
                        value={item.wID}
                        onChange={(e) => updateItemField(index, 'wID', e.target.value)}
                        placeholder="Enter cash shop ID"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor={`itemCount-${index}`}>Count</label>
                      <input
                        type="number"
                        id={`itemCount-${index}`}
                        value={item.itemCount}
                        onChange={(e) => updateItemField(index, 'itemCount', e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemField(index)}
                        className={styles.removeItemButton}
                        title="Remove item"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="maxUses">Max Uses (leave empty for unlimited)</label>
                  <input
                    type="number"
                    id="maxUses"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="100"
                    min="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="expiryDate">Expiry Date (optional)</label>
                  <input
                    type="datetime-local"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  Create Coupon
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({
                      code: '',
                      description: '',
                      items: [{ itemId: '', itemCount: '1' }],
                      maxUses: '',
                      isActive: true,
                      expiryDate: ''
                    });
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* History Modal */}
        {showHistory && selectedCoupon && (
          <div className={styles.modalOverlay} onClick={() => setShowHistory(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Coupon History: {selectedCoupon.szCode}</h3>
                <button className={styles.closeButton} onClick={() => setShowHistory(false)}>×</button>
              </div>
              <div className={styles.modalBody}>
                {history.length === 0 ? (
                  <p className={styles.noHistory}>No redemptions yet</p>
                ) : (
                  <table className={styles.historyTable}>
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Redeemed Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((redemption) => (
                        <tr key={redemption.id}>
                          <td>{redemption.dwUserId}</td>
                          <td>{redemption.szUserID || 'N/A'}</td>
                          <td>{redemption.szEmail || 'N/A'}</td>
                          <td>{formatDate(redemption.dRedeemedDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Coupons List */}
        <div className={styles.couponsList}>
          <h3>All Coupons ({coupons.length})</h3>
          
          {coupons.length === 0 ? (
            <div className={styles.noCoupons}>
              No coupons found. Create your first coupon!
            </div>
          ) : (
            <div className={styles.couponsGrid}>
              {coupons.map((coupon) => (
                <div key={coupon.id} className={styles.couponCard}>
                  <div className={styles.couponHeader}>
                    <div>
                      <h4 className={styles.couponCode}>{coupon.szCode}</h4>
                      {coupon.szDescription && (
                        <p className={styles.couponDescription}>{coupon.szDescription}</p>
                      )}
                    </div>
                    <div className={styles.couponStatus}>
                      {coupon.bIsActive ? (
                        <span className={styles.statusActive}>Active</span>
                      ) : (
                        <span className={styles.statusInactive}>Inactive</span>
                      )}
                      {isExpired(coupon.dExpiryDate) && (
                        <span className={styles.statusExpired}>Expired</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.couponDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Items:</span>
                      <span className={styles.detailValue}>
                        {coupon.items && coupon.items.length > 0 ? (
                          <div className={styles.itemsList}>
                            {coupon.items.map((item: any, idx: number) => (
                              <div key={idx} className={styles.itemBadge}>
                                wID: {item.wID} × {item.bItemCount}
                              </div>
                            ))}
                          </div>
                        ) : (
                          'No items'
                        )}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Max Uses:</span>
                      <span className={styles.detailValue}>
                        {coupon.bMaxUses === null ? 'Unlimited' : coupon.bMaxUses}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Redemptions:</span>
                      <span className={styles.detailValue}>
                        {coupon.dwRedemptionCount || 0}
                        {coupon.bMaxUses !== null && ` / ${coupon.bMaxUses}`}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Expiry:</span>
                      <span className={styles.detailValue}>{formatDate(coupon.dExpiryDate)}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Created:</span>
                      <span className={styles.detailValue}>{formatDate(coupon.dCreatedDate)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.couponActions}>
                    <button 
                      onClick={() => handleViewHistory(coupon.id)}
                      className={styles.historyButton}
                    >
                      View History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

