import React, { useState, useEffect } from "react";

const Library = () => {
  const [imageUrls, setImageUrls] = useState([]);

  // Fetch image URLs from backend (replace with your API call)
  useEffect(() => {
    const fetchImages = async () => {
      // Replace this with your backend API call
      const images = [
        "https://picsum.photos/400/600",
        "https://picsum.photos/500/300",
        "https://picsum.photos/300/400",
        "https://picsum.photos/600/400",
        "https://picsum.photos/700/500",
        "https://picsum.photos/200/400",
        "https://picsum.photos/450/350",
        "https://picsum.photos/250/500",
        "https://picsum.photos/350/200",
        "https://picsum.photos/550/650",
        "https://picsum.photos/480/320",
        "https://picsum.photos/360/540",
      ];
      setImageUrls(images);
    };

    fetchImages();
  }, []);

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 md:mt-8 md:ml-2 lg:mt-8 lg:ml-2 md:gap-4 lg:gap-4 md:p-4 lg:p-4">
      {imageUrls.map((url, index) => (
        <div key={index} className="mb-4">
          <img
            src={url}
            alt={`Collage Image ${index + 1}`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default Library;
