import React from "react";
import { Button } from "./ui/button";

const PRICING_OPTIONS = [
    {
      name:'Basic',
      tokens:'100',
      desc:'basic plan for occasional users',
      price:4.99
    },
    {
      name:'Pro',
      tokens:'2.5M',
      desc:'Designed for professionals and businesses',
      price:19.99
    }
  ];

export default function PricingPage() {


  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {
            PRICING_OPTIONS.map((option,index) => (
                <div  className="border p-7 rounded-xl flex flex-col gap-2" key={index}>
                <div className="font-bold text-2xl">
                    {option.name}
                </div>
                <div className="font-medium text-lg">{option.tokens}</div>
                <p className="text-gray-400">{option.desc}</p>
                <h2 className="text-4xl font-bold text-center mt-6">${option.price}</h2>

                <Button>Subscribe</Button>

                </div>
            ))}
    </div>
  );
} 