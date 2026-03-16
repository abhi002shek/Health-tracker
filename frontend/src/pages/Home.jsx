import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';
import PostCard from '../components/PostCard';
import { HiPlus } from 'react-icons/hi';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="home-header">
        <h1>HealthTracker 🩺</h1>
        <p>Your personal health journal. Log workouts, meals, symptoms, and wellness notes.</p>
        <div className="vibe-tags">
          <span className="vibe-tag">💪 fitness logs</span>
          <span className="vibe-tag">🥗 nutrition</span>
          <span className="vibe-tag">😴 wellness</span>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🩺</div>
          <h3>No entries yet</h3>
          <p>Start tracking your health journey today</p>
          <Link to="/create" className="btn btn-primary">
            <HiPlus size={18} />
            Add first entry
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
