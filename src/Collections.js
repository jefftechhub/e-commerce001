import React, { useEffect, useState } from "react";
import { CollectionComp, ViewAlso } from "./Component/Collection";
import { useParams } from "react-router-dom";
import { useGet } from "./useGet";

import "./Component_css/Collection.css";

function Collections({ addtocart, addingToWishlist }) {
  const { collection } = useParams();
  const [collections, setCollections] = useState([]);
  const [viewAlso, setViewAlso] = useState([]);

  const { data, loading } = useGet(`/api/collection/${collection}`);

  useEffect(() => {
    if (data) {
      setCollections(data.products);
      setViewAlso(data.viewAlso);
    }
  }, [data]);

  return (
    <React.Fragment>
      {loading ? (
        <div className="shoploadingAnimationContainer">
          <p className="loadingAnimation"></p>
        </div>
      ) : (
        <>
          <a href="#">
            <i class="fa-regular fa-hand-point-up"></i>
          </a>
          <h1 id="collectionHeading">{collection}</h1>
          <div className="collectionsContainer">
            <div className="colletionGrid">
              {collections.map((item) => {
                return (
                  <CollectionComp
                    {...item}
                    addtocart={addtocart}
                    addingToWishlist={addingToWishlist}
                  />
                );
              })}
            </div>
            <h2>View Also</h2>
            <div className="colletionGrid">
              {viewAlso.map((item) => {
                return <ViewAlso {...item} />;
              })}
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default Collections;
