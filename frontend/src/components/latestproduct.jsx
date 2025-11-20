import { useContext,useState,useEffect } from 'react'
import { ShopContext } from '../contexts/shopcontext'
import ProductItem from './productitem'
const types = () => {
    const {products} = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState(products);
    useEffect(() => {
        let latest = products.slice(0,10);
        setLatestProducts(latest);
    },[])
  return (
    <div className='mx-5 my-5'>
      <h1 className='text-3xl font-bold  text-green-700 mb-3'>
        🌾 You Might needed🌾
      </h1>
      <div className='grid grid-cols-4 gap-4'>
        {latestProducts.map((product,index) => (
          <ProductItem 
            key={index} 
            name={product.name} 
            price={product.price} 
            image={product.image} 
            id={product._id}
            stock={product.stock}
            farmerName={product.farmerId?.name}
          />
        ))}
      </div>
    
    </div>
  )
}

export default types