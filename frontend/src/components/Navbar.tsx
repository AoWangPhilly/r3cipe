import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
    Container,
    Box,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Avatar,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import KitchenIcon from "@mui/icons-material/Kitchen";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Link, redirect, useNavigate } from "react-router-dom";
import { AuthContext, checkAuth } from "../context/AuthContext";
import PantryModal from "./PantryModal";
import { GRADIENT } from "../util";

//use MUI navbar component

export default function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    const [pantryOpen, setPantryOpen] = React.useState(false);

    const { isAuth, setIsAuth, name, setName, setUserId } =
        React.useContext(AuthContext);
    const [profileUrl, setProfileUrl] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handlePantryOpen = () => {
        setPantryOpen(true);
    };

    const handlePantryClose = () => {
        setPantryOpen(false);
    };

    useEffect(() => {
        checkAuth().then((data) => {
            // console.log(data);
            if (data.message === "Authenticated") {
                setIsAuth(true);
                setName(data.user.name);
                setUserId(data.user.id);
                setProfileUrl(data.user.profileUrl);
            } else {
                setIsAuth(false);
            }
        });
    }, [isAuth]);

    const handleLogout = async () => {
        let response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        if (response.status === 200) {
            setIsAuth(false);
            setName("");
            setUserId("");
            navigate("/");
        }
    };

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl" sx={{ height: 70 }}>
                    <Toolbar disableGutters>
                        {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Recipe App
                        </Typography>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon
                                    style={{
                                        color: "white",
                                    }}
                                />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate("/");
                                    }}
                                >
                                    <ListItemIcon>
                                        <SearchIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Find Recipes" />
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate("/circle");
                                    }}
                                >
                                    <ListItemIcon>
                                        <GroupsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Circles" />
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate("/library");
                                    }}
                                >
                                    <ListItemIcon>
                                        <CollectionsBookmarkIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Library" />
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate("/create");
                                    }}
                                >
                                    <ListItemIcon>
                                        <AddBoxIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Create a Recipe" />
                                </MenuItem>
                            </Menu>
                        </Box>
                        {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Recipe App
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                                gap: 2,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button
                                    key="search-page"
                                    startIcon={<SearchIcon fontSize="small" />}
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate("/");
                                    }}
                                    sx={{
                                        my: 2,
                                        color: "white",
                                    }}
                                >
                                    Find Recipes
                                </Button>
                            </div>

                            <Button
                                key="circle-page"
                                startIcon={<GroupsIcon fontSize="small" />}
                                onClick={() => {
                                    handleCloseNavMenu();
                                    navigate("/circle");
                                }}
                                sx={{ my: 2, color: "white"}}
                            >
                                Circles
                            </Button>
                            <Button
                                key="library-page"
                                startIcon={<CollectionsBookmarkIcon fontSize="small" />}
                                onClick={() => {
                                    handleCloseNavMenu();
                                    navigate("/library");
                                }}
                                sx={{ my: 2, color: "white"}}
                            >
                                Library
                            </Button>
                            <Button
                                key="create-page"
                                startIcon={<AddBoxIcon fontSize="small" />}
                                onClick={() => {
                                    handleCloseNavMenu();
                                    navigate("/create");
                                }}
                                sx={{ my: 2, color: "white", }}
                            >
                                Create a Recipe
                            </Button>
                        </Box>
                        {!isAuth ? (
                            <Box sx={{ flexGrow: 0 }}>
                                {/* login button with icon */}
                                <Button
                                    key="login-page"
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate("/login");
                                    }}
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                >
                                    Login
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Pantry">
                                        <IconButton
                                            size="large"
                                            aria-label="account of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            onClick={handlePantryOpen}
                                            color="inherit"
                                        >
                                            <KitchenIcon
                                                sx={{ color: "white" }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Box sx={{ flexGrow: 0 }}>
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        component="a"
                                        sx={{
                                            mr: 2,
                                            display: { xs: "none", md: "flex" },
                                            fontFamily: "monospace",
                                            fontWeight: 700,
                                            letterSpacing: ".3rem",
                                            color: "inherit",
                                            textDecoration: "none",
                                        }}
                                    >
                                        {name}
                                    </Typography>
                                </Box>

                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="User Menu">
                                        <Avatar
                                            onClick={handleOpenUserMenu}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                cursor: "pointer",
                                                background: GRADIENT,
                                            }}
                                        >
                                            {profileUrl ? (
                                                <img
                                                    src={profileUrl}
                                                    alt="profile"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    {name &&
                                                        name[0].toUpperCase()}
                                                </>
                                            )}
                                        </Avatar>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: "45px" }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleCloseUserMenu();
                                                handleLogout();
                                            }}
                                        >
                                            <ListItemIcon>
                                                <LogoutIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Logout</ListItemText>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            <PantryModal
                pantryOpen={pantryOpen}
                handlePantryClose={handlePantryClose}
            />
        </>
    );
}
