import { useEffect, useState } from "react";
import "./App.css";

const backEndPortDev = 5000;

function App() {
    const [data, setData] = useState([]);
    const [colNames, setColNames] = useState([]);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Get data from backend when page loads
        loginAndFetchData();
    }, []);

    var protocol = window.location.protocol;
    var server = window.location.hostname;

    var baseUrl = protocol + "//" + server;
    if (server == "localhost") {
        baseUrl += ":" + backEndPortDev;
    }
    else {
        baseUrl += "/Backend";
    }

    // Backend's location in the cloud (Azure Container App)
    baseUrl = "https://ca-backend.gentletree-c367ba6f.westeurope.azurecontainerapps.io/";

    const login = async () => {
        const loginPayload = {
            username: "user1",
            password: "password1",
        };

        try {
            const response = await fetch(baseUrl + "/Auth/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginPayload),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const result = await response.json();
            setToken(result.token);
            return result.token;
        } catch (error) {
            console.error("Error during login:", error);
            return null;
        }
    };

    const getData = async (authToken) => {
        fetch(baseUrl + "/Data", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then(response => {
            if(response.ok)
            {
                return response.json();
            }
            else
            {
                return null;
            }
        })
        .then(data => {
            if (data) {
                setData(data);

                return Object.keys(data[0]);
            }
            else {
                setData([]);
                setColNames([]);

                return Object.keys([]);
            }
        })
        .then(firstRecord => {
            setColNames(firstRecord);
        });
    };

    const loginAndFetchData = async () => {
        const authToken = await login();
        if (authToken) {
            await getData(authToken);
        }
    };

    return (
        <>
            <table>
                <thead>
                    {
                        Object.values(colNames).map(value => {
                            return <th>{value}</th>;
                        })
                    }
                </thead>
                <tbody>{data.map(obj => {
                    return <tr>{Object.values(obj).map(value => {
                        return <td>{value}</td>;
                    })}</tr>;
                })}
                </tbody>
            </table>
        </>
    );
}

export default App;
