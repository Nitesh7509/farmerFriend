
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay } from "swiper/modules";

const Types = () => {
  const collection = [
    {
      name: "Fruits",
      image:
        "https://i.pinimg.com/1200x/9c/00/1a/9c001a3fe8dfe7012c11fe22847d9030.jpg",
     
    },
    {
      name: "Vegetables",
      image:
        "https://i.pinimg.com/736x/32/8f/96/328f9639f43da5ddcf3a8556c60eb60f.jpg",
      
    },
    {
      name: "Seeds",
      image:
        "https://i.pinimg.com/736x/b6/73/20/b67320741f3f44ab852a7749116af875.jpg",
    
    },
    {
      name: "Grains & Cereals",
      image:
        "https://i.pinimg.com/736x/3d/48/73/3d48732cfcbf41286cac073f5861e7a9.jpg",
     
    },
    {
      name: "Pulses & Legumes",
      image:
        "https://i.pinimg.com/1200x/37/14/7b/37147b04461ea50ab4803e9bd572a585.jpg",
      
    },
    {
      name: "Spices & Herbs",
      image:
        "https://i.pinimg.com/1200x/f6/d6/95/f6d6956192d44e7a0c9205fd42e6a3e9.jpg",
      
    },
    {
      name: "Dairy & Animal Products",
      image:
        "https://i.pinimg.com/736x/83/9a/62/839a624185e9247c4f49f7bd1d3d229c.jpg",
    
    },
    {
      name: "Flowers & Nursery Plants",
      image:
        "https://i.pinimg.com/736x/3b/b1/46/3bb1464d878bc9cb5a18c0837046ee33.jpg",
   
    },
  ];

  return (
    <div className="mx-5 my-10">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        🌾 Category 🌾
      </h1>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="rounded-xl shadow-md px-4"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {collection.map((product) => (
          <SwiperSlide key={product.id}>
            <Link
              to={`/collection`}
              className="flex flex-col items-center text-center hover:scale-105 transition-transform"
            >
              <img
                src={product.image}
                alt={product.name}
                className="rounded-xl w-60 h-40 object-cover mb-2"
              />
              <h2 className="text-lg font-semibold text-green-800">
                {product.name}
              </h2>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Types;
