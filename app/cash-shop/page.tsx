"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CashShopCategory, CashShopItem, cashShopData } from '../data/cashShopData';
import { apiRequest, API_ENDPOINTS, MoonstonesResponse, tokenManager } from '../services/api';
import ItemCard from '../components/ItemCard';
import VirtualScroll from '../components/VirtualScroll';
import styles from './cashShop.module.css';

export default function CashShopPage() {
  const [categories, setCategories] = useState<CashShopCategory[]>([]);
  const [items, setItems] = useState<CashShopItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CashShopItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moonstones, setMoonstones] = useState<number>(0);

  // Load categories and items from local data
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      // Load categories from local data
      if (cashShopData.categories.success && cashShopData.categories.items) {
        // Sort categories by wOrder
        const sortedCategories = cashShopData.categories.items.sort((a, b) => a.wOrder - b.wOrder);
        setCategories(sortedCategories);
      }

      // Load items from local data
      if (cashShopData.items.success && cashShopData.items.items) {
        // Sort items by bCategory ASC, then by wOrder
        const sortedItems = cashShopData.items.items.sort((a, b) => {
          if (a.bCategory !== b.bCategory) {
            return a.bCategory - b.bCategory;
          }
          return a.wOrder - b.wOrder;
        });
        setItems(sortedItems);
        setFilteredItems(sortedItems);
      }

      if (!cashShopData.categories.success || !cashShopData.items.success) {
        setError('Failed to load cash shop data');
      }
    } catch (err) {
      setError('Error loading cash shop data');
      console.error('Error loading cash shop data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch moonstones
  useEffect(() => {
    const fetchMoonstones = async () => {
      try {        
        const response = await apiRequest<MoonstonesResponse>(API_ENDPOINTS.MOONSTONES, {
          method: 'GET',
        });
        if (response.success && response.data) {
          setMoonstones(response.data.moonstones);
        } else {
          console.error('Failed to fetch moonstones:', response.error);
        }
      } catch (err) {
        console.error('Error fetching moonstones:', err);
      }
    };

    fetchMoonstones();
  }, []);

  // Filter items by category and search term
  const filterItems = (categoryId: number | null, search: string) => {
    let filtered = items;
    
    // Filter by category
    if (categoryId !== null) {
      filtered = filtered.filter(item => item.bCategory === categoryId);
    }
    
    // Filter by search term
    if (search.trim() !== '') {
      filtered = filtered.filter(item => 
        item.szName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const filtered = filterItems(categoryId, searchTerm);
    setFilteredItems(filtered);
  };

  const handleSearchInputChange = (input: string) => {
    setSearchInput(input);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    const filtered = filterItems(selectedCategory, searchInput);
    setFilteredItems(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePurchaseSuccess = async () => {
    // Refresh moonstones after successful purchase
    try {
      const response = await apiRequest<MoonstonesResponse>(API_ENDPOINTS.MOONSTONES, {
        method: 'GET',
      });

      if (response.success && response.data) {
        setMoonstones(response.data.moonstones);
      }
    } catch (err) {
      console.error('Error refreshing moonstones:', err);
    }
  };


  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className={styles.spinner}
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #333',
              borderTop: '3px solid #790801',
              borderRadius: '50%',
              marginBottom: '20px'
            }}
          />
          <div className={styles.loadingText}>Loading Cash Shop...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.errorText}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Cash Shop Bar */}
      <div className={styles.cashShopBar}>
        <Image
          src="/images/titles/Cash-Shop.png"
          alt="Cash Shop"
          width={278}
          height={73}
          className={styles.cashShopTitle}
        />
        <div className={styles.bar}>
          <Image
            src="/images/titles/Bar.png"
            alt="Bar"
            width={991}
            height={8}
            className={styles.barImage}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.filtersContainer}>
          <div className={styles.leftFilters}>
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleCategoryChange(null);
                } else {
                  const categoryId = parseInt(value, 10);
                  handleCategoryChange(categoryId);
                }
              }}
              className={styles.categorySelect}
            >
              <option value="">Most Popular</option>
              {categories.map((category) => {
                return (
                  <option key={category.bID} value={String(category.bID)}>
                    {category.szName}
                  </option>
                );
              })}
            </select>
            
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search items..."
                className={styles.searchInput}
              />
              <button 
                className={styles.searchButton}
                onClick={handleSearch}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.moonstonesDisplay}>
            <Image
              src="/images/icons/Moonstones.png"
              alt="Moonstones"
              width={20}
              height={18}
              className={styles.moonstonesIcon}
            />
            <span className={styles.moonstonesText}>{moonstones.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.itemsContainer}>
          {filteredItems.length === 0 ? (
            <div className={styles.noItems}>
              <p>No items found in the selected category.</p>
            </div>
          ) : (
            <div className={styles.virtualScrollWrapper}>
              <VirtualScroll
                items={filteredItems}
                itemHeight={225} // Height of each item card
                containerHeight={typeof window !== 'undefined' ? window.innerHeight : 800} // Use full window height
                overscan={5} // Number of items to render outside visible area
                className={styles.virtualScrollContainer}
                renderItem={(item: CashShopItem) => (
                  <ItemCard
                    key={item.wID}
                    item={item}
                    onPurchaseSuccess={handlePurchaseSuccess}
                    userMoonstones={moonstones}
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
