import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Box,
  Avatar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  Grid,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  EmailOutlined as EmailIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";

export default function Login() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/home");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "grey.50",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={0} sx={{ minHeight: 600 }}>
          {/* Left side - Illustration/Branding */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: "none", md: "block" },
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              borderRadius: "16px 0 0 16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "url('/path-to-your-illustration.svg') no-repeat center",
                backgroundSize: "cover",
                opacity: 0.1,
              }}
            />
            <Box
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                p: 6,
                textAlign: "center",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                Welcome Back!
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Sign in to access your dashboard and manage your account
              </Typography>
              <Box
                component="img"
                src="/path-to-your-image.svg"
                alt="Login illustration"
                sx={{
                  maxWidth: "80%",
                  height: "auto",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </Box>
          </Grid>

          {/* Right side - Login Form */}
          <Grid
            item
            xs={12}
            md={6}
            component={Paper}
            elevation={6}
            square
            sx={{
              borderRadius: { xs: 2, md: "0 16px 16px 0" },
              p: { xs: 3, sm: 6 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
                <LockIcon fontSize="large" />
              </Avatar>
              
              <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
                Sign In
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Enter your credentials to access your account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 3, borderRadius: 2 }}>
                  {error || "Invalid username or password"}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}