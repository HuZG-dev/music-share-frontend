const API_BASE_URL = 'http://localhost:8080'; // Java Spring Boot默认端口

export const uploadImage = async (file, type = 'covers') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  try {
    const response = await fetch(`${API_BASE_URL}/api/file/upload`, {
      method: 'POST',
      body: formData
    });
    
    return await response.json();
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
};

export const fetchHomeData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home/data`);
    return await response.json();
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
};

export const deleteImage = async (filename, type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/file/delete/${type}/${filename}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('删除失败:', error);
    throw error;
  }
};