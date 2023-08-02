
import { useState, useEffect } from 'react';
import axios from 'axios';

const useYandexOAuth = (clientId, clientSecret) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const params = new URLSearchParams(document.location.search);
  const code = params.get("code");
  const clientIdBase64 = window.btoa(`${clientId}:${clientSecret}`);

  useEffect(() => {
    if (!code) {
        window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}`
        return;
    }

    const fetchData = async () => {
        try {
            const response = await axios.post(`https://oauth.yandex.ru/token`, {
                grant_type: 'authorization_code',
                code,
                client_id: clientId
                }, {
                headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${clientIdBase64}`
                    }
                })
            setToken(response.data.access_token)
        } catch (error) {
            setError(error);
        }
    };

    fetchData();
  }, [code, clientId, clientSecret]);

  return [token, error];
};

export default useYandexOAuth;