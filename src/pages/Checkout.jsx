import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { Container, Typography } from "@mui/material";

export default function Checkout() {
  const { items, totalPrice } = useSelector((state) => state.cart);

  return (
    <>
      <Navbar />

      <Container>
        <Typography variant="h4" sx={{ mt: 3 }}>
          Checkout
        </Typography>

        {items.map((item) => (
          <div key={item.id}>
            <p>
              {item.title} x {item.quantity} — ₹{item.price}
            </p>
          </div>
        ))}

        <Typography variant="h5">
          Total: ₹ {totalPrice}
        </Typography>
      </Container>
    </>
  );
}
