import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "../Axios";
import PopNotification from "../PopNotifiction";
import Loading from "../Loading";

function AddProducts() {
  const [productsValues, setProductsValue] = useState(
    JSON.parse(localStorage.getItem("product")) || {
      title: "",
      image: [],
      price: "",
      oldPrice: "",
      category: "",
      type: "",
      averageRating: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [errorNote, setErrorNote] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    axios.post("/api/products/uploads", formData).then((res) => {
      try {
        if (res.data.success) {
          setProductsValue((prevState) => ({
            ...prevState,
            image: [...prevState.image, res.data.data],
          }));

          localStorage.setItem("product", JSON.stringify(productsValues));
        } else {
          console.log(res.data.message);
        }
      } catch (error) {
        setErrorContent(error);
        setLoading(false);
        setError(true);
        console.log(error);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const submitHandler = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        productsValues.title &&
        productsValues.image.length > 0 &&
        productsValues.price &&
        productsValues.category &&
        productsValues.type &&
        productsValues.averageRating
      ) {
        axios
          .post("/api/uploadProduct", productsValues)
          .then((res) => {
            if (res.data.success) {
              localStorage.removeItem("product");
              setProductsValue({
                title: "",
                image: [],
                price: "",
                oldPrice: "",
                category: "",
                type: "",
                averageRating: "",
                peopleRated: "",
              });
              setNoteContent("successfully uploaded");
              setErrorNote(false);
              setShowNote(true);
              setLoading(false);
            } else {
              setNoteContent(res.data.message);
              setErrorNote(true);
              setLoading(false);
              setShowNote(true);
            }
          })
          .catch((err) => {
            setErrorContent("internal server error");
            setLoading(false);
            setError(true);
          });
      } else {
        setNoteContent("empty field");
        setErrorNote(true);
        setLoading(false);
        setShowNote(true);
      }
    } catch (error) {
      setErrorContent("internal server error");
      setLoading(false);
      setError(true);
    }
  };

  const otherImages = productsValues.image.slice(
    1,
    productsValues.image.length
  );

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setProductsValue({ ...productsValues, [name]: value });
    localStorage.setItem("product", JSON.stringify(productsValues));
  };

  // remove image
  const removeHandler = (path) => {
    axios.delete(`/${path}`).then((resp) => {
      if (resp.data.success) {
        const updatedImageArray = productsValues.image.filter(
          (imagePath) => imagePath !== path
        );

        // Update the state with the updated `image` array
        setProductsValue((prevState) => ({
          ...prevState,
          image: updatedImageArray,
        }));

        localStorage.setItem("product", JSON.stringify(productsValues));
      }
    });
  };

  if (error) {
    return <div>{errorContent}</div>;
  } else {
    return (
      <React.Fragment>
        <div className="addproducts">
          {showNote && (
            <PopNotification
              noteContent={noteContent}
              errorNote={errorNote}
              setShowNote={setShowNote}
            />
          )}
          <form onSubmit={submitHandler}>
            <header>
              <Link to="/dashboard/products">
                <i class="fa-solid fa-arrow-left"></i>
              </Link>

              <button disabled={loading} type="submit">
                {loading ? "loading..." : "save"}
              </button>
            </header>
            <h1>Add products</h1>
            <diV>
              <h2>title *</h2>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g Blue loveseat sofa with throw pillows"
                value={productsValues.title}
                onChange={changeHandler}
              />
            </diV>

            <div id="media">
              <h2 for="media">Media *</h2>

              {productsValues.image.length > 0 ? (
                <div className="imagesContainer">
                  <div>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p className="addImage">Drop here ...</p>
                      ) : (
                        <p className="addImage">Add Image</p>
                      )}
                    </div>
                    <div className="imageDiv">
                      <i
                        class="fa-solid fa-rectangle-xmark"
                        onClick={() => {
                          removeHandler(productsValues.image[0]);
                        }}
                      ></i>
                      <img
                        src={`http://localhost:5000/${productsValues.image[0]}`}
                        alt="Product's Image"
                      />
                    </div>
                  </div>

                  {otherImages && (
                    <div className="otherImagesContainer">
                      {otherImages.map((item) => {
                        return (
                          <div className="imageDiv otherImages">
                            <i
                              class="fa-solid fa-rectangle-xmark"
                              onClick={() => {
                                removeHandler(productsValues.image[0]);
                              }}
                            ></i>
                            <img
                              src={`http://localhost:5000/${item}`}
                              alt="Product's Image"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h2>Pricing</h2>
              <label for="price">Price *</label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="Price"
                value={productsValues.price}
                onChange={changeHandler}
              />
              <label for="price">old price </label>
              <input
                id="oldprice"
                type="number"
                name="oldPrice"
                placeholder="Initial price after discount"
                value={productsValues.oldPrice}
                onChange={changeHandler}
              />
            </div>

            <div>
              <h2>Collection</h2>
              <label for="category">Collection *</label>
              <select
                id="collection"
                value={productsValues.collection}
                name="category"
                onChange={changeHandler}
              >
                <option value="">--choose collection--</option>
                <option value="livingroom">livingroom</option>
                <option value="bedroom">bedroom</option>
                <option value="kitchen">kitchen</option>
                <option value="outdoor">outdoor</option>
                <option value="others">others</option>
              </select>
              <label for="type">Type *</label>
              <select
                id="type"
                name="type"
                value={productsValues.type}
                onChange={changeHandler}
              >
                <option value="">--choose type--</option>
                <option value="sofas">sofas</option>
                <option value="beds">beds</option>
                <option value="tvStands">tv stands</option>
                <option value="kitchen">kitchen</option>
                <option value="others">others</option>
              </select>
            </div>

            <div>
              <h2>ratings *</h2>
              <label for="type">products rating</label>
              <input
                type="number"
                name="averageRating"
                placeholder="Average ratings"
                value={productsValues.averageRating}
                onChange={changeHandler}
              />
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default AddProducts;
