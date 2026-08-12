import TemplatePage from '../../components/TemplatePage'
import { MDXRemote } from 'next-mdx-remote'
import { getAllPostIds, getPostData } from '../../lib/blog'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { absoluteUrl, SITE_URL } from '../../lib/site'

// Custom MDX components for icons
const mdxComponents = {
    CheckIcon: () => <CheckCircle size={16} className="inline-block text-green-600 mr-1" style={{ verticalAlign: 'middle' }} />,
    WarnIcon: () => <AlertTriangle size={16} className="inline-block text-amber-500 mr-1" style={{ verticalAlign: 'middle' }} />,
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.slug)
    return {
        props: {
            postData
        }
    }
}

export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

export default function Post({ postData }) {
    const [avatarError, setAvatarError] = useState(false)
    const authorName = postData?.author?.name || 'Author'
    const rawAvatar = postData?.author?.avatar
    const avatarUrl = typeof rawAvatar === 'string' && rawAvatar.trim().length > 0 ? rawAvatar : null
    const initials = authorName
        .split(' ')
        .filter(Boolean)
        .map(namePart => namePart[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    const description = postData.subtitle || postData.title
    const canonicalUrl = absoluteUrl(`/blog/${postData.slug}`)
    const imageUrl = postData.image
        ? (postData.image.startsWith('http') ? postData.image : `${SITE_URL}${postData.image}`)
        : `${SITE_URL}/images/edr_telemetry_logo.png`

    return (
        <TemplatePage
            title={postData.title}
            description={description}
            ogImage={postData.image}
            ogType="article"
            canonicalPath={`/blog/${postData.slug}`}
        >
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Article',
                            headline: postData.title,
                            description,
                            image: [imageUrl],
                            datePublished: postData.date || undefined,
                            author: {
                                '@type': 'Person',
                                name: authorName,
                            },
                            mainEntityOfPage: {
                                '@type': 'WebPage',
                                '@id': canonicalUrl,
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'EDR Telemetry Project',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: `${SITE_URL}/images/edr_telemetry_logo.png`,
                                },
                            },
                        }),
                    }}
                />
            </Head>

            <div className="bg-white min-h-screen font-charter">
                <article className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-16 mdx-article">
                    {/* Author info - without hardcoded title/subtitle */}
                    <header className="mb-12">
                        <div className="flex items-center pb-6 border-b border-[rgba(242,242,242,1)]">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {avatarUrl && !avatarError ? (
                                        <Image
                                            src={avatarUrl}
                                            alt={authorName}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                            onError={() => setAvatarError(true)}
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-gray-600">
                                            {initials}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <span className="font-medium text-[rgba(41,41,41,1)] text-[14px]">{authorName}</span>
                                    </div>
                                    <div className="flex items-center text-[14px] text-[rgba(107,107,107,1)] space-x-1">
                                        <span>{postData.readingTime} min read</span>
                                        <span>·</span>
                                        <span>{postData.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mdx-article-content">
                        <MDXRemote {...postData.mdxSource} components={mdxComponents} />
                    </div>
                </article>
            </div>
        </TemplatePage>
    )
}
