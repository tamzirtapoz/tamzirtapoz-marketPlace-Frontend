import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { connect } from "react-redux";
import brands from "../assets/brands.jpg";
import discount from "../assets/discount.jpg";
import SingleProduct from "./SingleProduct";
// import { FcNext, FcPrevious } from "react-icons/fc";

// import { IconContext } from "react-icons";

import { homeScreenItems } from "../arrayFiles/homeScreenItems";
import { ALL_PRODUCT_UPDATED } from "../actions/actionsForBag";
import axios from "axios";

const HomeGeneral = ({
  isBigScreen,
  login,
  allProducts,

  token,
  setAllProducts,
  urlServer,
}) => {
  const [indexForSlide, setIndexForSlide] = useState(0);
  const [smallerPage, setSmallerPage] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const pageSizeChanged = () => {
    if (window.innerWidth < 930) {
      setSmallerPage(true);
    } else {
      setSmallerPage(false);
    }
  };

  useEffect(() => {
    if (!productsLoaded) {
      axios({
        method: "get",
        url: urlServer + "/market/all-products",
      })
        .then((response) => {
          if (response.data.success) {
            setAllProducts(response.data.productArray);
            setProductsLoaded(true);
          } else {
            setProductsLoaded(false);
          }
        })
        .catch((err) => {
          console.log(err);
          window.alert(err);
          setProductsLoaded(false);
        });
    }
    // eslint-disable-next-line
  }, [login, allProducts, token]);

  useEffect(() => {
    window.addEventListener("resize", pageSizeChanged);
    return () => {
      window.removeEventListener("resize", pageSizeChanged);
    };
  });

  const handleSelect = (selectedIndex, e) => {
    setIndexForSlide(selectedIndex);
  };

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="d-flex flex-row flex-wrap justify-content-around align-items-center homeTab">
          {isBigScreen ? (
            <>
              <div
                className={`d-flex justify-content-around align-self-center flex-${
                  smallerPage ? "row" : "column"
                } m-0 p-0`}
              >
                <img
                  src={brands}
                  alt="brands"
                  className="img img-fluid rounded"
                  style={{
                    maxWidth: "250px",

                    boxShadow: "10px 10px 5px rgba(55, 50, 50, 0.3)",
                  }}
                />
                <div style={{ width: "0px", height: "25px" }}></div>
                <div className="d-flex justify-content-center m-0 p-0">
                  <img
                    src={discount}
                    alt="discount"
                    className="img img-fluid rounded border border-danger"
                    style={{
                      maxWidth: "250px",
                      boxShadow: "10px 10px 5px rgba(55, 50, 50, 0.3)",
                    }}
                  />
                  <p
                    className="discountFlicker"
                    style={{
                      position: "absolute",
                      zIndex: "150",
                      fontSize: "30px",
                    }}
                  >
                    up to 50%
                  </p>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div
            className="container-fluid m-0  p-1 homeSlideItems border border-secondary"
            style={{
              borderRadius: "15px",
              maxWidth: "600px",
              width: "90vw",

              background: "rgba(50,50,150,0.2)",
            }}
          >
            <h1 className="text-center text-uppercase m-0 p-0">
              {homeScreenItems[indexForSlide].header}
            </h1>
            <Carousel
              activeIndex={indexForSlide}
              onSelect={handleSelect}
              slide={true}
              fade
              indicators={true}
              variant="dark"
              indicatorLabels={[1, 2, 3, 4]}
              nextLabel=""
              nextIcon={
                <span>
                  {/* <IconContext.Provider
                    value={{
                      className: "global-class-name border-dark bg-dark",
                      size: "2em",
                    }}
                  >
                    <FcNext />
                  </IconContext.Provider> */}
                </span>
              }
              prevLabel=""
              prevIcon={
                <span>
                  {/* <IconContext.Provider
                    value={{
                      className: "global-class-name border-dark bg-dark",
                      size: "2em",
                    }}
                  >
                    <FcPrevious />
                  </IconContext.Provider> */}
                </span>
              }
            >
              {homeScreenItems.map((item, index) => {
                return (
                  <Carousel.Item key={item.id}>
                    <div className="container-fluid m-0 p-0">
                      <img
                        onClick={() => {
                          // window.location.reload();
                        }}
                        key={item.id}
                        className="img-fluid rounded"
                        src={item.img}
                        alt={`${item.id} slide`}
                      />
                    </div>
                  </Carousel.Item>
                );
              })}
            </Carousel>
            <div className="d-flex justify-content-around flex-wrap m-1 p-1">
              {homeScreenItems.map((item) => {
                return (
                  <button
                    onMouseOver={() => setIndexForSlide(item.id - 1)}
                    key={item.id}
                    style={{
                      color:
                        item.id - 1 === indexForSlide
                          ? "rgba(150,255,150,1)"
                          : "rgba(0,0,0,1)",
                      borderColor:
                        item.id - 1 === indexForSlide
                          ? "rgba(0,0,0,1)"
                          : "rgba(0,0,0,0.5)",
                      borderRadius: "15px",
                      background:
                        item.id - 1 === indexForSlide
                          ? "rgba(3, 67, 97,1)"
                          : "rgba(53,244,244,0.3)",
                      boxShadow:
                        item.id - 1 === indexForSlide
                          ? "5px 7px 5px rgba(55, 50, 50, 0.5)"
                          : "0px 10px 5px rgba(55, 50, 50, 0)",
                    }}
                  >
                    {item.header}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around flex-wrap m-3 p-3 homeProductList align-items-center">
          {allProducts.map((item, index) => {
            return <SingleProduct key={index} {...item} />;
          })}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { isBigScreen, login, token, urlServer } = state.site;
  const { allProducts } = state.bag;
  return { isBigScreen, allProducts, login, token, urlServer };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAllProducts: (allProducts) =>
      dispatch({ type: ALL_PRODUCT_UPDATED, payload: { allProducts } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeGeneral);
