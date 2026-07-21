'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Project Creator',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        quote: 'This platform helped me raise funds for my community garden project in just two weeks. The support from backers was incredible!',
        rating: 5,
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Supporter',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        quote: 'I love discovering innovative projects and knowing exactly where my contribution goes. The transparency is amazing.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Creator',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        quote: 'From idea to fully funded — the tools and community here made launching my art studio campaign a breeze.',
        rating: 5,
    },
    {
        id: 4,
        name: 'David Kim',
        role: 'Regular Backer',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        quote: 'Being part of someone\'s dream is rewarding. I\'ve backed 12 projects and every single one delivered on their promises.',
        rating: 4,
    },
];

export default function Testimonials() {
    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        What Our Users Say
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Real stories from creators and supporters who make this community thrive.
                    </p>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    loop={true}
                    spaceBetween={30}
                    slidesPerView={1}
                    className="pb-12"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.role}</p>
                                    </div>
                                    <div className="ml-auto flex gap-0.5">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <blockquote className="text-gray-700 text-lg italic leading-relaxed">
                                    &ldquo;{item.quote}&rdquo;
                                </blockquote>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}