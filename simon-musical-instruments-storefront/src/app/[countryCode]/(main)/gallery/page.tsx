import GalleryTemplate from "@modules/gallery/templates/gallery-template";

export default async function Gallery() {
  const images = Array.from({ length: 18 }).map((_, index) => `/images/gallery-${index + 1}.jpg`)

  return (
    <div className="content-container">
      <GalleryTemplate 
        images={images} 
      />
    </div>
  )
}
