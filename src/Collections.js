import React, { useEffect, useState } from "react";
import { CollectionComp, ViewAlso } from "./Component/Collection";
import { useParams } from "react-router-dom";
import { data, viewAlsoCollections } from "./data";

import "./Component_css/Collection.css";

function Collections() {
  const { collection } = useParams();
  const [collections, setCollections] = useState([]);
  const [viewAlso, setViewAlso] = useState([]);

  useEffect(() => {
    const collections = data.filter((item) => item.collection === collection);
    setCollections(collections);

    const viewAlso = viewAlsoCollections.filter(
      (item) => item.collection !== collection
    );
    setViewAlso(viewAlso);
  }, [collection, viewAlso]);

  return (
    <React.Fragment>
      <a href="#">
        <i class="fa-regular fa-hand-point-up"></i>
      </a>
      <h1 id="collectionHeading">{collection}</h1>
      <div className="collectionsContainer">
        <div className="colletionGrid">
          {collections.map((item) => {
            return <CollectionComp {...item} />;
          })}
        </div>
        <h2>View Also</h2>
        <div className="colletionGrid">
          {viewAlso.map((item) => {
            return <ViewAlso {...item} />;
          })}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Collections;
