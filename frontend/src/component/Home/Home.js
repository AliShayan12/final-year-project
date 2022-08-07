import React, { Fragment } from 'react';
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Product from "./Product.js";
import MetaData from "../layout/MetaData";


const product = {
    name: "Black shirt",
    price : "$23",
    _id: "shayan",
    images: [{url: "https://www.aestheticindians.com/wp-content/uploads/2022/04/26.1.jpg"}] 
}

const Home = () => {
    return (
        <Fragment>

            <MetaData title ="Equip-Rental" />

            <div className="banner">
                <p>Welcome to Equip-Rental</p>
                <h1>Find Products For Rent Below</h1>

                <a href="#container">
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>
            <h2 className="homeHeading">Featured Products</h2>

            <div className="container" id="container">
                {/* {products && products.map((product) => <Product product={product} />)} */}

                <Product product= {product}/>
                <Product product= {product}/>
                <Product product= {product}/>
                <Product product= {product}/>
                <Product product= {product}/>
                <Product product= {product}/>
                <Product product= {product}/>
                <Product product= {product}/>
                <Product product= {product}/>
                    

            </div>

        </Fragment>
    )
}

export default Home