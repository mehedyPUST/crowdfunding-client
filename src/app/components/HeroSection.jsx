'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const slides = [
    {
        title: 'Fuel Your Dream Project',
        subtitle: 'Join thousands of creators who turned their ideas into reality with community support.',
        gradient: 'from-amber-600 via-orange-600 to-rose-700',
        accent: 'bg-amber-400',
    },
    {
        title: 'Support What Inspires You',
        subtitle: 'Discover innovative campaigns and back projects that shape the future.',
        gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
        accent: 'bg-emerald-400',
    },
    {
        title: 'Build Something Together',
        subtitle: 'Every contribution brings creative visions to life. Start your journey today.',
        gradient: 'from-violet-600 via-purple-600 to-fuchsia-700',
        accent: 'bg-violet-400',
    },
];

export default function HeroSection() {
    return (
        <section className="relative h-[520px] md:h-[600px]">
            <Swiper
                modules={[EffectFade, Autoplay, Pagination]}
                effect="fade"
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-white/40 !w-3 !h-3 !opacity-100',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-8 !rounded-full',
                }}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className={`h-full w-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center px-4 relative overflow-hidden`}>
                            {/* Animated background elements */}
                            <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-3xl" />

                            {/* Grid pattern overlay */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{
                                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                            }} />

                            <div className="text-center text-white max-w-4xl relative z-10 px-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <div className={`inline-flex items-center gap-2 ${slide.accent} bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6`}>
                                        <Sparkles className="w-3.5 h-3.5" />
                                        CrowdFunding Platform
                                    </div>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
                                >
                                    {slide.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
                                >
                                    {slide.subtitle}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <Link
                                        href="/explore"
                                        className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl active:scale-95 group"
                                    >
                                        Explore Campaigns
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 hover:border-white/50 transition-all active:scale-95"
                                    >
                                        Start a Campaign
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}