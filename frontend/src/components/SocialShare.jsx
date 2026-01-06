// ============================================
// 2. SOCIAL SHARE COMPONENT - Create new file
// frontend/src/components/SocialShare.jsx
// ============================================

import { Share2, Facebook, Twitter, Mail, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function SocialShare({ url, title, description }) {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = url || window.location.href;
    const shareTitle = title || 'Check out AI Persona';
    const shareDesc = description || 'Get personalized AI-powered product recommendations';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareDesc,
                    url: shareUrl
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            setShowMenu(!showMenu);
        }
    };

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
        email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareDesc + '\n\n' + shareUrl)}`
    };

    return (
        <div className="relative">
            <button
                onClick={handleNativeShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md"
            >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
            </button>

            {showMenu && !navigator.share && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 z-50 min-w-[240px]">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Share via</p>

                    <div className="space-y-1">
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                        >
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Facebook</span>
                        </a>

                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                        >
                            <Twitter className="w-5 h-5 text-sky-500" />
                            <span className="text-sm font-medium text-gray-700">Twitter</span>
                        </a>

                        <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                        >
                            <MessageCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                        </a>

                        <a
                            href={shareLinks.email}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                        >
                            <Mail className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Email</span>
                        </a>

                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition w-full text-left"
                        >
                            <LinkIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                                {copied ? 'Copied!' : 'Copy Link'}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}