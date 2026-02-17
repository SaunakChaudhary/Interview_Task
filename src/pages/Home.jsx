import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setCategory } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import Navbar from "../components/Navbar";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Container,
  Chip,
  Box,
  Skeleton,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Badge,
  Rating,
  Breadcrumbs,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
  Slide,
  Grow,
  Zoom,
  Fab,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpIcon,
  LocalOffer as OfferIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const { items, currentPage, limit, selectedCategory, loading, error } =
    useSelector((state) => state.products);

  const categories = [
    { id: "all", name: "All Products", icon: "🛍️" },
    { id: "smartphones", name: "Smartphones", icon: "📱" },
    { id: "laptops", name: "Laptops", icon: "💻" },
    { id: "fragrances", name: "Fragrances", icon: "🌸" },
    { id: "skincare", name: "Skincare", icon: "🧴" },
    { id: "groceries", name: "Groceries", icon: "🛒" },
    { id: "home-decoration", name: "Home Decor", icon: "🏠" },
  ];

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit,
        skip: (currentPage - 1) * limit,
        category: selectedCategory,
      })
    );
  }, [dispatch, currentPage, selectedCategory, limit]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const filteredAndSortedProducts = () => {
    let filtered = [...items];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const displayProducts = filteredAndSortedProducts();

  // Skeleton loading component
  const ProductSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: "100%" }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width="100%" height={36} />
        </CardActions>
      </Card>
    </Grid>
  );

  if (error) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error || "Failed to load products. Please try again."}
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Box
        sx={{
          bgcolor: "grey.50",
          minHeight: "100vh",
          pt: { xs: 2, md: 4 },
          pb: 8,
        }}
      >
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link color="inherit" href="/">
              Home
            </Link>
            <Typography color="text.primary">Products</Typography>
          </Breadcrumbs>

          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "start", sm: "center" },
              mb: 4,
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {selectedCategory === "all" 
                  ? "All Products" 
                  : categories.find(c => c.id === selectedCategory)?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {displayProducts.length} products found
              </Typography>
            </Box>

            {/* Sort and Filter */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Top Rated</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>

              {isMobile && (
                <IconButton>
                  <FilterIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Category Chips */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 4,
              bgcolor: "white",
              borderRadius: 3,
              overflowX: "auto",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Box sx={{ display: "flex", gap: 1, minWidth: "max-content" }}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Box>
                  }
                  onClick={() => dispatch(setCategory(category.id))}
                  color={selectedCategory === category.id ? "primary" : "default"}
                  variant={selectedCategory === category.id ? "filled" : "outlined"}
                  sx={{
                    px: 1,
                    py: 2,
                    fontSize: "0.9rem",
                    "&:hover": {
                      bgcolor: selectedCategory === category.id 
                        ? "primary.dark" 
                        : alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {loading
              ? Array.from(new Array(8)).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              : displayProducts.map((product, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3} 
                    key={product.id}
                  >
                    <Grow in={true} timeout={500 + index * 100}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 3,
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          position: "relative",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                            "& .product-image": {
                              transform: "scale(1.05)",
                            },
                            "& .quick-actions": {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        {/* Wishlist Button */}
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            bgcolor: "white",
                            "&:hover": {
                              bgcolor: "white",
                            },
                          }}
                          onClick={() => toggleWishlist(product.id)}
                        >
                          {wishlist.includes(product.id) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>

                        {/* Discount Badge */}
                        {product.discountPercentage && (
                          <Chip
                            label={`${Math.round(product.discountPercentage)}% OFF`}
                            color="error"
                            size="small"
                            icon={<OfferIcon />}
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              zIndex: 1,
                              fontWeight: 600,
                            }}
                          />
                        )}

                        {/* Product Image */}
                        <Box
                          sx={{
                            position: "relative",
                            pt: "100%",
                            overflow: "hidden",
                            bgcolor: "#f5f5f5",
                          }}
                        >
                          <CardMedia
                            component="img"
                            className="product-image"
                            image={product.thumbnail}
                            alt={product.title}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                          />
                        </Box>

                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                          {/* Product Title */}
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="h3"
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              lineHeight: 1.4,
                              height: "2.8em",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product.title}
                          </Typography>

                          {/* Rating */}
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Rating
                              value={product.rating || 4}
                              size="small"
                              readOnly
                              precision={0.5}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              ({product.reviews?.length || 0})
                            </Typography>
                          </Box>

                          {/* Price Section */}
                          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "primary.main",
                              }}
                            >
                              ₹{product.price}
                            </Typography>
                            {product.originalPrice && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                ₹{product.originalPrice}
                              </Typography>
                            )}
                          </Box>
                        </CardContent>

                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CartIcon />}
                            onClick={() => dispatch(addToCart(product))}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              py: 1,
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              "&:hover": {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                              },
                            }}
                          >
                            Add to Cart
                          </Button>
                        </CardActions>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
          </Grid>

          {/* No Products Found */}
          {!loading && displayProducts.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter to find what you're looking for.
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {displayProducts.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={10}
                page={currentPage}
                onChange={(e, page) => dispatch({ type: "products/setPage", payload: page })}
                color="primary"
                size={isMobile ? "medium" : "large"}
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}
        </Container>
      </Box>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            boxShadow: 3,
          }}
        >
          <ArrowUpIcon />
        </Fab>
      </Zoom>
    </>
  );
}