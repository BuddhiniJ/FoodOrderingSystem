import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, Store, MapPin, Clock, Search, Star, Bell } from 'lucide-react';

export default function FoodOrderingLandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/restaurants')
            .then(res => setRestaurants(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
            {/* Header */}
            <header className={`fixed w-full z-50 transition-all duration-300  bg-gradient-to-b from-red-50 to-white ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center mr-2">
                            <ShoppingBag size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">
                            <span className="text-red-500">Food</span>
                            <span className="text-gray-800">Fetch</span>
                        </h1>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to={"/customer"}>
                            <button className="px-4 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                Login
                            </button>
                        </Link>
                        <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors shadow-md">
                            Sign Up
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-700 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white py-4 px-4 shadow-lg">
                        <nav className="flex flex-col space-y-4">

                            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                                <button className="px-4 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                    Login
                                </button>
                                <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors">
                                    Sign Up
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-400 rounded-full"></div>
                    <div className="absolute right-40 top-40 w-48 h-48 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center">
                        <div className="w-full lg:w-4/5 mb-12 lg:mb-0">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                                Delicious Food <span className="text-red-500">Delivered</span> To Your Door
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                                Connect with local restaurants and enjoy your favorite meals without leaving home. Fast delivery, fresh food, happy customers.
                            </p>

                        </div>
                        <div className="w-full lg:w-1/5 relative">
                            <div className="relative w-60">
                                <div className="absolute -top-6 -left-4 w-full h-[440px] bg-red-200 rounded-2xl transform -rotate-3"></div>
                                <img
                                    src="/images/img1.png"
                                    alt="Food delivery"
                                    className="rounded-2xl shadow-lg relative z-10 h-[400px] object-cover"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Popular Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-red-50 transition-colors group">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                                <img src="/images/bread.png" className="w-14 h-14" />
                            </div>
                            <p className="font-medium text-gray-700"> Bread </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-red-50 transition-colors group">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                                <img src="/images/drink.png" className="w-14 h-14" />
                            </div>
                            <p className="font-medium text-gray-700"> Beverages </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-red-50 transition-colors group">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                                <img src="/images/dessert.png" className="w-14 h-14" />
                            </div>
                            <p className="font-medium text-gray-700"> Dessert </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-red-50 transition-colors group">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                                <img src="/images/chineese.png" className="w-14 h-14" />
                            </div>
                            <p className="font-medium text-gray-700"> Chineese </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-red-50 transition-colors group">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                                <img src="/images/burger.png" className="w-14 h-14" />
                            </div>
                            <p className="font-medium text-gray-700"> Buns </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-red-50 transition-colors group">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                                <img src="/images/pizza.png" className="w-14 h-14" />
                            </div>
                            <p className="font-medium text-gray-700"> Pizza </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose FoodFetch?</h2>
                        <p className="text-lg text-gray-600">
                            Our platform offers the best experience for both restaurant owners and food lovers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Clock size={24} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Delivery</h3>
                            <p className="text-gray-600">Get your food delivered quickly while it's still hot and fresh, with real-time tracking.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Search size={24} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Restaurant Discovery</h3>
                            <p className="text-gray-600">Find new restaurants or your favorite local spots with our intuitive search and filters.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Bell size={24} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Real-time Notifications</h3>
                            <p className="text-gray-600">Stay updated on your order status or incoming restaurant orders with instant alerts.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How FoodFetch Works</h2>
                        <p className="text-lg text-gray-600">
                            We've made the process simple and efficient for everyone involved.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline Bar */}
                        <div className="hidden md:block absolute left-0 right-0 top-1/2 h-1 bg-red-200 transform -translate-y-1/2 z-0"></div>

                        {/* Steps */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {/* Step 1 */}
                            <div className="relative flex flex-col items-center text-center z-10">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-6">
                                    1
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Your Restaurant</h3>
                                    <p className="text-gray-600">Browse through our curated list of restaurants and find your favorites.</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col items-center text-center z-10">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-6">
                                    2
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Place Your Order</h3>
                                    <p className="text-gray-600">Select your favorite dishes and securely checkout with easy payment options.</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col items-center text-center z-10">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-6">
                                    3
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Track in Real-time</h3>
                                    <p className="text-gray-600">Follow your order from preparation to delivery with tracking and notifications.</p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative flex flex-col items-center text-center z-10">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-6">
                                    4
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Enjoy Your Food</h3>
                                    <p className="text-gray-600">Receive your food fresh and hot, ready to enjoy in the comfort of your home.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            < section className="py-16" >
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of restaurants and food lovers on our platform today.
                    </p>
                    {/* User Cards */}
                    <div className="flex flex-col md:flex-row gap-8 mt-12">
                        {/* Restaurant Owners Card */}
                        <div className="bg-white rounded-xl shadow-lg p-8 flex-1 hover:shadow-xl transition-all text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Store size={24} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">For Restaurant Owners</h2>
                            <p className="text-gray-600 mb-6">
                                Join our platform to reach more customers, manage orders efficiently, and grow your business.
                            </p>
                            <Link to="/admin">
                                <button className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors shadow-md" >
                                    Register Your Restaurant
                                </button>
                            </Link>
                            <br/>
                            <Link to="/resturantLogin">
                                <button className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors shadow-md" >
                                    Login to Your Restaurant
                                </button>
                            </Link>
                        </div>

                        {/* Customers Card */}
                        <div className="bg-white rounded-xl shadow-lg p-8 flex-1 hover:shadow-xl transition-all text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag size={24} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">For Customers</h2>
                            <p className="text-gray-600 mb-6">
                                Discover local restaurants, order your favorite meals, and get them delivered right to your doorstep.
                            </p>
                            <button className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors shadow-md">
                                Order Food Now
                            </button>
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-gray-800 text-white py-12" >
                <div className="container mx-auto px-4">
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 FoodFetch. All rights reserved.</p>
                    </div>
                </div>
            </footer >
        </div >
    );
}