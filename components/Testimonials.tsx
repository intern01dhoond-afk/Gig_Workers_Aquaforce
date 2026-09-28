"use client";

import React from "react";
import { TestimonialsSection, type Testimonial } from "@/components/ui/testimonial-v2";

const testimonials: Testimonial[] = [
  {
    text: "Apartment basements mein socket dhoondne ke liye security guard se request karni padti thi. Aquaforce lene ke baad wire ka jhanjhat hi khatam! Machine bike ke carrier pe fit hoti hai, bucket mein siphon daalo aur 20 mins mein deep foam wash finish. Daily 7-8 cars aaram se cover hoti hain!",
    image: "/aquaforceforgigworkers/images/testimonials/rahul-sharma1.webp",
    name: "Rahul Sharma",
    role: "Doorstep Wash Partner, Urban Company (Bengaluru)",
  },
  {
    text: "Bike pe mobile detailing service chalata hoon. Pehle petrol generator carry karna padta tha jo heavy aur noisy tha. Aquaforce ka 1400 PSI pressure superb hai — chain grime, engine fins aur tyre mud bina kisi wire ke 15 minute mein clean. Mera daily fuel cost ₹250 bach gaya!",
    image: "/aquaforceforgigworkers/images/testimonials/arjun-mehta1.webp",
    name: "Arjun Mehta",
    role: "Two-Wheeler Mobile Detailer, Pune",
  },
  {
    text: "Gated societies mein hose pipe connect karna strictly not allowed hota hai. Aquaforce bucket se paani siphon karta hai aur sirf 2 bucket mein poori SUV chamka deta hai. Customers cordless professional look dekh ke impress hote hain aur regular monthly subscriptions dete hain.",
    image: "/aquaforceforgigworkers/images/testimonials/priya-nair1.webp",
    name: "Priya Nair",
    role: "Doorstep Auto Spa Specialist, Hyderabad",
  },
  {
    text: "Maine 3 Aquaforce units apni mobile wash team ke liye li hain. Hamare riders bike pe carry karke din bhar societies mein travel karte hain. Battery backup solid hai, foam cannon quality top-class hai, aur har cleaner ab 30% zyada daily orders complete kar raha hai.",
    image: "/aquaforceforgigworkers/images/testimonials/vikram-reddy1.webp",
    name: "Vikram Reddy",
    role: "Owner, QuickClean Mobile Detailing, Chennai",
  },
  {
    text: "Pehle 40 meter ka extension wire leke ghoomna padta tha. Wire ulajh jata tha aur high-rise parking mein plug point milna mushkil tha. Is cordless machine ne mera kaam bohot aasan kar diya. Bas battery lagao aur direct start. Mera daily income almost double ho gaya!",
    image: "/aquaforceforgigworkers/images/testimonials/sneha-kapoor1.webp",
    name: "Sneha Kapoor",
    role: "Freelance Doorstep Detailing Partner, Delhi NCR",
  },
  {
    text: "Motorcycle ke peeche carrier pe pura setup fix ho jata hai. Subah se shaam tak 6 cars aur 4 bikes easily wash kar leta hoon. 1400 PSI se wheel arches aur chassis ka hard mud turant nikalta hai. Auto care gig workers ke liye ye best investment hai.",
    image: "/aquaforceforgigworkers/images/testimonials/manoj-kumar1.webp",
    name: "Manoj Kumar",
    role: "Freelance Car & Bike Washer, Chandigarh",
  },
  {
    text: "Car wash ke sath sath main AC outdoor units aur rooftop solar panels bhi clean karta hoon. Seedhi pe chadh ke wire carry karna risky tha, lekin Aquaforce cordless hone se single-handedly koi bhi rooftop ya balcony job bina power socket ke kar leta hoon.",
    image: "/aquaforceforgigworkers/images/testimonials/karthik-rao1.webp",
    name: "Karthik Rao",
    role: "Doorstep Multi-Service Cleaning Pro, Bengaluru",
  },
  {
    text: "High-rise apartments ke podium parking mein paani ka tap aur plug point dono nahi milte. Aquaforce bucket se direct water lift karta hai. Foam spray itna thick aata hai ki customer turant 5-star rating dete hain app pe aur extra tip bhi milti hai!",
    image: "/aquaforceforgigworkers/images/testimonials/ananya-rao1.webp",
    name: "Ananya Rao",
    role: "Doorstep Car Care Partner, Mumbai",
  },
  {
    text: "Doorstep car wash business start karne ke liye expensive shop lene ki zaroorat nahi padi. Sirf ek bike aur ye Aquaforce machine se apna business shuru kiya. 1 mahine mein machine ki poori cost vasool ho gayi. Har cleaning professional ke paas ye honi chahiye!",
    image: "/aquaforceforgigworkers/images/testimonials/aditya-singh1.webp",
    name: "Aditya Singh",
    role: "Independent Mobile Detailing Entrepreneur, Jaipur",
  },
];

export default function Testimonials() {
  return (
    <TestimonialsSection
      testimonials={testimonials}
      badge="GIG WORKER TESTIMONIALS"
      title="Trusted by Doorstep Auto Care Gig Workers"
      subtitle={
        <span className="inline-block max-w-[840px] text-center">
          <span className="block">
            Real stories from freelance car washers, bike detailers, and doorstep cleaning
          </span>
          <span className="block">
            professionals across India who doubled their daily earnings with Aquaforce® 1400.
          </span>
        </span>
      }
    />
  );
}
