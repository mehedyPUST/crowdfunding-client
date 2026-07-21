'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const slides = [
    {
        title: 'Fuel Your Dream Project',
        subtitle: 'Join thousands of creators who turned their ideas into reality.',
        bg: 'from-brand-800 via-brand-600 to-brand-700',
    },
    {
        title: 'Support What Inspires You',
        subtitle: 'Discover innovative campaigns and back projects that matter.',
        bg: 'from-accent-800 via-accent-600 to-brand-700',
    },
    {
        title: 'Build Something Together',
        subtitle: 'Every contribution helps bring creative visions to life.',
        bg: 'from-slate-800 via-brand-700 to-accent-700',
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
                        <div className={`h-full w-full bg-gradient-to-r ${slide.bg} flex items-center justify-center px-4`}>
                            <div className="text-center text-white max-w-3xl">
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{slide.title}</h1>
                                <p className="text-lg md:text-xl text-white/80 mb-8">{slide.subtitle}</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/explore"
                                        className="inline-flex items-center gap-2 bg-white text-brand-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
                                    >
                                        Explore Campaigns <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition"
                                    >
                                        Start a Campaign
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}