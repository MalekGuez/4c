'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService } from '@/app/services/api';
import styles from './news.module.css';

export default function AdminNewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: ''
  });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    loadNews();
  }, [router]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await adminService.getNews();
      
      if (response.success && response.news) {
        setNews(response.news);
      } else {
        setError(response.error || 'Failed to load news');
      }
    } catch (err) {
      setError('An error occurred while loading news');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = () => {
    setEditingNews(null);
    setFormData({ title: '', content: '', image: '' });
    setShowCreateForm(true);
  };

  const handleEditNews = (newsItem: any) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title || '',
      content: newsItem.content || '',
      image: newsItem.image || ''
    });
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      // TODO: Implement create/update news API
      console.log('Submitting news:', formData);
      alert(editingNews ? 'News updated successfully!' : 'News created successfully!');
      
      setShowCreateForm(false);
      setFormData({ title: '', content: '', image: '' });
      setEditingNews(null);
      await loadNews();
    } catch (err) {
      setError('Failed to save news');
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    try {
      // TODO: Implement delete news API
      console.log('Deleting news:', newsId);
      alert('News deleted successfully!');
      await loadNews();
    } catch (err) {
      setError('Failed to delete news');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading news...</p>
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
          alt="News Management"
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
            onClick={handleCreateNews}
            className={styles.createButton}
          >
            Create New News
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className={styles.createForm}>
            <h3>{editingNews ? 'Edit News' : 'Create New News'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Image URL (optional)</label>
                <input
                  type="url"
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={10}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingNews ? 'Update News' : 'Create News'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ title: '', content: '', image: '' });
                    setEditingNews(null);
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News List */}
        <div className={styles.newsList}>
          <h3>All News ({news.length})</h3>
          
          {news.length === 0 ? (
            <div className={styles.noNews}>
              No news found. Create your first news item!
            </div>
          ) : (
            <div className={styles.newsGrid}>
              {news.map((newsItem) => (
                <div key={newsItem.id} className={styles.newsCard}>
                  <div className={styles.newsHeader}>
                    <h4 className={styles.newsTitle}>{newsItem.title}</h4>
                    <div className={styles.newsActions}>
                      <button 
                        onClick={() => handleEditNews(newsItem)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteNews(newsItem.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {newsItem.image && (
                    <div className={styles.newsImage}>
                      <img 
                        src={newsItem.image} 
                        alt={newsItem.title}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className={styles.newsContent}>
                    {newsItem.content?.substring(0, 200)}
                    {newsItem.content?.length > 200 && '...'}
                  </div>
                  
                  <div className={styles.newsFooter}>
                    <span className={styles.newsDate}>
                      {formatDate(newsItem.createdAt)}
                    </span>
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
