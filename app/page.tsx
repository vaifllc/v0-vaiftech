import Hero from "@/components/hero"
import Features from "@/components/features"
import Services from "@/components/services"
import Products from "@/components/products"
import Training from "@/components/training"
import Booking from "@/components/booking"
import Testimonials from "@/components/testimonials"
import CTA from "@/components/cta"

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Services />
      <Products />
      <Training />
      <Booking />
      <Testimonials />
      <CTA />
    </main>
  )
}
