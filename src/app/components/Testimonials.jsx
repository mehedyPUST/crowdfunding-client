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
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 rounded-full mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">
                        What Our Users Say
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Real stories from creators and supporters who love our platform.
                    </p>
                </motion.div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet !bg-amber-300 !w-2.5 !h-2.5 !opacity-50',
                        bulletActiveClass: 'swiper-pagination-bullet-active !bg-amber-500 !opacity-100 !w-8 !rounded-full',
                    }}
                    loop={true}
                    spaceBetween={30}
                    slidesPerView={1}
                    className="pb-16"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-100/50 dark:shadow-black/20 relative overflow-hidden"
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-50 to-transparent dark:from-amber-900/10 rounded-bl-3xl" />

                                {/* Quote icon */}
                                <Quote className="absolute top-6 right-6 w-10 h-10 text-amber-200 dark:text-amber-800" />

                                <div className="flex items-center gap-4 mb-6 relative">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-amber-100 dark:ring-amber-900/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-800">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 dark:text-gray-200">{item.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.role}</p>
                                    </div>
                                    <div className="ml-auto flex gap-1">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                variants={starVariants}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true }}
                                                custom={i}
                                            >
                                                <Star className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <blockquote className="text-gray-600 dark:text-gray-300 text-lg italic leading-relaxed relative pl-4 border-l-4 border-amber-400 dark:border-amber-600">
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