"use client";

import React from "react";
import { TestimonialsSection, type Testimonial } from "@/components/ui/testimonial-v2";

const testimonials: Testimonial[] = [
  {
    text: "Bhai honestly, apartment parking mein car wash karna was always a headache. Aquaforce lene ke baad wire aur socket ka jhanjhat hi khatam! Ek bucket paani aur 15 mins mein car ekdum showroom clean.",
    image: "/aquaforceforautocare/images/testimonials/rahul-sharma1.webp",
    name: "Rahul Sharma",
    role: "Car Enthusiast, Mumbai",
  },
  {
    text: "Weekend trail ride ke baad bike pe stubborn mud jam jata tha. The 1400 PSI pressure is seriously impressive — radiator ke delicate fins ko bina damage kiye saari mitti saaf kar deta hai.",
    image: "/aquaforceforautocare/images/testimonials/arjun-mehta1.webp",
    name: "Arjun Mehta",
    role: "Superbike Owner, Pune",
  },
  {
    text: "Cordless hone ka sabse bada advantage ye hai ki basement parking mein socket dhoondne ki tension nahi. Very lightweight, easy to carry, and the battery easily lasts for a full deep wash.",
    image: "/aquaforceforautocare/images/testimonials/priya-nair1.webp",
    name: "Priya Nair",
    role: "Creta Owner, Bengaluru",
  },
  {
    text: "I run a mobile auto detailing setup in Hyderabad. Customers are always amazed seeing a cordless pressure washer with such high power. Foam cannon ke sath turnaround time double fast ho gaya hai.",
    image: "/aquaforceforautocare/images/testimonials/vikram-reddy1.webp",
    name: "Vikram Reddy",
    role: "Auto Detailing Studio, Hyderabad",
  },
  {
    text: "Society mein water hose pipe allow nahi thi wash ke liye. Aquaforce is a lifesaver. Siphon pipe bucket mein daalo aur instantly powerful spray start. Balcony tiles aur car dono easily clean ho jaate hain.",
    image: "/aquaforceforautocare/images/testimonials/sneha-kapoor1.webp",
    name: "Sneha Kapoor",
    role: "Home & Garden, Delhi NCR",
  },
  {
    text: "Pehle Sunday car wash center pe 2 ghante line mein lagna padta tha. Ab ghar ke driveway pe 20 minutes mein complete DIY wash ho jata hai. Solid machine and powerful water throw!",
    image: "/aquaforceforautocare/images/testimonials/manoj-kumar1.webp",
    name: "Manoj Kumar",
    role: "Fortuner Owner, Chandigarh",
  },
  {
    text: "The 1400 PSI pressure rating is well calibrated for automotive paintwork. No swirl marks, high flow rate, and seamless cordless portability. Absolutely worth the investment.",
    image: "/aquaforceforautocare/images/testimonials/karthik-rao1.webp",
    name: "Karthik Rao",
    role: "Vehicle Care Expert, Chennai",
  },
  {
    text: "Compact design is a huge plus point. I keep it in the car boot during road trips. Whenever needed, kisi bhi bucket ya container se connect karke instant wash kar lo. Very convenient!",
    image: "/aquaforceforautocare/images/testimonials/ananya-rao1.webp",
    name: "Ananya Rao",
    role: "Daily Commuter, Kochi",
  },
  {
    text: "Thar off-roading ke baad remote locations mein wash karna pehle impossible tha. Ab highway dhabe pe bhi bucket paani se chassis aur tyre arches ekdum clean kar lete hain. Gazab product hai!",
    image: "/aquaforceforautocare/images/testimonials/aditya-singh1.webp",
    name: "Aditya Singh",
    role: "Off-Road Enthusiast, Jaipur",
  },
];

export default function Testimonials() {
  return (
    <TestimonialsSection
      testimonials={testimonials}
      badge="CUSTOMER STORIES"
      title="What Our Users Say"
      subtitle={
        <>
          Real feedback from car enthusiasts, bike owners, and professionals across{" "}
          <br className="hidden sm:inline" />
          India who trust Aquaforce® 1400.
        </>
      }
    />
  );
}
