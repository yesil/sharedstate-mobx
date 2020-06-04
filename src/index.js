import React from "react";
import ReactDOM from "react-dom";
import "mobx-react-lite/batchingForReactDom";
import { observable, action, configure, computed, autorun } from "mobx";
import { observer } from "mobx-react-lite";

configure({ enforceActions: "observed" });

class OrderLine {
  @observable price = 1;
  @observable amount = 1;
  @observable discount = 0;

  @computed get total() {
    return this.price * this.amount - this.discount;
  }

  @action
  setPrice(value) {
    this.price = value;
    this.discount = 0;
  }

  @action
  setAmount(value) {
    this.amount = value;
    this.discount = 0;
  }

  @action
  setDiscount(value) {
    this.discount = value;
  }
}

const order = new OrderLine();
window.order = order;

const Comp = observer(({ order: { price, amount, discount, total } }) => {
  return (
    <div style={{ backgroundColor: "lime" }}>
      This is a react app
      <div>
        price: <span>{price}</span>
        <button onClick={() => order.setPrice(order.price + 1)}> + </button>
      </div>
      <div>
        amount: <span>{amount}</span>
        <button onClick={() => order.setAmount(order.amount + 1)}> + </button>
      </div>
      <div>
        discount: <span>{discount}</span>
      </div>
      <div>
        total: <span>{total}</span>
      </div>
    </div>
  );
});

(() => {
  // init react app
  const comp = <Comp order={order} />;
  ReactDOM.render(comp, document.getElementById("root"));

  // init vanilla app discount button click event listener
  document
    .querySelector("[data-discount] button")
    .addEventListener("click", () => {
      order.setDiscount(Math.floor(order.price * order.amount * 0.1));
    });

  // invoked when any of the order properties change - update the DOM nodes.
  autorun(() => {
    document.querySelector("[data-price] span").textContent = order.price;
    document.querySelector("[data-amount] span").textContent = order.amount;
    document.querySelector("[data-discount] span").textContent = order.discount;
    document.querySelector("[data-total] span").textContent = order.total;
  });

  // invoked when any of the order properties change, trigger "analytics calls"
  autorun(() => {
    const entry = document.createElement("li");
    entry.textContent = `Triggering analytics call with total: ${order.total} ${
      order.discount ? "and a discount of " + order.discount : ""
    }`;
    const events = document.querySelector("#events ul");
    events.insertBefore(entry, events.firstChild);
  });

  // invoked only at page load.
  autorun(() => {
    console.log("hello");
  });

  // invoked when order.total changes
  autorun(() => {
    console.log("total", order.total);
  });
})();
