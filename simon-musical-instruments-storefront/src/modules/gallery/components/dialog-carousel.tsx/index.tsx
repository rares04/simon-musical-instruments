"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@lib/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@lib/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRef } from "react";

type GalleryDialogCarouselProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    startIndex: number;
    images: string[];
}

export default function GalleryDialogCarousel({isOpen, setIsOpen, startIndex, images}: GalleryDialogCarouselProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <VisuallyHidden>
        <DialogTitle>We gladly welcome you to our workshop</DialogTitle>
        <DialogDescription>A series of images from our workshop displayed in a carousel</DialogDescription>
      </VisuallyHidden>
      <DialogContent className="p-0 border-none">
        <Carousel 
          orientation="horizontal" 
          opts={{
            align: "center",
            loop: true,
            startIndex: startIndex || 0
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img ref={imageRef} src={image} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover"/>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}