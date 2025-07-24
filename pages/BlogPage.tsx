import React from 'react';
import { Link } from 'react-router-dom';
import { allPosts } from '../data/blogData';
import type { BlogPost } from '../types';
import { ArrowRight, Calendar } from 'lucide-react';

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <div className="bg-secondary-dark/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-accent-purple hover:shadow-lg hover:shadow-accent-purple/20 transform hover:-translate-y-1">
        <Link to={`/blog/${post.slug}`} className="block">
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
        </Link>
        <div className="p-6">
            <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Calendar size={14} />
                {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-xl font-bold text-white font-playfair mb-3 h-16">
                 <Link to={`/blog/${post.slug}`} className="hover:text-accent-gold transition-colors">{post.title}</Link>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4 h-24 overflow-hidden">{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} className="font-bold text-accent-gold hover:underline flex items-center gap-2">
                Read More <ArrowRight size={18} />
            </Link>
        </div>
    </div>
);


const BlogPage: React.FC = () => {
    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">Gyan Dhara</h1>
                    <p className="text-lg text-gray-400">
                        The Mystic Blog. A river of knowledge on Tarot, spirituality, and self-discovery.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allPosts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()).map(post => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
