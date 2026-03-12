import axios from "axios";
import Cookies from "js-cookie";


const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: BASE_URL
})

let isRefreshing = false;
let refreshSubscribers: ((token:string)=> void) [] =  [];

function onRefreshed(accessToken:string) {
    refreshSubscribers.map((callback) => callback(accessToken));
}

function addRefreshSubscriber(callback:(token:string)=> void) {
    refreshSubscribers.push(callback);
}

api?.interceptors.request.use(
    (config) => {
        const jwt = Cookies.get("access_token")
        if (jwt) {
            config.headers["Authorization"] = `Bearer ${jwt}`
            config.headers["Content-Type"] = "application/json"
        }
        return config
    },
    (error) =>  Promise.reject(error)
    
)

// Add an interceptor to handle Refresh Token request

api?.interceptors.response.use(
    (response) =>  response,
    async (error) => {
        const originalRequest = error.config;
        // Check if the error status is due to token expiration
        // refreshToken
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            if (!isRefreshing) {
                isRefreshing = true
                originalRequest._retry = true;
            
                // Attempt to refresh the token
                try {
                    const refresh_token = Cookies.get("refresh_token")
                    const response = await api.post("/api/v1/auth/refresh-token", {
                        refresh_token
                    }, {
                        headers: {
                            "Authorization": `Bearer ${refresh_token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.status === 200) {
                      
                        Cookies.set("access_token", response.data?.data?.access_token);
                        Cookies.set("refresh_token", response.data?.data?.refresh_token);
                        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
                        api.defaults.headers.common["Content-Type"] = "application/json";
                        // originalRequest.headers["Authorization"] = response.data.access_token
                        isRefreshing = false;
                        onRefreshed(response.data.access_token)
                        refreshSubscribers = [];
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    isRefreshing = false
                    refreshSubscribers = [];
                
                    Cookies.remove("refresh_token");
                    Cookies.remove("access_token");
          
                    reloadPage();
                    return Promise.reject(refreshError);
                }
            }else {
                return new Promise((resolve )=> {
                    addRefreshSubscriber((accessToken:string)=>{
                        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                        resolve(api(originalRequest))
                    })
                })
            }
        }

        // logout
        if(error.response && error.response.status === 403 ) {
            Cookies.remove("access_token")
            Cookies.remove("refresh_token")
            reloadPage();
        }
        return Promise.reject(error);
    }
)

// Function to redirect the user to the login page
function reloadPage() {
    window.location.reload();
}