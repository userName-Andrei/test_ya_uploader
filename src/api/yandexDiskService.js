import axios from "axios";

class YandexDiskService {
    static async uploadFile(token, path, file) {
        try {
            const url = `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(path)}&overwrite=true`;
            const headers = {
                'Authorization': `OAuth ${token}`,
                'Content-Type': 'application/json'
            };
            const linkToUpload = await axios.get(url, {headers});
            const { href } = linkToUpload.data;

            const formData = new FormData();
            formData.append('file', file);
            axios.put(href, formData);

            return ({
                succsess: true,
                error: null
            })
        } catch (error) {
            console.error('Failed to upload file', error)

            if (error.code === "ERR_NETWORK") {
                return ({
                    succsess: false,
                    error: `Проверьте подключение к интернету!`
                })
            }

            return ({
                succsess: false,
                error: `${error.response.data.message}`
            })
        }
    };
    
    static async uploadFiles(files, token) {
        try {
            for (let i = 0; i < files.length; i++) {
                let res = await this.uploadFile(token, `app:/${files[i].name}`, files[i])
                
                if (res.error) return res
            }
            
            return ({
                succsess: true,
                error: null
            })
        } catch (error) {
            console.error(`Failed to upload files`, error)

            if (error.code === "ERR_NETWORK") {
                return ({
                    succsess: false,
                    error: `Проверьте подключение к интернету!`
                })
            }

            return ({
                succsess: false,
                error: `${error.response.data.message}`
            })
        }
    }
}

export default YandexDiskService;