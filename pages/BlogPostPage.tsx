import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { allPosts } from '../data/blogData';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = allPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl font-playfair mb-4">Post not found</h1>
                <p className="text-gray-400">This article could not be found in the Gyan Dhara.</p>
                <Link to="/blog" className="mt-6 flex items-center gap-2 text-accent-gold hover:underline">
                    <ArrowLeft size={18} /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <Link to="/blog" className="flex items-center gap-2 text-accent-gold hover:underline mb-8">
                        <ArrowLeft size={20} />
                        Back to Gyan Dhara
                    </Link>

                    <article>
                        <header className="mb-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 leading-tight">{post.title}</h1>
                            <div className="flex items-center text-gray-400 text-sm">
                                <Calendar size={14} className="mr-2" />
                                <span>Published on {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <img src={post.imageUrl} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-xl my-8 border-2 border-accent-purple/50" />
                        </header>

                        <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed font-lato"
                          style={{
                            // @ts-ignore
                            '--tw-prose-body': '#D1D5DB',
                            '--tw-prose-headings': '#FFFFFF',
                            '--tw-prose-links': '#F0B43A',
                            '--tw-prose-bold': '#FFFFFF',
                            '--tw-prose-bullets': '#9B59B6',
                            '--tw-prose-quotes': '#9B59B6',
                            '--tw-prose-quote-borders': '#393359'
                          }}
                        >
                            {post.content}
                        </div>

                        <footer className="mt-12 pt-8 border-t border-gray-700/50">
                            <div className="flex flex-wrap items-center gap-2">
                                <Tag size={18} className="text-gray-400" />
                                <span className="text-gray-400 mr-2">Keywords:</span>
                                {post.keywords.map(keyword => (
                                    <span key={keyword} className="bg-secondary-dark text-accent-gold text-xs font-semibold px-3 py-1 rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </footer>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;
