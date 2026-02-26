"use client";

import { useState } from "react";
import { ArrowLeft, Users, Clock, Star } from "lucide-react";

interface FeaturesPageProps {
  onBack?: () => void;
}

export default function FeaturesPage({ onBack }: FeaturesPageProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100 text-black">
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Coming Soon! 🚀</h3>
            <p className="text-gray-600 mb-6">
              We're working hard to bring you the Virtual Wardrobe feature.
              Stay tuned for updates!
            </p>

            <button
              onClick={() => setShowComingSoon(false)}
              className="w-full bg-pink-300 text-black hover:bg-pink-400 py-2 rounded-lg font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}

            <div className="w-8 h-8 bg-pink-300 rounded-full"></div>
            <span className="text-xl font-bold">
              Outfevibe Features
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Powerful Features for
            <span className="block text-pink-300">
              Perfect Styling
            </span>
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover how Outfevibe's cutting-edge technology
            transforms your wardrobe into a personalized
            styling experience.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Outfit Suggestions */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Outfit Suggestions
              </h3>

              <p className="text-gray-700 mb-6">
                Get AI-powered outfit recommendations tailored to
                your style, mood, and occasion. Upload your clothes
                and receive instant styling suggestions.
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  "Smart color matching algorithms",
                  "Style compatibility scoring",
                  "Seasonal appropriateness checks",
                  "Personal preference learning",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-pink-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-pink-300 text-black hover:bg-pink-400 py-2 rounded-lg font-medium">
                Try Outfit Suggestions
              </button>
            </div>

            {/* Virtual Wardrobe */}
            <div className="bg-white p-8 rounded-2xl shadow-lg opacity-75">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Virtual Wardrobe
              </h3>

              <p className="text-gray-700 mb-6">
                Organize and manage your entire wardrobe digitally.
                Mix and match pieces to create perfect outfits.
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  "Digital clothing catalog",
                  "Outfit creation tools",
                  "Wardrobe analytics",
                  "Seasonal organization",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowComingSoon(true)}
                disabled
                className="w-full border border-gray-400 text-gray-600 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Coming Soon
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Style?
          </h2>

          <p className="text-xl text-gray-700 mb-8">
            Join thousands of users who have revolutionized their
            wardrobe with Outfevibe
          </p>

          <button className="bg-pink-300 text-black hover:bg-pink-400 px-8 py-4 text-lg rounded-lg font-medium">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
