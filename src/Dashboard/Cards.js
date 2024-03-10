import React from "react";
import { useOutletContext } from "react-router-dom";
import { cards } from "../data";

function Cards() {
  const [setShowContent] = useOutletContext();

  return (
    <React.Fragment>
      <div className="cards">
        <header>
          <i
            class="fa-solid fa-xmark"
            onClick={() => {
              setShowContent(false);
            }}
          ></i>
          <button type="submit">Update</button>
        </header>
        <table>
          <thead>
            <tr>
              <th>Tested</th>
              <th id="names">Names of Holder</th>
              <th id="number">card number</th>
              <th>CV</th>
              <th>expiry</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((item) => {
              return <SingleCard {...item} />;
            })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

const SingleCard = ({ firstName, lastName, cv, number, expiry }) => {
  return (
    <tr className="singleCardRow">
      <td>
        <input id="checkbox" type="checkbox" />
      </td>

      <td id="name">{firstName + " " + lastName}</td>
      <td>{number}</td>
      <td>{cv}</td>
      <td>{expiry}</td>
    </tr>
  );
};

export default Cards;
