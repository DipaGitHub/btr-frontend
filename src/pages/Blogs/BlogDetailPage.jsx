import { API_BASE_URL } from '../../utils/apiConfig';
import { useEffect, useState } from 'react';
import { CalendarDays, UserRound, ArrowLeft } from 'lucide-react';
import { go } from '../../utils/navigation';

export function BlogDetailPage({ blogId }) {
    const [blog, setBlog] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                // Fetch all blogs to get the specific one
                const response = await fetch(`${API_BASE_URL}/api/blogs`);
                const data = await response.json();
                
                if (data.success) {
                    const formattedBlogs = data.data.map(blog => ({
                        ...blog,
                        formattedDate: new Date(blog.publish_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        }),
                        tags: blog.tags.split(',').map(tag => tag.trim()),
                        // Full image URL
                        imageUrl: `${API_BASE_URL}${blog.banner_image}`
                    }));

                    setAllBlogs(formattedBlogs);
                    
                    // Find the specific blog
                    const foundBlog = formattedBlogs.find(b => b.id === parseInt(blogId));
                    if (foundBlog) {
                        setBlog(foundBlog);
                    } else {
                        setError('Blog not found');
                    }
                } else {
                    setError('Failed to load blog');
                }
            } catch (err) {
                setError('Error fetching blog details');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            fetchBlogDetails();
        }
    }, [blogId]);

    if (loading) {
        return (
            <section className="blog-detail-loading">
                <div className="loading-spinner">Loading blog details...</div>
            </section>
        );
    }

    if (error || !blog) {
        return (
            <section className="blog-detail-error">
                <h2>{error || 'Blog not found'}</h2>
                <button onClick={() => go('/blogs')}>Back to Blogs</button>
            </section>
        );
    }

    return (
        <>
            {/* Breadcrumb */}
            <section className="blog-detail-banner">
                <span>BLOG DETAILS</span>
                <h1>{blog.title}</h1>
                <button onClick={() => go('/')}>Home</button>
                <small>/</small>
                <button onClick={() => go('/blogs')}>Blogs</button>
            </section>

            <section className="blog-detail-layout">
                <article className="blog-article">
                    {/* Blog Artwork/Header with Banner Image */}
                    <div 
                        className="blog-detail-art"
                        style={{
                            backgroundImage: `url(${blog.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: '9px'
                        }}></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div className="idea-trail">✦ · ✦ · ✦</div>
                            <strong>{blog.title.toUpperCase()}</strong>
                            <span>Ideas that move brands forward</span>
                            <i>Explore the story</i>
                        </div>
                    </div>

                    {/* Meta Information */}
                    <div className="article-meta">
                        <span>
                            <UserRound size={13} /> Written by: {blog.author}
                        </span>
                        <span>
                            <CalendarDays size={13} /> {blog.formattedDate}
                        </span>
                    </div>

                    {/* Content */}
                    <h2>{blog.title}</h2>
                    
                    {/* Additional content */}
                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.long_description || blog.content || blog.short_description }}>
                    </div>

                    {/* Tags */}
                    <div className="article-tags">
                        <strong>Tags:</strong> 
                        {blog.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                    </div>
                </article>

                {/* Latest Updates Sidebar */}
                <aside className="latest-updates">
                    <h3>Latest Updates</h3>
                    {allBlogs
                        .filter(b => b.id !== blog.id)
                        .slice(0, 3)
                        .map(relatedBlog => (
                                <button 
                                key={relatedBlog.id} 
                                onClick={() => go(`/blogs/${relatedBlog.id}`)}
                            >
                                <div 
                                    className="blog-detail-art compact"
                                    style={{
                                        backgroundImage: `url(${relatedBlog.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <strong>
                                        {relatedBlog.title.toUpperCase().substring(0, 3)}
                                    </strong>
                                </div>
                                <span>
                                    <small>
                                        <CalendarDays size={12} /> 
                                        {new Date(relatedBlog.publish_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </small>
                                    <strong>{relatedBlog.title}</strong>
                                </span>
                            </button>
                        ))}
                </aside>
            </section>

            {/* Back to Blogs Button */}
            <div className="back-to-blogs" style={{ maxWidth: '1080px', margin: '0 auto 40px', padding: '0 30px' }}>
                <button 
                    onClick={() => go('/blogs')}
                    className="button"
                >
                    <ArrowLeft size={16} /> Back to all blogs
                </button>
            </div>
        </>
    );
}