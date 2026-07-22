'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    { id: 1, name: 'Sarah Johnson', role: 'Project Creator', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', quote: 'This platform helped me raise funds for my community garden project in just two weeks. The support was incredible!', rating: 5 },
    { id: 2, name: 'Michael Chen', role: 'Supporter', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', quote: 'I love discovering innovative projects. The transparency is amazing.', rating: 5 },
    { id: 3, name: 'Emily Rodriguez', role: 'Creator', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', quote: 'The tools and community here made launching my art studio campaign a breeze.', rating: 5 },
    { id: 4, name: 'David Kim', role: 'Regular Backer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', quote: 'I have backed 12 projects and every single one delivered on their promises.', rating: 4 },
];

const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: 0.1 * i, duration: 0.3, ease: "backOut" }
    }),
};

export default function Testimonials() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">What Our Users Say</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Real stories from creators and supporters.</p>
                </motion.div>

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
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-lg shadow-gray-100/50 relative"
                            >
                                {/* Quote icon background */}
                                <Quote className="absolute top-6 right-6 w-12 h-12 text-amber-100" />

                                <div className="flex items-center gap-4 mb-6 relative">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber-200 ring-offset-2">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.role}</p>
                                    </div>
                                    <div className="ml-auto flex gap-0.5">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                variants={starVariants}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true }}
                                                custom={i}
                                            >
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <blockquote className="text-gray-600 text-lg italic leading-relaxed relative">
                                    &ldquo;{item.quote}&rdquo;
                                </blockquote>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}