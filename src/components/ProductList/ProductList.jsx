// import { useEffect, useState } from "react";

// // const API_URL = "https://jsonplaceholder.typicode.com/posts";
// const API_URL =
//   "https://script.google.com/macros/s/AKfycbzbr8nbF1nJQyA8OdFoQeV2JktX_lUKLpNjQwMMdVXjXStE72zwWbAXRIlqF2vJMufS/exec";

// export default function Posts(props) {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     (async function () {
//       try {
//         const res = await fetch(API_URL);
//         const categories = await res.json();
//         setCategories(categories.sheets);
//         // setProducts(categories.products);
//       } catch (error) {
//         setError(error.message);
//       }
//       setIsLoading(false);
//     })();
//   }, []);

//   const setHandleProducts = async (category) => {
//     let response = await fetch(API_URL + `?category=${category}`);
//     const data = await response.json();
//     setProducts(data.products);
//     console.log(data);
//   };
//   // const sendData = useCallback(async () => {
//   //   const data = await axios
//   //     .post(API_URL, newUser)
//   //     .then((response) => {
//   //       store.dispatch(resultModal(response.data));
//   //       handleActiveModalState();
//   //     })
//   //     .catch((error) => error)
//   //     .finally();

//   //   // console.log(Object.values(data));
//   // }, []);

//   // const setHandleProducts = (category) => {
//   //   console.log(API_URL + `?category=${category}`);

//   //   useEffect(() => {
//   //     (async function () {
//   //       try {
//   //         const res = await fetch(API_URL + `${category}`);
//   //         const categories = await res.json();
//   //         setCategories(categories);
//   //       } catch (error) {
//   //         setError(error.message);
//   //       }
//   //       // setIsLoading(false);
//   //     })();
//   //   }, []);
//   // };

//   // useEffect(() => {
//   //   fetch(API_URL)
//   //     .then((response) => response.json())
//   //     .then((json) => setPosts(json))
//   //     .catch((error) => setError(error.message))
//   //     .finally(() => setIsLoading(false));
//   // }, []);
//   console.log(products);
//   if (error) {
//     return <h1>ERROR: {error}</h1>;
//   }
//   return (
//     <div>
//       <h1>Categories:</h1>
//       <hr />
//       {isLoading ? (
//         <h1>LOADING...</h1>
//       ) : (
//         categories.map((x, i) => (
//           // <Post key={i} {...x} />
//           <button onClick={() => setHandleProducts(x)} key={i}>
//             {x}
//           </button>
//         ))
//       )}
//       <h1>Products:</h1>
//       <hr />
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr 1fr",
//           gap: "40px",
//           padding: "60px",
//         }}
//       >
//         {products &&
//           products.map((product, i) => (
//             <div
//               key={i}
//               style={{
//                 backgroundColor: "white",
//                 borderRadius: "6px",
//                 color: "blue",
//               }}
//             >
//               <p>Модель {product.model}</p>
//               <p>Объем памяти {product.memory}</p>
//               <p>Цвет {product.color}</p>
//               <p>Описание {product.description}</p>
//               {product.new && <p>NEW</p>}
//               <p>Цена {product.price}₽</p>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import "./ProductList.css";
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";
import { useCallback, useEffect } from "react";

const products = [
  {
    id: "1",
    title: "Джинсы",
    price: 5000,
    description: "Синего цвета, прямые",
  },
  {
    id: "2",
    title: "Куртка",
    price: 12000,
    description: "Зеленого цвета, теплая",
  },
  {
    id: "3",
    title: "Джинсы 2",
    price: 5000,
    description: "Синего цвета, прямые",
  },
  {
    id: "4",
    title: "Куртка 8",
    price: 122,
    description: "Зеленого цвета, теплая",
  },
  {
    id: "5",
    title: "Джинсы 3",
    price: 5000,
    description: "Синего цвета, прямые",
  },
  {
    id: "6",
    title: "Куртка 7",
    price: 600,
    description: "Зеленого цвета, теплая",
  },
  {
    id: "7",
    title: "Джинсы 4",
    price: 5500,
    description: "Синего цвета, прямые",
  },
  {
    id: "8",
    title: "Куртка 5",
    price: 12000,
    description: "Зеленого цвета, теплая",
  },
];

const getTotalPrice = (items = []) => {
  return items.reduce((acc, item) => {
    return (acc += item.price);
  }, 0);
};

const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const { tg, queryId } = useTelegram();

  const onSendData = useCallback(() => {
    const data = {
      products: addedItems,
      totalPrice: getTotalPrice(addedItems),
      queryId,
    };
    fetch("http://85.119.146.179:8000/web-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }, [addedItems]);

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData]);

  const onAdd = (product) => {
    const alreadyAdded = addedItems.find((item) => item.id === product.id);
    let newItems = [];

    if (alreadyAdded) {
      newItems = addedItems.filter((item) => item.id !== product.id);
    } else {
      newItems = [...addedItems, product];
    }

    setAddedItems(newItems);

    if (newItems.length === 0) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: `Купить ${getTotalPrice(newItems)}`,
      });
    }
  };

  return (
    <div className={"list"}>
      {products.map((item) => (
        <ProductItem product={item} onAdd={onAdd} className={"item"} />
      ))}
    </div>
  );
};

export default ProductList;
