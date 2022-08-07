import React from 'react';
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";


const options = {
    burgerColorHover: "#134B5F",
    logo,
    logoWidth: "20vmax",
    navColor1: "white",
    logoHoverSize: "0px",
    logoHoverColor: "white",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Contact",
    link4Text: "About",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/contact",
    link4Url: "/about",
    link1Size: "1.3vmax",
    link1Color: "black",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1ColorHover: "#134B5F",
    link1Margin: "1vmax",
    profileIcon: true,
    ProfileIconElement: FaUserAlt,
    profileIconUrl: "/login",
    profileIconColor: "black",

    searchIconColor: "black",
    searchIcon: true,
    SearchIconElement: BsSearch,

    cartIcon: true,
    CartIconElement: AiOutlineShoppingCart,
    cartIconColor: "black",
    profileIconColorHover: "#134B5F",
    searchIconColorHover: "#134B5F",
    cartIconColorHover: "#134B5F",
    cartIconMargin: "2vmax",

};



function Header() {
    return (
        <div>
            {/* <div>
                <p>cart logo <AiOutlineShoppingCart /></p>
                <p>search logo <BsSearch /></p>
                <p>profile logo <FaUserAlt /></p>
            </div> */}
            <ReactNavbar {...options} />
        </div>

    )
}


export default Header;
