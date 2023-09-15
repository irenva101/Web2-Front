import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { act } from "react-dom/test-utils";
const PayPalCheckoutButton = (props) => {
  const [paidFor, setPaidFor] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { product } = props;

  const{description, price}=product;
  const handleApprove = (orderId) => {
    //pucam na pek imam orderId
    props.setOrderId(orderId);
    console.log(product);
    //if response==true
    setPaidFor(true);
    //if response is error
  };

  if (paidFor) {
    //direct uset to success page
    //alert("Thank you for your purchase!");
    //navigate("/ulogovan-korisnik/prethodne-porudzbine");
  }
  if (error) {
    // Display error message, modal or redirect user to error page
    alert(error);
  }

  return (
    <PayPalButtons
      style={{
        color: "silver",
        layout: "horizontal",
        height: 48,
        tagline: false,
        shape: "pill",
      }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: product.description,
              amount: {
                value: product.price,
              },
            },
          ],
        });
      }}
      onClick={(data, actions) => {
        // Validate on button click, client or server side
        const hasAlreadyBoughtCourse = false;
      
        if (hasAlreadyBoughtCourse) {
          setError(
            "You already bought this course. Go to your account to view your list of courses."
          );
      
          return actions.reject();
        } else {
          return actions.resolve();
        }
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order.capture();
        console.log("order", order);
        handleApprove(data.orderID);
      }}
      onError={(err) => {
        setError(err);
        console.error("PayPal Checkout onError", err);
      }}
      onCancel={() => {
        // Display cancel message, modal or redirect user to cancel page or back to cart
      }}
    />
  );
};

export default PayPalCheckoutButton;
