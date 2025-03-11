"use client"

import { Heading } from "@medusajs/ui";
import { useState } from "react";
import GalleryDialogCarousel from "../components/dialog-carousel.tsx";

type GalleryTemplateProps = {
    images: string[];
}

export default function GalleryTemplate({images}: GalleryTemplateProps) {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-y-6 items-center p-4 space-y-12 mt-12">
        <Heading level="h1" className="text-3xl">We gladly welcome you to our workshop</Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div className="relative group hover:cursor-pointer w-full h-full" key={index} onClick={() => {setStartIndex(index); setIsOpen(true)}}>
              <img src={image} alt={`Gallery image ${index + 1}`} />
              <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 z-10"></div>
            </div>
          ))}
        </div>
      </div>
      <GalleryDialogCarousel 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        startIndex={startIndex} 
        images={images} 
      />
    </>
  )
}