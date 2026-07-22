'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const slides = [
    {
        title: 'Fuel Your Dream Project',
        subtitle: 'Join thousands of creators who turned their ideas into reality.',
        gradient: 'from-amber-900 via-amber-700 to-orange-700',
    },
    {
        title: 'Support What Inspires You',
        subtitle: 'Discover innovative campaigns and back projects that matter.',
        gradient: 'from-emerald-900 via-emerald-700 to-teal-700',
    },
    {
        title: 'Build Something Together',
        subtitle: 'Every contribution helps bring creative visions to life.',
        gradient: 'from-gray-800 via-amber-800 to-orange-800',
    },
];

export default function HeroSection() {
    return (
        <section className="relative h-[480px] md:h-[560px]">
            <Swiper
                modules={[EffectFade, Autoplay, Pagination]}
                effect="fade"
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className={`h-full w-full bg-gradient-to-r ${slide.gradient} flex items-center justify-center px-4 relative overflow-hidden`}>
                            {/* Decorative blobs */}
                            <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

                            <div className="text-center text-white max-w-3xl relative z-10">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.2 }}
                                    className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
                                >
                                    {slide.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.4 }}
                                    className="text-lg md:text-xl text-white/80 mb-8"
                                >
                                    {slide.subtitle}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.6 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <Link
                                        href="/explore"
                                        className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
                                    >
                                        Explore Campaigns <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
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