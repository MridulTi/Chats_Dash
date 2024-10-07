import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaChartBar, FaUserCheck } from "react-icons/fa";
import { Button, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import axios from 'axios';
import { MdSpaceDashboard } from "react-icons/md";
import { useAuth } from '../Context/Context';
import { useError } from '../Context/ErrorContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [formData, setFormData] = useState();
    const [searchBar, setSearchBar] = useState([]);
    const location = useLocation();
    const [url, setUrl] = useState(window.location.pathname);
    const { triggerError } = useError();

    useEffect(() => {
        setUrl(location.pathname);
    }, [location.pathname]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    function handleSearch() {
        axios.post("api/v1/weather/get-place", formData)
            .then(res => {
                setSearchBar(res.data.data.results);
            })
            .catch(err => {
                triggerError(err);
            });
    }

    return (
        <Card className="h-screen mt-2 fixed left-0 top-0 w-full max-w-[250px] md:max-w-[14vw] p-4 shadow-xl shadow-indigo-gray-900/5 overflow-auto">
            <div className="mb-2 py-4">
                <Typography variant="h4" className='font-extrabold text-center' color="blue-gray">
                    Charts Dash!
                </Typography>
            </div>
            <List className=''>
                <Link to="/app/dashboard">
                    <ListItem className={`w-5/6 ${url.includes("dashboard") ? "bg-indigo-50" : ""}`}>
                        <ListItemPrefix>
                            <MdSpaceDashboard className='h-5 w-5' />
                        </ListItemPrefix>
                        Dashboard
                    </ListItem>
                </Link>
                <Link to="/app/analytics">
                    <ListItem className={`w-5/6 ${url.includes("analytics") ? "bg-indigo-50" : ""}`}>
                        <ListItemPrefix>
                            <FaChartBar className="h-5 w-5" />
                        </ListItemPrefix>
                        Analytics
                    </ListItem>
                </Link>
            </List>
        </Card>
    );
};
import { FaUserCircle } from "react-icons/fa";
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";

export const TopBar = () => {
    const { userDetails, toggleLogin } = useAuth();
    const navigate = useNavigate();

    function logout() {
        axios.post('/api/v1/auth/logout')
            .then(res => {
                toggleLogin();
                navigate("/");
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div className="fixed top-0 right-0 p-2 px-4 sm:px-6 flex gap-2 sm:gap-4 place-items-center z-10 ">
            <Popover>
                <PopoverHandler className="bg-none">
                    <div>
                        {userDetails.img 
                            ? <img src={userDetails.img} loading='lazy' className='w-12 h-12 rounded-full' />
                            : <FaUserCircle className="text-2xl sm:text-3xl text-gray-600" />
                        }
                    </div>
                </PopoverHandler>
                <PopoverContent>
                    <div className="grid place-items-center w-8/12">
                        <h1 className="text-sm sm:text-base flex gap-4">{`${userDetails.firstName} ${userDetails.lastName}`}</h1>
                        <button
                            className="p-1 sm:p-2 bg-red-600 w-full text-white outline-0 px-12 text-xs sm:text-sm"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
