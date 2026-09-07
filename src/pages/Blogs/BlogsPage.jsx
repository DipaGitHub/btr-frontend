import { API_BASE_URL } from '../../utils/apiConfig';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Banner } from '../../components/shared/SiteComponents';
import { go } from '../../utils/navigation';
import { motion } from 'framer-motion';

export function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/blogs`);
                const data = await response.json();
                
                if (data.success) {
                    // Format the data for display
                    const formattedBlogs = data.data.map(blog => ({
                        ...blog,
                        formattedDate: new Date(blog.publish_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }),
                        tags: blog.tags.split(',').map(tag => tag.trim())
                    }));
                    setBlogs(formattedBlogs);
                } else {
                    setError('Failed to load blogs');
                }
            } catch (err) {
                setError('Error fetching blogs');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <>
                <Banner title="Our Blogs" />
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="section-dark blog-page"
                >
                    <div className="loading-spinner">Loading blogs...</div>
                </motion.section>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Banner title="Our Blogs" />
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="section-dark blog-page"
                >
                    <div className="error-message">{error}</div>
                </motion.section>
            </>
        );
    }

    return (
        <>
            <Banner title="Our Blogs" />
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="section-dark blog-page"
            >
                <div className="blog-grid">
                    {blogs.map((blog, index) => {
                        const openBlog = () => go(`/blogs/${blog.id}`);
                        return (
                            <motion.article 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="blog-card" 
                                role="link" 
                                tabIndex="0" 
                                key={blog.id} 
                                onClick={openBlog}
                                onKeyDown={event => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        openBlog();
                                    }
                                }}
                            >
                                <div 
                                    className={`blog-image ${blog.id === 1 ? 'blog-idea-bg' : 'blog-strategy-bg'}`}
                                    style={{
                                        backgroundImage: blog.banner_image ? `url(${API_BASE_URL}${blog.banner_image})` : 'none'
                                    }}
                                >
                                    <strong>{blog.title}</strong>
                                </div>
                                <div className="blog-meta">
                                    <span>{blog.tags[0]}</span>
                                    <small>{blog.formattedDate}</small>
                                </div>
                                <h3>{blog.title}</h3>
                                <p className="blog-excerpt">{blog.short_description}</p>
                                <button 
                                    className="button" 
                                    style={{ margin: 'auto 18px 22px 18px', alignSelf: 'flex-start' }}
                                    onClick={event => {
                                        event.stopPropagation();
                                        openBlog();
                                    }}
                                >
                                    Read article <ArrowUpRight size={15} />
                                </button>
                            </motion.article>
                        );
                    })}
                </div>
            </motion.section>
        </>
    );
}