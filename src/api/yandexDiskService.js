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
        } catch (error) {
            console.error('Failed to upload file', error)
        }
    };
    
    static async uploadFiles(files, token) {
        try {
            files.forEach(file => this.uploadFile(token, `app:/${file.name}`, file))
        } catch (error) {
            console.error(`Failed to upload files`, error)
        }
    }
}

export default YandexDiskService;